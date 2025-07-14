package login.cloudComputing.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "The username cannot be empty.")
    @Size(min = 2, message = "The username length must be longer than 2 characters.")
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
    private String password;

    @NotBlank(message = "The email cannot be empty.")
    @Email(message = "Please enter a valid email address.")
    private String email;

    @NotBlank(message = "The verificationCode cannot be empty.")
    @Size(min = 6, max = 6,message = "The length of verificationCode must be 6")
    private String verificationCode;
}
