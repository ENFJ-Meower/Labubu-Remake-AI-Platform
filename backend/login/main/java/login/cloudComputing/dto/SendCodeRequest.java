package login.cloudComputing.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendCodeRequest {
    @NotBlank(message = "The email cannot be empty.")
    @Email(message = "Please enter a valid email address.")
    @TableField("email")
    private String email;
}

