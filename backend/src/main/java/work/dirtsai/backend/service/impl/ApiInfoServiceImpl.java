package work.dirtsai.backend.service.impl;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import work.dirtsai.backend.mapper.ApiInfoMapper;
import work.dirtsai.backend.model.entity.ApiInfo;
import work.dirtsai.backend.service.ApiInfoService;
import org.springframework.stereotype.Service;

@Service
public class ApiInfoServiceImpl extends ServiceImpl<ApiInfoMapper, ApiInfo> implements ApiInfoService {

}