package com.labubu.labububackend.service;

import com.labubu.labububackend.entity.User;
import com.labubu.labububackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.sql.Timestamp;
import java.util.Base64;
import org.springframework.security.crypto.bcrypt.BCrypt;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 注册新用户
    public User register(String username, String email, String password) {
        // 检查用户名和邮箱唯一
        if (userRepository.findByUsername(username) != null) {
            throw new RuntimeException("用户名已存在");
        }
        if (userRepository.findByEmail(email) != null) {
            throw new RuntimeException("邮箱已存在");
        }
        // 生成盐
        String salt = generateSalt();
        // 密码加密
        String passwordHash = hashPassword(password, salt);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setSalt(salt);
        user.setPasswordHash(passwordHash);
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        return userRepository.save(user);
    }

    // 登录校验
    public User login(String usernameOrEmail, String password) {
        User user = userRepository.findByUsername(usernameOrEmail);
        if (user == null) {
            user = userRepository.findByEmail(usernameOrEmail);
        }
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        // 校验密码
        if (!verifyPassword(password, user.getSalt(), user.getPasswordHash())) {
            throw new RuntimeException("密码错误");
        }
        return user;
    }

    // 生成盐
    private String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    // 密码加密
    private String hashPassword(String password, String salt) {
        return BCrypt.hashpw(password + salt, BCrypt.gensalt());
    }

    // 密码校验
    private boolean verifyPassword(String password, String salt, String hash) {
        return BCrypt.checkpw(password + salt, hash);
    }
}