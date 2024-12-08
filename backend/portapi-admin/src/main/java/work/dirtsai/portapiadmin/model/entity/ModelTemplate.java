package work.dirtsai.portapiadmin.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("model_template")
public class ModelTemplate {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String company;

    private String modelName;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedTime;
}
