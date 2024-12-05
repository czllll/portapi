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

import java.util.List;

@RestController
@RequestMapping("/api/api-call")
public class ApiCallController {

    @Resource
    private ApiCallService apiCallService;

    /**
     * 新增调用记录
     * @param apiCall 调用记录
     */
    @PostMapping("/create")
    public BaseResponse<Boolean> save(@RequestBody ApiCall apiCall) {
        return ResultUtils.success(apiCallService.save(apiCall));
    }


    @GetMapping("/metrics")
    public BaseResponse<DashboardMetrics> getMetrics(@RequestParam String timeRange) {
        return ResultUtils.success(apiCallService.getMetrics(timeRange));
    }

    @GetMapping("/trends")
    public BaseResponse<ApiCallTrends> getTrends(@RequestParam String timeRange) {
        return ResultUtils.success(apiCallService.getTrends(timeRange));
    }

    @GetMapping("/model-distribution")
    public BaseResponse<List<ModelStats>> getModelDistribution(@RequestParam String timeRange) {
        return ResultUtils.success(apiCallService.getModelDistribution(timeRange));
    }
}
