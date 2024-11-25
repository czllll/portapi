package work.dirtsai.backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginDTO {
    @NotBlank(message = "登录邮箱不能为空")
    private String email;

    @NotBlank(message = "密码不能为空")
    private String password;
}