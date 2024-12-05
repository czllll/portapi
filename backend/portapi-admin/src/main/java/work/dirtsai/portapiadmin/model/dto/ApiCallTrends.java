package work.dirtsai.portapiadmin.model.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
public class ApiCallTrends {
    private List<String> timePoints;      // 时间点列表
    private List<Long> requestCounts;     // 对应的请求数
    private List<Double> avgResponseTimes; // 对应的平均响应时间
    private List<Long> tokenSums;         // 对应的token使用量

    public ApiCallTrends(Map<LocalDateTime, Long> requestCounts,
                         Map<LocalDateTime, Double> avgResponseTimes,
                         Map<LocalDateTime, Long> tokenSums) {
        // 获取所有时间点并排序
        this.timePoints = requestCounts.keySet().stream()
                .sorted()
                .map(time -> time.format(DateTimeFormatter.ISO_LOCAL_DATE))
                .collect(Collectors.toList());

        // 按时间点顺序整理数据
        this.requestCounts = new ArrayList<>();
        this.avgResponseTimes = new ArrayList<>();
        this.tokenSums = new ArrayList<>();

        for (String timePoint : timePoints) {
            LocalDateTime time = LocalDateTime.parse(timePoint + "T00:00:00");
            this.requestCounts.add(requestCounts.getOrDefault(time, 0L));
            this.avgResponseTimes.add(avgResponseTimes.getOrDefault(time, 0.0));
            this.tokenSums.add(tokenSums.getOrDefault(time, 0L));
        }
    }
}
