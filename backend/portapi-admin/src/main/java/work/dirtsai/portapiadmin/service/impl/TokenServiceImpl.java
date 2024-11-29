package work.dirtsai.portapiadmin.service.impl;

import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import work.dirtsai.portapiadmin.service.TokenService;
import work.dirtsai.common.utils.JwtUtils;

@Service
public class TokenServiceImpl implements TokenService {
    @Resource
    private JwtUtils jwtUtils;

    @Override
    public String createToken(String username) {
        return jwtUtils.createToken(username);
    }
}

