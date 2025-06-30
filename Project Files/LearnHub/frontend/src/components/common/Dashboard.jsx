import React, { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

import NavBar from './NavBar';
import UserHome from "./UserHome";
import AddCourse from '../user/teacher/AddCourse';
import StudentHome from '../user/student/StudentHome';
import AdminHome from '../admin/AdminHome';
import EnrolledCourses from '../user/student/EnrolledCourses';
import CourseContent from '../user/student/CourseContent';
import AllCourses from '../admin/AllCourses';
import { UserContext } from '../../App';

const Dashboard = () => {
  const user = useContext(UserContext);
  const [selectedComponent, setSelectedComponent] = useState('home');

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'home':
        return <UserHome />;
      case 'addcourse':
        return <AddCourse />;
      case 'enrolledcourse':
        return <EnrolledCourses />;
      case 'coursesection':
        return <CourseContent />;
      case 'courses':
        return <AllCourses />;
      default:
        return <UserHome />;
    }
  };

  return (
    <>
      <NavBar setSelectedComponent={setSelectedComponent} />
      <Container className="my-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderSelectedComponent()}
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  );
};

export default Dashboard;
