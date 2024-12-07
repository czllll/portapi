package work.dirtsai.portapiadmin.common;

import com.auth0.jwt.exceptions.JWTVerificationException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import work.dirtsai.portapiadmin.exception.BusinessException;
import work.dirtsai.portapiadmin.model.vo.UserVO;
import work.dirtsai.portapiadmin.service.TokenService;
import work.dirtsai.portapiadmin.service.UserService;

@Component
@RequiredArgsConstructor
public class SecurityUtils {
    private final HttpServletRequest request;
    private final TokenService tokenService;
    private final UserService userService;

    public Long getCurrentUserId() {
        // 从请求头获取token
        String token = request.getHeader("Authorization").substring(7);
        if (StringUtils.isBlank(token)) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        try {
            // 解析token获取用户ID
            return  userService.getLoginUser(token).getUserId();
        } catch (JWTVerificationException e) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR, "token无效");
        }
    }

    public UserVO getCurrentUser() {
        String token = request.getHeader("Authorization");
        return userService.getLoginUser(token);
    }
}