import React from 'react'
import { Navbar } from '../../components'
import MainContent from './components/Content';

const CetakLaporan = () => {
  return (
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <Navbar />
            <MainContent />
        </div>    
    </div>
  )
}

export default CetakLaporan