package work.dirtsai.portapiadmin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import work.dirtsai.portapiadmin.mapper.ModelTemplateMapper;
import work.dirtsai.portapiadmin.model.entity.ModelTemplate;
import work.dirtsai.portapiadmin.service.ModelTemplateService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModelTemplateServiceImpl extends ServiceImpl<ModelTemplateMapper, ModelTemplate> implements ModelTemplateService {

}