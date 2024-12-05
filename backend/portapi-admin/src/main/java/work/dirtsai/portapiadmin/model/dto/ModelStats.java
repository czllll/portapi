package work.dirtsai.portapiadmin.model.dto;

import lombok.Data;

@Data
public class ModelStats {
    private String modelName;
    private Long callCount;
    private Long tokenUsage;
}