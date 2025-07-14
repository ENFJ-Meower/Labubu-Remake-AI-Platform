package login.cloudComputing.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import login.cloudComputing.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author wmz
 * @since 2025-07-11
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

}
