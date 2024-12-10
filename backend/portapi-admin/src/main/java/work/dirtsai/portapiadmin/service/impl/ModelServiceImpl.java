package work.dirtsai.portapiadmin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import okhttp3.*;
import org.springframework.stereotype.Service;
import work.dirtsai.common.common.PageResponse;
import work.dirtsai.portapiadmin.common.ErrorCode;
import work.dirtsai.portapiadmin.exception.BusinessException;
import work.dirtsai.portapiadmin.mapper.ModelMapper;
import work.dirtsai.portapiadmin.model.entity.Model;
import work.dirtsai.portapiadmin.service.ModelService;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ModelServiceImpl extends ServiceImpl<ModelMapper, Model> implements ModelService {

   @Resource
   private OkHttpClient okHttpClient;

    @Override
    public String getApiKeyByModelName(String modelName) {
        QueryWrapper<Model> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("model_name", modelName);
        Model model = this.getOne(queryWrapper);
        if (model != null) {
            return model.getRealApiKey();
        }
        return null;
    }

    @Override
    public boolean deleteModelById(Long id) {
        Model model = this.getById(id);
        if (model == null) {
            return false;
        }
        model.setIsDeleted(1);
        return this.updateById(model);
    }

    @Override
    public PageResponse<Model> getModelList(Integer current, Integer size) {
        QueryWrapper<Model> queryWrapper = new QueryWrapper<Model>()
                .eq("is_deleted", 0)
                .orderByDesc("updated_time");

        Page<Model> page = new Page<>(current, size);
        Page<Model> modelPage = this.page(page, queryWrapper);

        List<Model> records = modelPage.getRecords();

        return new PageResponse<>(
                records,
                modelPage.getTotal(),
                modelPage.getCurrent(),
                modelPage.getSize()
        );
    }

    public boolean testModel(Model model) {
        try {
            switch (model.getModelCompany().toUpperCase()) {
                case "OPENAI":
                    return testOpenAiModel(model);
//                case "ANTHROPIC":
//                    return testClaudeModel(model);
                case "GOOGLE":
                    return testGeminiModel(model);
                default:
                    throw new BusinessException(ErrorCode.SYSTEM_ERROR,
                            "Unsupported model company: " + model.getModelCompany());
            }
        } catch (Exception e) {
            model.setUpdatedTime(LocalDateTime.now());
            this.updateById(model);
            return false;
        }
    }

    private boolean testOpenAiModel(Model model) throws JsonProcessingException {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model.getModelName());
        requestBody.put("messages", Collections.singletonList(
                new HashMap<String, String>() {{
                    put("role", "user");
                    put("content", "test connection");
                }}
        ));

        ObjectMapper mapper = new ObjectMapper();

        Request request = new Request.Builder()
                .url("https://api.openai.com/v1/chat/completions")
                .header("Authorization", "Bearer " + model.getRealApiKey())
                .header("Content-Type", "application/json")
                .post(RequestBody.create(
                        MediaType.parse("application/json"),
                        mapper.writeValueAsString(requestBody)))
                .build();

        try {
            Response response = okHttpClient.newCall(request).execute();
            boolean success = response.isSuccessful();
            model.setUpdatedTime(LocalDateTime.now());
            this.updateById(model);
            return success;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR,
                    "OpenAI model connection test failed: " + e.getMessage());
        }
    }

    private boolean testGeminiModel(Model model) throws JsonProcessingException {
        Map<String, Object> requestBody = new HashMap<>();
        /**
         * {
         * 	"contents": [
         * 		        {
         * 			"parts": [
         *                {
         * 					"text": "ping"
         *                }
         * 			]
         *        }
         * 	]
         * } 按照这个body格式
         */

        requestBody.put("contents", Collections.singletonList(
                new HashMap<String, Object>() {{
                    put("parts", Collections.singletonList(
                            new HashMap<String, String>() {{
                                put("text", "ping");
                            }}
                    ));
                }}
        ));

        ObjectMapper mapper = new ObjectMapper();

        Request request = new Request.Builder()
                .url("https://generativelanguage.googleapis.com/v1beta/models/" + model.getModelName() + ":generateContent?key=" + model.getRealApiKey())
                .header("Content-Type", "application/json")
                .post(RequestBody.create(
                        MediaType.parse("application/json"),
                        mapper.writeValueAsString(requestBody)))
                .build();

        try {
            Response response = okHttpClient.newCall(request).execute();
            boolean success = response.isSuccessful();
            model.setUpdatedTime(LocalDateTime.now());
            this.updateById(model);
            return success;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR,
                    "Google model connection test failed: " + e.getMessage());
        }
    }
}
