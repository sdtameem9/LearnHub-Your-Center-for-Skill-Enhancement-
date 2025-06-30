import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosInstance from './AxiosInstance';
import Dropdown from 'react-bootstrap/Dropdown';

const Register = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('Select User');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    type: '',
  });

  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
    setData({ ...data, type: eventKey });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.name || !data?.email || !data?.password || !data?.type) {
      return alert('Please fill all fields');
    } else {
      axiosInstance
        .post('/api/user/register', data)
        .then((response) => {
          if (response.data.success) {
            alert(response.data.message);
            navigate('/login');
          } else {
            console.log(response.data.message);
          }
        })
        .catch((error) => {
          console.log('Error', error);
        });
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              LearnHub: Your Center for Skill Enhancement
            </motion.h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll></Nav>
            <Nav>
              {['/', '/login', '/register'].map((path, idx) => (
                <motion.div
                  whileHover={{ scale: 1.1, color: '#007bff' }}
                  key={idx}
                  style={{ margin: '0 8px' }}
                >
                  <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {path === '/' ? 'Home' : path === '/login' ? 'Login' : 'Register'}
                  </Link>
                </motion.div>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container component="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            marginTop: '3rem',
            marginBottom: '2rem',
            padding: '20px',
            background: '#f4f5fa',
            border: '1px solid lightblue',
            borderRadius: '10px',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ bgcolor: 'secondary.main' }} />
            <Typography component="h1" variant="h5" mt={1}>
              Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={data.name}
                onChange={handleChange}
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={data.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                value={data.password}
                onChange={handleChange}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              <Dropdown className="my-3">
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                  {selectedOption}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSelect('Student')}>Student</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSelect('Teacher')}>Teacher</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Box mt={2} display="flex" justifyContent="center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }} style={{ width: '200px' }}>
                    Sign Up
                  </Button>
                </motion.div>
              </Box>

              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="body2">
                    Have an account?{' '}
                    <Link style={{ color: 'blue' }} to={'/login'}>
                      Sign In
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </>
  );
};

export default Register;
