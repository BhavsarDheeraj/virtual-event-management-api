
# 🎉 Virtual Event Registration API

A Node.js-based event registration platform built with **Express**, **MongoDB**, and **JWT Authentication**. Users can register, login, and sign up for events, while organizers can create and manage them.

---

## 🚀 Features

- 👤 **User Authentication** (Register/Login with JWT)
- 📅 **Event Management**
  - Public: View all events
  - Private: Organizers can create and manage events
- 📧 **Email Notifications** on successful registration (Gmail + Nodemailer)
- 🧪 **Unit and Integration Tests** with in-memory MongoDB for fast and isolated testing

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Email**: Nodemailer with Gmail
- **Testing**: Jest, Supertest, MongoDB Memory Server

---

## 📁 Project Structure

```
src/
├── controllers/       # Route handlers
├── models/            # Mongoose schemas
├── routes/            # API routes (users, events)
├── utils/             # Utility functions (mailer, auth)
├── middleware/        # Auth middleware
├── app.js             # Express app config
└── server.js          # Entry point

tests/
├── controllers/       # Controllers unit tests
├── integration/       # Integration tests
├── middlewares/       # Middlewares unit tests
├── routes/            # Routes unit tests
├── setup/             # In-memory DB setup
└── utils/             # Utils unit tests

.env                   # Environment variables
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/events
JWT_SECRET=your_jwt_secret
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_email_password
```

---

## ▶️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm run dev
```

> Make sure MongoDB is running locally unless you're using an online cluster.

### 3. Run Tests

```bash
npm test
```

---

## 🧪 Integration Testing

Integration tests are set up with:

- `jest` for testing framework
- `supertest` for HTTP assertions
- `mongodb-memory-server` for in-memory MongoDB instance

Test flow includes:

- Register a new user
- Login to receive JWT token
- Fetch events
- Register for an event (triggers email)

---

## 📬 Email Notifications

Emails are sent using Gmail via `nodemailer`.

Make sure:

- "Less secure app access" is **enabled** for the Gmail account  
  OR  
- Use an **App Password** (recommended)

Set your credentials in `.env` as:

```env
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_gmail_app_password
```

---

## 💡 Future Enhancements

- ✅ Role-based access control
- 📈 Organizer dashboard
- 📨 RSVP confirmations
- 📃 Swagger / Postman API Docs
- 🔍 Pagination, filters & search
- 🛡️ Rate limiting and security middleware

---

## 🙌 Contributing

Feel free to fork the repo, open issues, or suggest improvements. PRs are always welcome!

---
