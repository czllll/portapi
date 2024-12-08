package work.dirtsai.portapiadmin.controller;


import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import work.dirtsai.common.common.BaseResponse;
import work.dirtsai.portapiadmin.common.ResultUtils;
import work.dirtsai.portapiadmin.model.entity.Model;
import work.dirtsai.portapiadmin.service.ModelService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/model")
public class ModelController {

    @Resource
    private ModelService modelService;


    /** 获取模型列表 */
    @GetMapping("/list")
    public List<Model> list() {
        return modelService.list();
    }

    /**
     * 根据模型名称获取apikey
     * @param modelName 模型名称
     * @return apikey
     */
    @GetMapping("/apikey")
    public String getApiKeyByModelName(String modelName) {
        return modelService.getApiKeyByModelName(modelName);
    }

    /**
     * 分页获取模型列表
     * @param current 当前页
     * @param size 每页数量
     *
     */
    @GetMapping("/page")
    public List<Model> page(@RequestParam(defaultValue = "1") Integer current,
                            @RequestParam(defaultValue = "10") Integer size) {
        return modelService.getModelList(current, size);
    }

    /**
     * 更新模型
     * @param model 模型
     *
     */
    @PutMapping
    public boolean update(@RequestBody Model model) {
        return modelService.updateById(model);
    }

    /**
     * 逻辑删除模型
     * @param id 模型id
     *
     */
    @PutMapping("/{id}/delete")
    public boolean delete(@PathVariable Long id) {
        return modelService.deleteModelById(id);
    }

    /**
     * 新增模型
     * @param model 模型
     *
     */
    @PostMapping
    public boolean save(@RequestBody Model model) {
        return modelService.save(model);
    }

    /**
     * 测试模型
     * @param model 模型
     */
    @PostMapping("/test")
    public BaseResponse<Boolean> test(@RequestBody Model model) {
        boolean result = modelService.testModel(model);
        return ResultUtils.success(result);
    }
}
