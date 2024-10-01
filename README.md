# Tracend - Achievement Management System

This project is a web-based application built with a **React frontend** and an **ASP.NET Web API backend**. The application allows users to perform CRUD (Create, Read, Update, Delete) operations on **Achievements**.

## Project Structure

- **Frontend**: React.js
- **Backend**: ASP.NET Web API
- **Database**: SQL Server

---

## Prerequisites

### Backend
- **.NET SDK** (version 8.0 )
- **SQL Server**
- **Visual Studio** or any IDE supporting .NET
- **SMTP service** for email functionality (optional)

### Frontend
- **Node.js** (version 14 or higher)
- **npm** or **yarn**

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/tracend.git
cd tracend
``` 
### Backend Setup (ASP.NET Web API)

```bash
cd TracendBackend
```

### run this command
```bash 
dotnet restore
```

### Database Configuration in app.setting.json
```bash
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your_server;Database=Tracend;Trusted_Connection=True;"
  }
}
```
### Frontend Setup (React)
```bash
npm install
npm start
```
### smtp configuration in app.setting.json
Enter your email address from where you want to sent code.
Generate app password from your gmail account and enter that password. Don't enter you gmail ACCOUNT PASSWORD.

```bash
"Email": {
    "FromAddress": "",  
    "FromPassword": "",
    
  },
```
Restoring Database from Backup
------------------------------

1.  Open **SQL Server Management Studio (SSMS)** and connect to your server.
    
2.  Right-click on **Databases** and select **Restore Database**.
    
3.  Choose **Device** and select the .bak file from the backup directory.
    
4.  In the **Destination** section, provide the name of the database (e.g., Tracend.bak).
    
5.  Click **OK** to restore the database.


### Demo Video

You can watch the demo video of the Tracend Achievement Management System here:

[Watch the Demo](https://www.youtube.com/watch?v=obMNnxemlQc)

