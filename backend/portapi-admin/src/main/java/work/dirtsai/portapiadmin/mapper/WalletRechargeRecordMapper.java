package work.dirtsai.portapiadmin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.apache.ibatis.annotations.Mapper;
import work.dirtsai.portapiadmin.model.entity.WalletRechargeRecord;

@Mapper
public interface WalletRechargeRecordMapper extends BaseMapper<WalletRechargeRecord> {
    // 自定义分页查询
//    @Select("SELECT * FROM wallet_recharge_record WHERE user_id = #{userId}")
//    IPage<WalletRechargeRecord> selectPageByUserId(Page<WalletRechargeRecord> page, @Param("userId") Long userId);
}