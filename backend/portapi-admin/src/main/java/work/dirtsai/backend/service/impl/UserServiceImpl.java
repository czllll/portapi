package work.dirtsai.backend.service.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import work.dirtsai.backend.common.ErrorCode;
import work.dirtsai.backend.exception.BusinessException;
import work.dirtsai.backend.mapper.UserMapper;
import work.dirtsai.backend.model.dto.UserDTO;
import work.dirtsai.backend.model.dto.UserLoginDTO;
import work.dirtsai.backend.model.dto.UserRegisterDTO;
import work.dirtsai.backend.model.entity.User;
import work.dirtsai.backend.model.vo.UserVO;
import work.dirtsai.backend.service.UserService;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private static final byte[] JWT_SECRET = new byte[32];
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public long userRegister(UserRegisterDTO userRegisterDTO) {
        if (userRegisterDTO == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        String username = userRegisterDTO.getUsername();
        String password = userRegisterDTO.getPassword();
        String checkPassword = userRegisterDTO.getConfirmPassword();
        String email = userRegisterDTO.getEmail();

        if (StringUtils.isAnyBlank(username, password, checkPassword, email)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        if (!password.equals(checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "两次密码不一致");
        }

        String validPattern = "[0-9a-zA-Z_]+";
        if (!username.matches(validPattern)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户名只能包含数字、字母和下划线");
        }

        // check if the username is already taken
        boolean exist = this.lambdaQuery().eq(User::getUsername, username).exists();
        if (exist) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户名已存在");
        }

        // check if the email is already taken

        exist = this.lambdaQuery().eq(User::getEmail, email).exists();
        if (exist) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "邮箱已存在");
        }

        // create a new user
        User user = new User();
        user.setUsername(username);
        // decrypt the password
        user.setPassword(BCrypt.hashpw(password, BCrypt.gensalt()));
        user.setEmail(email);
        user.setRole("user");

        // save the user
        boolean result = this.save(user);
        if ( !result ) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "注册失败");
        }


        return user.getId();
    }

    @Override
    public UserVO userLogin(UserLoginDTO userLoginDTO, HttpServletRequest request) {
        if (userLoginDTO == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        String email = userLoginDTO.getEmail();
        String password = userLoginDTO.getPassword();

        if (StringUtils.isAnyBlank(email, password)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 查询用户
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        User user = this.getOne(queryWrapper);

        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "用户不存在");
        }

        // 验证密码

        if (!BCrypt.checkpw(password, user.getPassword())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "密码错误");
        }

        // 生成JWT token
        String token = JWT.create()
                .withClaim("userId", user.getId())
                .sign(Algorithm.HMAC256(JWT_SECRET));

        // 转换为响应对象

        UserVO userLoginResponse = new UserVO();

        userLoginResponse.setToken(token);
        userLoginResponse.setUserId(user.getId());
        userLoginResponse.setUsername(user.getUsername());
        userLoginResponse.setEmail(user.getEmail());
        userLoginResponse.setRole(user.getRole());

        return userLoginResponse;


    }

    @Override
    public UserVO getLoginUser(String token) {
        if (StringUtils.isBlank(token)) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        try {
            // 验证JWT token
            DecodedJWT jwt = JWT.require(Algorithm.HMAC256(JWT_SECRET))
                    .build()
                    .verify(token);

            // 从token中获取用户ID
            Long userId = jwt.getClaim("userId").asLong();

            // 从Redis中获取用户信息
            String redisKey = String.format("user:token:%s", userId);
            Object cachedUser = redisTemplate.opsForValue().get(redisKey);

            if (cachedUser == null) {
                throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR, "用户未登录或登录已过期");
            }

            // 查询数据库获取最新用户信息
            User user = this.getById(userId);
            if (user == null) {
                throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "用户不存在");
            }

            // 转换为响应对象
            UserVO userLoginResponse = new UserVO();

            userLoginResponse.setToken(token);
            userLoginResponse.setUserId(user.getId());
            userLoginResponse.setUsername(user.getUsername());
            userLoginResponse.setEmail(user.getEmail());
            userLoginResponse.setRole(user.getRole());


            return userLoginResponse;

        } catch (JWTVerificationException e) {
            log.error("token验证失败", e);
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR, "token无效");
        } catch (Exception e) {
            log.error("获取当前登录用户失败", e);
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "系统错误");
        }
    }

    @Override
    public boolean isLogin(HttpServletRequest request) {
        // 实现判断是否登录逻辑
        return false;
    }

    @Override
    public boolean userLogout(HttpServletRequest request) {
        // 实现注销逻辑
        return false;
    }

    @Override
    public boolean isAdmin(HttpServletRequest request) {
        // 实现判断是否是管理员逻辑
        return false;
    }

    @Override
    public List<UserVO> getUserList(Integer currentPage, Integer pageSize) {
        Page<User> page = new Page<>(currentPage, pageSize);
        Page<User> userPage = this.page(page, new QueryWrapper<>());

        // 筛选出非is_deleted的用户
        userPage.getRecords().removeIf(user -> user.getIsDeleted() == 1);

        return userPage.getRecords().stream().map(user -> {
            UserVO userVO = new UserVO();
            userVO.setUserId(user.getId());
            userVO.setUsername(user.getUsername());
            userVO.setEmail(user.getEmail());
            userVO.setRole(user.getRole());
            userVO.setStatus(user.getStatus());
            return userVO;
        }).collect(Collectors.toList());
    }

    @Override
    public boolean updateUserStatus(Long id, Integer status) {
        User user = this.getById(id);
        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "用户不存在");
        }

        user.setStatus(status);
        return this.updateById(user);
    }

    @Override
    public boolean deleteUser(Long id) {
        User user = this.getById(id);
        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "用户不存在");
        }

        user.setIsDeleted(1);
        return this.updateById(user);
    }

    @Override
    public boolean updateUser(Long id, UserDTO request) {
        User user = this.getById(id);
        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "用户不存在");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        return this.updateById(user);
    }
}