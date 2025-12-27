// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'student') {
    window.location.href = 'attendance.html';
}

// Display user info
document.getElementById('student-name').textContent = currentUser.name;
document.getElementById('student-class').textContent = currentUser.class;
document.getElementById('student-id').textContent = currentUser.admissionNo;

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
    // Load today's attendance
    const today = new Date().toISOString().split('T')[0];
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    const todayRecord = records[today];
    
    if (todayRecord && todayRecord[currentUser.admissionNo.replace('RPS', '')] !== undefined) {
        const status = todayRecord[currentUser.admissionNo.replace('RPS', '')];
        document.getElementById('today-attendance').textContent = status === 'present' ? 'Present' : 'Absent';
    } else {
        document.getElementById('today-attendance').textContent = 'Not Marked';
    }
    
    // Load monthly attendance (simplified)
    document.getElementById('monthly-attendance').textContent = '85%';
    document.getElementById('pending-homework').textContent = '2';
}

function showSection(section) {
    const contentArea = document.getElementById('content-area');
    
    let content = '';
    switch(section) {
        case 'homework':
            content = `
                <div class="content-section active">
                    <h3>Today's Homework</h3>
                    <div class="homework-list">
                        <div class="homework-item">
                            <h4>Mathematics</h4>
                            <p>Complete exercises 5.1 to 5.5 from textbook</p>
                            <small>Due: Tomorrow</small>
                        </div>
                        <div class="homework-item">
                            <h4>Physics</h4>
                            <p>Read chapter 8 and solve numerical problems</p>
                            <small>Due: Tomorrow</small>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'test-scores':
            content = `
                <div class="content-section active">
                    <h3>Monthly Test Scores</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Marks</th>
                                <th>Total</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mathematics</td>
                                <td>85</td>
                                <td>100</td>
                                <td>85%</td>
                            </tr>
                            <tr>
                                <td>Physics</td>
                                <td>78</td>
                                <td>100</td>
                                <td>78%</td>
                            </tr>
                            <tr>
                                <td>Chemistry</td>
                                <td>92</td>
                                <td>100</td>
                                <td>92%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            break;
        case 'leave-application':
            content = `
                <div class="content-section active">
                    <h3>Apply for Leave</h3>
                    <form class="leave-form">
                        <div class="form-group">
                            <label for="leave-from">From Date</label>
                            <input type="date" id="leave-from" required>
                        </div>
                        <div class="form-group">
                            <label for="leave-to">To Date</label>
                            <input type="date" id="leave-to" required>
                        </div>
                        <div class="form-group">
                            <label for="leave-reason">Reason</label>
                            <textarea id="leave-reason" rows="4" placeholder="Please provide reason for leave" required></textarea>
                        </div>
                        <button type="submit" class="btn">Submit Application</button>
                    </form>
                </div>
            `;
            break;
        case 'upcoming-exams':
            content = `
                <div class="content-section active">
                    <h3>Upcoming Exams</h3>
                    <div class="exam-list">
                        <div class="exam-item">
                            <h4>Mathematics Final Exam</h4>
                            <p>Date: 25th December 2025</p>
                            <p>Time: 10:00 AM - 1:00 PM</p>
                            <p>Syllabus: Chapters 1-10</p>
                        </div>
                        <div class="exam-item">
                            <h4>Physics Mid-term</h4>
                            <p>Date: 15th January 2026</p>
                            <p>Time: 9:00 AM - 12:00 PM</p>
                            <p>Syllabus: Chapters 5-8</p>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'announcements':
            content = `
                <div class="content-section active">
                    <h3>School Announcements</h3>
                    <div class="announcement-list">
                        <div class="announcement-item">
                            <h4>Winter Vacation Notice</h4>
                            <p>School will remain closed from 20th December to 5th January for winter vacation.</p>
                            <small>Posted: 15th December 2025</small>
                        </div>
                        <div class="announcement-item">
                            <h4>Parent-Teacher Meeting</h4>
                            <p>PTM scheduled for 18th December 2025. Please attend with your ward.</p>
                            <small>Posted: 10th December 2025</small>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'attendance':
            content = `
                <div class="content-section active">
                    <h3>My Attendance Record</h3>
                    <div class="attendance-overview">
                        <div class="attendance-stat">
                            <h4>Present Days</h4>
                            <span class="stat-number">${getStudentAttendanceData().present}</span>
                        </div>
                        <div class="attendance-stat">
                            <h4>Absent Days</h4>
                            <span class="stat-number">${getStudentAttendanceData().absent}</span>
                        </div>
                        <div class="attendance-stat">
                            <h4>Holidays</h4>
                            <span class="stat-number">${getStudentAttendanceData().holidays}</span>
                        </div>
                        <div class="attendance-stat">
                            <h4>Attendance %</h4>
                            <span class="stat-number">${getStudentAttendanceData().percentage}%</span>
                        </div>
                    </div>
                    <div class="attendance-chart">
                        <canvas id="student-attendance-chart"></canvas>
                    </div>
                    <h4>Monthly Details</h4>
                    <div class="attendance-details">
                        ${getStudentAttendanceData().details.map(detail => 
                            `<div class="attendance-item ${detail.status.toLowerCase()}">
                                <span class="date">${detail.date}</span>
                                <span class="status">${detail.status}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            `;
            // Load chart after content is added
            setTimeout(() => {
                loadStudentAttendanceChart();
            }, 100);
            break;
    }
    
    contentArea.innerHTML = content;
}

function getStudentAttendanceData() {
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    const holidays = JSON.parse(localStorage.getItem('holidays')) || [];
    const monthDates = getCurrentMonthDates();
    
    let present = 0;
    let absent = 0;
    let holidaysCount = 0;
    const details = [];

    monthDates.forEach(date => {
        if (holidays.includes(date)) {
            holidaysCount++;
            details.push({ date, status: 'Holiday' });
        } else {
            const dayAttendance = records[date];
            if (dayAttendance && dayAttendance[currentUser.admissionNo.replace('RPS', '')] !== undefined) {
                const status = dayAttendance[currentUser.admissionNo.replace('RPS', '')];
                if (status === 'present') {
                    present++;
                    details.push({ date, status: 'Present' });
                } else if (status === 'absent') {
                    absent++;
                    details.push({ date, status: 'Absent' });
                }
            } else {
                details.push({ date, status: 'Not Marked' });
            }
        }
    });

    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, absent, holidays: holidaysCount, percentage, details };
}

function getCurrentMonthDates() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

function loadStudentAttendanceChart() {
    const canvas = document.getElementById('student-attendance-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = getStudentAttendanceData();
    
    // Destroy existing chart if it exists
    if (window.studentChart) {
        window.studentChart.destroy();
    }
    
    window.studentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Present', 'Absent', 'Holidays'],
            datasets: [{
                data: [data.present, data.absent, data.holidays],
                backgroundColor: ['#4CAF50', '#f44336', '#FF9800'],
                borderColor: ['#4CAF50', '#f44336', '#FF9800'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Monthly Attendance'
                }
            }
        }
    });
}