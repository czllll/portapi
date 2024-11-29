package work.dirtsai.portapiadmin.model.entity;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
@TableName(value = "user")
public class User implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    // 认证信息
    private String email;
    private String phone;
    private String password;

    // 用户信息
    private String username;
    private String nickname;
    private String avatarUrl;
    private String bio;
    private String accessKey;
    private String accessSecret;

    // 状态信息
    private String role;
    private Integer status;
    private Integer emailVerified;
    private Integer phoneVerified;
    private Date lastLoginTime;

    // OAuth提供商
    private String googleId;
    private String githubId;
    private Integer isDeleted;

    // 时间信息
    private Date createTime;
    private Date updateTime;

    @Serial
    private static final long serialVersionUID = 1L;
}