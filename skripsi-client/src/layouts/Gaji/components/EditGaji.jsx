import React, { useState, useEffect } from 'react';
import { Footer, Navbar } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getOneGaji, editGaji, getOneGolongan } from "../../../redux/action";
import { useNavigate, useParams } from "react-router-dom";

const EditGaji = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const dataGaji = useSelector(state => state.salary);
  const karyawans = useSelector(state => state.karyawans);
  const golongan = useSelector(state => state.golongan);
  const GolonganId = dataGaji.Karyawan ? dataGaji.Karyawan.GolonganId : 0

    const [gaji, setGaji] = useState({
        KaryawanId: dataGaji.KaryawanId,
        tanggal: dataGaji.tanggal,
        gajiPokok: dataGaji.gajiPokok,
        lembur: dataGaji.lembur,
        lamaLembur: dataGaji.lamaLembur
    })

    const handleEditGaji = (e) => {
        e.preventDefault();

        let totalUangLembur = gaji.lamaLembur * golongan.uangLembur;
        let payload = {
            ...gaji,
            gajiTunjangan: golongan.uangTunjangan,
            totalGajiLembur: totalUangLembur,
            totalGaji: gaji.gajiPokok + (gaji.lamaLembur * golongan.uangLembur) + golongan.uangTunjangan
        }
        
        dispatch(editGaji(payload, id, localStorage.token))
        navigate("/gaji")
    }

    useEffect(() => {
        dispatch(getOneGaji(id, localStorage.token))
        dispatch(getOneGolongan(GolonganId, localStorage.token))
    }, [dispatch, id])

  return (
    <>
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <Navbar />
            <div className="layout-page">
                <div className="content-wrapper">
                    <div className="container-xxl flex-grow-1 container-p-y">
                        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Gaji /</span> Edit Gaji</h4>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card mb-4">
                                    <h5 className="card-header">Ubah Data Gaji</h5>
                                    <hr className="my-0" />
                                    <div className="card-body">
                                        <form onSubmit={handleEditGaji} id="formAccountSettings" >
                                            <div className="row">
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Karyawan ID</label>
                                                    <select onChange={(e)=> setGaji({ ...gaji, KaryawanId: e.target.value })}  className="select2 form-select">
                                                        <option value="">Select</option>
                                                        {karyawans && karyawans.length > 1 
                                                        ?
                                                            karyawans.map((e) => {
                                                                return (
                                                                    <option value={e.id} selected={e.id === dataGaji.id ? dataGaji.id  : ""}>{e.namaDepan}</option>
                                                                )
                                                            })
                                                        : null
                                                        }
                                                    </select>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Tanggal</label>
                                                    <input value={gaji.tanggal ? gaji.tanggal.slice(0, 10) : null} onChange={(e)=> setGaji({ ...gaji, tanggal: e.target.value })}  className="form-control" type="date" />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Gaji Pokok</label>
                                                    <input value={gaji.gajiPokok} onChange={(e)=> setGaji({ ...gaji, gajiPokok: Number(e.target.value) })} className="form-control" type="number" autofocus />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Lembur</label>
                                                    <select onChange={(e)=> setGaji({ ...gaji, lembur: e.target.value})}  className="select2 form-select">
                                                        <option value="">Select</option>
                                                        <option value="true" selected={dataGaji.lembur === true ? dataGaji.lembur : ""}>Ada</option>
                                                        <option value="false" selected={dataGaji.lembur === false ? dataGaji.lembur : ""}>Tidak Ada</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Lama Lembur</label>
                                                    <input value={gaji.lamaLembur} disabled={gaji.lembur === false ? true : false} onChange={(e)=> setGaji({ ...gaji, lamaLembur: Number(e.target.value) })} className="form-control" type="number" autofocus />
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <button type="submit" className="btn btn-primary me-2">Simpan</button>
                                                <button type="reset" className="btn btn-outline-secondary">Batal</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Footer />

                    <div className="content-backdrop fade"></div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default EditGaji