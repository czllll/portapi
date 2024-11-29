package work.dirtsai.portapiadmin.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("api_info")
public class ApiInfo {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private String url;
    private String method;
    private String description;
    private Integer status;
    private String headers;
    private String params;
    private String response;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}