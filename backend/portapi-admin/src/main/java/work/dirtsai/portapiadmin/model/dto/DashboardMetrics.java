package work.dirtsai.portapiadmin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardMetrics {
    private Long totalRequests;       // 总请求数
    private Double avgResponseTime;   // 平均响应时间
    private Double errorRate;         // 错误率
    private Long totalTokens;         // 总token消耗
}