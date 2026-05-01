# 🚌 QuickBus - Highway Bus Reservation and Management System

QuickBus is a full-stack mobile application developed for managing highway bus reservation and bus operation activities. The system is designed to help passengers easily access bus-related information and help administrators manage important bus service data in an organized, secure, and user-friendly way.

The application allows users to register, log in, view routes, check stops, view bus details, access schedules, and make bookings. It also provides administrative features for managing routes, stops, buses, schedules, bookings, dashboard summaries, and reports.

This project was developed as part of the SE2020 Web and Mobile Technologies group assignment.

---

## 📌 GitHub Repository

Repository Link:

```txt
https://github.com/AselKarunathilaka/Bus-System
```

---

## 🌐 Deployment Details

Backend URL:

```txt
https://bus-system-3lgy.onrender.com
```

API Base URL:

```txt
https://bus-system-3lgy.onrender.com/api
```

The mobile application connects to the hosted backend API using the API base URL.

---

## 📖 Project Overview

Many bus reservation and bus management activities are still handled manually or through disconnected methods such as phone calls, paper records, direct counter bookings, and informal communication. These methods can make it difficult for passengers to find updated route details, stop information, bus availability, schedules, and booking details.

QuickBus solves this problem by providing a centralized mobile application for both passengers and administrators. Passengers can use the application to access travel-related information, while administrators can manage the main operational data of the bus system.

The main purpose of this system is to make bus reservation and bus management easier, faster, more secure, and more organized.

---

## 🎯 Main Objectives

The main objectives of the QuickBus system are:

- To provide a mobile application for highway bus reservation and management.
- To allow users to register and log in securely.
- To allow passengers to view routes, stops, buses, and schedules.
- To allow passengers to make and manage bookings.
- To allow administrators to manage routes, stops, buses, schedules, bookings, and reports.
- To reduce manual work in bus management.
- To improve the accuracy of bus, route, and booking information.
- To provide a structured system for managing bus operations.
- To support role-based access for users and administrators.

---

## 🛠️ Technologies Used

### 📱 Frontend

- React Native
- Expo
- React Navigation
- Axios
- AsyncStorage

### 🖥️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token authentication
- bcryptjs password hashing
- CORS
- dotenv

### 🗄️ Database

- MongoDB Atlas

### 🚀 Deployment and Testing

- Render for backend hosting
- Expo Go for mobile app testing
- Postman for API testing
- MongoDB Compass for database checking

---

## 👥 Team Details

Group Number: WD-IT-01

Member 1: IT21323102 - Karunathilaka K.W.A.A.S.  
Module: Login, Route Management and Stop Management

Member 2: IT21009372 - Biyanwila B.D.K.P.S.  
Module: Bus Management

Member 3: IT21274220 - Wickramasinghe B.G.A.  
Module: Bus Schedule Management

Member 4: IT20666774 - Gayashan K.L.  
Module: Booking Management

Member 5: IT21335778 - Wijesinghe M.L.P.  
Module: Admin Panel and Report Generation

---

## 🧩 System Modules

### 🔐 1. Login, Route Management and Stop Management

This module is handled by Member 1.

The login section allows users to register and log in to the system securely. It includes password hashing, JWT-based authentication, protected routes, and role-based access control. This ensures that normal users and administrators have different access levels.

The route management section allows administrators to create, view, update, and delete route records. Route details are important because passengers need to know the starting location, destination, distance, price, estimated duration, and route status.

The stop management section allows administrators to create and manage stops related to routes. Since one route can have multiple stops, this module helps passengers understand the route path clearly.

Main features:

- User registration
- User login
- Password hashing
- JWT authentication
- Role-based access control
- Protected backend routes
- Route creation
- Route viewing
- Route updating
- Route deletion
- Stop creation
- Stop viewing
- Stop updating
- Stop deletion

---

### 🚌 2. Bus Management

This module is handled by Member 2.

The bus management module is responsible for managing all bus-related information in the system. Administrators can add new buses, view existing buses, update bus details, delete bus records, and assign buses to routes.

This module is important because buses are connected with routes, schedules, and bookings. A bus must be correctly added and assigned before it can be used in the scheduling and booking process.

Main features:

- Add new buses
- View all buses
- View selected bus details
- Update bus details
- Delete bus records
- Assign buses to routes
- Manage bus status
- Store driver details
- Store conductor details
- Store bus contact details
- Store seat count
- Store bus type

