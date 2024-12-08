package work.dirtsai.portapiadmin.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("model")
public class Model {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String modelName;

    private String modelCompany;

    private String realApiKey;

    private BigDecimal remainQuote;

    private Integer isDeleted;

    private LocalDateTime createdTime;

    private LocalDateTime updatedTime;
}
