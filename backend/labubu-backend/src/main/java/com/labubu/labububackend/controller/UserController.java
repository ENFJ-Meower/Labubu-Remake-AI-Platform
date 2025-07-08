package com.labubu.labububackend.controller;

import com.labubu.labububackend.entity.User;
import com.labubu.labububackend.service.UserService;
import com.labubu.labububackend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    // 注册接口
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        User user = userService.register(username, email, password);
        Map<String, Object> result = new HashMap<>();
        result.put("msg", "注册成功");
        result.put("userId", user.getId());
        return result;
    }

    // 登录接口
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String usernameOrEmail = body.get("usernameOrEmail");
        String password = body.get("password");
        User user = userService.login(usernameOrEmail, password);
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        Map<String, Object> result = new HashMap<>();
        result.put("msg", "登录成功");
        result.put("token", token);
        result.put("username", user.getUsername());
        return result;
    }

    // 示例：受保护接口
    @GetMapping("/profile")
    public Map<String, Object> profile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = Long.valueOf(jwtUtil.parseToken(token).getSubject());
        String username = (String) jwtUtil.parseToken(token).get("username");
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("username", username);
        return result;
    }
}