import React, { useState, useContext } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { UserContext } from '../../../App';
import axiosInstance from '../../common/AxiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

const AddCourse = () => {
   const user = useContext(UserContext);
   const [addCourse, setAddCourse] = useState({
      userId: user.userData._id,
      C_educator: '',
      C_title: '',
      C_categories: '',
      C_price: '',
      C_description: '',
      sections: [],
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setAddCourse({ ...addCourse, [name]: value });
   };

   const handleCourseTypeChange = (e) => {
      setAddCourse({ ...addCourse, C_categories: e.target.value });
   };

   const addInputGroup = () => {
      setAddCourse({
         ...addCourse,
         sections: [
            ...addCourse.sections,
            {
               S_title: '',
               S_description: '',
               S_content: null,
            },
         ],
      });
   };

   const handleChangeSection = (index, e) => {
      const updatedSections = [...addCourse.sections];
      const sectionToUpdate = updatedSections[index];

      if (e.target.name.endsWith('S_content')) {
         sectionToUpdate.S_content = e.target.files[0];
      } else {
         sectionToUpdate[e.target.name] = e.target.value;
      }

      setAddCourse({ ...addCourse, sections: updatedSections });
   };

   const removeInputGroup = (index) => {
      const updatedSections = [...addCourse.sections];
      updatedSections.splice(index, 1);
      setAddCourse({
         ...addCourse,
         sections: updatedSections,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      Object.keys(addCourse).forEach((key) => {
         if (key === 'sections') {
            addCourse[key].forEach((section, index) => {
               if (section.S_content instanceof File) {
                  formData.append(`S_content`, section.S_content);
               }
               formData.append(`S_title`, section.S_title);
               formData.append(`S_description`, section.S_description);
            });
         } else {
            formData.append(key, addCourse[key]);
         }
      });

      try {
         const res = await axiosInstance.post('/api/user/addcourse', formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               'Content-Type': 'multipart/form-data',
            },
         });

         if (res.status === 201) {
            alert(res.data.success ? res.data.message : 'Failed to create course');
         } else {
            alert('Unexpected response status: ' + res.status);
         }
      } catch (error) {
         console.error('An error occurred:', error);
         alert('An error occurred while creating the course, only .mp4 videos can be uploaded');
      }
   };

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="p-3"
      >
         <Form className="mb-3" onSubmit={handleSubmit}>
            <Row className="mb-3">
               <Form.Group as={Col} controlId="formGridJobType">
                  <Form.Label>Course Type</Form.Label>
                  <Form.Select value={addCourse.C_categories} onChange={handleCourseTypeChange}>
                     <option>Select categories</option>
                     <option>IT & Software</option>
                     <option>Finance & Accounting</option>
                     <option>Personal Development</option>
                  </Form.Select>
               </Form.Group>
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control name='C_title' value={addCourse.C_title} onChange={handleChange} type="text" placeholder="Enter Course Title" required />
               </Form.Group>
            </Row>

            <Row className="mb-3">
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Educator</Form.Label>
                  <Form.Control name='C_educator' value={addCourse.C_educator} onChange={handleChange} type="text" placeholder="Enter Course Educator" required />
               </Form.Group>
               <Form.Group as={Col} controlId="formGridTitle">
                  <Form.Label>Course Price(Rs.)</Form.Label>
                  <Form.Control name='C_price' value={addCourse.C_price} onChange={handleChange} type="text" placeholder="For free course, enter 0" required />
               </Form.Group>
               <Form.Group as={Col} className="mb-3" controlId="formGridAddress2">
                  <Form.Label>Course Description</Form.Label>
                  <Form.Control name='C_description' value={addCourse.C_description} onChange={handleChange} required as="textarea" placeholder="Enter Course description" />
               </Form.Group>
            </Row>

            <hr />

            <AnimatePresence>
               {addCourse.sections.map((section, index) => (
                  <motion.div
                     key={index}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ duration: 0.3 }}
                     className="d-flex flex-column mb-4 border rounded-3 border-3 p-3 position-relative shadow-sm"
                  >
                     <Col xs={24} md={12} lg={8}>
                        <motion.span
                           whileHover={{ scale: 1.2, rotate: 20 }}
                           whileTap={{ scale: 0.8, rotate: -20 }}
                           style={{ cursor: 'pointer' }}
                           className="position-absolute top-0 end-0 p-1 text-danger fw-bold"
                           onClick={() => removeInputGroup(index)}
                        >
                           ❌
                        </motion.span>
                     </Col>
                     <Row className='mb-3'>
                        <Form.Group as={Col} controlId="formGridTitle">
                           <Form.Label>Section Title</Form.Label>
                           <Form.Control
                              name={`S_title`}
                              value={section.S_title}
                              onChange={(e) => handleChangeSection(index, e)}
                              type="text"
                              placeholder="Enter Section Title"
                              required
                           />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridContent">
                           <Form.Label>Section Content (Video or Image)</Form.Label>
                           <Form.Control
                              name={`S_content`}
                              onChange={(e) => handleChangeSection(index, e)}
                              type="file"
                              accept="video/*,image/*"
                              required
                           />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGridAddress2">
                           <Form.Label>Section Description</Form.Label>
                           <Form.Control
                              name={`S_description`}
                              value={section.S_description}
                              onChange={(e) => handleChangeSection(index, e)}
                              required
                              as="textarea"
                              placeholder="Enter Section description"
                           />
                        </Form.Group>
                     </Row>
                  </motion.div>
               ))}
            </AnimatePresence>

            <Row className="mb-3">
               <Col xs={24} md={12} lg={8}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                     <Button size="sm" variant="outline-secondary" onClick={addInputGroup}>
                        ➕ Add Section
                     </Button>
                  </motion.div>
               </Col>
            </Row>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <Button variant="primary" type="submit">
                  Submit
               </Button>
            </motion.div>
         </Form>
      </motion.div>
   );
};

export default AddCourse;
