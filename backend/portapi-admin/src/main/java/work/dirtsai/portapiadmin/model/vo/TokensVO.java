package work.dirtsai.portapiadmin.model.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class TokensVO {
    private Long id;
    private String tokenNumber;
    private String name;
    private LocalDateTime expiresAt;
    private Integer userId;
    private Integer totalQuota;
    private Integer usedQuota;
    private String modelRestriction;
    private Integer status;
    private Long groupId;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;


}