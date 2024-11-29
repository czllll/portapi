package work.dirtsai.portapiadmin.model.vo;

import lombok.Data;

@Data
public class UserVO {
    private Long userId;
    private String username;
    private String email;
    private String token;
    private String avatar;
    private String role;
    private Integer status;
}
