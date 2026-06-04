<div align="center">
  <img src="https://img.icons8.com/?size=100&id=46860&format=png&color=2563EB" alt="QuickBus Logo" width="100"/>
  <h1>🚌 QuickBus</h1>
  <p><strong>Next-Generation Highway Bus Reservation and Management System</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-blue.svg?style=flat-square" alt="Platform" />
    <img src="https://img.shields.io/badge/Stack-React%20Native%20%7C%20Node.js%20%7C%20MongoDB-2ea44f.svg?style=flat-square" alt="Stack" />
    <img src="https://img.shields.io/badge/Status-Fully%20Operational-success.svg?style=flat-square" alt="Status" />
  </p>
</div>

---

## 📖 Overview

**QuickBus** is a robust, full-stack mobile application designed to modernize and streamline highway bus operations. By replacing outdated, disconnected manual processes with a centralized digital platform, QuickBus provides passengers with a seamless booking experience and empowers administrators with powerful fleet, route, and scheduling management tools.

This project was developed as part of the **SE2020 Web and Mobile Technologies** group assignment.

---

## ✨ Key Features

### 👤 For Passengers
*   **🛣️ Route Discovery:** Browse available routes, view detailed stop information, and check estimated travel times.
*   **🗓️ Real-Time Scheduling:** Check live availability for upcoming trips and filter by departure/arrival locations and dates.
*   **🎫 Seamless Booking:** Select seats via an interactive layout, book tickets securely, and instantly access digital tickets.
*   **🧑‍💻 Profile Management:** Track booking history, view past receipts, and manage personal profile information.

### 🛡️ For Administrators
*   **📈 Analytics Dashboard:** Access real-time system analytics, fleet status breakdowns, revenue tracking, and 7-day booking trends.
*   **🗺️ Route & Fleet Management:** Create and manage routes, intermediate stops, and bus details (including capacity and driver assignments).
*   **📅 Schedule Orchestration:** Allocate specific buses to routes, define departure and arrival times, and monitor seat availability.
*   **📑 PDF Report Generation:** Instantly export comprehensive, date-filtered analytic reports directly from the mobile app.

---

## 🧩 Comprehensive System Modules

### 🔐 1. Authentication & Security
*   **User Management:** Secure registration and login workflows with password hashing (`bcryptjs`) and JWT-based session management.
*   **Role-Based Access Control (RBAC):** Strict separation of privileges between standard passengers and administrators, preventing unauthorized access to management panels.

### 📍 2. Route & Stop Management
*   **Dynamic Routing:** Administrators can establish new travel routes, defining starting points, destinations, estimated durations, and base pricing.
*   **Intermediate Stops:** Routes can be enriched with multiple stops, providing passengers with granular details about their journey's trajectory.

### 🚌 3. Fleet & Bus Management
*   **Fleet Database:** Comprehensive registry of all operational vehicles, including license plates, seating capacities, and bus types.
*   **Personnel Assignment:** Links buses with dedicated drivers and conductors, ensuring accountability and streamlined operations.

### 🗓️ 4. Advanced Scheduling
*   **Trip Generation:** Admins can pair routes with specific buses to create actionable, date-specific schedules.
*   **Capacity Tracking:** Real-time monitoring of booked vs. available seats for every active journey, avoiding overbooking.

### 🎟️ 5. Booking Engine
*   **Interactive Selection:** Passengers can visually select up to 8 seats (Family Booking) or single seats.
*   **Automated Validation:** Server-side checks prevent double-booking and out-of-bounds seat selections, guaranteeing transactional integrity.

---

## 💻 Technology Stack

| Architecture | Technologies |
| :--- | :--- |
| **📱 Frontend (Mobile & Web)** | React Native, Expo, React Navigation, Axios, NativeWind (Tailwind CSS) |
| **⚙️ Backend API** | Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs |
| **🗄️ Database** | MongoDB Atlas, Mongoose |
| **🚀 Deployment** | Render (Backend), Expo Go (Mobile Testing) |

---

## 🎨 UI/UX Highlights

QuickBus boasts a highly polished, professional SaaS-style interface:
*   **Modern Aesthetics:** Clean layouts, structured cards, and a carefully curated typography scale utilizing `Plus Jakarta Sans`.
*   **Responsive Design:** Flawless rendering logic ensuring compatibility across Web browsers and native mobile environments.
*   **Optimized Performance:** Fully stabilized frontend eliminating cross-platform CSS interop rendering bugs for a smooth, crash-free experience on Expo Go.

---

## 🔗 Live Deployments

*   **API Base URL:** `https://bus-system-3lgy.onrender.com/api`
*   **GitHub Repository:** `https://github.com/AselKarunathilaka/Bus-System`

---

## 👥 Team Details

**Group Number:** WD-IT-01

*   **Member 1:** IT21323102 - Karunathilaka K.W.A.A.S. *(Login, Route & Stop Management)*
*   **Member 2:** IT21009372 - Biyanwila B.D.K.P.S. *(Bus Management)*

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/AselKarunathilaka/Bus-System.git
cd Bus-System
```

### 2. Run the Backend (Locally)
If you prefer not to use the hosted backend, you can spin it up locally:
```bash
cd backend
npm install

# Create a .env file with PORT, MONGO_URI, and JWT_SECRET
npm run dev
```

### 3. Run the Mobile Application
It is highly recommended to run the mobile app connected to the hosted backend for demonstration purposes.
```bash
cd mobile-app
npm install

# Create a .env file and add the hosted API URL:
# EXPO_PUBLIC_API_URL=https://bus-system-3lgy.onrender.com/api

npx expo start -c
```
*Scan the generated QR code with the **Expo Go** app on your mobile device. If testing locally with a local backend on a physical device, ensure you use your computer's local IP address instead of `localhost`.*

---

---

## 🔒 Security Architecture

QuickBus prioritizes data integrity and access control:
*   **Password Hashing:** Passwords are cryptographically hashed using `bcryptjs` before being stored in the database.
*   **Stateless Authentication:** JSON Web Tokens (JWT) are utilized for secure, scalable session verification across both mobile and web platforms.
*   **API Protection:** All critical backend routes are shielded by authorization middleware that validates JWT signatures and user roles before executing operations.
*   **Input Validation:** Strict payload validation in the controllers prevents malformed requests, duplicate seat bookings, and unauthorized data manipulation.

---

<div align="center">
  <p>Built with ❤️ by Team WD-IT-01</p>
</div>

---

## 📝 Latest Changes Commit Command

To commit these latest documentation updates and comprehensive system details to your repository, use the following exact commands in your terminal:

```bash
git add .
git commit -m "docs: expand README with comprehensive module breakdowns and security architecture"
```