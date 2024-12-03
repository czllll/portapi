package work.dirtsai.portapiproxy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import work.dirtsai.common.common.BaseResponse;
import work.dirtsai.portapiproxy.entity.Model;
import work.dirtsai.common.common.UpdateQuotaRequest;
import work.dirtsai.portapiproxy.feign.AdminClient;

import java.util.List;

@Service
public class StandardOpenAIRequestService {

    private final AdminClient adminClient;

    @Autowired
    public StandardOpenAIRequestService(AdminClient adminClient) {
        this.adminClient = adminClient;
    }

    public boolean updateTokenQuota(String tokenNumber, Integer consumedQuota) {
        UpdateQuotaRequest request = new UpdateQuotaRequest();
        request.setTokenNumber(tokenNumber);
        request.setConsumedQuota(consumedQuota);
        BaseResponse<Boolean> response = adminClient.updateTokensQuota(request);
        try {
            return response.getData();
        } catch (Exception e) {
            return false;
        }

    }

    public List<Model> list() {
        return adminClient.list();
    }

    /**
     * 根据模型名称获取apikey
     * @param modelName 模型名称
     */
    public String getApiKeyByModelName(String modelName) {
        return adminClient.getApiKeyByModelName(modelName);
    }

}
