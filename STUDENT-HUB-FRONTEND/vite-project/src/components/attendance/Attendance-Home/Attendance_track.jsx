import React, { useState } from 'react';

function Attendance_track() {
  const [dailyAttendance, setDailyAttendance] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState(null);
  const [error, setError] = useState(null);

  // Fetch daily attendance for a specific date
  async function handleDailyAttendance() {
    const date = prompt('Enter the date (e.g., 1-09-24):');  // Ask user to enter the date
    if (!date) return;

    try {
      const response = await fetch(`http://localhost:4000/attendance-api/attendance/${date}`);
      const data = await response.json();

      if (response.ok) {
        setDailyAttendance(data.data);  // Update the state with daily attendance data
        setError(null); // Clear any errors
      } else {
        setError(data.message || 'Failed to fetch daily attendance.');
        setDailyAttendance(null);  // Clear previous attendance if error occurs
      }
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
      setError('An error occurred while fetching daily attendance.');
    }
  }

  // Fetch monthly attendance for a specific month
  async function handleMonthlyAttendance() {
    const month = prompt('Enter the month and year (e.g., 09-24):');  // Ask user to enter the month
    if (!month) return;

    try {
      const response = await fetch(`http://localhost:4000/attendance-api/products/${month}`);
      const data = await response.json();

      if (response.ok) {
        setMonthlyAttendance(data.data);  // Update the state with monthly attendance data
        setError(null); // Clear any errors
      } else {
        setError(data.message || 'Failed to fetch monthly attendance.');
        setMonthlyAttendance(null);  // Clear previous attendance if error occurs
      }
    } catch (error) {
      console.error('Error fetching monthly attendance:', error);
      setError('An error occurred while fetching monthly attendance.');
    }
  }

  return (
    <div>
      <h2>Welcome to the Attendance Portal</h2>
      <div className="button-card-row mt-3 row ">
        <div className='col-md-6 mb-4'>
          <div className="button-card card-light-pink p-2">
            <img src="https://ctl.mesacc.edu/wp-content/uploads/2022/10/syllabus.png" alt="" style={{ maxWidth: '300px', maxHeight: '300px' }} />
            <h4>Track my day attendance</h4>
            <p>Easily track your subjects, assignments, and academic goals in one place.</p>
            <div className="btn btn-custom" onClick={handleDailyAttendance}>Explore Academic Atlas</div>
          </div>
        </div>

        <div className='col-md-6 mb-4'>
          <div className="button-card card-light-pink p-2">
            <img src="https://www.thoughtco.com/thmb/mjTy33kvR48JJstO2uyujH-K8pE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/175426893-56a25a2a5f9b58b7d0c93cc1.jpg" alt="" style={{ maxWidth: '300px', maxHeight: '300px' }} />
            <h4>Track my monthly attendance</h4>
            <p>Easily track your subjects, assignments, and academic goals in one place.</p>
            <div className="btn btn-custom" onClick={handleMonthlyAttendance}>Explore Text Treasures</div>
          </div>
        </div>
      </div>

      {/* Display Daily Attendance */}
      {dailyAttendance && (
        <div className="attendance-result">
          <h3>Daily Attendance:</h3>
          <pre>{JSON.stringify(dailyAttendance, null, 2)}</pre>
        </div>
      )}

      {/* Display Monthly Attendance */}
      {monthlyAttendance && (
        <div className="attendance-result">
          <h3>Monthly Attendance:</h3>
          <pre>{JSON.stringify(monthlyAttendance, null, 2)}</pre>
        </div>
      )}

      {/* Display Error */}
      {error && (
        <div className="error-message">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default Attendance_track;
