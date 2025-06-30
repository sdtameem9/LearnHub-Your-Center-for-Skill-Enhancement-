import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Button, Navbar } from 'react-bootstrap';
import AllCourses from './AllCourses';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
        <Container fluid>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Navbar.Brand>
              <h2 className="fw-bold text-primary">LearnHub: Your Center for Skill Enhancement</h2>
            </Navbar.Brand>
          </motion.div>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll></Nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="d-flex gap-3"
            >
              <Link to={'/'} className="text-decoration-none text-dark">Home</Link>
              <Link to={'/login'} className="text-decoration-none text-dark">Login</Link>
              <Link to={'/register'} className="text-decoration-none text-dark">Register</Link>
            </motion.div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div id='home-container' className='first-container d-flex align-items-center justify-content-center' style={{ minHeight: '60vh' }}>
        <motion.div
          className="content-home text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="fs-3"
          >
            Small App, Big Dreams: <br /> <span className="text-primary">Elevating Your Education</span>
          </motion.p>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to={'/register'}>
              <Button variant='warning' className='m-2' size='md'>Explore Courses</Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <Container className="second-container my-5">
        <motion.h2
          className="text-center mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Trending Courses
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <AllCourses />
        </motion.div>
      </Container>
    </>
  );
};

export default Home;
