import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosInstance from './AxiosInstance';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data?.email || !data?.password) {
      return alert('Please fill all fields');
    } else {
      axiosInstance
        .post('/api/user/login', data)
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.userData));
            navigate('/dashboard');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            alert("User doesn't exist");
          }
          navigate('/login');
        });
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
        <Container fluid>
          <Navbar.Brand>
            <h2>LearnHub: Your Center for Skill Enhancement</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto" navbarScroll />
            <Nav>
              <Link className="nav-link" to={'/'}>
                Home
              </Link>
              <Link className="nav-link" to={'/login'}>
                Login
              </Link>
              <Link className="nav-link" to={'/register'}>
                Register
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container
        component="main"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              p: 4,
              background: '#f9fafb',
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }} />
            </motion.div>

            <Typography component="h1" variant="h5" mt={1}>
              Sign In
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <motion.div whileFocus={{ scale: 1.02 }} whileHover={{ scale: 1.02 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  autoComplete="email"
                  autoFocus
                />
              </motion.div>
              <motion.div whileFocus={{ scale: 1.02 }} whileHover={{ scale: 1.02 }}>
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
              </motion.div>
              <Box mt={3}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button type="submit" variant="contained" fullWidth sx={{ py: 1.5 }}>
                    Sign In
                  </Button>
                </motion.div>
              </Box>

              <Grid container mt={2} justifyContent="center">
                <Grid item>
                  Have an account?{' '}
                  <Link style={{ color: 'blue' }} to={'/register'}>
                    Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </>
  );
};

export default Login;
