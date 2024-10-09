import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import RootLayout from "./components/RootLayout";
import Home from "./components/home/Home";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import AboutUs from "./components/about-us/AboutUs";
import UserLoginStore from "./context/Userstore"; 
import Routingerror from "./components/Routingerror";
import Curriculu_home from "./components/curriculum/Curriculum_home/Curriculum_home";
import Syllabus from "./components/curriculum/syllabus/Syllabus";
import Textbooks from "./components/curriculum/Textbooks/Textbooks";
import Attendance_track from "./components/attendance/Attendance_home/Attendance_track";
import Myattendance from "./components/attendance/Myattendance/Myattendance";
import Notes_track from "./components/notes/Notes_home/Notes_track";
import Mynotes from "./components/notes/Mynotes/Mynotes";
import User_profile from "./components/user_profile/User_profile";
import Dashboard from "./components/dashboard/Dashboard";


function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement:<Routingerror />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />, 
        },
        {
          path: "about",
          element: <AboutUs />,
        },
        {
          path: "curriculum_track",
          element:<Curriculu_home />,
        },
        {
          path:"syllabus",
          element:<Syllabus />,
         },
         {
          path:"Textbooks",
          element:<Textbooks />,
         },
        {
          path:"attendance",
          element:<Attendance_track />,
        },
        {
         path:"myattendance",
         element:<Myattendance />,
        },
        {
          path:"notes",
          element:<Notes_track />,
        },
        {
         path:"mynote",
         element:<Mynotes />,
        },
        {
          path:"user+profile",
          element:<User_profile />,
        },
        {
          path:"dashboard",
          element:<Dashboard />,
        },
      ],
    },
  ]);

  return (
    <UserLoginStore>
      <div className="main">
        <RouterProvider router={browserRouter} />
      </div>
    </UserLoginStore>
  );
}

export default App;
