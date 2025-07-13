package com.labubu.labububackend.repository;

import com.labubu.labububackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 根据用户名查找用户
    User findByUsername(String username);
    
    // 根据邮箱查找用户
    User findByEmail(String email);
    
    // 根据用户名或邮箱查找用户
    User findByUsernameOrEmail(String username, String email);
}
