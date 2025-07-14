package login.cloudComputing.controller;

import io.swagger.annotations.ApiOperation;
import login.cloudComputing.common.result;
import login.cloudComputing.dto.LoginRequest;
import login.cloudComputing.dto.RegisterRequest;
import login.cloudComputing.dto.SendCodeRequest;
import login.cloudComputing.entity.User;
import login.cloudComputing.service.UserService;
import login.cloudComputing.utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author wmz
 * @since 2025-07-11
 */

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    private final JwtUtils jwtUtils;

    public UserController(UserService userService, JwtUtils jwtUtils)   {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @ApiOperation(value = "登录")
    @PostMapping("/login")
    public result<?> login(@Validated @RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        User user = userService.lambdaQuery()
                .eq(User::getUsername, username)
                .one();

        if (user == null) {
            return result.error(401,"User not found");
        }
        if (!user.getPassword().equals(password)) {
            return result.error(401,"Invalid password");
        }
        return getResult(user);
    }


    @ApiOperation(value = "注册")
    @PostMapping("/register")
    public result<?> register(@Validated @RequestBody RegisterRequest registerRequest) {
        String username = registerRequest.getUsername();
        String password = registerRequest.getPassword();
        String email = registerRequest.getEmail();
        String verificationCode = registerRequest.getVerificationCode();

        if (userService.lambdaQuery().eq(User::getUsername, username).exists()) {
            return result.error(409,"Username already exists.");
        }
        if (userService.lambdaQuery().eq(User::getEmail, email).exists()) {
            return result.error(409,"Email already exists.");
        }
        if (!userService.verifyCode(email, verificationCode)) {
            return result.error(400,"Invalid or expired verification code.");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setEmail(email);

        userService.save(newUser);

        return getResult(newUser);
    }

    @ApiOperation(value = "发送邮箱验证码")
    @PostMapping("/sendCode")
    public result<?> sendCode(@Validated @RequestBody SendCodeRequest request) {
        String email = request.getEmail();
        try {
            userService.sendVerificationCode(email);
        } catch (Exception e) {
            log.error(e.getMessage());
            return result.error(500, "Failed to send email");
        }
        return result.success("Verification code sent successfully");
    }

    private result<?> getResult(User user) {
        String token = jwtUtils.generateToken(user);
        HashMap<String, Object> map = new HashMap<>();
        map.put("token", token);
        map.put("username",user.getUsername());
        map.put("email",user.getEmail());
        return result.success(map);
    }
}

