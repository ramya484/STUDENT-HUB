const exp = require('express');
const attendanceApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');

// Fetch daily attendance for a specific date
attendanceApp.get('/attendance/:date', expressAsyncHandler(async (req, res) => {
    const attendanceCollection = req.app.get('attendance_excelCollection');
    let date = req.params.date;

    // Add leading zeros if necessary (e.g., convert "1-09-24" to "01-09-24")
    const parts = date.split('-');
    if (parts[0].length === 1) parts[0] = '0' + parts[0]; // Pad day with leading zero
    date = parts.join('-');  // Rejoin the date string

    console.log("Requested date:", date);  // Log the formatted date for debugging

    try {
        // Query to find the attendance record for the specific date
        const attendanceData = await attendanceCollection.findOne({ _id: date });
        
        if (attendanceData) {
            res.send({ message: "Attendance for the day", data: attendanceData });
        } else {
            res.status(404).send({ message: `Attendance not found for the date: ${date}` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error fetching daily attendance", error: error.message });
    }
}));

// Fetch monthly attendance (cumulative for a specific month)
attendanceApp.get('/products/:month', expressAsyncHandler(async (req, res) => {
    const attendanceCollection = req.app.get('attendance_excelCollection');
    const month = req.params.month;  // The month passed in the URL (e.g., "09-24")

    try {
        // Query to find all attendance records for the specific month
        const attendanceRecords = await attendanceCollection.find({
            _id: { $regex: `.*-${month}$` } // Matches all records for the given month (e.g., "1-09-24", "2-09-24", etc.)
        }).toArray();

        if (attendanceRecords.length > 0) {
            // Cumulative attendance per student
            const cumulativeAttendance = {};

            attendanceRecords.forEach(record => {
                record[month].forEach(student => {
                    const rollNo = student.Rollo;
                    if (!cumulativeAttendance[rollNo]) {
                        cumulativeAttendance[rollNo] = { totalClasses: 0, attendedClasses: 0 };
                    }

                    // Sum attendance across all subjects
                    for (const [subject, attendance] of Object.entries(student)) {
                        if (subject !== 'Rollo') {
                            cumulativeAttendance[rollNo].totalClasses++;
                            if (attendance === 1) {
                                cumulativeAttendance[rollNo].attendedClasses++;
                            }
                        }
                    }
                });
            });

            res.send({ message: "Cumulative monthly attendance", data: cumulativeAttendance });
        } else {
            res.status(404).send({ message: `No attendance records found for the month: ${month}` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error fetching monthly attendance", error: error.message });
    }
}));

// Export the attendanceApp router
module.exports = attendanceApp;
