import React from "react";
import { Routes, Route , BrowserRouter as Router } from "react-router-dom";
import {
  Home,
  Login,
  Register,

  Karyawan,
  AddKaryawan,
  EditKaryawan,

  Presensi,
  Absensi,

  Gaji,
  AddGaji,
  EditGaji,

  SlipGaji,
  Lembur,
  Cuti,
  Reimbursement,
  Info,

  Pengajuan,
  Golongan,
  BuatAkun,
  Project,
  
  Performa,
  AddPerforma,
  EditPerforma,
  CetakLaporan,
  EditInfo,
  Keuangan,
} from "./layouts";
import CetakLaporanPresensi  from "./layouts/CetakLaporan/data/dataPresensi";
import { Provider } from "react-redux";
import store from './redux/store';
 
const App = () => {
  return(
    <>
    <Provider store={store}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/karyawan" element={<Karyawan />}/>
            <Route path="/absensi" element={<Absensi />}/>
            <Route path="/presensi" element={<Presensi />}/>
            <Route path="/gaji" element={<Gaji />}/>
            <Route path="/slip-gaji" element={<SlipGaji />}/>
            <Route path="/lembur" element={<Lembur />}/>
            <Route path="/cuti" element={<Cuti />}/>
            <Route path="/reimbursement" element={<Reimbursement />}/>
            <Route path="/pengajuan" element={<Pengajuan />}/>
            <Route path="/golongan" element={<Golongan />}/>
            <Route path="/project" element={<Project />}/>
            <Route path="/performa" element={<Performa />}/>
            <Route path="/buat-akun" element={<BuatAkun />}/>
            <Route path="/cetak-laporan" element={<CetakLaporan />}/>
            <Route path="/keuangan" element={<Keuangan />}/>

            <Route path="/info" element={<Info />}/>
            <Route path="/edit-info/:id" element={<EditInfo />}/>

            <Route path="/cetak-laporan-presensi" element={<CetakLaporanPresensi />}/>

            <Route path="/performa/add-performa" element={<AddPerforma />}/>
            <Route path="/performa/edit-performa/:id" element={<EditPerforma />}/>

            <Route path="/karyawan/add-karyawan" element={<AddKaryawan />}/>
            <Route path="/karyawan/edit-karyawan/:id" element={<EditKaryawan />}/>

            <Route path="/gaji/add-gaji" element={<AddGaji />}/>
            <Route path="/gaji/detail-gaji/:id" element={<EditGaji />}/>
          </Routes>
        </div>
      </Router>
      </Provider>
    </>
  )
};

export default App;