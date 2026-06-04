<div align="center">
  <img src="https://img.icons8.com/?size=100&id=46860&format=png&color=2563EB" alt="QuickBus Logo" width="100"/>
  <h1>🚌 QuickBus - Highway Bus Reservation & Management System</h1>
  <p><strong>A Next-Generation, Full-Stack Solution for Public Transportation Management</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-blue.svg?style=flat-square" alt="Platform" />
    <img src="https://img.shields.io/badge/Stack-React%20Native%20%7C%20Node.js%20%7C%20MongoDB-2ea44f.svg?style=flat-square" alt="Stack" />
    <img src="https://img.shields.io/badge/Status-Fully%20Operational-success.svg?style=flat-square" alt="Status" />
  </p>
</div>

---

## 📖 Executive Overview

**QuickBus** is a robust, full-stack mobile application engineered to modernize and streamline highway bus operations. The transportation sector often struggles with fragmented communication—relying on phone calls, paper ledgers, and disconnected agents. QuickBus bridges this gap by providing a centralized digital ecosystem. 

It empowers passengers with a seamless, mobile-first booking experience while simultaneously equipping system administrators with powerful fleet orchestration, route planning, and real-time scheduling tools.

This project was developed as part of the **SE2020 Web and Mobile Technologies** group assignment, focusing on modern UI/UX principles, strict backend security, and cross-platform mobile stability.

---

## ✨ Comprehensive Feature Set

### 👤 Passenger Portal
*   **🛣️ Dynamic Route Discovery:** Passengers can browse all active operational routes, view granular stop-by-stop geographical information, and check estimated travel durations.
*   **🗓️ Real-Time Trip Scheduling:** Users can check live availability for upcoming trips, filter by departure/arrival hubs, and view precisely when buses depart.
*   **🎫 Interactive Seat Booking:** An intuitive visual layout allows passengers to select exact seats (up to 8 for Family Bookings, or 1 for Single Bookings). 
*   **📱 Digital Ticketing & QR Generation:** Upon booking, secure digital tickets are generated instantly alongside QR codes for fast boarding.
*   **🧑‍💻 Profile & History Management:** Users maintain a personalized dashboard to track booking histories, view past receipts, and manage account credentials.

### 🛡️ Administrative Command Center
*   **📈 Real-Time Analytics Dashboard:** A comprehensive view of system health, including fleet status breakdowns (Available vs. Maintenance), aggregate revenue tracking, and dynamic 7-day booking volume charts.
*   **🗺️ Route & Topology Management:** Admins can establish new travel routes, defining precise starting points, destinations, total distance, and base pricing structures.
*   **🚌 Complete Fleet Management:** A deep registry of all operational vehicles. Admins can register new buses, assign license plates, configure seating capacities, and attach driver/conductor contact details.
*   **📅 Schedule Orchestration:** Connect specific buses to established routes to create actionable, date-specific schedules.
*   **📑 PDF Report Generation:** Instantly export comprehensive, date-filtered analytic reports (HTML-to-PDF) directly from the mobile interface for executive review.

---

## 🧩 Deep-Dive System Modules

### 🔐 1. Authentication & Security Architecture
*   **Cryptographic User Management:** Secure registration and login workflows utilizing `bcryptjs` for one-way password hashing.
*   **Stateless JWT Sessions:** JSON Web Tokens (JWT) are employed for secure, scalable session verification across mobile and web platforms.
*   **Role-Based Access Control (RBAC):** Strict separation of privileges. Standard passengers are firewalled from administrative panels, and all backend administrative routes validate the `admin` token signature before execution.
*   **Payload Validation:** Strict algorithmic validation in backend controllers prevents malformed requests, duplicate seat bookings, and negative pricing injections.

### 📍 2. Route & Stop Management
*   **Route Lifecycle:** Full CRUD operations for routes. A route encapsulates the origin, destination, standard duration, and fare.
*   **Waypoint Integration:** Routes are enriched with multiple intermediate stops, providing passengers with exact trajectory maps and estimated sub-journey times.

