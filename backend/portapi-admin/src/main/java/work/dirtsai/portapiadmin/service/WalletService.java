package work.dirtsai.portapiadmin.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import jakarta.annotation.Resource;
import work.dirtsai.portapiadmin.model.entity.WalletRechargeRecord;

import java.io.IOException;
import java.math.BigDecimal;

public interface WalletService {
    BigDecimal getBalance(Long userId);
    WalletRechargeRecord topUp(Long userId, BigDecimal amount, String promoCode);
    IPage<WalletRechargeRecord> getRechargeRecords(Long userId, long page, long size);

    void updateWalletQuota(Integer userId, Integer deltaQuota);
    //Resource exportRechargeRecords(Long userId) throws IOException;

}