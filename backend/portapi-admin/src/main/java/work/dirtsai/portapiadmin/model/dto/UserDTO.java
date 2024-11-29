package work.dirtsai.portapiadmin.model.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long userId;
    private String username;
    private String email;
    private String token;
    private String avatar;
    private String role;
    private Integer status;
}
