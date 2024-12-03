package work.dirtsai.portapiadmin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import work.dirtsai.portapiadmin.common.ErrorCode;
import work.dirtsai.portapiadmin.common.Utils;
import work.dirtsai.portapiadmin.exception.BusinessException;
import work.dirtsai.portapiadmin.mapper.TokensMapper;
import work.dirtsai.portapiadmin.model.entity.Tokens;
import work.dirtsai.portapiadmin.model.vo.TokensVO;
import work.dirtsai.portapiadmin.service.TokensService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TokensServiceImpl extends ServiceImpl<TokensMapper, Tokens> implements TokensService {

    @Resource
    private Utils utils;

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
    public List<TokensVO> getTokensList(Integer current, Integer size, Integer userId){
        Page<Tokens> page = new Page<>(current, size);
        Page<Tokens> tokensPage = this.page(page, new QueryWrapper<>());

        // 筛选出非is_deleted的用户
        tokensPage.getRecords().removeIf(tokens -> tokens.getIsDeleted() == 1);
        // 筛选当前用户的令牌
        if (userId != null) {
            tokensPage.getRecords().removeIf(tokens -> !tokens.getUserId().equals(userId));
        }
        return tokensPage.getRecords().stream().map(tokens -> {

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

        }).collect(Collectors.toList());
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
}