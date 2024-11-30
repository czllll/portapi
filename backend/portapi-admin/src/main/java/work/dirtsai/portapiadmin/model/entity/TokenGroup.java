package work.dirtsai.portapiadmin.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("token_group")
public class TokenGroup {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Integer userId;

    private Boolean isDeleted;
    private Date createTime;
    private Date updateTime;

}
