# Sara7a App

A backend API built with **Node.js + Express** for an anonymous messaging application similar to "Sarahah". The project includes authentication, messaging features, file uploading to Cloudinary, and security enhancements.

---

## 📑 Table of Contents

- [Features](#✨-features)
- [Technologies & Packages Used](#🛠-technologies-&-packages-used)
- [Setup Instructions](#⚡-setup-instructions)
- [Project Structure](#🗂-project-structure)
- [Security & Performance](#🔐-security--performance)
- [Accessibility](#♿-accessibility)
- [API Routes Documentation](#📱-api-routes-documentation)
- [Author](#🤝-author)

---

## 🚀 Features

- User Authentication (Register / Login / JWT)
- Anonymous messaging system
- Rate limiting & security headers
- File upload support (Multer + Cloudinary)
- Request validation using Joi
- MongoDB database with Mongoose
- Google Auth login
- Nodemailer email support

---

## 📦 Technologies & Packages Used

```
bcrypt
chalk
cloudinary
cors
dotenv
express
express-rate-limit
file-type
google-auth-library
helmet
joi
jsonwebtoken
mongoose
morgan
multer
nanoid
nodemailer
uuid
```

---

## 📂 Project Structure (Example)

```
sara7aapp/
 ├─ src/
 │  ├─ routes/
 │  ├─ controllers/
 │  ├─ middlewares/
 │  ├─ utils/
 │  ├─ models/
 │  └─ config/
 ├─ index.js
 ├─ .env
 ├─ package.json
 └─ README.md
```

---

## 🔧 Setup Instructions

```bash
# Clone the repo
git clone <repository-link>
cd sara7aapp

# Install dependencies
npm install

# Create .env file and add required configs
```

Example **.env**:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
EMAIL_USER=xxx
EMAIL_PASS=xxx
```

Run the server:

```bash
npm run dev
```

---

## 📌 API Routes Documentation

### 🔐 Auth Routes

| Method | Endpoint                         | Validation           | Auth      | Description               |
| ------ | -------------------------------- | -------------------- | --------- | ------------------------- |
| POST   | /auth/signup                     | signupSchema         | ❌        | Register new user         |
| POST   | /auth/login                      | loginSchema          | ❌        | Login and receive tokens  |
| PATCH  | /auth/confirm-email              | confirmEmailSchema   | ❌        | Confirm email with OTP    |
| POST   | /auth/revoke-token               | —                    | ✔ Access  | Logout & revoke token     |
| POST   | /auth/refresh-token              | —                    | ✔ Refresh | Generate new access token |
| PATCH  | /auth/forget-password            | forgetPasswordSchema | ❌        | Send OTP to email         |
| PATCH  | /auth/update-password            | updatePasswordSchema | ✔ Access  | Update password           |
| PATCH  | /auth/confirm-reset-password-OTP | —                    | ❌        | Verify reset OTP          |
| PATCH  | /auth/reset-password             | resetPasswordSchema  | ❌        | Reset password            |
| POST   | /auth/social-login               | —                    | ❌        | Google login              |

---

### 👤 User Routes

| Method | Endpoint                       | Auth     | Roles      | Description                 |
| ------ | ------------------------------ | -------- | ---------- | --------------------------- |
| GET    | /users                         | ❌       | —          | Get all users               |
| GET    | /users/profile                 | ✔ Access | User       | Get user profile            |
| PATCH  | /users/update                  | ✔ Access | USER       | Update profile info         |
| PATCH  | /users/profile-image           | ✔ Access | USER       | Upload new profile image    |
| PATCH  | /users/cover-images            | ✔ Access | USER       | Upload up to 4 cover images |
| PATCH  | /users/:userId/freeze-account  | ✔ Access | ADMIN/USER | Freeze account              |
| PATCH  | /users/restore-freezed-account | ✔ Access | ADMIN/USER | Restore frozen account      |
| PATCH  | /users/:userId/delete-account  | ✔ Access | ADMIN/USER | Soft delete account         |
| PATCH  | /users/restore-deleted-account | ✔ Access | ADMIN/USER | Restore deleted account     |

---

### 💬 Message Routes

| Method | Endpoint                             | Auth     | Description                |
| ------ | ------------------------------------ | -------- | -------------------------- |
| POST   | /messages/send-message/:receiverId   | ❌       | Send anonymous message     |
| GET    | /messages/get-messages               | ✔ Access | Fetch logged user messages |
| DELETE | /messages/delete-messages/:messageId | ✔ Access | Delete a message           |

---

## 📄 License

This project is licensed under the **ISC License**.

---

## ✨ Author

Developed by **Bashar Yousri**.
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Bashar%20Yousri-blue?logo=linkedin)](https://www.linkedin.com/in/bashar-yousri-330882234)

Feel free to contribute or suggest improvements.

---

## 🛠 API Usage Examples (Postman + Curl)

### 🔹 Register User

**POST** `/api/auth/register`

**Body (JSON):**

```
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "12345678"
}
```

**Curl Example:**

```
curl -X POST https://yourapi.com/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"John Doe","email":"john@example.com","password":"12345678"}'
```

---

### 🔹 Login User

**POST** `/api/auth/login`

```
{
  "email": "john@example.com",
  "password": "12345678"
}
```

**Response Example:**

```
{
  "message": "Login successful",
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

---

## 🔐 Authentication Flow (Diagram)

```
[ Client ] → sends credentials → [ Login Route ] → validates user
      ↓                                   ↓
 receives tokens ← generates JWT tokens ← saves refresh token
      ↓                                   ↓
 uses access token → access protected routes → expiry → use refresh token
```

---

## 📌 Tech Badges

`Node.js` `Express.js` `MongoDB` `JWT` `Cloudinary` `Multer` `Joi` `Bcrypt` `Dotenv`

---
