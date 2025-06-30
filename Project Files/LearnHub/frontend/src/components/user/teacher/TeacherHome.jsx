import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axiosInstance from '../../common/AxiosInstance';

const TeacherHome = () => {
  const [allCourses, setAllCourses] = useState([]);

  const getAllCoursesUser = async () => {
    try {
      const res = await axiosInstance.get(`api/user/getallcoursesteacher`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setAllCourses(res.data.data);
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  useEffect(() => {
    getAllCoursesUser();
  }, []);

  const toggleDescription = (courseId) => {
    setAllCourses((prevCourses) =>
      prevCourses.map((course) =>
        course._id === courseId
          ? { ...course, showFullDescription: !course.showFullDescription }
          : course
      )
    );
  };

  const deleteCourse = async (courseId) => {
    const confirmation = confirm('Are you sure you want to delete?');
    if (!confirmation) return;

    try {
      const res = await axiosInstance.delete(`api/user/deletecourse/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        alert(res.data.message);
        getAllCoursesUser();
      } else {
        alert("Failed to delete the course");
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  return (
    <Container className="py-4">
      <Row className="g-4">
        {allCourses?.length > 0 ? (
          allCourses.map((course) => (
            <Col key={course._id} md={6} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-sm border-0 rounded-3">
                  <Card.Body>
                    <Card.Title className="fw-bold">{course.C_title}</Card.Title>
                    <Card.Text>
                      <p>
                        <strong>Description: </strong>
                        {course.showFullDescription
                          ? course.C_description
                          : `${course.C_description.slice(0, 10)}...`}{' '}
                        {course.C_description.length > 10 && (
                          <motion.span
                            className="text-primary"
                            style={{ cursor: 'pointer' }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => toggleDescription(course._id)}
                          >
                            {course.showFullDescription ? 'Read Less' : 'Read More'}
                          </motion.span>
                        )}
                      </p>
                      <p>
                        <strong>Category: </strong>
                        {course.C_categories}
                      </p>
                      <p>
                        <strong>Sections: </strong> {course.sections.length}
                      </p>
                      <p className="text-muted">
                        <strong>Enrolled students: </strong> {course.enrolled}
                      </p>
                    </Card.Text>
                    <motion.div whileTap={{ scale: 0.9 }} className="text-end">
                      <Button variant="danger" onClick={() => deleteCourse(course._id)}>
                        Delete
                      </Button>
                    </motion.div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))
        ) : (
          <div className="text-center text-muted">No courses found!!</div>
        )}
      </Row>
    </Container>
  );
};

export default TeacherHome;
