// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'teacher') {
    window.location.href = 'attendance.html';
}

// Display user info
document.getElementById('teacher-name').textContent = currentUser.name;
document.getElementById('teacher-subject').textContent = currentUser.subject;
document.getElementById('teacher-id').textContent = currentUser.id;

// Load dashboard data
loadDashboardData();

// Navigation
document.querySelectorAll('.nav-card').forEach(card => {
    card.addEventListener('click', () => {
        const section = card.dataset.section;
        showSection(section);
    });
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'attendance.html';
});

function loadDashboardData() {
    // Load today's attendance stats
    const today = new Date().toISOString().split('T')[0];
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    const todayRecord = records[today];
    
    if (todayRecord) {
        const present = Object.values(todayRecord).filter(status => status === 'present').length;
        const total = Object.keys(todayRecord).length;
        document.getElementById('today-attendance').textContent = `${present}/${total}`;
    } else {
        document.getElementById('today-attendance').textContent = 'Not taken';
    }
    
    // Class average (simplified)
    document.getElementById('class-average').textContent = '78%';
    document.getElementById('pending-tasks').textContent = '3';
}

function showSection(section) {
    const contentArea = document.getElementById('content-area');
    
    let content = '';
    switch(section) {
        case 'attendance':
            window.location.href = 'attendance.html';
            return;
        case 'upload-marks':
            content = `
                <div class="content-section active">
                    <h3>Upload Test Marks</h3>
                    <form class="marks-form">
                        <div class="form-group">
                            <label for="test-subject">Subject</label>
                            <select id="test-subject" required>
                                <option value="">Select Subject</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="physics">Physics</option>
                                <option value="chemistry">Chemistry</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="test-date">Test Date</label>
                            <input type="date" id="test-date" required>
                        </div>
                        <div id="marks-inputs">
                            <!-- Student marks inputs will be added here -->
                        </div>
                        <button type="submit" class="btn">Upload Marks</button>
                    </form>
                </div>
            `;
            break;
        case 'announcements':
            content = `
                <div class="content-section active">
                    <h3>Make Announcement</h3>
                    <form class="announcement-form">
                        <div class="form-group">
                            <label for="announcement-title">Title</label>
                            <input type="text" id="announcement-title" placeholder="Announcement title" required>
                        </div>
                        <div class="form-group">
                            <label for="announcement-content">Content</label>
                            <textarea id="announcement-content" rows="6" placeholder="Announcement details" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="announcement-target">Target Audience</label>
                            <select id="announcement-target" required>
                                <option value="all">All Students</option>
                                <option value="class">My Class Only</option>
                                <option value="parents">Parents Only</option>
                            </select>
                        </div>
                        <button type="submit" class="btn">Post Announcement</button>
                    </form>
                </div>
            `;
            break;
        case 'homework':
            content = `
                <div class="content-section active">
                    <h3>Upload Today's Homework</h3>
                    <form class="homework-form">
                        <div class="form-group">
                            <label for="homework-subject">Subject</label>
                            <select id="homework-subject" required>
                                <option value="">Select Subject</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="physics">Physics</option>
                                <option value="chemistry">Chemistry</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="homework-content">Homework Details</label>
                            <textarea id="homework-content" rows="6" placeholder="Describe the homework assignment" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="homework-due">Due Date</label>
                            <input type="date" id="homework-due" required>
                        </div>
                        <button type="submit" class="btn">Assign Homework</button>
                    </form>
                </div>
            `;
            break;
        case 'student-data':
            window.location.href = 'student-data.html';
            return;
        case 'manage-students':
            content = `
                <div class="content-section active">
                    <h3>Manage Students</h3>
                    <div class="student-management-header">
                        <button class="btn btn-primary" onclick="showAddStudentForm()">Add New Student</button>
                    </div>
                    <div class="student-list" id="student-list">
                        <!-- Student list will be loaded here -->
                    </div>
                </div>
            `;
            // Load student list after content is added
            setTimeout(() => {
                loadStudentList();
            }, 100);
            break;
    }
    
    contentArea.innerHTML = content;
}