### 🚌 3. Fleet & Bus Management
*   **Vehicle Registry:** Maintains the operational status of all buses (e.g., Available, In Maintenance).
*   **Personnel Accountability:** Directly links physical buses with dedicated drivers and conductors, ensuring strict accountability and streamlined operations in case of emergencies.

### 🗓️ 4. Advanced Scheduling Engine
*   **Trip Generation:** Merges a `RouteId` and a `BusId` with specific chronological data (Departure Date/Time) to spawn a bookable Schedule.
*   **Concurrency Control:** Real-time monitoring of booked vs. available seats. The backend utilizes atomic operations to ensure that two users cannot book the same seat simultaneously.

### 🎟️ 5. Booking & Transaction Core
*   **Server-Side Pricing Calculation:** Prices are strictly calculated on the backend based on `route.price * seats.length` to prevent frontend manipulation.
*   **Automated Validation:** Checks ensure that the selected bus has the physical capacity for the selected seat index (e.g., preventing booking seat 45 on a 40-seat bus).

---

## ⚙️ Internal Architecture & Core System Functions

### 📡 API & Backend Controllers
*   **Authentication Flow (`authController.js`):** Intercepts login requests, hashes incoming passwords using `bcryptjs`, compares them against the database, and issues signed JSON Web Tokens (JWT) valid for secure sessions.
*   **Booking Engine (`bookingController.js`):** Implements rigorous transactional checks. Validates that selected seat indices do not exceed the linked `Bus.seatCapacity`, verifies seats aren't already included in `Schedule.bookedSeats`, and accurately calculates the `totalPrice` server-side before confirming the booking.
*   **Analytics Aggregator (`adminController.js`):** Dynamically queries MongoDB to generate live statistical snapshots (total revenue, active routes, fleet status) and formats 7-day volume histories for the frontend dashboard.

### ⚛️ Frontend State & Context Management
*   **AuthContext (`AuthContext.js`):** A React Context provider that globally manages the user's authentication state, JWT token storage (via `AsyncStorage`), and user role (`admin` vs `user`), automatically dictating navigation stack access.
*   **Cross-Platform UI Rendering:** Custom encapsulated components (e.g., `AppButton`, `AppCard`) utilize conditional NativeWind class merging and React Native `StyleSheet` properties to ensure pixel-perfect rendering across Web DOM, iOS UIViews, and Android Views, specifically mitigating common Android elevation clipping bugs.
*   **PDF Generation (`html2pdf.js` & `expo-print`):** The Admin Dashboard dynamically compiles raw React state into an HTML template string and streams it to device-native PDF generators, integrating with `expo-sharing` for instant mobile export.

---

## 💻 Technology Stack & Architecture

| Architecture Layer | Core Technologies Utilized |
| :--- | :--- |
| **📱 Frontend UI (Mobile & Web)** | React Native, Expo, React Navigation, React Native SVG |
| **🎨 Styling & Design System** | NativeWind (Tailwind CSS for React Native), Glassmorphism UI |
| **⚙️ Backend API Server** | Node.js, Express.js, Axios |
| **🔐 Security & Auth** | JSON Web Tokens (JWT), `bcryptjs`, CORS, Dotenv |
| **🗄️ Database & ORM** | MongoDB Atlas (Cloud NoSQL), Mongoose ODM |
| **🚀 Deployment Infrastructure** | Render (Backend Server), Expo Go (Mobile Client Testing) |

---

## 🗃️ Database Schema Overview (MongoDB)

QuickBus utilizes a relational NoSQL structure with the following primary collections:
*   `Users`: Stores credentials, roles (`admin` or `user`), and contact info.
*   `Routes`: Stores geographical data, pricing, and active status.
*   `Buses`: Stores capacity, license plates, operational status, and assigned staff.
*   `Schedules`: The intersection of a Route and a Bus, tracking specific dates, times, and an array of `bookedSeats`.
*   `Bookings`: Transactional records linking a `User`, a `Schedule`, the specific seats booked, and the final calculated price.

---

## 🎨 UI/UX Design Philosophy

