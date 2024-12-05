package work.dirtsai.portapiproxy.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import work.dirtsai.common.common.ApiCallDTO;
import work.dirtsai.common.common.BaseResponse;
import work.dirtsai.portapiproxy.config.FeignConfig;
import work.dirtsai.portapiproxy.entity.Model;
import work.dirtsai.common.common.UpdateQuotaRequest;

import java.util.List;

@FeignClient(name = "portapi-admin1" , configuration = FeignConfig.class)
public interface AdminClient {
    @PutMapping("/api/tokens/quota")
    BaseResponse<Boolean> updateTokensQuota(@RequestBody UpdateQuotaRequest updateQuatoRequest);

    @GetMapping("/api/model/list")
    List<Model> list();

    /**
     * 根据模型名称获取apikey
     */
    @GetMapping("/api/model/apikey")
    String getApiKeyByModelName(@RequestParam String modelName);

    /**
     * 新增调用信息
     */
    @PostMapping("/api/api-call/create")
    BaseResponse<Boolean> saveApiCall(@RequestBody ApiCallDTO apiCallDTO);

}