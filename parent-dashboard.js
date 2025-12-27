// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'parent') {
    window.location.href = 'attendance.html';
}

// Display user info
document.getElementById('child-name').textContent = currentUser.childName;
document.getElementById('child-id').textContent = currentUser.childAdmissionNo;

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
    // Load child's attendance
    document.getElementById('child-attendance').textContent = '85%';
    document.getElementById('fees-status').textContent = 'Paid';
    document.getElementById('latest-grade').textContent = 'A';
}

function showSection(section) {
    const contentArea = document.getElementById('content-area');
    
    let content = '';
    switch(section) {
        case 'fees':
            content = `
                <div class="content-section active">
                    <h3>Fees Information</h3>
                    <div class="fees-summary">
                        <div class="fee-item">
                            <h4>Tuition Fee</h4>
                            <p>Amount: ₹5,000</p>
                            <p>Status: <span class="paid">Paid</span></p>
                            <p>Due Date: 15th of each month</p>
                        </div>
                        <div class="fee-item">
                            <h4>Transport Fee</h4>
                            <p>Amount: ₹1,500</p>
                            <p>Status: <span class="paid">Paid</span></p>
                            <p>Due Date: 15th of each month</p>
                        </div>
                        <div class="fee-item">
                            <h4>Examination Fee</h4>
                            <p>Amount: ₹800</p>
                            <p>Status: <span class="pending">Pending</span></p>
                            <p>Due Date: 10th January 2026</p>
                        </div>
                    </div>
                    <button class="btn">Pay Online</button>
                </div>
            `;
            break;
        case 'attendance':
            content = `
                <div class="content-section active">
                    <h3>Child's Monthly Attendance</h3>
                    <div class="attendance-overview">
                        <div class="attendance-stat">
                            <h4>Present Days</h4>
                            <span class="stat-number">24</span>
                        </div>
                        <div class="attendance-stat">
                            <h4>Absent Days</h4>
                            <span class="stat-number">3</span>
                        </div>
                        <div class="attendance-stat">
                            <h4>Holidays</h4>
                            <span class="stat-number">4</span>
                        </div>
                        <div class="attendance-stat">
                            <h4>Attendance %</h4>
                            <span class="stat-number">85%</span>
                        </div>
                    </div>
                    <button class="btn" onclick="window.location.href='student-data.html'">View Detailed Report</button>
                </div>
            `;
            break;
        case 'test-records':
            content = `
                <div class="content-section active">
                    <h3>Test Records</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Test Date</th>
                                <th>Subject</th>
                                <th>Marks</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>15th Nov 2025</td>
                                <td>Mathematics</td>
                                <td>85/100</td>
                                <td>A</td>
                            </tr>
                            <tr>
                                <td>20th Nov 2025</td>
                                <td>Physics</td>
                                <td>78/100</td>
                                <td>B+</td>
                            </tr>
                            <tr>
                                <td>25th Nov 2025</td>
                                <td>Chemistry</td>
                                <td>92/100</td>
                                <td>A+</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            break;
        case 'teachers':
            content = `
                <div class="content-section active">
                    <h3>Subject Teachers Contact</h3>
                    <div class="teachers-list">
                        <div class="teacher-card">
                            <h4>Mathematics</h4>
                            <p><strong>Mr. Sharma</strong></p>
                            <p>Phone: +91-9876543210</p>
                            <p>Email: sharma.math@rps.edu</p>
                        </div>
                        <div class="teacher-card">
                            <h4>Physics</h4>
                            <p><strong>Ms. Gupta</strong></p>
                            <p>Phone: +91-9876543211</p>
                            <p>Email: gupta.physics@rps.edu</p>
                        </div>
                        <div class="teacher-card">
                            <h4>Chemistry</h4>
                            <p><strong>Mr. Verma</strong></p>
                            <p>Phone: +91-9876543212</p>
                            <p>Email: verma.chemistry@rps.edu</p>
                        </div>
                        <div class="teacher-card">
                            <h4>English</h4>
                            <p><strong>Ms. Singh</strong></p>
                            <p>Phone: +91-9876543213</p>
                            <p>Email: singh.english@rps.edu</p>
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
                        <div class="announcement-item">
                            <h4>Fee Payment Reminder</h4>
                            <p>January fees are due by 15th January. Please make payment on time.</p>
                            <small>Posted: 1st January 2026</small>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'leave-status':
            content = `
                <div class="content-section active">
                    <h3>Leave Applications Status</h3>
                    <div class="leave-applications">
                        <div class="leave-item">
                            <h4>Medical Leave (10th-12th Dec)</h4>
                            <p>Reason: Fever</p>
                            <p>Status: <span class="approved">Approved</span></p>
                        </div>
                        <div class="leave-item">
                            <h4>Family Function (20th-22nd Dec)</h4>
                            <p>Reason: Marriage in family</p>
                            <p>Status: <span class="pending">Pending</span></p>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
    
    contentArea.innerHTML = content;
}