---

### 🗓️ 3. Bus Schedule Management

This module is handled by Member 3.

The bus schedule management module is responsible for managing bus travel schedules. It connects routes and buses with specific travel dates and departure times.

This module helps passengers find available trips and helps administrators organize bus operations more clearly.

Main features:

- Create bus schedules
- Assign buses to routes for specific trips
- Manage travel dates
- Manage departure times
- Manage arrival times
- Track available seats
- View available schedules
- Update schedule details
- Delete schedules

---

### 🎫 4. Booking Management

This module is handled by Member 4.

The booking management module allows passengers to reserve seats for available bus schedules. It connects users with schedules and stores booking details such as selected seat number, booking date, total amount, payment status, and booking status.

This module helps reduce manual booking issues and allows passengers to view their booking information easily.

Main features:

- Create passenger bookings
- View booking history
- View selected booking details
- Cancel bookings
- Manage booking status
- Manage payment status
- Connect bookings with users
- Connect bookings with schedules

---

### 📊 5. Admin Panel and Report Generation

This module is handled by Member 5.

The admin panel and report generation module provides administrators with a clear overview of the system. It helps administrators monitor users, routes, stops, buses, schedules, and bookings from one place.

The report generation section helps administrators create useful summaries related to bus operations, route activity, schedule details, booking records, and overall system performance.

Main features:

- Admin dashboard
- System summary display
- User summary
- Route summary
- Bus summary
- Schedule summary
- Booking summary
- Report generation
- Statistics display
- Admin-only access

---

## ✅ Current Implementation Status

The currently implemented source code mainly includes the following completed modules:

- Login and Authentication
- Route Management
- Stop Management
- Bus Management

The following modules are part of the full system plan and are handled by the remaining members:

- Bus Schedule Management
- Booking Management
- Admin Panel and Report Generation

---

## 📁 Project Folder Structure

```txt
Bus-System
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── mobile-app
│   ├── context
│   ├── navigation
│   ├── screens
│   ├── services
│   ├── App.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🖥️ Backend Description

The backend is developed using Node.js and Express.js. It provides the server-side logic for the system and connects the mobile application with the MongoDB database.

The backend handles:

- Server setup
- Database connection
- User authentication
- Password hashing
- JWT token generation
- Protected routes
- Role-based access control
- Route management
- Stop management
- Bus management
- Request validation
- Error handling
- Communication with MongoDB

The backend is hosted online so that the mobile application can connect to it during testing and final demonstration.

---

## 📱 Mobile Application Description

The mobile application is developed using React Native with Expo. It provides the user interface for passengers and administrators.

The mobile app allows users to:

- Register an account
- Log in to the system
- View routes
- View route stops
- View bus details
- Access available schedules
- Make bookings
- Use role-based features depending on their account type

The mobile application communicates with the backend through API requests using Axios.

---

## 🗄️ Database Description

The system uses MongoDB as the database. MongoDB stores data in collections.

Main collections used or planned in this system include:

- users
- routes
- stops
- buses
- schedules
- bookings

The current implemented source code mainly includes users, routes, stops, and buses. The remaining collections are part of the full planned system.

---

## 👤 User Roles

The system uses two main user roles:

```txt
user
admin
```

Normal users can:

- Register
- Log in
- View routes
- View stops
- View buses
- Use passenger-related features

Admins can:

- Manage routes
- Manage stops
- Manage buses
- Manage schedules
- Manage bookings
- View dashboard information
- Generate reports

For security, public registration creates only normal user accounts. Admin accounts must be assigned separately through the database or through an authorized admin function.

---

## 🔒 Security Features

The system includes several security features:

- Password hashing using bcryptjs
- JWT-based authentication
- Protected backend routes
- Role-based access control
- Prevention of public admin registration
- Environment variables for sensitive data
- Input validation

These features help protect user accounts and restrict management features to administrators only.

---

## 🚀 How to Run the Application

The project has two main parts:

1. Backend server
2. Mobile application

Both parts must be run separately.

---

## 📌 Prerequisites

Before running the project, install the following:

- Node.js
- npm
- Git
- Expo Go mobile app
- MongoDB Atlas account or local MongoDB setup
- Visual Studio Code or another code editor

---

## 📥 Step 1: Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/AselKarunathilaka/Bus-System.git
```

