package login.cloudComputing.utils;

import cn.hutool.core.lang.UUID;
import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import login.cloudComputing.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtUtils {

    private static final long TOKEN_EXPIRED_TIME = 30L * 24 * 60 * 60 * 1000;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public String createJWT(Map<String, Object> claims, Long time) {
        Date now = new Date(System.currentTimeMillis());
        String jwtId = UUID.randomUUID().toString();

        JwtBuilder builder = Jwts.builder()
                .setClaims(claims)
                .setId(jwtId)
                .setIssuedAt(now)
                .signWith(SignatureAlgorithm.HS256,secretKey);

        if (time != null && time >= 0) {
            long expMillis = now.getTime() + time;
            Date exp = new Date(expMillis);
            builder.setExpiration(exp);
        }
        return builder.compact();
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("user_id", user.getUserId());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        return createJWT(claims, TOKEN_EXPIRED_TIME);
    }
}