// Student Management Functions
function loadStudentList() {
    const users = JSON.parse(localStorage.getItem('users')) || { students: [] };
    const studentList = document.getElementById('student-list');
    
    if (users.students.length === 0) {
        studentList.innerHTML = '<p>No students found. Add some students to get started.</p>';
        return;
    }
    
    studentList.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Admission No</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Date of Birth</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.students.map((student, index) => `
                    <tr>
                        <td>${student.admissionNo}</td>
                        <td>${student.name}</td>
                        <td>${student.class}</td>
                        <td>${student.dob}</td>
                        <td>
                            <button class="btn btn-small" onclick="editStudent(${index})">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="deleteStudent(${index})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showAddStudentForm() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="content-section active">
            <h3>Add New Student</h3>
            <form class="student-form" onsubmit="addStudent(event)">
                <div class="form-group">
                    <label for="admission-no">Admission Number</label>
                    <input type="text" id="admission-no" placeholder="RPS2025XXX" required>
                </div>
                <div class="form-group">
                    <label for="student-name">Full Name</label>
                    <input type="text" id="student-name" placeholder="Student full name" required>
                </div>
                <div class="form-group">
                    <label for="student-class">Class</label>
                    <select id="student-class" required>
                        <option value="">Select Class</option>
                        <option value="11A">11A</option>
                        <option value="11B">11B</option>
                        <option value="12A">12A</option>
                        <option value="12B">12B</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="student-dob">Date of Birth</label>
                    <input type="text" id="student-dob" placeholder="DD/MM/YYYY" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Add Student</button>
                    <button type="button" class="btn" onclick="showSection('manage-students')">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

function addStudent(event) {
    event.preventDefault();
    
    const admissionNo = document.getElementById('admission-no').value.trim();
    const name = document.getElementById('student-name').value.trim();
    const studentClass = document.getElementById('student-class').value;
    const dob = document.getElementById('student-dob').value.trim();
    
    if (!admissionNo || !name || !studentClass || !dob) {
        alert('Please fill all fields');
        return;
    }
    
    // Validate admission number format
    if (!admissionNo.startsWith('RPS')) {
        alert('Admission number must start with "RPS"');
        return;
    }
    
    // Validate date format (DD/MM/YYYY)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dob)) {
        alert('Date of birth must be in DD/MM/YYYY format');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || { students: [] };
    
    // Check if admission number already exists
    if (users.students.some(student => student.admissionNo === admissionNo)) {
        alert('Admission number already exists!');
        return;
    }
    
    // Add new student
    users.students.push({
        admissionNo,
        name,
        class: studentClass,
        dob
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('Student added successfully!');
    showSection('manage-students');
}

function editStudent(index) {
    const users = JSON.parse(localStorage.getItem('users')) || { students: [] };
    const student = users.students[index];
    
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="content-section active">
            <h3>Edit Student</h3>
            <form class="student-form" onsubmit="updateStudent(event, ${index})">
                <div class="form-group">
                    <label for="admission-no">Admission Number</label>
                    <input type="text" id="admission-no" value="${student.admissionNo}" readonly>
                </div>
                <div class="form-group">
                    <label for="student-name">Full Name</label>
                    <input type="text" id="student-name" value="${student.name}" required>
                </div>
                <div class="form-group">
                    <label for="student-class">Class</label>
                    <select id="student-class" required>
                        <option value="11A" ${student.class === '11A' ? 'selected' : ''}>11A</option>
                        <option value="11B" ${student.class === '11B' ? 'selected' : ''}>11B</option>
                        <option value="12A" ${student.class === '12A' ? 'selected' : ''}>12A</option>
                        <option value="12B" ${student.class === '12B' ? 'selected' : ''}>12B</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="student-dob">Date of Birth</label>
                    <input type="text" id="student-dob" value="${student.dob}" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Update Student</button>
                    <button type="button" class="btn" onclick="showSection('manage-students')">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

function updateStudent(event, index) {
    event.preventDefault();
    
    const name = document.getElementById('student-name').value.trim();
    const studentClass = document.getElementById('student-class').value;
    const dob = document.getElementById('student-dob').value.trim();
    
    if (!name || !studentClass || !dob) {
        alert('Please fill all fields');
        return;
    }
    
    // Validate date format (DD/MM/YYYY)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dob)) {
        alert('Date of birth must be in DD/MM/YYYY format');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || { students: [] };
    const oldStudent = users.students[index];
    const oldName = oldStudent.name;
    
    users.students[index] = {
        ...users.students[index],
        name,
        class: studentClass,
        dob
    };
    
    // Update parent records if student name changed
    if (oldName !== name && users.parents) {
        users.parents.forEach(parent => {
            if (parent.childAdmissionNo === oldStudent.admissionNo) {
                parent.childName = name;
            }
        });
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('Student updated successfully!');
    showSection('manage-students');
}

function deleteStudent(index) {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || { students: [] };
    const student = users.students[index];
    
    // Remove student from array
    users.students.splice(index, 1);
    
    // Remove associated parent records
    if (users.parents) {
        users.parents = users.parents.filter(parent => parent.childAdmissionNo !== student.admissionNo);
    }
    
    // Also remove from attendance records if they exist
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    Object.keys(attendanceRecords).forEach(date => {
        if (attendanceRecords[date][student.admissionNo.replace('RPS', '')]) {
            delete attendanceRecords[date][student.admissionNo.replace('RPS', '')];
        }
    });
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('Student deleted successfully!');
    loadStudentList();
}