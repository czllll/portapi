package work.dirtsai.portapiadmin.model.dto;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
public class TokenGroupDTO {
    private Long id;
    private String name;
    private Integer userId;
    private Boolean isDeleted;
    private Date createTime;
    private Date updateTime;

}
