import React, { useEffect } from 'react';
import { Navbar } from '../../components';
import MainContent from './components/Content';
import { useNavigate } from 'react-router-dom';

const Golongan = () => {
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
            <MainContent />
        </div>    
    </div>
    </>
  )
}

export default Golongan