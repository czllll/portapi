package work.dirtsai.backend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import jakarta.servlet.http.HttpServletRequest;
import work.dirtsai.backend.model.dto.UserLoginDTO;
import work.dirtsai.backend.model.dto.UserRegisterDTO;
import work.dirtsai.backend.model.entity.User;
import work.dirtsai.backend.model.vo.UserVO;


public interface UserService extends IService<User> {

    /**
     * 用户注册
     * @param userRegisterDTO 用户注册请求
     * @return 新用户 id
     */
    long userRegister(UserRegisterDTO userRegisterDTO);

    /**
     * 用户登录
     * @param userLoginDTO 用户登录请求
     * @param request HTTP 请求
     * @return 登录响应
     */
    UserVO userLogin(UserLoginDTO userLoginDTO, HttpServletRequest request);

    /**
     * 获取当前登录用户
     * @param token JWT token
     * @return 用户信息
     */
    UserVO getLoginUser(String token);
    /**
     * 用户是否登录
     * @param request HTTP 请求
     * @return 是否登录
     */
    boolean isLogin(HttpServletRequest request);

    /**
     * 用户注销
     * @param request HTTP 请求
     * @return 是否成功
     */
    boolean userLogout(HttpServletRequest request);

    /**
     * 是否是管理员
     * @param request HTTP 请求
     * @return 是否是管理员
     */
    boolean isAdmin(HttpServletRequest request);
}