QuickBus boasts a highly polished, professional SaaS-style interface engineered to stand out:
*   **Modern Aesthetics:** Clean, solid-color layouts utilizing advanced Glassmorphism techniques, dynamic background gradients, and a curated typography scale (`Plus Jakarta Sans`).
*   **Cross-Platform Responsive Design:** Flawless rendering logic ensuring structural integrity across Web browsers, Android, and iOS environments.
*   **Optimized Performance:** Fully stabilized frontend architecture. We systematically eliminated cross-platform CSS interop rendering bugs (such as Android elevation shadow clipping) to guarantee a buttery-smooth, crash-free experience natively on Expo Go.

---

## 🔗 Live Deployments & Connections

*   **API Base URL (Render):** `https://bus-system-3lgy.onrender.com/api`
*   **GitHub Repository:** `https://github.com/AselKarunathilaka/Bus-System`

---

## 👥 Team Details & Core Responsibilities

**Group Number:** WD-IT-01

### 👤 Member 1: Asel Karunathilaka (<a href="https://github.com/AselKarunathilaka">@AselKarunathilaka</a>)
*Engineered all core system architecture, authentication, route logistics, scheduling, booking, and administrative features.*
*   **Authentication & Security:** Developed the entire login/registration flow, implemented `bcryptjs` for password hashing, and constructed the stateless JWT session architecture across both backend middleware and the frontend `AuthContext`.
*   **Route & Stop Management:** Engineered the CRUD APIs and UI screens allowing administrators to define geographical bus routes, calculate base fares, and attach multi-point intermediate stops to specific journeys.
*   **Schedule & Booking Core:** Built the complex transactional logic for bus scheduling and the passenger booking engine, including real-time seat capacity validation, pricing calculators, and QR code digital ticket generation.
*   **Admin Dashboard & Analytics:** Designed the administrative command center, integrating real-time MongoDB aggregation pipelines for revenue tracking, fleet status updates, and HTML-to-PDF report generation.

### 👤 Member 2: Kethaka Biyanwila (<a href="https://github.com/sanklana123">@sanklana123</a>)
*Engineered the comprehensive Fleet and Bus Management subsystems.*
*   **Bus Registry System:** Developed the backend models, API controllers, and frontend interfaces for registering and managing the entire physical bus fleet.
*   **Vehicle Configurations:** Engineered logic to track individual bus configurations, including distinct seating capacities, license plate designations, and vehicle categorization.
*   **Personnel & Status Tracking:** Implemented the systems that link physical buses to their assigned drivers and conductors for strict operational accountability, as well as tracking real-time maintenance vs. availability statuses.

---

## 🚀 Getting Started & Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/AselKarunathilaka/Bus-System.git
cd Bus-System
```

### 2. Run the Backend Server (Local Development)
If you prefer not to use the hosted backend, you can spin it up locally:
```bash
cd backend
npm install

# Create a .env file and configure the following:
# PORT=5000
# MONGO_URI=your_mongodb_atlas_connection_string
# JWT_SECRET=your_secure_jwt_secret

npm run dev
```
*The local backend will run on `http://localhost:5000`.*

### 3. Run the Mobile Application (Frontend)
It is highly recommended to run the mobile app connected to the hosted backend for immediate demonstration purposes.
```bash
cd mobile-app
npm install

# Create a .env file in the mobile-app root and add the hosted API URL:
# EXPO_PUBLIC_API_URL=https://bus-system-3lgy.onrender.com/api

npx expo start -c
```
**Testing Instructions:** Scan the generated QR code with the **Expo Go** application on your physical mobile device. 
> ⚠️ **Note on Local Testing:** If you are running the backend locally and testing on a physical phone, you MUST change your `.env` URL to use your computer's IPv4 address (e.g., `http://192.168.1.X:5000/api`) instead of `localhost`.

---

<div align="center">
  <p>Engineered by <a href="https://github.com/AselKarunathilaka">@AselKarunathilaka</a> and <a href="https://github.com/sanklana123">@sanklana123</a></p>
</div>