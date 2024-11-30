package work.dirtsai.portapiadmin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import work.dirtsai.portapiadmin.common.ErrorCode;
import work.dirtsai.portapiadmin.exception.BusinessException;
import work.dirtsai.portapiadmin.mapper.TokensMapper;
import work.dirtsai.portapiadmin.model.entity.Tokens;
import work.dirtsai.portapiadmin.model.entity.User;
import work.dirtsai.portapiadmin.model.vo.TokensVO;
import work.dirtsai.portapiadmin.model.vo.UserVO;
import work.dirtsai.portapiadmin.service.TokensService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TokensServiceImpl extends ServiceImpl<TokensMapper, Tokens> implements TokensService {

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
    public List<TokensVO> getTokensList(Integer current, Integer size){
        Page<Tokens> page = new Page<>(current, size);
        Page<Tokens> tokensPage = this.page(page, new QueryWrapper<>());

        // 筛选出非is_deleted的用户
        tokensPage.getRecords().removeIf(tokens -> tokens.getIsDeleted() == 1);

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
            return tokensVO;

        }).collect(Collectors.toList());
    }

}