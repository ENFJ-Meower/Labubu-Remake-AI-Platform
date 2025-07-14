### 用户认证 API 文档

---
注意：由于全局异常均会被拦截，用户认证中后端返回的所有响应码都为200（OK），具体详细状态需要从响应体（json）中的"code"获得。所有未知异常均会返回
```json
{
  "code": 500,
  "msg": "System error",
  "data": null
}
```

#### **1. 发送邮箱验证码**
**用途**：用户注册前获取邮箱验证码  
**URL**: `/user/sendCode`  
**Method**: `POST`  
**Request Body**:
```json
{
  "email": "user@example.com"
}
```
**成功响应** (200):
```json
{
  "code": 200,
  "msg": "success",
  "data": "Verification code sent successfully"
}
```
**失败响应** (500):
```json
{
  "code": 500,
  "msg": "Failed to send email",
  "data": null
}
```
```json
{
  "code": 500,
  "msg": "Please enter a valid email address.",
  "data": null
}
```

**使用场景**：  
1. 用户注册时填写邮箱，调用此接口发送验证码  
2. 验证码有效期为3min

---

#### **2. 用户注册**
**用途**：使用邮箱验证码注册新账号  
**URL**: `/user/register`  
**Method**: `POST`  
**Request Body**:
```json
{
  "username": "new_user",
  "password": "secure_password",
  "email": "user@example.com",
  "verificationCode": "123456"  // 通过 /sendCode 获取
}
```
**成功响应** (200):
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",  // JWT 令牌
    "username": "new_user",
    "email": "user@example.com"
  }
}
```
**错误响应**：
- 用户名已存在 (409):
  ```json
  {"code": 409, "msg": "Username already exists.","data": null}
  ```
- 邮箱已存在 (409):
  ```json
  {"code": 409, "msg": "Email already exists.","data": null}
  ```
- 验证码错误 (400):
  ```json
  {"code": 400, "msg": "Invalid or expired verification code.","data": null}
  ```

---

#### **3. 用户登录**
**用途**：使用用户名密码登录  
**URL**: `/user/login`  
**Method**: `POST`  
**Request Body**:
```json
{
  "username": "existing_user",
  "password": "user_password"
}
```
**成功响应** (200):
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",  // JWT 令牌
    "username": "existing_user",
    "email": "user@example.com"
  }
}
```
**错误响应**：
- 用户不存在 (401):
  ```json
  {"code": 401, "msg": "User not found","data": null}
  ```
- 密码错误 (401):
  ```json
  {"code": 401, "msg": "Invalid password","data": null}
  ```
---  
**其他错误 (500)**:
  ```json
  {"code": 500, "msg": "The username cannot be empty.","data": null}
  ```
  ```json
  {"code": 500, "msg": "The username cannot be empty.","data": null}
  ```
  ```json
  {"code": 500, "msg": "The username length must be longer than 2 characters.","data": null}
  ``` 

  ```json
  {"code": 500, "msg": "The password cannot be empty.","data": null}
  ``` 
  ```json
  {"code": 500, "msg": "The password length must be between 8 and 16 characters.","data": null}
  ``` 
  ```json
  {"code": 500, "msg": "The password must include at least two of the following: uppercase letters, lowercase letters, and digits.","data": null}
  ``` 
  ```json
  {"code": 500, "msg": "The email cannot be empty.","data": null}
  ``` 
  ```json
  {"code": 500, "msg": "Please enter a valid email address.","data": null}
  ``` 
  ```json
  {"code": 500, "msg": "The verificationCode cannot be empty.","data": null}
  ``` 
  ```json
  {"code": 500, "msg": "The length of verificationCode must be 6","data": null}
  ``` 
---

### 关键说明
1. **Token 使用**  
   - 登录/注册成功后返回的 `token` 需在后续请求的 **Authorization Header** 中携带  
   - 格式：`Authorization: Bearer <token>`

2. **安全要求**  
   - JWT 令牌有效期由后端控制

3. **错误处理逻辑**  
   - `401` 错误：强制跳转登录页  
   - `409` 错误：提示用户修改用户名/邮箱  
   - `500` 错误：展示服务端错误消息

4. **参数验证规则**  
   - 邮箱格式：`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$`  
   - 用户名长度：2- 位  
   - 密码强度：8-16 位（大小字母，小写字母，数字这三类中至少有两类）

---

### 前端调用示例 (JavaScript)
```javascript
// 登录示例
const login = async () => {
  const res = await fetch("/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "test_user",
      password: sha256("password123") // 前端加密
    })
  });
  
  const result = await res.json();
  if (result.code === 200) {
    localStorage.setItem("token", result.data.token); // 存储token
  }
};

// 后续请求携带token
const getProfile = async () => {
  const res = await fetch("/api/profile", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });
};
```
