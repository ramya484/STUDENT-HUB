const exp = require('express');
const attendanceApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');

// Fetch daily attendance for a specific date
attendanceApp.get('/attendance/:roll_no/:date', expressAsyncHandler(async (req, res) => {
    const attendanceCollection = req.app.get('attendance_excelCollection');
    const { date, roll_no } = req.params;

    // Convert from YYYY-MM-DD to DD-MM-YYYY format
    const parts = date.split('-');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // Reformat date to DD-MM-YYYY

    console.log("Requested date (formatted):", formattedDate);  // Log the formatted date

    try {
        // Query to find the attendance record for the specific date and roll number
        const attendanceData = await attendanceCollection.findOne({
            "days.date": formattedDate, // Match the date field in the 'days' array
            "days.attendance.roll_no": roll_no // Match the roll_no in the 'attendance' array
        });

        if (attendanceData) {
            const dailyAttendance = attendanceData.days.find(day => day.date === formattedDate);
            if (dailyAttendance) {
                const userAttendance = dailyAttendance.attendance.find(a => a.roll_no === roll_no);
                if (userAttendance) {
                    res.send({ message: "Attendance for the day", data: userAttendance });
                } else {
                    res.status(404).send({ message: `Attendance not found for roll number: ${roll_no} on date: ${formattedDate}` });
                }
            } else {
                res.status(404).send({ message: `No attendance data for the date: ${formattedDate}` });
            }
        } else {
            res.status(404).send({ message: `Attendance not found for the date: ${formattedDate}` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error fetching daily attendance", error: error.message });
    }
}));

function convertMonthFormat(month) {
    const [mm, yyyy] = month.split('-'); // Split into month and year
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const monthIndex = parseInt(mm, 10) - 1; // Convert to zero-based index
    return `${monthNames[monthIndex]} ${yyyy}`; // Return the formatted month
}


// Fetch monthly attendance (cumulative for a specific month)
attendanceApp.get('/attendance/:roll_no/:month', expressAsyncHandler(async (req, res) => {
    const attendanceCollection = req.app.get('attendance_excelCollection');
    const { month, roll_no } = req.params;  // The month passed in the URL (e.g., "09-2024")

    // Convert month format from MM-YYYY to "MMMM YYYY"
    const formattedMonth = convertMonthFormat(month);

    try {
        // Query to find all attendance records for the specific month
        const attendanceRecords = await attendanceCollection.find({
            month: formattedMonth // Match the month field in the database
        }).toArray();

        if (attendanceRecords.length > 0) {
            // Initialize an object to hold attendance data for the specific roll number
            const studentAttendance = {
                roll_no: roll_no,
                totalClasses: 0,
                attendedClasses: 0,
                attendanceDetails: [] // Array to hold attendance details for each day
            };

            attendanceRecords.forEach(record => {
                record.days.forEach(day => {
                    // Check if attendance exists for the specific roll number
                    const studentRecord = day.attendance.find(student => student.roll_no === roll_no);
                    if (studentRecord) {
                        // Add the daily attendance record to the attendance details
                        studentAttendance.attendanceDetails.push({
                            date: day.date,
                            subjects: studentRecord.subjects // Include subject attendance
                        });

                        // Sum attendance across all subjects for the specific student
                        for (const [subject, attendance] of Object.entries(studentRecord.subjects)) {
                            studentAttendance.totalClasses++; // Increment total classes
                            if (attendance === 1) {
                                studentAttendance.attendedClasses++; // Increment attended classes if marked present
                            }
                        }
                    }
                });
            });

            // Check if there are attendance details for the student
            if (studentAttendance.attendanceDetails.length > 0) {
                res.send({ 
                    message: "Attendance for the student for the month", 
                    data: studentAttendance 
                });
            } else {
                res.status(404).send({ message: `No attendance records found for roll number: ${roll_no} for the month: ${formattedMonth}` });
            }
        } else {
            res.status(404).send({ message: `No attendance records found for the month: ${formattedMonth}` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error fetching monthly attendance", error: error.message });
    }
}));


module.exports = attendanceApp;
