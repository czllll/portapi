package work.dirtsai.portapiadmin.controller;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import work.dirtsai.common.common.BaseResponse;
import work.dirtsai.portapiadmin.common.ResultUtils;
import work.dirtsai.portapiadmin.model.dto.ApiCallTrends;
import work.dirtsai.portapiadmin.model.dto.DashboardMetrics;
import work.dirtsai.portapiadmin.model.dto.ModelStats;
import work.dirtsai.portapiadmin.model.entity.ApiCall;
import work.dirtsai.portapiadmin.service.ApiCallService;
import work.dirtsai.portapiadmin.service.TokensService;

import java.util.List;

@RestController
@RequestMapping("/api/api-call")
public class ApiCallController {

    @Resource
    private ApiCallService apiCallService;

    @Resource
    private TokensService tokensService;

    @PostMapping("/create")
    public BaseResponse<Boolean> save(@RequestBody ApiCall apiCall) {
        // 添加userId
        apiCall.setUserId(tokensService.getUserIdByTokenNumber(apiCall.getTokenNumber()));

        return ResultUtils.success(apiCallService.save(apiCall));
    }

    @GetMapping("/metrics")
    public BaseResponse<DashboardMetrics> getMetrics(
            @RequestParam String timeRange,
            @RequestParam Integer userId
            ) {
        return ResultUtils.success(apiCallService.getMetrics(timeRange, userId));
    }

    @GetMapping("/trends")
    public BaseResponse<ApiCallTrends> getTrends(
            @RequestParam String timeRange,
            @RequestParam Integer userId
            ) {
        return ResultUtils.success(apiCallService.getTrends(timeRange, userId));
    }

    @GetMapping("/model-distribution")
    public BaseResponse<List<ModelStats>> getModelDistribution(
            @RequestParam String timeRange,
            @RequestParam Integer userId
            ) {
        return ResultUtils.success(apiCallService.getModelDistribution(timeRange, userId));
    }
}