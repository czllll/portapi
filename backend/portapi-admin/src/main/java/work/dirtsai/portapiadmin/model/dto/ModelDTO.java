package work.dirtsai.portapiadmin.model.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ModelDTO {

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