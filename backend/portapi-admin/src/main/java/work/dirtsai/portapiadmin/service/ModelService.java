package work.dirtsai.portapiadmin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import work.dirtsai.portapiadmin.model.entity.Model;

import java.util.List;

public interface ModelService extends IService<Model> {
    /**
     * 获取apikey
     * @param modelName
     * @return
     */
    String getApiKeyByModelName(String modelName);

    /**
     * 逻辑删除模型
     * @param id
     */
    boolean deleteModelById(Long id);

    /**
     * 获取模型列表
     * @param current
     * @param size
     * @return
     */
    List<Model> getModelList(Integer current, Integer size);


    /**
     * 测试模型
     *
     * @param model
     * @return
     */
    boolean testModel(Model model);
}
