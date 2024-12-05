package work.dirtsai.common.common;

import lombok.Data;

import java.util.Date;

@Data
public class ApiCallDTO {
    private Integer id;
    private String tokenNumber;
    private String callModel;
    private Integer usedToken;
    private Date createTime;
    private Integer status;
    private Integer responseTime;
}
