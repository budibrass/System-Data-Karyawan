import React, { useState, useEffect } from 'react';
import { Footer } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { addGaji, fetchKaryawan, getOneGolongan } from '../../../redux/action';
import { useNavigate } from "react-router-dom";

const AddContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const karyawans = useSelector(state => state.karyawans);
  const golongan = useSelector(state => state.golongan);
  let id = 0;

    const [gaji, setGaji] = useState({
        KaryawanId: null,
        tanggal:"",
        gajiPokok: 0,
        lembur: false,
        lamaLembur: 0,
    })

    const handleKaryawanId = (e) => {
        console.log(e.target.value, `<<<< e.target.value`);
        setGaji({
            ...gaji,
            KaryawanId: +e.target.value
        })
        id = +e.target.value
        dispatch(getOneGolongan(id, localStorage.token))
    }
    
    const handleAddGaji = (e) => {
        e.preventDefault();

        let uangPotongan = [
            {
                pph21: 100000,
                bpjsKesehatan: 20000,
                bpjsKetenagaKerjaan: 30000,
            }
        ]

        let totalUangLembur = gaji.lamaLembur * golongan.uangLembur;

        let payload = {
            ...gaji,
            potongan: uangPotongan,
            totalPotongan: (uangPotongan[0].pph21 + uangPotongan[0].bpjsKesehatan + uangPotongan[0].bpjsKetenagaKerjaan),
            gajiTunjangan: golongan.uangTunjangan,
            totalGajiLembur: totalUangLembur,
            totalGaji: (gaji.gajiPokok + (gaji.lamaLembur * golongan.uangLembur) + golongan.uangTunjangan) - (uangPotongan[0].pph21 + uangPotongan[0].bpjsKesehatan + uangPotongan[0].bpjsKetenagaKerjaan)
        }

        console.log(payload, `<<<< payload`);
        dispatch(addGaji(payload, localStorage.token))
        navigate("/gaji")
    }

    useEffect(()=> {
        // dispatch(fetchGolongan(localStorage.token));
        dispatch(fetchKaryawan(localStorage.token));
    }, [dispatch])

  return (
    <>
    <div className="layout-page">
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Gaji /</span> Input Gaji</h4>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card mb-4">
                            <h5 className="card-header">Tambah Gaji Karyawan</h5>
                            <hr className="my-0" />
                            <div className="card-body">
                                <form onSubmit={handleAddGaji} id="formAccountSettings" >
                                    <div className="row">
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Nama Karyawan</label>
                                            {/* <select onChange={(e)=> setGaji({ ...gaji, KaryawanId: e.target.value })} autoFocus className="select2 form-select"> */}
                                            <select onChange={handleKaryawanId} autoFocus className="select2 form-select">
                                                <option value="">Select</option>
                                                {karyawans && karyawans.length > 0
                                                ?
                                                    karyawans.map((e) => {
                                                        return (
                                                            <option value={e.id}>{e.namaDepan}{' '}{e.namaBelakang}</option>
                                                        )
                                                    })
                                                : null
                                                }
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Tanggal</label>
                                            <input onChange={(e)=> setGaji({ ...gaji, tanggal: e.target.value })}  className="form-control" type="date" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Gaji Pokok</label>
                                            <input onChange={(e)=> setGaji({ ...gaji, gajiPokok: Number(e.target.value) })} className="form-control" type="number" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Lembur</label>
                                            <select onChange={(e)=> setGaji({ ...gaji, lembur: e.target.value})}  className="select2 form-select">
                                                <option value="">Select</option>
                                                <option value="true">Ada</option>
                                                <option value="false" selected>Tidak Ada</option>
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Lama Lembur</label>
                                            <input disabled={gaji.lembur === false ? true : false} onChange={(e)=> setGaji({ ...gaji, lamaLembur: Number(e.target.value) })} className="form-control" type="number" />
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
    </div></>
  )
}

export default AddContent