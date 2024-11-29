package work.dirtsai.portapiadmin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import work.dirtsai.portapiadmin.model.entity.User;

@Mapper
public interface UserMapper extends BaseMapper<User> {

}