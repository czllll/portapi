package work.dirtsai.backend.controller;

import io.micrometer.common.util.StringUtils;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import work.dirtsai.backend.common.BaseResponse;
import work.dirtsai.backend.common.ErrorCode;
import work.dirtsai.backend.common.ResultUtils;
import work.dirtsai.backend.exception.BusinessException;
import work.dirtsai.backend.model.dto.UserLoginDTO;
import work.dirtsai.backend.model.dto.UserRegisterDTO;
import work.dirtsai.backend.model.vo.UserVO;
import work.dirtsai.backend.service.UserService;

@RestController
@RequestMapping("/api/user")
@Validated
@Slf4j
public class UserController {

    @Resource
    private UserService userService;

    @PostMapping("/register")
    public BaseResponse<Long> register(@RequestBody @Valid UserRegisterDTO request) {
        long userId = userService.userRegister(request);
        return ResultUtils.success(userId);
    }

    @PostMapping("/login")
    public BaseResponse<UserVO> login(@RequestBody @Valid UserLoginDTO request,
                                      HttpServletRequest httpRequest) {
        UserVO response = userService.userLogin(request, httpRequest);
        return ResultUtils.success(response);
    }

    @GetMapping("/current")
    public BaseResponse<UserVO> getCurrentUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (StringUtils.isBlank(token)) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        UserVO user = userService.getLoginUser(token);
        return ResultUtils.success(user);
    }
}