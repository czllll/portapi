package work.dirtsai.portapiadmin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import work.dirtsai.portapiadmin.model.dto.ApiCallTrends;
import work.dirtsai.portapiadmin.model.dto.DashboardMetrics;
import work.dirtsai.portapiadmin.model.dto.ModelStats;
import work.dirtsai.portapiadmin.model.entity.ApiCall;

import java.util.List;

public interface ApiCallService extends IService<ApiCall> {

    DashboardMetrics getMetrics(String timeRange, Integer userId);

    ApiCallTrends getTrends(String timeRange, Integer userId);

    List<ModelStats> getModelDistribution(String timeRange, Integer userId);
}