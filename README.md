
# Scheduler Web Application

A web-based scheduling application that allows users to manage tasks, events, and schedules effectively. The project consists of two main components: **Frontend** and **Backend**, both of which are necessary to run the application.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
- [Development Workflow](#development-workflow)
- [Usage](#usage)

## Overview

This Scheduler Web Application helps users organize and manage their schedules, events, and tasks by providing a convenient platform for adding, editing, and viewing schedules. The app is built with:

- **Frontend**: The user interface, developed using React, where users can interact with the application.
- **Backend**: A Node.js-based server that handles business logic, data storage, and communication with the frontend.
- **Database**: A MySQL database that stores and manages application data while ensuring data integrity.

## Prerequisites

Before setting up the application locally, ensure that the following tools are installed:

- **Node.js**: A JavaScript runtime required to run both the frontend and backend. Download and install it from [here](https://nodejs.org/en).
- **Git**: A version control system to clone the repository. Download and install it from [here](https://git-scm.com).

## Getting Started

Follow these steps to set up the project on your local machine.

### Clone the Repository

Start by cloning the repository to your local device:

```bash
git clone <repository-url>
```

Replace `<repository-url>` with the URL of your Git repository.

### Frontend Setup

1. **Navigate to the frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install the required dependencies**:

   ```bash
   npm install
   ```

3. **Build the frontend project**:

   ```bash
   npm run build
   ```

4. **Start the frontend development server**:

   ```bash
   npm run
   ```

Your frontend should now be running. The application will usually be accessible at [http://localhost:5173](http://localhost:5173) by default.

### Database Setup

Follow these steps to set up the MySQL database for the Scheduler Web Application.

1. **Install MySQL**

Ensure that MySQL is installed on your system. If not, download and install it from [here](https://dev.mysql.com/downloads/installer/).

2. **Create the Database**

Open MySQL command-line client or any MySQL GUI tool such as MySQL Workbench.
Create a new database by running the following command:

   ```sql
   CREATE DATABASE burntcones;
   ```

Switch to the newly created database:
   ```sql
   USE scheduler_app;
   ```

3. **Set Up Tables**

Run the following SQL script to create the necessary tables:

```sql
-- Delete existing tables if they exist
DROP TABLE IF EXISTS leave_offs;
DROP TABLE IF EXISTS shift_applications;
DROP TABLE IF EXISTS confirmed_slots;
DROP TABLE IF EXISTS schedule;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(255) UNIQUE NOT NULL,
  color VARCHAR(255) DEFAULT '#212121',
  permanent BOOLEAN DEFAULT FALSE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nric VARCHAR(20),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phonenumber VARCHAR(20),
  sex ENUM('Male', 'Female') NOT NULL,
  dob DATETIME NOT NULL,
  bankName VARCHAR(255),
  bankAccountNo VARCHAR(255),
  address VARCHAR(255),
  workplace VARCHAR(255) DEFAULT 'NA',
  occupation VARCHAR(255) DEFAULT 'NA',
  driverLicense BOOLEAN DEFAULT FALSE,
  firstAid BOOLEAN DEFAULT FALSE,
  joinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  admin BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  role_id INT,
  leaves DECIMAL(5,1) DEFAULT 0,
  offs DECIMAL(5,1) DEFAULT 0,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Create schedule table
CREATE TABLE IF NOT EXISTS schedule (
  schedule_id INT AUTO_INCREMENT PRIMARY KEY,
  outlet_name VARCHAR(255) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  vacancy INT CHECK (vacancy >= 0),
  published BOOLEAN DEFAULT FALSE
);

-- Create shift_applications table
CREATE TABLE IF NOT EXISTS shift_applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  schedule_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  application_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (schedule_id) REFERENCES schedule(schedule_id) ON DELETE CASCADE
);

-- Create confirmed_slots table
CREATE TABLE IF NOT EXISTS confirmed_slots (
  schedule_id INT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (schedule_id) REFERENCES schedule(schedule_id) ON DELETE CASCADE
);

-- Create leave_offs table
CREATE TABLE IF NOT EXISTS leave_offs (
  leave_offs_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(5) NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  duration VARCHAR(20) NOT NULL,
  amt_used DECIMAL(5,1) NOT NULL,
  status VARCHAR(10) DEFAULT 'pending' NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

4. **Insert Default Data**

Run the following commands to insert initial data into the database:

```sql
-- Insert default roles
INSERT INTO roles (role_name, color, permanent) 
VALUES 
('User', '#333333', TRUE),
('Owner', '#4A90E2', FALSE),
('Operational Manager', '#50E3C2', FALSE),
('Gelato Chef', '#D0021B', FALSE),
('Full Timer', '#8B5BFF', FALSE),
('Shift Leader', '#7ED321', FALSE),
('Part Timer', '#d1c00b', FALSE);

-- Insert main user
INSERT INTO users (name, nric, email, password, phonenumber, sex, dob, bankName, bankAccountNo, address, workplace, occupation, 
driverLicense, firstAid, admin, role_id) 
VALUES ( 'Administrator', 'S1234567A', 'masteracc@gmail.com', '$2b$10$Rr/mIoHFZyR3/F9xTUF6wuo6s3GwMvbmoTE3yeqjtRKZAY90eZYsm', '9876543210', 'Male', '1990-05-15 00:00:00', 'Bank ABC', '1234567890123456', '123 Main St, Hometown', 'Headquarters', 'Administrator', TRUE, TRUE, TRUE, 1 );
```

5. **Verify the Setup**

To check if everything is set up correctly, run the following query:

```sql
SHOW TABLES;
```

You should see all the created tables listed.

### Backend Setup

1. **Navigate to the backend directory**:

   ```bash
   cd backend
   ```

2. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Update the .env file with your settings**:
   ```env
   NODE_ENV=development
   ACCESS_TOKEN_SECRET=your_secret_key
   REFRESH_TOKEN_SECRET=another_secret_key
   DB_HOST="127.0.0.1"
   DB_USER="root"
   DB_PASS="your_password"
   DB_DATABASE="burntcones"
   ```

4. **Install the required backend dependencies**:

   ```bash
   npm install
   ```

5. **Build the backend project**:

   ```bash
   npm run build
   ```

6. **Start the backend server**:

   ```bash
   npm run
   ```

The backend server should now be running, typically accessible at [http://localhost:8080](http://localhost:8080) (depending on your configuration).

## Development Workflow

Once both frontend, backend and database servers are running, you can interact with the Scheduler Web Application via your browser.

- **Frontend URL**: Open [http://localhost:5173](http://localhost:5173) to access the user interface.
- **Backend URL**: The backend will be running on [http://localhost:8080](http://localhost:8080) (or the port you configured).

You can now begin working on the application, adding features, fixing bugs, or adjusting the user interface.

## Usage

After setting up both frontend and backend, You can login using the following information:
- **Email**: masteracc@gmail.com
- **Password**: password1

Once you have logged in, here are some of the features you can access:

- **View and manage schedules**: Add, edit, or delete schedules for specific tasks or events.
- **User Authentication**: Log in to personalize your scheduling experience.
- **Calendar Integration**: Synchronize your schedules with a calendar.
