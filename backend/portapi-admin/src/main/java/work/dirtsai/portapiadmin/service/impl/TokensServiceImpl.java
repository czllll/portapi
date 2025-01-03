package work.dirtsai.portapiadmin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import work.dirtsai.common.common.PageResponse;
import work.dirtsai.portapiadmin.common.ErrorCode;
import work.dirtsai.portapiadmin.common.Utils;
import work.dirtsai.portapiadmin.exception.BusinessException;
import work.dirtsai.portapiadmin.mapper.TokensMapper;
import work.dirtsai.portapiadmin.model.entity.Tokens;
import work.dirtsai.portapiadmin.model.vo.TokensVO;
import work.dirtsai.portapiadmin.service.TokensService;
import work.dirtsai.portapiadmin.service.WalletService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TokensServiceImpl extends ServiceImpl<TokensMapper, Tokens> implements TokensService {

    @Resource
    private Utils utils;

    @Resource
    private WalletService walletService;
    @Override
    public boolean deleteTokensById(Long id) {
        Tokens tokens = this.getById(id);
        if (tokens == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "令牌不存在");
        }

        tokens.setIsDeleted(1);
        return this.updateById(tokens);
    }

    @Override
    public PageResponse<TokensVO> getTokensList(Integer current, Integer size, Integer userId) {
        QueryWrapper<Tokens> queryWrapper = new QueryWrapper<Tokens>()
                .eq("is_deleted", 0)
                .eq(userId != null, "user_id", userId)
                .orderByDesc("updated_time");

        Page<Tokens> page = new Page<>(current, size);
        Page<Tokens> tokensPage = this.page(page, queryWrapper);

        List<TokensVO> records = tokensPage.getRecords().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                records,
                tokensPage.getTotal(),
                tokensPage.getCurrent(),
                tokensPage.getSize()
        );
    }

    @Override
    public boolean updateTokensStatus(Long id, Integer status) {
        Tokens tokens = this.getById(id);
        if (tokens == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "令牌不存在");
        }

        tokens.setStatus(status);
        return this.updateById(tokens);
    }

    @Override
    public boolean createTokens(TokensVO tokenVO){
        Tokens tokens = new Tokens();

        tokens.setTokenNumber(utils.generateKey());
        tokens.setName(tokenVO.getName());
        tokens.setExpiresAt(tokenVO.getExpiresAt());
        tokens.setTotalQuota(tokenVO.getTotalQuota());
        tokens.setModelRestriction(tokenVO.getModelRestriction());
        tokens.setGroupId(tokenVO.getGroupId());
        tokens.setStatus(tokenVO.getStatus());
        tokens.setIsDeleted(0);
        tokens.setUserId(tokenVO.getUserId());
        walletService.updateWalletQuota(tokens.getUserId(), tokenVO.getTotalQuota());
        return this.save(tokens);
    }


    @Override
    public boolean updateTokensQuato(String tokenNumber, Integer consumeQuota) {

        Tokens tokens = this.getByTokenNumber(tokenNumber);
        if (tokens == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "令牌不存在");
        }

        tokens.setUsedQuota(tokens.getUsedQuota() + consumeQuota);

        return this.updateById(tokens);
    }

    private Tokens getByTokenNumber(String tokenNumber) {
        return this.getOne(new QueryWrapper<Tokens>().eq("token_number", tokenNumber));
    }


    @Override
    public boolean updateTokens(TokensVO tokenVO) {
        Tokens tokens = this.getByTokenNumber(tokenVO.getTokenNumber());
        if (tokens == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "令牌不存在");
        }
        // 数据库中token的quota
        Integer quota = tokens.getTotalQuota();
        Integer newQuota = tokenVO.getTotalQuota();
        //quota变化量
        Integer deltaQuota = newQuota - quota;
        // 更新钱包余额
        try {
            walletService.updateWalletQuota(tokens.getUserId(), deltaQuota);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "余额操作失败");
        }
        tokens.setTotalQuota(newQuota);
        tokens.setUpdatedTime(LocalDateTime.now());
        return this.updateById(tokens);
    }


    @Override
    public Integer getUserIdByTokenNumber(String tokenNumber) {
        Tokens tokens = this.getByTokenNumber(tokenNumber);
        if (tokens == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "令牌不存在");
        }
        return tokens.getUserId();
    }


    private TokensVO convertToVO(Tokens tokens) {
        TokensVO tokensVO = new TokensVO();
        tokensVO.setId(tokens.getId());
        tokensVO.setTokenNumber(tokens.getTokenNumber());
        tokensVO.setUserId(tokens.getUserId());
        tokensVO.setStatus(tokens.getStatus());
        tokensVO.setCreatedTime(tokens.getCreatedTime());
        tokensVO.setName(tokens.getName());
        tokensVO.setExpiresAt(tokens.getExpiresAt());
        tokensVO.setTotalQuota(tokens.getTotalQuota());
        tokensVO.setUsedQuota(tokens.getUsedQuota());
        tokensVO.setGroupId(tokens.getGroupId());
        tokensVO.setModelRestriction(tokens.getModelRestriction());
        return tokensVO;
    }
}