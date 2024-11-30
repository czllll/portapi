package work.dirtsai.portapiadmin.model.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
public class TokensDTO {
    private Long id;
    private String tokenNumber;
    private String name;
    private Date expiresAt;
    private Integer userId;
    private Integer totalQuota;
    private Integer usedQuota;
    private String modelRestriction;
    private Integer status;
    private Long groupId;
    private Date createdTime;
    private Date updatedTime;
    private Integer isDeleted;

}