package work.dirtsai.portapiadmin.model.vo;

import lombok.Data;

import java.util.Date;

@Data
public class TokensVO {
    private Long id;
    private String tokenNumber;
    private String name;
    private Date expiresAt;
    private Integer userId;
    private Integer totalQuota;
    private Integer usedQuota;
    private String modelRestriction;
    private Byte status;
    private Long groupId;
    private Date createdTime;
    private Date updatedTime;

}