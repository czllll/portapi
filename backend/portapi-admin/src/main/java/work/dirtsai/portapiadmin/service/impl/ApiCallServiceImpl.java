package work.dirtsai.portapiadmin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import work.dirtsai.portapiadmin.mapper.ApiCallMapper;
import work.dirtsai.portapiadmin.model.dto.ApiCallTrends;
import work.dirtsai.portapiadmin.model.dto.DashboardMetrics;
import work.dirtsai.portapiadmin.model.dto.ModelStats;
import work.dirtsai.portapiadmin.model.entity.ApiCall;
import work.dirtsai.portapiadmin.service.ApiCallService;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ApiCallServiceImpl extends ServiceImpl<ApiCallMapper, ApiCall> implements ApiCallService  {


    @Override
    public DashboardMetrics getMetrics(String timeRange) {
        LocalDateTime startTime = getStartTimeByRange(timeRange);

        LambdaQueryWrapper<ApiCall> wrapper = Wrappers.lambdaQuery(ApiCall.class)
                .ge(ApiCall::getCreateTime, startTime);

        long totalRequests = count(wrapper);
        double avgResponseTime = baseMapper.selectList(wrapper)
                .stream()
                .mapToInt(ApiCall::getResponseTime)
                .average()
                .orElse(0.0);
        long errorCount = count(wrapper.eq(ApiCall::getStatus, 0));
        double errorRate = totalRequests > 0 ? (double) errorCount / totalRequests : 0;
        Long totalTokens = baseMapper.selectList(wrapper)
                .stream()
                .mapToLong(ApiCall::getUsedToken)
                .sum();

        return new DashboardMetrics(totalRequests, avgResponseTime, errorRate, totalTokens);
    }

    @Override
    public ApiCallTrends getTrends(String timeRange) {
        LocalDateTime startTime = getStartTimeByRange(timeRange);

        // 按时间分组查询
        LambdaQueryWrapper<ApiCall> wrapper = Wrappers.lambdaQuery(ApiCall.class)
                .ge(ApiCall::getCreateTime, startTime)
                .orderByAsc(ApiCall::getCreateTime);

        List<ApiCall> calls = baseMapper.selectList(wrapper);

        // 按天分组统计
        Map<LocalDateTime, Long> requestCounts = calls.stream()
                .collect(Collectors.groupingBy(
                        call -> call.getCreateTime().truncatedTo(ChronoUnit.DAYS),
                        Collectors.counting()
                ));

        Map<LocalDateTime, Double> avgResponseTimes = calls.stream()
                .collect(Collectors.groupingBy(
                        call -> call.getCreateTime().truncatedTo(ChronoUnit.DAYS),
                        Collectors.averagingDouble(ApiCall::getResponseTime)
                ));

        Map<LocalDateTime, Long> tokenSums = calls.stream()
                .collect(Collectors.groupingBy(
                        call -> call.getCreateTime().truncatedTo(ChronoUnit.DAYS),
                        Collectors.summingLong(ApiCall::getUsedToken)
                ));

        return new ApiCallTrends(requestCounts, avgResponseTimes, tokenSums);
    }

    @Override
    public List<ModelStats> getModelDistribution(String timeRange) {
        LocalDateTime startTime = getStartTimeByRange(timeRange);

        LambdaQueryWrapper<ApiCall> wrapper = Wrappers.lambdaQuery(ApiCall.class)
                .ge(ApiCall::getCreateTime, startTime);

        List<ApiCall> calls = baseMapper.selectList(wrapper);

        // 按模型分组统计
        return calls.stream()
                .collect(Collectors.groupingBy(
                        ApiCall::getCallModel,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    ModelStats stats = new ModelStats();
                                    stats.setModelName(list.get(0).getCallModel());
                                    stats.setCallCount((long) list.size());
                                    stats.setTokenUsage(list.stream()
                                            .mapToLong(ApiCall::getUsedToken)
                                            .sum());
                                    return stats;
                                }
                        )
                ))
                .values()
                .stream()
                .toList();
    }

    private LocalDateTime getStartTimeByRange(String timeRange) {
        LocalDateTime now = LocalDateTime.now();
        return switch (timeRange) {
            case "24h" -> now.minusHours(24);
            case "7days" -> now.minusDays(7);
            case "30days" -> now.minusDays(30);
            case "90days" -> now.minusDays(90);
            default -> throw new IllegalArgumentException("Invalid time range");
        };
    }
}
