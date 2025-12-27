# RPS School Management System

A comprehensive web-based school management system for RPS School, featuring role-based access for students, teachers, and parents.

## Features

### 🔐 Multi-Role Authentication
- **Student Login**: Admission Number + Date of Birth
- **Teacher Login**: Teacher ID + Phone Number + OTP verification
- **Parent Login**: Guardian Phone Number + OTP verification

### 👨‍🎓 Student Dashboard
- **Homework**: View daily assignments
- **Test Scores**: Monthly academic performance
- **Leave Application**: Submit leave requests
- **Upcoming Exams**: Exam schedule and syllabus
- **Announcements**: School notices and updates
- **Attendance Record**: Personal attendance history

### 👨‍🏫 Teacher Dashboard
- **Attendance Management**: Mark student attendance
- **Test Marks Upload**: Enter student test scores
- **Announcement System**: Post school notices
- **Homework Assignment**: Upload daily homework
- **Student Analytics**: View attendance and performance data
- **Student Management**: Edit class roster

### 👨‍👩‍👧‍👦 Parent Dashboard
- **Fees Management**: View and pay school fees
- **Child's Attendance**: Monthly attendance reports
- **Test Records**: Academic performance tracking
- **Teacher Contacts**: Subject teachers' information
- **School Announcements**: Important notices
- **Leave Applications**: Track leave request status

### 📊 Analytics & Reports
- **Monthly Attendance Charts**: Visual representation with Chart.js
- **Performance Analytics**: Test scores and grade tracking
- **Holiday Management**: Mark and track school holidays
- **Data Security**: Past records are locked from editing

## Technologies Used
- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript (ES6+)**: Dynamic functionality and data management
- **Chart.js**: Data visualization for attendance analytics
- **Local Storage**: Client-side data persistence

## Installation & Setup

1. **Download** all project files
2. **Open** `login.html` in any modern web browser
3. **No server required** - runs entirely in the browser

## Usage Guide

### First Time Setup
1. Open `login.html` in your browser
2. The system comes with sample user accounts:
   - **Student**: Admission No: `RPS2025001`, DOB: `15/08/2008`
   - **Teacher**: ID: `T001`, Phone: `9876543210`
   - **Parent**: Phone: `9876543210`

### Login Process
- **Students**: Enter admission number and DOB
- **Teachers**: Enter ID, phone, receive OTP (shown in alert for demo)
- **Parents**: Enter phone number, receive OTP (shown in alert for demo)

### Navigation
Each role has a dedicated dashboard with relevant features and information.

## Security Features
- Past attendance records are locked from editing
- Password protection for data clearing
- Client-side data storage (no server required)

## Sample Data
The system includes sample data for testing:
- 47 students with admission numbers RPS2025001 to RPS2025047
- 3 teachers with different subjects
- Parent accounts linked to student records

## Browser Compatibility
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## File Structure
```
├── index.html              # Main attendance page
├── style.css               # Styles and animations
├── script.js               # Main application logic
├── student-data.html       # Analytics page
├── student-data.js         # Analytics logic
└── README.md              # This file
```

## Contributing
Feel free to enhance the system with additional features like:
- Real SMS OTP integration
- Database backend
- File upload for assignments
- Online payment integration
- Mobile app version

## License
This project is open source and available under the MIT License.

## Support
For issues or questions, contact dev 9817567037

