package work.dirtsai.portapiadmin.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("tokens")
public class Tokens {
    @TableId(type = IdType.AUTO)
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