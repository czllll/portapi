package work.dirtsai.portapiadmin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import work.dirtsai.portapiadmin.mapper.ModelMapper;
import work.dirtsai.portapiadmin.model.entity.Model;
import work.dirtsai.portapiadmin.service.ModelService;

import java.util.List;

@Service
public class ModelServiceImpl extends ServiceImpl<ModelMapper, Model> implements ModelService {
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
    public List<Model> getModelList(Integer current, Integer size) {
        // 只显示is_deleted为0的模型
        QueryWrapper<Model> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("is_deleted", 0);
        Page<Model> page = new Page<>(current, size);
        return this.page(page, queryWrapper).getRecords();

    }
}
