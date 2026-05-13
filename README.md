# Claims Intake Microservices

Smart insurance claims intake platform built with microservices, AI-assisted analysis, and a modern React frontend.

## ✨ Highlights

- 🤖 AI-powered claim risk assessment and concise claim summaries
- 🧠 Real-time description completeness hints before submission
- 📄 Secure document upload flow with pre-signed S3 URLs
- 🔐 JWT-based authentication with a dedicated user service
- 🧩 Microservices architecture for clear separation of concerns
- 🎨 Responsive frontend built with React + TypeScript + Vite

## 🏗️ Architecture

The project is organized into three main parts:

- `frontend` - React app for login, claim submission, and claim tracking
- `user-service` - Auth and user management (register/login)
- `claims-service` - Claim CRUD, AI analysis, and document upload URL generation

## 🛠️ Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express
- Data: MongoDB (claims), PostgreSQL (users)
- AI: OpenAI API
- Storage: AWS S3 (pre-signed upload URLs)
- Auth: JWT

## 🚀 Quick Start

### 1. Install dependencies

Run in each service folder:

```bash
npm install
```

### 2. Configure environment variables

Create `.env` files for `claims-service` and `user-service` with your local values.

Typical values include:

- Database connections (MongoDB/PostgreSQL)
- JWT secret
- OpenAI API key
- AWS credentials + S3 bucket settings

### 3. Start infrastructure

Make sure your databases are running:

- PostgreSQL for `user-service`
- MongoDB for `claims-service`

### 4. Run services

In separate terminals:

```bash
# user-service
npm start

# claims-service
npm start

# frontend
npm run dev
```

## 🔍 Core User Flows

- 📝 Register and log in
- 📥 Submit a new claim with optional document upload
- 💡 Get AI hints to improve claim description quality
- ⚠️ Receive AI risk level, risk factors, and suggested action
- 📊 Track claim status across the workflow

## 📁 Project Structure

```text
claims-intake/
├─ claims-service/
├─ user-service/
└─ frontend/
```

## 🌟 Why This Project Stands Out

This project combines practical microservices design with real AI value in the claims intake process: faster submissions, better data quality, and smarter triage from day one.
