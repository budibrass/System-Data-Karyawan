import React from 'react'
import { Navbar } from '../../components'
import AddContent from './components/AddContent'

const AddKaryawan = () => {
  return (
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <Navbar />
            <AddContent />
        </div>    
    </div>
  )
}

export default AddKaryawan