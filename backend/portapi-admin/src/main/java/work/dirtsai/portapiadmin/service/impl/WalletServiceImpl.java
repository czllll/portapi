package work.dirtsai.portapiadmin.service.impl;

import com.alibaba.nacos.common.utils.StringUtils;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import work.dirtsai.portapiadmin.mapper.PromoCodeMapper;
import work.dirtsai.portapiadmin.mapper.WalletBalanceMapper;
import work.dirtsai.portapiadmin.mapper.WalletRechargeRecordMapper;
import work.dirtsai.portapiadmin.model.entity.PromoCode;
import work.dirtsai.portapiadmin.model.entity.WalletBalance;
import work.dirtsai.portapiadmin.model.entity.WalletRechargeRecord;
import work.dirtsai.portapiadmin.service.WalletService;

import java.io.IOException;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {
    private final WalletBalanceMapper walletBalanceMapper;
    private final WalletRechargeRecordMapper rechargeRecordMapper;
    private final PromoCodeMapper promoCodeMapper;

    @Override
    public BigDecimal getBalance(Long userId) {
        WalletBalance balance = walletBalanceMapper.selectById(userId);
        return balance != null ? balance.getBalance() : BigDecimal.ZERO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WalletRechargeRecord topUp(Long userId, BigDecimal amount, String promoCode) {
        // 验证并计算优惠后金额
        BigDecimal finalAmount = amount;
        BigDecimal discountAmount = BigDecimal.ZERO;

        if (StringUtils.hasText(promoCode)) {
            PromoCode code = promoCodeMapper.selectById(promoCode);
            if (code == null) {
                throw new RuntimeException("无效的优惠码");
            }

            // 验证优惠码
            if (LocalDateTime.now().isBefore(code.getStartDate()) ||
                    LocalDateTime.now().isAfter(code.getEndDate())) {
                throw new RuntimeException("优惠码已过期");
            }
            if (code.getMaxUses() != null && code.getCurrentUses() >= code.getMaxUses()) {
                throw new RuntimeException("优惠码已达到使用上限");
            }

            // 计算优惠金额
            if ("PERCENTAGE".equals(code.getDiscountType())) {
                discountAmount = amount.multiply(code.getDiscountValue())
                        .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            } else {
                discountAmount = code.getDiscountValue();
            }

            finalAmount = amount.subtract(discountAmount);
            if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
                finalAmount = BigDecimal.ZERO;
            }

            // 更新优惠码使用次数
            code.setCurrentUses(code.getCurrentUses() + 1);
            promoCodeMapper.updateById(code);
        }

        // 创建充值记录
        WalletRechargeRecord record = new WalletRechargeRecord();
        record.setUserId(userId);
        record.setAmount(amount);
        record.setPromoCode(promoCode);
        record.setDiscountAmount(discountAmount);
        record.setFinalAmount(finalAmount);
        record.setPaymentMethod("Credit Card");
        record.setStatus("Success");
        record.setCreatedAt(LocalDateTime.now());
        rechargeRecordMapper.insert(record);

        // 更新钱包余额
        WalletBalance balance = walletBalanceMapper.selectById(userId);
        if (balance != null) {
            balance.setBalance(balance.getBalance().add(finalAmount));
            balance.setUpdatedAt(LocalDateTime.now());
            walletBalanceMapper.updateById(balance);
        } else {
            balance = new WalletBalance();
            balance.setUserId(userId);
            balance.setBalance(finalAmount);
            balance.setCreatedAt(LocalDateTime.now());
            balance.setUpdatedAt(LocalDateTime.now());
            walletBalanceMapper.insert(balance);
        }

        return record;
    }

    @Override
    public IPage<WalletRechargeRecord> getRechargeRecords(Long userId, long page, long size) {
        Page<WalletRechargeRecord> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<WalletRechargeRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WalletRechargeRecord::getUserId, userId)
                .orderByDesc(WalletRechargeRecord::getCreatedAt);

        return rechargeRecordMapper.selectPage(pageParam, wrapper);
    }

//    @Override
//    public Resource exportRechargeRecords(Long userId) throws IOException {
//        LambdaQueryWrapper<WalletRechargeRecord> wrapper = new LambdaQueryWrapper<>();
//        wrapper.eq(WalletRechargeRecord::getUserId, userId)
//                .orderByDesc(WalletRechargeRecord::getCreatedAt);
//
//        List<WalletRechargeRecord> records = rechargeRecordMapper.selectList(wrapper);
//
//        StringWriter stringWriter = new StringWriter();
//        CSVWriter csvWriter = new CSVWriter(stringWriter);
//
//        // 写入CSV头
//        csvWriter.writeNext(new String[]{"日期", "金额", "优惠码", "优惠金额", "实付金额", "支付方式", "状态"});
//
//        // 写入数据
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
//        for (WalletRechargeRecord record : records) {
//            csvWriter.writeNext(new String[]{
//                    record.getCreatedAt().format(formatter),
//                    record.getAmount().toString(),
//                    record.getPromoCode(),
//                    record.getDiscountAmount().toString(),
//                    record.getFinalAmount().toString(),
//                    record.getPaymentMethod(),
//                    record.getStatus()
//            });
//        }
//
//        csvWriter.close();
//
//        return new ByteArrayResource(stringWriter.toString().getBytes(StandardCharsets.UTF_8));
//    }

    @Override
    public void updateWalletQuota(Integer userId, Integer deltaQuota) {
        WalletBalance balance = walletBalanceMapper.selectById(userId);
        if (balance == null) {
            throw new RuntimeException("用户钱包不存在");
        }
        // 新余额
        BigDecimal newBalance = balance.getBalance().subtract(new BigDecimal(deltaQuota));
        if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("余额不足");
        }
        balance.setBalance(newBalance);
        walletBalanceMapper.updateById(balance);
    }
}