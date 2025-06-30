import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, Modal } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';
import ReactPlayer from 'react-player';
import { UserContext } from '../../../App';
import NavBar from '../../common/NavBar';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const CourseContent = () => {
  const user = useContext(UserContext);
  const { courseId, courseTitle } = useParams();
  const [courseContent, setCourseContent] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playingSectionIndex, setPlayingSectionIndex] = useState(-1);
  const [completedSections, setCompletedSections] = useState([]);
  const [completedModule, setCompletedModule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [certificate, setCertificate] = useState(null);

  const completedModuleIds = completedModule.map((item) => item.sectionId);

  const downloadPdfDocument = (rootElementId) => {
    const input = document.getElementById(rootElementId);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'JPEG', -35, 10);
      pdf.save('download-certificate.pdf');
    });
  };

  const getCourseContent = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/coursecontent/${courseId}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        setCourseContent(res.data.courseContent);
        setCompletedModule(res.data.completeModule);
        setCertificate(res.data.certficateData.updatedAt);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { getCourseContent(); }, [courseId]);

  const playVideo = (videoPath, index) => {
    setCurrentVideo(videoPath);
    setPlayingSectionIndex(index);
  };

  const completeModule = async (sectionId) => {
    if (completedModule.length < courseContent.length) {
      if (playingSectionIndex !== -1 && !completedSections.includes(playingSectionIndex)) {
        setCompletedSections([...completedSections, playingSectionIndex]);
        try {
          const res = await axiosInstance.post(`api/user/completemodule`, { courseId, sectionId }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.data.success) {
            alert(res.data.message);
            getCourseContent();
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <NavBar />
      <motion.h1
        className='my-3 text-center'
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
      >
        Welcome to the course: {courseTitle}
      </motion.h1>

      <div className='course-content d-flex flex-wrap gap-4 justify-content-center'>
        <motion.div 
          className="course-section"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        >
          <Accordion defaultActiveKey="0" flush>
            {courseContent.map((section, index) => {
              const sectionId = index;
              const isSectionCompleted = !completedModuleIds.includes(sectionId);

              return (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Accordion.Item eventKey={index.toString()}>
                    <Accordion.Header>{section.S_title}</Accordion.Header>
                    <Accordion.Body>
                      {section.S_description}
                      {section.S_content && (
                        <>
                          <Button color='success' className='mx-2' variant="text" size="small"
                            onClick={() => playVideo(`http://localhost:8000${section.S_content.path}`, index)}
                          >
                            Play Video
                          </Button>
                          {isSectionCompleted && !completedSections.includes(index) && (
                            <Button
                              variant='contained'
                              color='success'
                              size='small'
                              onClick={() => completeModule(sectionId)}
                              disabled={playingSectionIndex !== index}
                            >
                              Mark as Completed
                            </Button>
                          )}
                        </>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </motion.div>
              );
            })}
            {completedModule.length === courseContent.length && (
              <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
                <Button className='my-2' variant='outlined' onClick={() => setShowModal(true)}>
                  Download Certificate
                </Button>
              </motion.div>
            )}
          </Accordion>
        </motion.div>

        <motion.div 
          className="course-video w-50"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1 }}
        >
          {currentVideo && (
            <ReactPlayer
              url={currentVideo}
              width='100%'
              height='100%'
              controls
            />
          )}
        </motion.div>
      </div>

      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Completion Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <motion.div
            id='certificate-download'
            className="certificate text-center"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            <h1>Certificate of Completion</h1>
            <div className="content">
              <p>This is to certify that</p>
              <h2>{user.userData.name}</h2>
              <p>has successfully completed the course</p>
              <h3>{courseTitle}</h3>
              <p>on</p>
              <p className="date">{new Date(certificate).toLocaleDateString()}</p>
            </div>
          </motion.div>
          <Button onClick={() => downloadPdfDocument('certificate-download')} style={{ float: 'right', marginTop: 3 }}>
            Download Certificate
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CourseContent;
