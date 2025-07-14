package login.cloudComputing.service;

import com.baomidou.mybatisplus.extension.service.IService;
import login.cloudComputing.entity.User;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author wmz
 * @since 2025-07-11
 */

public interface UserService extends IService<User> {
    /**
     * 发送邮箱验证码
     * @param email 目标邮箱
     */
    void sendVerificationCode(String email);

    /**
     * 校验邮箱验证码
     * @param email 目标邮箱
     * @param codeInput 用户输入的验证码
     * @return 验证通过返回 true，否则返回 false
     */
    boolean verifyCode(String email, String codeInput);

    /**
     * 发送 HTML 邮件
     */
    void sendHtmlMail(String to, String subject, String html) throws jakarta.mail.MessagingException;

}
