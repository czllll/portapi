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
import work.dirtsai.backend.model.dto.UserDTO;
import work.dirtsai.backend.model.dto.UserLoginDTO;
import work.dirtsai.backend.model.dto.UserRegisterDTO;
import work.dirtsai.backend.model.vo.UserVO;
import work.dirtsai.backend.service.UserService;

import java.util.List;

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

    @GetMapping("/page")
    public BaseResponse<List<UserVO>> getUserList(
            @RequestParam(defaultValue = "1") Integer currentPage,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        List<UserVO> userList = userService.getUserList(currentPage, pageSize);
        return ResultUtils.success(userList);
    }

    @PutMapping("/{id}/status")
    public BaseResponse<Boolean> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Integer status
    ) {
        boolean result = userService.updateUserStatus(id, status);
        return ResultUtils.success(result);
    }

    /**
     * 逻辑删除
     * @param id
     * @return
     */
    @PutMapping("/{id}/delete")
    public BaseResponse<Boolean> deleteUser(@PathVariable Long id) {
        boolean result = userService.deleteUser(id);
        return ResultUtils.success(result);
    }

    /**
     * 更新用户信息
     * @param id
     * @param request
     * @return
     */
    @PutMapping("/{id}")
    public BaseResponse<Boolean> updateUser(@PathVariable Long id, @RequestBody UserDTO request) {
        boolean result = userService.updateUser(id, request);
        return ResultUtils.success(result);
    }
}