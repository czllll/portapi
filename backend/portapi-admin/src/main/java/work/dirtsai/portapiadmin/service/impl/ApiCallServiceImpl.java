package work.dirtsai.portapiadmin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import work.dirtsai.portapiadmin.mapper.ApiCallMapper;
import work.dirtsai.portapiadmin.model.dto.ApiCallTrends;
import work.dirtsai.portapiadmin.model.dto.DashboardMetrics;
import work.dirtsai.portapiadmin.model.dto.ModelStats;
import work.dirtsai.portapiadmin.model.entity.ApiCall;
import work.dirtsai.portapiadmin.model.entity.User;
import work.dirtsai.portapiadmin.service.ApiCallService;
import work.dirtsai.portapiadmin.service.UserService;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ApiCallServiceImpl extends ServiceImpl<ApiCallMapper, ApiCall> implements ApiCallService {

    @Resource
    private UserService userService;

    @Override
    public DashboardMetrics getMetrics(String timeRange, Integer userId) {
        LocalDateTime startTime = getStartTimeByRange(timeRange);

        LambdaQueryWrapper<ApiCall> wrapper = Wrappers.lambdaQuery(ApiCall.class)
                .ge(ApiCall::getCreateTime, startTime);

        if (!isAdmin(userId)) {
            wrapper.eq(ApiCall::getUserId, userId);
        }

        List<ApiCall> apiCalls = baseMapper.selectList(wrapper);
        long totalRequests = apiCalls.size();

        double totalTime = 0;
        long totalTokens = 0;
        long errorCount = 0;

        for (ApiCall call : apiCalls) {
            totalTime += call.getResponseTime();
            totalTokens += call.getUsedToken();
            if (call.getStatus() == 0) {
                errorCount++;
            }
        }

        double avgResponseTime = totalRequests > 0 ? totalTime / totalRequests : 0;
        double errorRate = totalRequests > 0 ? (double) errorCount / totalRequests : 0;

        return new DashboardMetrics(totalRequests, avgResponseTime, errorRate, totalTokens);
    }

    @Override
    public ApiCallTrends getTrends(String timeRange, Integer userId) {
        LocalDateTime startTime = getStartTimeByRange(timeRange);

        LambdaQueryWrapper<ApiCall> wrapper = Wrappers.lambdaQuery(ApiCall.class)
                .ge(ApiCall::getCreateTime, startTime)
                .orderByAsc(ApiCall::getCreateTime);

        if (!isAdmin(userId)) {
            wrapper.eq(ApiCall::getUserId, userId);
        }

        List<ApiCall> calls = baseMapper.selectList(wrapper);

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
    public List<ModelStats> getModelDistribution(String timeRange, Integer userId) {
        LocalDateTime startTime = getStartTimeByRange(timeRange);

        LambdaQueryWrapper<ApiCall> wrapper = Wrappers.lambdaQuery(ApiCall.class)
                .ge(ApiCall::getCreateTime, startTime);

        if (!isAdmin(userId)) {
            wrapper.eq(ApiCall::getUserId, userId);
        }

        List<ApiCall> calls = baseMapper.selectList(wrapper);

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
    /**
     * 使用userId判断是否为管理员
     * @param userId
     */
    private boolean isAdmin(Integer userId) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", userId);
        User user = userService.getOne(queryWrapper);
        return user.getRole().equals("admin");

    }
}