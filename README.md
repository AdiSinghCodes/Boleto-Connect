

# **Boleto-Connect: Employee Work & Payroll Management Software**  

Boleto-Connect is an advanced **PERN stack** (PostgreSQL, Express.js, React.js, Node.js) software designed for **Boleto Vadapav** to streamline **employee work schedules, payroll calculations, and task assignments**. The software enables employees to log their **monthly work schedules**, while the **boss can manage schedules, assign tasks, and track payments** efficiently.  

---

## **Features**  

### **For Employees**  
✅ **Signup & Login:** Secure authentication using Google OAuth.  
✅ **Work Schedule:** Add and edit a monthly work calendar.  
✅ **Task Management:** View assigned tasks from the boss.  
✅ **Submit Schedule:** Lock monthly schedules for payroll processing.  
✅ **Salary Tracking:** View salary breakdown based on workdays.  

### **For Boss/Manager**  
✅ **Dashboard Notices:** Post motivational messages or important updates.  
✅ **Employee Schedules:** View, edit, and track all employee work logs.  
✅ **Task Assignments:** Assign and update tasks for employees.  
✅ **Salary Calculation:** Pay employees based on recorded workdays.  
✅ **Boss's Schedule:** Manage a personal monthly work calendar.  

---

## **Prerequisites**  

Before running the application, ensure that the following dependencies are installed:  

### **Backend Dependencies (Node.js & Express.js)**  
- `express`  
- `pg` *(PostgreSQL Client)*  
- `bcryptjs` *(Password Hashing)*  
- `jsonwebtoken` *(Authentication)*  
- `dotenv` *(Environment Variables)*  
- `cors` *(Cross-Origin Resource Sharing)*  

### **Frontend Dependencies (React.js)**  
- `react-router-dom` *(Routing)*  
- `axios` *(API Requests)*  
- `bootstrap` *(UI Components)*  

### **Database**  
- PostgreSQL *(Ensure PostgreSQL is installed and running on your machine.)*  

---

## **Installation**  

You can install all required dependencies using the following command:  

```bash
npm install
```

---

## **Setup**  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/AdiSinghCodes/Boleto-Connect.git
cd boleto-connect
```

### **2️⃣ Install Dependencies**  
```bash
npm install
```

### **3️⃣ Setup PostgreSQL Database**  
1. **Ensure PostgreSQL is installed** on your system.  
2. **Create a new database:**  
   ```sql
   CREATE DATABASE boleto_connect;
   ```
### **3. Start the Backend Server**  
```bash
node server.js
```

### **4. Start the Frontend**  
```bash
npm start
```



## **File Descriptions**  

### **Backend Files (server/)**  
1. `server.js`  
   - Main entry point for the backend.  
   - Handles API requests and authentication.  

2. `routes/employeeRoutes.js`  
   - Manages employee-specific actions (schedule submission, task retrieval).  

3. `routes/adminRoutes.js`  
   - Handles admin functionalities like task assignment, payroll tracking.  

4. `models/database.js`  
   - Contains database queries for fetching, updating employee records.  

### **Frontend Files (client/src/)**  
1. `App.js`  
   - Main React application.  

2. `components/Dashboard.js`  
   - Displays the employee or boss dashboard.  

3. `components/Schedule.js`  
   - Interface for filling and editing schedules.  



## **How to Use**  

### **1️⃣ Employee Login & Schedule Submission**  
1. Sign up or log in using Google OAuth.  
2. Navigate to "My Schedule" to enter work details.  
3. Submit the monthly schedule before the **3rd of the month**.  

### **2️⃣ Boss Dashboard & Employee Management**  
1. Log in with admin credentials.  
2. Post notices/motivational messages for employees.  
3. View & edit employee schedules.  
4. Assign tasks and track employee work.  
5. View and process salaries.  

---

## **Notes**  
- Employees can only edit their schedules before the **3rd of each month**.  
- The system automatically locks schedules for payroll calculation.  
- The **boss has full access** to view and modify all schedules.  

---

## **License**  
This project is licensed under the **MIT License**. See the LICENSE file for details.  

---

## **Acknowledgments**  
- **PostgreSQL** for efficient data storage.  
- **React.js & Bootstrap** for interactive UI.  
- **Express.js & Node.js** for backend processing.  

For any issues or contributions, feel free to open an **issue** or submit a **pull request**. 🚀
