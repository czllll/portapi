package work.dirtsai.portapiadmin.service.impl;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import work.dirtsai.portapiadmin.mapper.ApiInfoMapper;
import work.dirtsai.portapiadmin.model.entity.ApiInfo;
import work.dirtsai.portapiadmin.service.ApiInfoService;
import org.springframework.stereotype.Service;

@Service
public class ApiInfoServiceImpl extends ServiceImpl<ApiInfoMapper, ApiInfo> implements ApiInfoService {

}