Go into the project folder:

```bash
cd Bus-System
```

---

## ⚙️ Backend Run Commands

### Option 1: Run the Backend Locally

Go to the backend folder:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder.

Add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm start
```

If your project has a development script with nodemon, you can run:

```bash
npm run dev
```

The backend should run on:

```txt
http://localhost:5000
```

The local API base URL will be:

```txt
http://localhost:5000/api
```

---

### Option 2: Use the Hosted Backend

The backend is already deployed on Render.

Hosted backend URL:

```txt
https://bus-system-3lgy.onrender.com
```

Hosted API base URL:

```txt
https://bus-system-3lgy.onrender.com/api
```

If you are using the hosted backend, you do not need to run the backend locally.

---

## 📱 Mobile App Run Commands

### Option 1: Run the Mobile App with Hosted Backend

This is the recommended method for testing and demonstration.

Open a new terminal from the project root folder.

Go to the mobile app folder:

```bash
cd mobile-app
```

Install mobile app dependencies:

```bash
npm install
```

Create a `.env` file inside the `mobile-app` folder.

Add the hosted API base URL:

```env
EXPO_PUBLIC_API_URL=https://bus-system-3lgy.onrender.com/api
```

Start the Expo app:

```bash
npx expo start
```

Then scan the QR code using the Expo Go app on your mobile phone.

---

### Option 2: Run the Mobile App with Cache Clear

Use this command if the app does not update properly or if old data is still showing.

```bash
npx expo start -c
```

---

### Option 3: Run the Mobile App Using Tunnel Mode

Use tunnel mode if your phone and laptop are on different networks, or if LAN mode does not work.

```bash
npx expo start --tunnel
```

Then scan the QR code using the Expo Go app.

---

### Option 4: Run the Mobile App with Local Backend

If you are running the backend locally and want the mobile app to connect to your local backend, update the mobile app `.env` file.

Use your computer's local IP address:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP_ADDRESS:5000/api
```

Example:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api
```

Then start Expo with cache clear:

```bash
npx expo start -c
```

Important:

Do not use `localhost` when testing on a real mobile phone. On a phone, `localhost` means the phone itself, not your computer. Use your computer's local IP address instead.

---

## 🧪 Testing

The system can be tested using:

- Expo Go for mobile app testing
- Postman for backend API testing
- MongoDB Compass for database record checking
- Browser for checking the hosted backend base URL

Testing should confirm that:

- Users can register.
- Users can log in.
- Normal users cannot register as admins.
- Routes can be managed.
- Stops can be managed.
- Buses can be managed.
- Mobile screens load data from the backend.
- Database records are saved correctly.
- The hosted backend is reachable.

---

## 🧰 Useful Commands

### Backend Commands

```bash
cd backend
npm install
npm start
npm run dev
```

### Mobile App Commands

```bash
cd mobile-app
npm install
npx expo start
npx expo start -c
npx expo start --tunnel
```

### Git Commands

```bash
git status
git add .
git commit -m "Update project files"
git push origin main
```

---

## 🔑 Environment Variables

### Backend `.env` Example

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Mobile App `.env` Example

```env
EXPO_PUBLIC_API_URL=https://bus-system-3lgy.onrender.com/api
```

---

## 🎬 Final Demo Notes

For the final demo, the mobile app should connect to the hosted backend, not localhost.

Use this API base URL:

```txt
https://bus-system-3lgy.onrender.com/api
```

The hosted backend base URL is:

```txt
https://bus-system-3lgy.onrender.com
```

If the app is tested using Expo Go and the normal QR code does not work, tunnel mode can be used:

```bash
npx expo start --tunnel
```

---

## 📌 Project Status

Completed modules in the current source code:

- Login and Authentication
- Route Management
- Stop Management
- Bus Management

Remaining full system modules:

- Bus Schedule Management
- Booking Management
- Admin Panel and Report Generation

---

## 🏁 Conclusion

QuickBus is a mobile-based highway bus reservation and management system developed to make bus operations easier to manage and easier for passengers to use. The system supports secure login, route and stop management, bus management, schedule planning, booking handling, and administrative reporting.

The project follows a full-stack mobile application structure with a React Native frontend, Node.js and Express backend, and MongoDB database. It is designed to support a real-world bus reservation workflow and can be extended with more features in the future.