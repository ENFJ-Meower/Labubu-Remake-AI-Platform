package login.cloudComputing.serviceImpl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import login.cloudComputing.entity.User;
import login.cloudComputing.exception.CustomException;
import login.cloudComputing.mapper.UserMapper;
import login.cloudComputing.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final StringRedisTemplate redis;
    private final JavaMailSender mailSender;

    public UserServiceImpl(StringRedisTemplate redis, JavaMailSender mailSender) {
        this.redis = redis;
        this.mailSender = mailSender;
    }

    @Override
    public void sendVerificationCode(String email) {
        String code = String.format("%06d", new Random().nextInt(1_000_000));

        String key = buildKey(email);
        redis.opsForValue().set(key, code, Duration.ofMinutes(3));

        String subject = "【LabubuAI】Verification Code";
        String logoUrl = "https://emailpicture-humm.s3.us-east-1.amazonaws.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250710191132.png";

        String html = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <meta charset=\"UTF-8\">" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "  <style>" +
                "    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');" +
                "    body { margin: 0; padding: 0; background-color: #f5f8ff; font-family: 'Poppins', Arial, sans-serif; }" +
                "    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); }" +
                "    .header { background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding: 40px 0 30px; text-align: center; }" +
                "    .logo { height: 48px; }" +
                "    .title { font-size: 28px; font-weight: 600; color: white; margin: 15px 0 0; letter-spacing: -0.5px; }" +
                "    .content { padding: 40px; color: #333333; line-height: 1.6; }" +
                "    .greeting { font-size: 18px; margin-bottom: 5px; }" +
                "    .message { margin: 20px 0; font-size: 16px; color: #555555; }" +
                "    .code-container { background: #f0f7ff; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; border: 1px dashed #4d86ff; }" +
                "    .code { font-size: 42px; font-weight: 700; letter-spacing: 5px; color: #2d6efd; margin: 10px 0; font-family: monospace; }" +
                "    .expire { color: #ff5252; font-weight: 500; margin-top: 15px; font-size: 15px; }" +
                "    .divider { height: 1px; background: #eaeff7; margin: 35px 0; }" +
                "    .support { margin: 25px 0 15px; }" +
                "    .footer { padding: 25px; text-align: center; background: #f8faff; color: #666666; font-size: 13px; }" +
                "    .footer-links { margin-top: 10px; }" +
                "    .footer-links a { color: #4d86ff; text-decoration: none; margin: 0 10px; }" +
                "    .note { background: #fff8f8; border-left: 4px solid #ff5252; padding: 15px; margin-top: 25px; border-radius: 0 8px 8px 0; }" +
                "    @media (max-width: 620px) { " +
                "      .content { padding: 30px 20px; } " +
                "      .code { font-size: 36px; } " +
                "    }" +
                "  </style>" +
                "</head>" +
                "<body>" +
                "  <div class=\"container\">" +
                "    <div class=\"header\">" +
                "      <img src=\"" + logoUrl + "\" alt=\"LabubuAI Logo\" class=\"logo\">" +
                "      <h1 class=\"title\">Account Verification</h1>" +
                "    </div>" +
                "    <div class=\"content\">" +
                "      <p class=\"greeting\">Hello there,</p>" +
                "      <p class=\"message\">Welcome to LabubuAI! We're excited to have you on board. To complete your account setup, please use the following verification code:</p>" +
                "      " +
                "      <div class=\"code-container\">" +
                "        <div class=\"code\">" + code + "</div>" +
                "        <p class=\"expire\">⚠️ Valid for 3 minutes only</p>" +
                "      </div>" +
                "      " +
                "      <div class=\"note\">" +
                "        <p><strong>Security tip:</strong> Never share this code with anyone. LabubuAI will never ask you for your verification code.</p>" +
                "      </div>" +
                "      " +
                "      <p class=\"message\">If you didn't request this code, please ignore this email. It's possible another user entered your email address by mistake.</p>" +
                "      " +
                "      <div class=\"divider\"></div>" +
                "      " +
                "      <div class=\"support\">" +
                "        <p>Need assistance? Our support team is here to help:</p>" +
                "        <p>📧 <a href=\"mailto:labubuai.technology@gmail.com\" style=\"color: #4d86ff; text-decoration: none;\">labubuai.technology@gmail.com</a></p>" +
                "        <p>🌐 <a href=\"https://www.labubuai.me\" style=\"color: #4d86ff; text-decoration: none;\">www.labubuai.me</a></p>" +
                "      </div>" +
                "    </div>" +
                "    <div class=\"footer\">" +
                "      <p>&copy; 2025 LabubuAI Technologies. All rights reserved.</p>" +
                "      <p>This is an automated message. Please do not reply directly to this email.</p>" +
                "      <div class=\"footer-links\">" +
                "        <a href=\"https://www.labubuai.me/privacy\">Privacy Policy</a>" +
                "        <a href=\"https://www.labubuai.me/terms\">Terms of Service</a>" +
                "        <a href=\"https://www.labubuai.me\">Website</a>" +
                "      </div>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";

        try {
            sendHtmlMail(email, subject, html);
            log.info("Verification code email sent to {}, code={}", email, code);
        } catch (MessagingException e) {
            log.error("Failed to send verification code email", e);
            throw new CustomException("Failed to send verification code. Please try again later.");
        }
    }

    @Override
    public boolean verifyCode(String email, String codeInput) {
        String key = buildKey(email);
        String codeStored = redis.opsForValue().get(key);

        if (codeStored == null) {
            return false;
        }
        if (!codeStored.equals(codeInput)) {
            return false;
        }

        redis.delete(key);
        return true;
    }

    @Override
    public void sendHtmlMail(String to, String subject, String html) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        mailSender.send(message);
    }

    private String buildKey(String email) {
        return "email:verify:code:" + email;
    }
}