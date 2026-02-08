# ✈️ Flight Booking Web App

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Full--Stack-Project-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/CDAC-PG--DAC-important?style=for-the-badge"/>
</p>

<p align="center">
  <b>A modern, full-stack flight ticket booking system built for real-world use cases.</b>
</p>

---

## 🧭 Overview

**Flight Booking Web App** is a full-stack web application that allows users to **search, book, and manage flight tickets online**.  
The system is designed with a **clean separation of concerns**, secure APIs, and a responsive frontend to simulate a real airline booking platform.

Built using **React.js**, **ASP.NET Core Web API (.NET 8)**, and **MySQL**, the project demonstrates **end-to-end application development**, from UI to database.

---

## ✨ Key Features

- 🔐 **User Authentication**
  - Secure user registration and login
  - Token-based API access

- 🛫 **Flight Search**
  - Search flights by source, destination, and date
  - Real-time availability from database

- 🎟️ **Ticket Booking**
  - Seat selection & booking flow
  - Booking confirmation handling

- 📄 **E-Ticket Generation**
  - Automatic ticket creation after booking
  - Booking details stored persistently

- 🛠️ **Admin Dashboard**
  - Add/update flights and schedules
  - Manage availability and pricing

- 📱 **Responsive UI**
  - Optimized for desktop and mobile
  - Smooth navigation with React

---

## 🧠 Architecture & Design

The application follows a **layered architecture**, commonly used in production systems:

```text
Client (React.js)
        ↓
ASP.NET Core Web API
        ↓
MySQL Database
