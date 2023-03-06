import React from 'react';
import MainContent from './contentDataPresensi'

const dataPresensi = React.forwardRef((props, ref) => {
  return (
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <MainContent />
        </div>    
    </div>
  )
})

export default dataPresensi