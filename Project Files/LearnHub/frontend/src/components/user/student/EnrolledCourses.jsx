import React, { useEffect, useState } from 'react';
import axiosInstance from '../../common/AxiosInstance';
import { Link } from 'react-router-dom';
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material';
import { motion } from 'framer-motion';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
   },
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));

const EnrolledCourses = () => {
   const [allEnrolledCourese, setAllEnrolledCourses] = useState([]);

   const allCourses = async () => {
      try {
         const res = await axiosInstance.get('api/user/getallcoursesuser', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         });
         if (res.data.success) {
            setAllEnrolledCourses(res.data.data);
         } else {
            alert(res.data.message);
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      allCourses();
   }, []);

   return (
      <motion.div
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: 'easeOut' }}
      >
         <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
               <TableHead>
                  <TableRow>
                     <StyledTableCell>Course ID</StyledTableCell>
                     <StyledTableCell align="left">Course Name</StyledTableCell>
                     <StyledTableCell align="left">Course Educator</StyledTableCell>
                     <StyledTableCell align="left">Course Category</StyledTableCell>
                     <StyledTableCell align="left">Action</StyledTableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {
                     allEnrolledCourese?.length > 0 ? (
                        allEnrolledCourese.map((course, index) => (
                           <motion.tr
                              key={course._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.4 }}
                           >
                              <StyledTableCell component="th" scope="row">
                                 {course._id}
                              </StyledTableCell>
                              <StyledTableCell>{course.C_title}</StyledTableCell>
                              <StyledTableCell>{course.C_educator}</StyledTableCell>
                              <StyledTableCell>{course.C_categories}</StyledTableCell>
                              <StyledTableCell>
                                 <Link to={`/courseSection/${course._id}/${course.C_title}`}>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                       <Button size="small" variant="contained" color="success">
                                          Go To
                                       </Button>
                                    </motion.div>
                                 </Link>
                              </StyledTableCell>
                           </motion.tr>
                        ))
                     ) : (
                        <motion.p
                           className="px-2"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           transition={{ duration: 0.5 }}
                           style={{ padding: '1rem', textAlign: 'center', color: 'gray' }}
                        >
                           You have not enrolled in any courses yet.
                        </motion.p>
                     )
                  }
               </TableBody>
            </Table>
         </TableContainer>
      </motion.div>
   );
};

export default EnrolledCourses;
