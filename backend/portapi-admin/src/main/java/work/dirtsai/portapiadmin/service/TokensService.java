package work.dirtsai.portapiadmin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import work.dirtsai.portapiadmin.model.entity.Tokens;
import work.dirtsai.portapiadmin.model.vo.TokensVO;

import java.util.List;

public interface TokensService  extends IService<Tokens> {

    boolean deleteTokensById(Long id);

    List<TokensVO> getTokensList(Integer current, Integer size, Integer userId);

    boolean updateTokensStatus(Long id, Integer status);

    boolean createTokens(TokensVO tokenVO);

    boolean updateTokensQuato(String tokenNumber, Integer consumeQuota);
}
