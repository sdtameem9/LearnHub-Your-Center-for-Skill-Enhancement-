import React from 'react';
import AllCourses from '../../common/AllCourses';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';

const StudentHome = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}         // start off-screen & invisible
      animate={{ opacity: 1, y: 0 }}          // fade in + slide up
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Container
        fluid
        className="py-4"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-4"
        >
          Welcome to Your Courses
        </motion.h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3 } }
          }}
        >
          <AllCourses />
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default StudentHome;
