package login.cloudComputing.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;

/**
 * <p>
 *
 * </p>
 *
 * @author wmz
 * @since 2025-07-11
 */
@Getter
@Setter
@ToString
@TableName("users")
@ApiModel(value = "User Object")
public class User implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @TableId(value = "user_id", type = IdType.AUTO)
    private Long userId;;

    @NotBlank(message = "The username cannot be empty.")
    @Size(min = 2, message = "The password length must be longer than 2 characters.")
    @TableField("username")
    private String username;

    @NotBlank(message = "The password cannot be empty.")
    @Size(min = 8, max = 16, message = "The password length must be between 8 and 16 characters.")
    @Pattern(
            regexp = "^(?:(?=.*[A-Z])(?=.*[a-z])"
                    + "|(?=.*[A-Z])(?=.*\\d)"
                    + "|(?=.*[a-z])(?=.*\\d))"
                    + ".+$",
            message = "The password must include at least two of the following: uppercase letters, lowercase letters, and digits."
    )
    @TableField("password")
    private String password;

    @NotBlank(message = "The email cannot be empty.")
    @Email(message = "Please enter a valid email address.")
    @TableField("email")
    private String email;

}
