import React, { useState, useEffect } from 'react';
import { Footer } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { addKaryawan, fetchProject, fetchGolongan } from '../../../redux/action';
import { useNavigate } from "react-router-dom";

const AddContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const golongans = useSelector(state => state.golongans);
  const projects = useSelector(state => state.projects);

    const [karyawan, setKaryawan] = useState({
        GolonganId: null,
        ProjectId: null,
        nip: "",
        email: "",
        namaDepan: "",
        namaBelakang: "",
        tempatLahir: "",
        tanggalLahir: "",
        jenisKelamin: "",
        agama: "",
        jabatan: "",
        pendidikan: "",
        noHandphone: "",
        alamat: "",
        statusPernikahan: "",
        statusKerja: "",
        tanggalMasuk: "",
        jumlahTanggunganAnak: 0
    })

    const handleAddKaryawan = (e) => {
        e.preventDefault();
        dispatch(addKaryawan(karyawan, localStorage.token))
        // navigate("/karyawan")
    }

    useEffect(()=> {
        dispatch(fetchProject(localStorage.token))
        dispatch(fetchGolongan(localStorage.token))
    }, [dispatch])

  return (
    <>
    <div className="layout-page">
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Karyawan /</span> Tambah Karyawan</h4>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card mb-4">
                            <h5 className="card-header">Tambah Karyawan</h5>
                            <hr className="my-0" />
                            <div className="card-body">
                                <form onSubmit={handleAddKaryawan} id="formAccountSettings" >
                                    <div className="row">
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Golongan ID</label>
                                            <select onChange={(e)=> setKaryawan({ ...karyawan, GolonganId: e.target.value })}  className="select2 form-select" autofocus>
                                                <option value="">Select</option>
                                                {golongans && golongans.length > 0
                                                ?
                                                    golongans.map((e) => {
                                                        return (
                                                            <option value={e.kodeGolongan}>{e.namaGolongan}</option>
                                                        )
                                                    })
                                                :
                                                    null
                                                }
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Nip</label>
                                            <input onChange={(e)=> setKaryawan({ ...karyawan, nip: e.target.value })} className="form-control" type="text" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Email</label>
                                            <input onChange={(e)=> setKaryawan({ ...karyawan, email: e.target.value })} className="form-control" type="email" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Nama Depan</label>
                                            <input onChange={(e)=> setKaryawan({ ...karyawan, namaDepan: e.target.value })} className="form-control" type="text" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Nama Belakang</label>
                                            <input onChange={(e)=> setKaryawan({ ...karyawan, namaBelakang: e.target.value })}  className="form-control" type="text" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Tempat lahir</label>
                                            <input onChange={(e)=> setKaryawan({ ...karyawan, tempatLahir: e.target.value })}  className="form-control" type="text" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Tanggal lahir</label>
                                            <input onChange={(e)=> setKaryawan({ ...karyawan, tanggalLahir: e.target.value })}  className="form-control" type="date" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Jenis Kelamin</label>
                                            <select onChange={(e)=> setKaryawan({ ...karyawan, jenisKelamin: e.target.value })}  className="select2 form-select">
                                                <option value="">Select</option>
                                                <option value="L">Laki - Laki</option>
                                                <option value="P">Perempuan</option>
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Agama</label>
                                            <select onChange={(e)=> setKaryawan({ ...karyawan, agama: e.target.value })}  className="select2 form-select">
                                                <option value="">Select</option>
                                                <option value="ISLAM">ISLAM</option>
                                                <option value="Kristen">Kristen</option>
                                                <option value="Hindhu">Hindhu</option>
                                                <option value="Budha">Budha</option>
                                                <option value="Kongucu">Kongucu</option>
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Jabatan</label>
                                            <input required onChange={(e)=> setKaryawan({ ...karyawan, jabatan: e.target.value })}  className="form-control" type="text" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Alamat</label>
                                            <input onChange={(e)=> setKaryawan({ ...karyawan, alamat: e.target.value })}  className="form-control" type="text" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">No Handphone</label>
                                            <input onChange={(e)=> setKaryawan({ ...karyawan, noHandphone: e.target.value })}  className="form-control" type="text" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Tanggal Masuk</label>
                                            <input onChange={(e)=> setKaryawan({ ...karyawan, tanggalMasuk: e.target.value })}  className="form-control" type="date" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Jumlah Tanggungan</label>
                                            <input onChange={(e)=> setKaryawan({ ...karyawan, jumlahTanggunganAnak: e.target.value })}  className="form-control" type="number" />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Pendidikan</label>
                                            <select onChange={(e)=> setKaryawan({ ...karyawan, pendidikan: e.target.value })}  className="select2 form-select">
                                                <option value="">Select</option>
                                                <option value="Sd">Sd</option>
                                                <option value="Smp">Smp</option>
                                                <option value="Sma/Smk">Sma / Smk</option>
                                                <option value="Sarjana">Sarjana</option>
                                                <option value="Master">Master</option>
                                                <option value="Doktor">Doktor</option>
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Status Pernikahan</label>
                                            <select onChange={(e)=> setKaryawan({ ...karyawan, statusPernikahan: e.target.value })}  className="select2 form-select">
                                                <option value="">Select</option>
                                                <option value="BM">Belum Menikah</option>
                                                <option value="M">Menikah</option>
                                                <option value="D">Duda</option>
                                                <option value="J">Janda</option>
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Status Kerja</label>
                                            <select onChange={(e)=> setKaryawan({ ...karyawan, statusKerja: e.target.value })}  className="select2 form-select">
                                                <option value="">Select</option>
                                                <option value="WFH">WFH</option>
                                                <option value="WFO">WFO</option>
                                            </select>
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label className="form-label">Nama Project</label>
                                            <select onChange={(e)=> setKaryawan({ ...karyawan, ProjectId: e.target.value })}  className="select2 form-select">
                                                <option value="">Select</option>
                                                {projects && projects.length > 1
                                                ?
                                                    projects.map((e) => {
                                                        return (
                                                            <option key={e.id} value={e.nama}>{e.nama}</option>
                                                        )
                                                    })
                                                : null
                                                }
                                                <option value="WFH">WFH</option>
                                            </select>
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