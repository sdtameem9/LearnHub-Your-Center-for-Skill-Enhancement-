import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './AxiosInstance';
import { Button, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import { MDBCol, MDBInput, MDBRow } from "mdb-react-ui-kit";
import { motion } from 'framer-motion';

const AllCourses = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [allCourses, setAllCourses] = useState([]);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState([]);
  const [cardDetails, setCardDetails] = useState({
    cardholdername: '',
    cardnumber: '',
    cvvcode: '',
    expmonthyear: '',
  });

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleShow = (courseIndex, coursePrice, courseId, courseTitle) => {
    if (coursePrice === 'free') {
      handleSubmit(courseId);
      return navigate(`/courseSection/${courseId}/${courseTitle}`);
    }
    const updatedShowModal = [...showModal];
    updatedShowModal[courseIndex] = true;
    setShowModal(updatedShowModal);
  };

  const handleClose = (courseIndex) => {
    const updatedShowModal = [...showModal];
    updatedShowModal[courseIndex] = false;
    setShowModal(updatedShowModal);
  };

  const getAllCoursesUser = async () => {
    try {
      const res = await axiosInstance.get(`api/user/getallcourses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setAllCourses(res.data.data);
        setShowModal(Array(res.data.data.length).fill(false));
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  useEffect(() => {
    getAllCoursesUser();
  }, []);

  const isPaidCourse = (course) => /\d/.test(course.C_price);

  const handleSubmit = async (courseId) => {
    try {
      const res = await axiosInstance.post(`api/user/enrolledcourse/${courseId}`, cardDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert(res.data.message);
      navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  return (
    <>
      <div className="mt-4 text-center">
        <p className="mt-3">Search By:</p>
        <input
          className="m-1 p-1 rounded border"
          type="text"
          placeholder="Title"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
        />
        <select
          className="m-1 p-1 rounded border"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Courses</option>
          <option value="Paid">Paid</option>
          <option value="Free">Free</option>
        </select>
      </div>

      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allCourses?.length > 0 ? (
          allCourses
            .filter(
              (course) =>
                filterTitle === '' ||
                course.C_title?.toLowerCase().includes(filterTitle.toLowerCase())
            )
            .filter((course) =>
              filterType === 'Free'
                ? !isPaidCourse(course)
                : filterType === 'Paid'
                ? isPaidCourse(course)
                : true
            )
            .map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-2xl transform hover:scale-105 transition"
              >
                <div className="p-4">
                  <h2 className="text-lg font-bold">{course.C_title}</h2>
                  <p className="text-sm text-gray-500">{course.C_categories}</p>
                  <p className="text-xs">by {course.C_educator}</p>
                  <p className="mt-2">Sections: {course.sections.length}</p>
                  <p>Price (Rs.): {course.C_price}</p>
                  <p>Enrolled: {course.enrolled}</p>

                  <motion.div whileHover={{ scale: 1.05 }} className="mt-2">
                    {user.userLoggedIn ? (
                      <>
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => handleShow(index, course.C_price, course._id, course.C_title)}
                        >
                          Start Course
                        </Button>
                        <Modal show={showModal[index]} onHide={() => handleClose(index)} centered>
                          <Modal.Header closeButton>
                            <Modal.Title>Payment for {course.C_title}</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <p>Educator: {course.C_educator}</p>
                            <p>Price: {course.C_price}</p>
                            <Form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(course._id);
                              }}
                            >
                              <MDBInput
                                className="mb-2"
                                label="Card Holder Name"
                                name="cardholdername"
                                value={cardDetails.cardholdername}
                                onChange={handleChange}
                                type="text"
                                placeholder="Cardholder's Name"
                                required
                              />
                              <MDBInput
                                className="mb-2"
                                label="Card Number"
                                name="cardnumber"
                                value={cardDetails.cardnumber}
                                onChange={handleChange}
                                type="number"
                                placeholder="1234 5678 9012 3457"
                                required
                              />
                              <MDBRow className="mb-2">
                                <MDBCol md="6">
                                  <MDBInput
                                    label="Expiration"
                                    name="expmonthyear"
                                    value={cardDetails.expmonthyear}
                                    onChange={handleChange}
                                    placeholder="MM/YYYY"
                                    required
                                  />
                                </MDBCol>
                                <MDBCol md="6">
                                  <MDBInput
                                    label="CVV"
                                    name="cvvcode"
                                    value={cardDetails.cvvcode}
                                    onChange={handleChange}
                                    type="number"
                                    placeholder="123"
                                    required
                                  />
                                </MDBCol>
                              </MDBRow>
                              <div className="d-flex justify-content-end">
                                <Button variant="secondary" className="mx-2" onClick={() => handleClose(index)}>
                                  Close
                                </Button>
                                <Button type="submit" variant="primary">
                                  Pay Now
                                </Button>
                              </div>
                            </Form>
                          </Modal.Body>
                        </Modal>
                      </>
                    ) : (
                      <Link to="/login">
                        <Button variant="outline-dark" size="sm">
                          Start Course
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))
        ) : (
          <p className="text-center col-span-full">No courses at the moment</p>
        )}
      </div>
    </>
  );
};

export default AllCourses;
