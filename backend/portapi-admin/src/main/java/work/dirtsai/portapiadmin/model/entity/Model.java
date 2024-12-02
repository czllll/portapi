package work.dirtsai.portapiadmin.model.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("model")
public class Model {

    @TableId
    private Integer id;

    private Integer modelId;

    private String modelName;

    private String modelCompany;

    private String modelVersion;

    private String realApiKey;

    private BigDecimal remainQuote;

    private Boolean isDeleted;

    private LocalDateTime createdTime;

    private LocalDateTime updatedTime;
}
