# 📧 EmailService API

An intelligent and fault-tolerant email sending service built with Node.js (ES Modules). Supports retry logic, fallback providers, rate limiting, circuit breaker pattern, logging, status tracking, and idempotency — all with mock providers.

---

## 🌐 Live Deployment

**API Base URL:**  
🔗 https://emailservice-nreh.onrender.com

---

## 🧠 Features

- ✅ **Retry mechanism with exponential backoff**
- 🔁 **Fallback between Provider A and Provider B**
- ♻️ **Idempotency** — no duplicate sends
- 🚦 **Rate limiting** — max 10 requests per 6 minutes
- 📊 **Status tracking** for every email
- 🚨 **Circuit breaker pattern** to avoid overload
- 🪵 **Simple logging**
- 📬 **Basic in-memory queue system**

---

## 🛠 Tech Stack

- JavaScript (ES Modules)
- Node.js
- Express.js
- Render (deployment)
- No external email service — uses mock providers

---

## 📁 Folder Structure

```EmailSendingService/
│
├── src/
│ ├── index.js # Express server
│ ├── emailservice.js # Main service integrating all features
│ └── features/ # Retry, fallback, rate limiter, etc.
│ ├── retry.js
│ ├── ratelimiter.js
│ ├── idempotency.js
│ ├── logger.js
│ ├── circuitbreaker.js
│ ├── statustracking.js
│ └── queue.js
│
├── tests/ # Manual test files using assert
├── package.json
└── README.md
```
---

## 🔁 API Endpoints

### 📨 POST `/send-email`

Sends an email using mock providers with retry, fallback, and queue logic.

#### 📥 Request Body:

```json
{
  "to": "user@example.com",
  "subject": "Hello from EmailService",
  "body": "This is a test email",
  "idempotencyKey": "unique-email-id-123"
}

📄 Sample YAML (Postman-style)
- name: Send Email
  request:
    method: POST
    url: https://emailservice-nreh.onrender.com/send-email
    body:
      mode: raw
      raw: |
        {
          "to": "swati@example.com",
          "subject": "Testing Retry",
          "body": "Fallback check",
          "idempotencyKey": "demo-email-2025"
        }

📤 Sample Response

{
  "status": "QUEUED",
  "message": "Email job accepted and will be processed shortly.",
  "track": "/status/demo-email-2025"
}

📊 GET /status/:id
Returns current status of the email attempt.

Example:
GET /status/demo-email-2025

Response:
{
  "status": "SENT"
}
Possible status values:

"PENDING"

"RETRYING_PROVIDER_A"

"RETRYING_PROVIDER_B"

"SENT"

"FAILED"

⚙️ Run Locally
git clone https://github.com/yourusername/EmailSendingService.git
cd EmailSendingService
npm install
node src/index.js
Test in Postman:

POST: http://localhost:10000/send-email

GET: http://localhost:10000/status/:id

🧪 Manual Unit Testing
Tests use native assert module (no Jest or Mocha).

Run individual test files:
node tests/retry.test.js
node tests/ratelimiter.test.js
node tests/circuitbreaker.test.js
node tests/idempotency.test.js
Each test prints pass/fail results directly to terminal.


📓 Assumptions
Email providers randomly fail to simulate real-world issues.

All state (status, logs, queue) is stored in memory.

idempotencyKey ensures same email isn't processed twice.

Circuit breaker opens after 3 failures, recovers after 10s.



```
