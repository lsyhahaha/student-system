# 学生管理系统接口文档

## 基础信息
- 基础URL: `http://localhost:8080/api`
- 请求头: 
  ```json
  {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${token}"
  }
  ```

## 1. 用户认证

### 1.1 登录
- 请求路径：`/auth/login`
- 请求方法：POST
- 请求参数：
  ```json
  {
    "username": "string",
    "password": "string",
    "role": "string"  // "admin" | "teacher" | "student"
  }
  ```
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "token": "string",
      "userInfo": {
        "id": "number",
        "username": "string",
        "role": "string",
        "avatar": "string"
      }
    }
  }
  ```

### 1.2 注册
- 请求路径：`/auth/register`
- 请求方法：POST
- 请求参数：
  ```json
  {
    "username": "string",
    "password": "string",
    "role": "string",  // "teacher" | "student"
    "confirmPassword": "string"
  }
  ```
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

### 1.3 退出登录
- 请求路径：`/auth/logout`
- 请求方法：POST
- 请求参数：无
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

## 2. 用户管理

### 2.1 获取个人信息
- 请求路径：`/user/profile`
- 请求方法：GET
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "number",
      "username": "string",
      "role": "string",
      "avatar": "string",
      "email": "string",
      "phone": "string"
    }
  }
  ```

### 2.2 修改个人信息
- 请求路径：`/user/profile`
- 请求方法：PUT
- 请求参数：
  ```json
  {
    "username": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string"
  }
  ```
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

### 2.3 修改密码
- 请求路径：`/user/password`
- 请求方法：PUT
- 请求参数：
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string",
    "confirmPassword": "string"
  }
  ```
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

## 3. 考勤管理

### 3.1 获取考勤列表
- 请求路径：`/attendance/list`
- 请求方法：GET
- 请求参数：
  ```typescript
  {
    pageNum: number,
    pageSize: number,
    classId?: string,
    startDate?: string,
    endDate?: string
  }
  ```
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": "number",
      "list": [
        {
          "id": "number",
          "studentName": "string",
          "className": "string",
          "date": "string",
          "status": "string",  // "normal" | "late" | "absent" | "leave"
          "checkInTime": "string",
          "checkOutTime": "string"
        }
      ]
    }
  }
  ```

### 3.2 创建考勤记录
- 请求路径：`/attendance/create`
- 请求方法：POST
- 请求参数：
  ```json
  {
    "classId": "string",
    "studentIds": ["string"],
    "date": "string",
    "status": "string"
  }
  ```
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

### 3.3 请假申请
- 请求路径：`/attendance/leave`
- 请求方法：POST
- 请求参数：
  ```json
  {
    "studentId": "string",
    "startDate": "string",
    "endDate": "string",
    "reason": "string",
    "type": "string"  // "sick" | "personal"
  }
  ```
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

## 4. 成绩管理

### 4.1 获取成绩列表
- 请求路径：`/scores/list`
- 请求方法：GET
- 请求参数：
  ```typescript
  {
    pageNum: number,
    pageSize: number,
    studentId?: string,
    courseId?: string
  }
  ```
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": "number",
      "list": [
        {
          "id": "number",
          "studentName": "string",
          "courseName": "string",
          "score": "number",
          "grade": "string",
          "semester": "string",
          "examDate": "string"
        }
      ]
    }
  }
  ```

### 4.2 录入成绩
- 请求路径：`/scores/create`
- 请求方法：POST
- 请求参数：
  ```json
  {
    "studentId": "string",
    "courseId": "string",
    "score": "number",
    "examDate": "string"
  }
  ```
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

## 5. 系统设置

### 5.1 获取系统设置
- 请求路径：`/settings`
- 请求方法：GET
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "systemName": "string",
      "logo": "string",
      "theme": "string",
      "securitySettings": {
        "passwordMinLength": "number",
        "loginAttempts": "number",
        "sessionTimeout": "number"
      }
    }
  }
  ```

### 5.2 更新系统设置
- 请求路径：`/settings`
- 请求方法：PUT
- 请求参数：
  ```json
  {
    "systemName": "string",
    "logo": "string",
    "theme": "string",
    "securitySettings": {
      "passwordMinLength": "number",
      "loginAttempts": "number",
      "sessionTimeout": "number"
    }
  }
  ```
- 响应结果：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

## 错误码说明

- 200: 成功
- 400: 请求参数错误
- 401: 未授权
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误

## 注意事项

1. 所有需要认证的接口都需要在请求头中携带 token
2. 日期格式统一使用 ISO 8601 标准：`YYYY-MM-DD HH:mm:ss`
3. 文件上传接口的 Content-Type 需要设置为 `multipart/form-data`
4. 分页参数 pageNum 从 1 开始
5. 所有响应数据都会包含 code 和 message 字段

## 开发建议

1. 建议使用 Spring Boot 作为后端框架
2. 数据库建议使用 MySQL
3. 建议实现统一的异常处理
4. 建议使用 JWT 进行身份认证
5. 建议实现接口访问日志记录 