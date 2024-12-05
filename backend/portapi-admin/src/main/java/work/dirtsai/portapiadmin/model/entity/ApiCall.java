package work.dirtsai.portapiadmin.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@TableName("api_call")
public class ApiCall {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String tokenNumber;
    private String callModel;
    private Integer usedToken;
    private LocalDateTime createTime;
    private Integer status;
    private Integer responseTime;
}
