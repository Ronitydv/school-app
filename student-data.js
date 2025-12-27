let students = JSON.parse(localStorage.getItem('students')) || [
    "Aarav Sharma", "Vihaan Gupta", "Arjun Singh", "Reyansh Patel", "Ishaan Kumar",
    "Advik Jain", "Arnav Agarwal", "Kabir Verma", "Anaya Mishra", "Diya Choudhary",
    "Saanvi Rao", "Aadhya Iyer", "Pari Kapoor", "Zara Khan", "Myra Saxena",
    "Aryan Joshi", "Rudra Malhotra", "Veer Chauhan", "Kian Bansal", "Arush Tiwari",
    "Nisha Pandey", "Riya Shah", "Anika Roy", "Kavya Nair", "Sara Gill",
    "Tara Mehta", "Maya Das", "Lila Bose", "Naina Sen", "Rhea Chakraborty",
    "Amit Kumar", "Priya Singh", "Rahul Verma", "Sneha Gupta", "Vikram Patel",
    "Anjali Sharma", "Rohit Jain", "Kavita Agarwal", "Suresh Khan", "Meera Saxena",
    "Rajesh Joshi", "Sunita Malhotra", "Deepak Chauhan", "Poonam Bansal", "Manoj Tiwari",
    "Rekha Pandey", "Alok Shah"
];

const studentSearch = document.getElementById('student-search');
const studentsList = document.getElementById('students-list');
const studentInfo = document.getElementById('student-info');
const studentNameEl = document.getElementById('student-name');
const monthlySummary = document.getElementById('monthly-summary');
const attendanceList = document.getElementById('attendance-list');
const ctx = document.getElementById('attendance-chart').getContext('2d');

let chart;

// Populate datalist
students.forEach(student => {
    const option = document.createElement('option');
    option.value = student;
    studentsList.appendChild(option);
});

// Function to get current month dates
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

// Function to calculate monthly attendance
function calculateMonthlyAttendance(studentIndex) {
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    const holidays = JSON.parse(localStorage.getItem('holidays')) || [];
    const monthDates = getCurrentMonthDates();
    let present = 0;
    let absent = 0;
    let holidaysCount = 0;
    const attendanceDetails = [];

    monthDates.forEach(date => {
        if (holidays.includes(date)) {
            holidaysCount++;
            attendanceDetails.push({ date, status: 'Holiday' });
        } else {
            const dayAttendance = records[date];
            if (dayAttendance && dayAttendance[studentIndex] !== undefined) {
                const status = dayAttendance[studentIndex];
                if (status === 'present') {
                    present++;
                    attendanceDetails.push({ date, status: 'Present' });
                } else if (status === 'absent') {
                    absent++;
                    attendanceDetails.push({ date, status: 'Absent' });
                }
            } else {
                attendanceDetails.push({ date, status: 'Not Marked' });
            }
        }
    });

    return { present, absent, holidays: holidaysCount, total: present + absent, details: attendanceDetails };
}

// Function to display student data
function displayStudentData(studentName, data) {
    studentNameEl.textContent = studentName;
    const percentage = data.total > 0 ? ((data.present / data.total) * 100).toFixed(1) : 0;
    monthlySummary.textContent = `Present: ${data.present}, Absent: ${data.absent}, Holidays: ${data.holidays}, Attendance: ${percentage}%`;

    // Update chart
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
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
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Monthly Attendance'
                }
            }
        }
    });

    // Update attendance list
    attendanceList.innerHTML = '';
    data.details.forEach(detail => {
        const li = document.createElement('li');
        li.textContent = `${detail.date}: ${detail.status}`;
        if (detail.status === 'Present') {
            li.style.color = '#4CAF50';
        } else if (detail.status === 'Absent') {
            li.style.color = '#f44336';
        } else if (detail.status === 'Holiday') {
            li.style.color = '#FF9800';
        } else {
            li.style.color = '#999';
        }
        attendanceList.appendChild(li);
    });

    studentInfo.style.display = 'block';
}

// Event listener for search
studentSearch.addEventListener('input', function() {
    const studentName = this.value;
    const studentIndex = students.indexOf(studentName);
    if (studentIndex !== -1) {
        const data = calculateMonthlyAttendance(studentIndex);
        displayStudentData(studentName, data);
    } else {
        studentInfo.style.display = 'none';
    }
});