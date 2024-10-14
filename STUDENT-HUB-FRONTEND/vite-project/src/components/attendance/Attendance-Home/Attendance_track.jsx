import React, { useState, useContext } from 'react';
import { userLoginContext } from '../../../context/usercontext';

function Attendance_track() {
  const [formData, setFormData] = useState({ date: '', month: '' });
  const [dailyAttendance, setDailyAttendance] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(userLoginContext); // Accessing the current user's context

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch daily attendance for a specific date
  async function handleDailyAttendance() {
    const date = formData.date;

    if (!date) {
      setError('Please select a valid date.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/attendance-api/attendance/${currentUser.studentID}/${date}`);
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

  // Fetch cumulative monthly attendance for a specific month
  async function handleMonthlyAttendance() {
    const month = formData.month;  // User will input the month (MM-YY format)

    if (!month) {
      setError('Please enter a valid month.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/attendance-api/attendance/${currentUser.studentID}/${month}`);
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

  // Render Daily Attendance in the specified format
  const renderDailyAttendance = () => {
    if (!dailyAttendance) return null;

    return (
      <div className="attendance-result">
        <h3>Daily Attendance:</h3>
        {dailyAttendance.attendanceDetails.map((detail, index) => (
          <div key={index}>
            <strong>Date: {detail.date}</strong>
            <ul>
              {Object.entries(detail.subjects).map(([subject, status]) => (
                <li key={subject}>
                  {subject}: {status === 1 ? 'Present' : 'Absent'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  // Render Cumulative Monthly Attendance in the specified format
  const renderMonthlyAttendance = () => {
    if (!monthlyAttendance) return null;

    return (
      <div className="attendance-result">
        <h3>Cumulative Monthly Attendance:</h3>
        <ul>
          {Object.entries(monthlyAttendance.attendanceSummary).map(([subject, { attended, total }]) => (
            <li key={subject}>
              {subject}: {attended}/{total} classes attended
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h2>Welcome to the Attendance Portal</h2>
      
      <div className="button-card-row mt-3 row">
        {/* Fetch Daily Attendance Card */}
        <div className='col-md-6 mb-4'>
          <div className="button-card card-light-pink p-2">
            <h3>Fetch Daily Attendance</h3>
            <label>
              Select a date:
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleInputChange} 
              />
            </label>
            <div className="btn btn-custom mt-2" onClick={handleDailyAttendance}>Get Daily Attendance</div>
          </div>
        </div>

        {/* Fetch Monthly Attendance Card */}
        <div className='col-md-6 mb-4'>
          <div className="button-card card-light-pink p-2">
            <h3>Fetch Monthly Attendance</h3>
            <label>
              Enter Month (MM-YY):
              <input 
                type="text" 
                name="month" 
                value={formData.month} 
                onChange={handleInputChange} 
                placeholder="MM-YY"
              />
            </label>
            <div className="btn btn-custom mt-2" onClick={handleMonthlyAttendance}>Get Monthly Attendance</div>
          </div>
        </div>
      </div>

      {/* Display Daily Attendance */}
      {renderDailyAttendance()}

      {/* Display Monthly Attendance */}
      {renderMonthlyAttendance()}

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
