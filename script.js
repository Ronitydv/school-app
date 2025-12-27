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

let attendance = {};

const studentList = document.getElementById('student-list');
const submitBtn = document.getElementById('submit-btn');
const dateInput = document.getElementById('date');
const recordsDisplay = document.getElementById('records-display');
const holidayBtn = document.getElementById('holiday-btn');
const prevDayBtn = document.getElementById('prev-day');
const todayBtn = document.getElementById('today-btn');
const nextDayBtn = document.getElementById('next-day');
const manageStudentsBtn = document.getElementById('manage-students-btn');
const manageStudentsDiv = document.getElementById('manage-students');
const studentInputs = document.getElementById('student-inputs');
const saveStudentsBtn = document.getElementById('save-students-btn');
const cancelStudentsBtn = document.getElementById('cancel-students-btn');
const clearDataBtn = document.getElementById('clear-data-btn');

// Set default date to today
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

// Function to load attendance for the selected date
function loadAttendanceForDate() {
    const date = dateInput.value;
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    const holidays = JSON.parse(localStorage.getItem('holidays')) || [];
    const savedAttendance = records[date] || {};
    
    // Reset attendance
    attendance = {};
    students.forEach((_, index) => {
        attendance[index] = savedAttendance[index] || null;
    });
    
    // Update UI
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.animation = 'none';
    });
    
    Object.keys(savedAttendance).forEach(index => {
        const status = savedAttendance[index];
        if (status) {
            const btn = document.querySelector(`[data-student="${index}"].${status}`);
            if (btn) {
                btn.classList.add('selected');
            }
        }
    });

    // Handle holiday or past date
    const today = new Date().toISOString().split('T')[0];
    if (holidays.includes(date)) {
        document.getElementById('student-list').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'none';
        holidayBtn.disabled = true;
        if (!document.getElementById('holiday-message')) {
            const msg = document.createElement('p');
            msg.id = 'holiday-message';
            msg.textContent = 'This day is marked as a holiday. No attendance required.';
            msg.style.color = '#FF9800';
            msg.style.fontWeight = 'bold';
            msg.style.textAlign = 'center';
            document.querySelector('.attendance-list').appendChild(msg);
        }
        const pastMsg = document.getElementById('past-message');
        if (pastMsg) pastMsg.remove();
    } else if (date < today) {
        document.getElementById('student-list').style.display = 'grid';
        document.querySelectorAll('.status-btn').forEach(btn => btn.disabled = true);
        document.getElementById('submit-btn').style.display = 'none';
        holidayBtn.disabled = true;
        const holidayMsg = document.getElementById('holiday-message');
        if (holidayMsg) holidayMsg.remove();
        if (!document.getElementById('past-message')) {
            const msg = document.createElement('p');
            msg.id = 'past-message';
            msg.textContent = 'Past attendance cannot be edited.';
            msg.style.color = '#f44336';
            msg.style.fontWeight = 'bold';
            msg.style.textAlign = 'center';
            document.querySelector('.attendance-list').appendChild(msg);
        }
    } else {
        document.getElementById('student-list').style.display = 'grid';
        document.querySelectorAll('.status-btn').forEach(btn => btn.disabled = false);
        document.getElementById('submit-btn').style.display = 'block';
        holidayBtn.disabled = false;
        const holidayMsg = document.getElementById('holiday-message');
        if (holidayMsg) holidayMsg.remove();
        const pastMsg = document.getElementById('past-message');
        if (pastMsg) pastMsg.remove();
    }
}

// Load attendance for today
loadAttendanceForDate();

// Add event listener for date change
dateInput.addEventListener('change', loadAttendanceForDate);

// Holiday button
holidayBtn.addEventListener('click', () => {
    const date = dateInput.value;
    if (!date) {
        alert('Please select a date.');
        return;
    }
    if (confirm(`Mark ${date} as a holiday? This will remove any attendance data for this date.`)) {
        let holidays = JSON.parse(localStorage.getItem('holidays')) || [];
        if (!holidays.includes(date)) {
            holidays.push(date);
            localStorage.setItem('holidays', JSON.stringify(holidays));
        }
        // Remove any attendance for that date
        let records = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
        delete records[date];
        localStorage.setItem('attendanceRecords', JSON.stringify(records));
        // Reload
        loadAttendanceForDate();
        loadRecords();
    }
});

// Date navigation buttons
prevDayBtn.addEventListener('click', () => {
    const currentDate = new Date(dateInput.value || new Date());
    currentDate.setDate(currentDate.getDate() - 1);
    dateInput.value = currentDate.toISOString().split('T')[0];
    loadAttendanceForDate();
});

