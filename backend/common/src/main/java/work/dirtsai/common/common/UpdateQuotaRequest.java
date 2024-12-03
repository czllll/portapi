package work.dirtsai.common.common;

import lombok.Data;

@Data
public class UpdateQuotaRequest {
    private String tokenNumber;
    private Integer consumedQuota;
}
