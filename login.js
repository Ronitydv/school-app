// Sample user data - in real app, this would come from server
const sampleUsers = {
    students: [
        { admissionNo: "RPS2025001", name: "Aarav Sharma", dob: "15/08/2008", class: "11A" },
        { admissionNo: "RPS2025002", name: "Vihaan Gupta", dob: "22/03/2008", class: "11A" },
        { admissionNo: "RPS2025003", name: "Arjun Singh", dob: "10/12/2007", class: "11A" },
        // Add more as needed
    ],
    teachers: [
        { id: "T001", name: "Mr. Sharma", phone: "9876543210", subject: "Mathematics" },
        { id: "T002", name: "Ms. Gupta", phone: "9876543211", subject: "Physics" },
        // Add more
    ],
    parents: [
        { phone: "9876543210", childAdmissionNo: "RPS2025001", childName: "Aarav Sharma" },
        { phone: "9876543211", childAdmissionNo: "RPS2025002", childName: "Vihaan Gupta" },
        // Add more
    ]
};

// Store sample data in localStorage if not exists
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
}

// DOM elements
const roleButtons = document.querySelectorAll('.role-btn');
const loginForm = document.getElementById('login-form');
const formTitle = document.getElementById('form-title');
const backBtn = document.getElementById('back-btn');

// Role selection
roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const role = btn.dataset.role;
        showLoginForm(role);
    });
});

// Show login form for selected role
function showLoginForm(role) {
    document.querySelector('.role-selection').style.display = 'none';
    loginForm.style.display = 'block';
    
    // Hide all forms
    document.querySelectorAll('.form-section').forEach(form => form.style.display = 'none');
    
    if (role === 'student') {
        formTitle.textContent = 'Student Login';
        document.getElementById('student-form').style.display = 'block';
    } else if (role === 'teacher') {
        formTitle.textContent = 'Teacher Login';
        document.getElementById('teacher-form').style.display = 'block';
    } else if (role === 'parent') {
        formTitle.textContent = 'Parent Login';
        document.getElementById('parent-form').style.display = 'block';
    }
}

// Back button
backBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
    document.querySelector('.role-selection').style.display = 'block';
});

// Student login
document.getElementById('student-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const admissionNo = document.getElementById('student-id').value;
    const dob = document.getElementById('student-dob').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const student = users.students.find(s => s.admissionNo === admissionNo && s.dob === dob);
    
    if (student) {
        localStorage.setItem('currentUser', JSON.stringify({ role: 'student', ...student }));
        window.location.href = 'student-dashboard.html';
    } else {
        alert('Invalid credentials!');
    }
});

// Teacher OTP
document.getElementById('send-otp-teacher').addEventListener('click', () => {
    const phone = document.getElementById('teacher-phone').value;
    if (phone.length === 10) {
        const otp = generateOTP();
        alert(`OTP sent to ${phone}: ${otp}`); // In real app, send via SMS
        localStorage.setItem('currentOTP', otp);
        document.getElementById('otp-section-teacher').style.display = 'block';
        document.getElementById('teacher-login-btn').style.display = 'block';
    } else {
        alert('Please enter a valid 10-digit phone number');
    }
});

// Teacher login
document.getElementById('teacher-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const teacherId = document.getElementById('teacher-id').value;
    const otp = document.getElementById('teacher-otp').value;
    const storedOTP = localStorage.getItem('currentOTP');
    
    if (otp === storedOTP) {
        const users = JSON.parse(localStorage.getItem('users'));
        const teacher = users.teachers.find(t => t.id === teacherId);
        
        if (teacher) {
            localStorage.setItem('currentUser', JSON.stringify({ role: 'teacher', ...teacher }));
            window.location.href = 'teacher-dashboard.html';
        } else {
            alert('Invalid Teacher ID!');
        }
    } else {
        alert('Invalid OTP!');
    }
});

// Parent OTP
document.getElementById('send-otp-parent').addEventListener('click', () => {
    const phone = document.getElementById('parent-phone').value;
    if (phone.length === 10) {
        const otp = generateOTP();
        alert(`OTP sent to ${phone}: ${otp}`); // In real app, send via SMS
        localStorage.setItem('currentOTP', otp);
        document.getElementById('otp-section-parent').style.display = 'block';
        document.getElementById('parent-login-btn').style.display = 'block';
    } else {
        alert('Please enter a valid 10-digit phone number');
    }
});

// Parent login
document.getElementById('parent-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = document.getElementById('parent-phone').value;
    const otp = document.getElementById('parent-otp').value;
    const storedOTP = localStorage.getItem('currentOTP');
    
    if (otp === storedOTP) {
        const users = JSON.parse(localStorage.getItem('users'));
        const parent = users.parents.find(p => p.phone === phone);
        
        if (parent) {
            localStorage.setItem('currentUser', JSON.stringify({ role: 'parent', ...parent }));
            window.location.href = 'parent-dashboard.html';
        } else {
            alert('Parent not found! Please contact school administration.');
        }
    } else {
        alert('Invalid OTP!');
    }
});

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}