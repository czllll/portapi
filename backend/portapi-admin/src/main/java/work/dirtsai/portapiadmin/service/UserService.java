package work.dirtsai.portapiadmin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import jakarta.servlet.http.HttpServletRequest;
import work.dirtsai.portapiadmin.model.dto.UserDTO;
import work.dirtsai.portapiadmin.model.dto.UserLoginDTO;
import work.dirtsai.portapiadmin.model.dto.UserRegisterDTO;
import work.dirtsai.portapiadmin.model.entity.User;
import work.dirtsai.portapiadmin.model.vo.UserVO;

import java.util.List;


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


    /**
     * 获取用户列表
     * @return 用户列表
     */
    List<UserVO> getUserList(Integer currentPage, Integer pageSize);


    /**
     * 更新用户状态
     * @param id 用户 id
     * @param status 用户状态
     * @return 是否成功
     */
    boolean updateUserStatus(Long id, Integer status);

    /**
     * 逻辑删除用户
     * @param id 用户 id
     * @return 是否成功
     */
    boolean deleteUser(Long id);

    /**
     * 更新用户信息
     * @param id 用户 id
     * @param userDTO 用户信息
     * @return 是否成功
     */
    boolean updateUser(Long id, UserDTO userDTO);
}