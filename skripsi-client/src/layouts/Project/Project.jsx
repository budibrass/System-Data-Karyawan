import React, { useRef, useEffect } from 'react';
import { Navbar } from '../../components';
import MainContent from './components/Content';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';

const Project = () => {
  const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const navigate = useNavigate();
  const token = localStorage.token;

  useEffect(() => {
    if(!token) {
      navigate("/login")
    }
  })

  return (
    <>
    <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
            <Navbar />
            <MainContent handlePrint={handlePrint} ref={componentRef}/>
        </div>    
    </div>
    </>
  )
}

export default Project