todayBtn.addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    loadAttendanceForDate();
});

nextDayBtn.addEventListener('click', () => {
    const currentDate = new Date(dateInput.value || new Date());
    currentDate.setDate(currentDate.getDate() + 1);
    dateInput.value = currentDate.toISOString().split('T')[0];
    loadAttendanceForDate();
});

// Manage students
manageStudentsBtn.addEventListener('click', () => {
    populateStudentInputs();
    manageStudentsDiv.style.display = 'block';
});

saveStudentsBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('#student-inputs input');
    const newStudents = Array.from(inputs).map(input => input.value.trim()).filter(name => name);
    if (newStudents.length === 0) {
        alert('Please enter at least one student name.');
        return;
    }
    students = newStudents;
    localStorage.setItem('students', JSON.stringify(students));
    manageStudentsDiv.style.display = 'none';
    // Reload the page to update everything
    location.reload();
});

cancelStudentsBtn.addEventListener('click', () => {
    manageStudentsDiv.style.display = 'none';
});

// Clear data
clearDataBtn.addEventListener('click', () => {
    const password = prompt('Enter password to clear all data:');
    if (password === 'admin123') {  // Default password
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
            localStorage.clear();
            alert('All data has been cleared.');
            location.reload();
        }
    } else {
        alert('Incorrect password.');
    }
});

function populateStudentInputs() {
    studentInputs.innerHTML = '';
    students.forEach((student, index) => {
        const div = document.createElement('div');
        div.className = 'student-input';
        div.innerHTML = `
            <label for="student-${index}">Student ${index + 1}:</label>
            <input type="text" id="student-${index}" value="${student}">
        `;
        studentInputs.appendChild(div);
    });
}

// Populate student list
students.forEach((student, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="student-name">${student}</span>
        <div class="status-buttons">
            <button class="status-btn present" data-student="${index}">Present</button>
            <button class="status-btn absent" data-student="${index}">Absent</button>
        </div>
    `;
    studentList.appendChild(li);
    attendance[index] = null; // null means not marked
});

// Add event listeners to buttons
document.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const studentIndex = this.dataset.student;
        const status = this.classList.contains('present') ? 'present' : 'absent';
        
        // Remove selected class from both buttons for this student and stop animations
        document.querySelectorAll(`[data-student="${studentIndex}"]`).forEach(b => {
            b.classList.remove('selected');
            b.style.animation = 'none';
        });
        
        // Add selected class to clicked button
        this.classList.add('selected');
        
        // Update attendance
        attendance[studentIndex] = status;
    });
});

// Submit attendance
submitBtn.addEventListener('click', () => {
    const date = dateInput.value;
    if (!date) {
        alert('Please select a date.');
        return;
    }
    
    // Check if all students are marked
    const unmarked = Object.values(attendance).some(status => status === null);
    if (unmarked) {
        alert('Please mark attendance for all students.');
        return;
    }
    
    // Save to localStorage
    let records = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    records[date] = attendance;
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
    
    // Animate submit button
    submitBtn.textContent = 'Submitted!';
    submitBtn.style.background = '#4CAF50';
    setTimeout(() => {
        submitBtn.textContent = 'Submit Attendance';
        submitBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }, 2000);
    
    // Reload records
    loadRecords();
});

// Load and display records
function loadRecords() {
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    const holidays = JSON.parse(localStorage.getItem('holidays')) || [];
    recordsDisplay.innerHTML = '';
    
    // Combine dates from records and holidays
    const allDates = new Set([...Object.keys(records), ...holidays]);
    
    Array.from(allDates).sort().reverse().forEach(date => {
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record-item';
        
        if (holidays.includes(date)) {
            recordDiv.innerHTML = `<h4>${date} - Holiday</h4><p>No attendance required.</p>`;
        } else {
            recordDiv.innerHTML = `<h4>${date}</h4>`;
            
            const attendanceData = records[date];
            const presentCount = Object.values(attendanceData).filter(status => status === 'present').length;
            const total = students.length;
            
            recordDiv.innerHTML += `<p>Present: ${presentCount}/${total}</p>`;
            
            const list = document.createElement('ul');
            students.forEach((student, index) => {
                const status = attendanceData[index];
                const li = document.createElement('li');
                li.textContent = `${student}: ${status}`;
                li.style.color = status === 'present' ? '#4CAF50' : '#f44336';
                list.appendChild(li);
            });
            
            recordDiv.appendChild(list);
        }
        recordsDisplay.appendChild(recordDiv);
    });
}

// Load records on page load
loadRecords();