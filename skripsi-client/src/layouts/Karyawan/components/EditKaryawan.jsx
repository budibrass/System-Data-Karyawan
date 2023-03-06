import React, { useState, useEffect } from 'react';
import { Footer, Navbar } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getOneKaryawan, editKaryawan, fetchGolongan } from "../../../redux/action";
import { useNavigate, useParams } from "react-router-dom";

const EditKaryawan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const dataKaryawan = useSelector(state => state.karyawan);
  const golongans = useSelector(state => state.golongans)

    const [karyawan, setKaryawan] = useState({
        GolonganId: dataKaryawan.GolonganId,
        ProjectId: dataKaryawan.ProjectId,
        nip: dataKaryawan.nip,
        email: dataKaryawan.email,
        namaDepan: dataKaryawan.namaDepan,
        namaBelakang: dataKaryawan.namaBelakang,
        tempatLahir: dataKaryawan.tempatLahir,
        tanggalLahir: dataKaryawan.tanggalLahir,
        jenisKelamin: dataKaryawan.jenisKelamin,
        agama: dataKaryawan.agama,
        jabatan: dataKaryawan.jabatan,
        pendidikan: dataKaryawan.pendidikan,
        noHandphone: dataKaryawan.noHandphone,
        alamat: dataKaryawan.alamat,
        statusPernikahan: dataKaryawan.statusPernikahan,
        statusKerja: dataKaryawan.statusKerja,
        tanggalMasuk: dataKaryawan.tanggalMasuk,
        jumlahTanggunganAnak: dataKaryawan.jumlahTanggunganAnak,
    })

    const handleEditkaryawan = (e) => {
        e.preventDefault();
        dispatch(editKaryawan(karyawan, id, localStorage.token))
        navigate("/karyawan")
    }

    // console.log(karyawan, `<<<< karyawan`);
    // console.log(dataKaryawan, `<<<< dataKaryawan`);

    useEffect(() => {
        dispatch(getOneKaryawan(+id, localStorage.token))
        dispatch(fetchGolongan(localStorage.token))
    }, [dispatch, id])

  return (
    <>
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <Navbar />
            <div className="layout-page">
                <div className="content-wrapper">
                    <div className="container-xxl flex-grow-1 container-p-y">
                        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Karyawan /</span> Edit Karyawan</h4>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card mb-4">
                                    <h5 className="card-header">Profile Details</h5>
                                    <hr className="my-0" />
                                    <div className="card-body">
                                        <form onSubmit={handleEditkaryawan} id="formAccountSettings" >
                                            <div className="row">
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Golongan ID</label>
                                                    <select onChange={(e)=> setKaryawan({ ...karyawan, GolonganId: e.target.value })}  className="select2 form-select" autofocus>
                                                        <option value="">Select</option>
                                                        {golongans && golongans.length > 0
                                                        ?
                                                            golongans.map((e) => {
                                                                return (
                                                                    <option value={e.kodeGolongan} selected={e.kodeGolongan === karyawan.GolonganId ? e.kodeGolongan : ""}>{e.namaGolongan}</option>
                                                                )
                                                            })
                                                        :
                                                            null
                                                        }
                                                    </select>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Nip</label>
                                                    <input onChange={(e)=> setKaryawan({ ...karyawan, nip: e.target.value })} className="form-control" type="text" value={karyawan.nip} />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Email</label>
                                                    <input disabled className="form-control" type="text" value={karyawan.email}  />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Nama Depan</label>
                                                    <input onChange={(e)=> setKaryawan({ ...karyawan, namaDepan: e.target.value })} className="form-control" type="text" value={karyawan.namaDepan} />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Nama Belakang</label>
                                                    <input onChange={(e)=> setKaryawan({ ...karyawan, namaBelakang: e.target.value })}  className="form-control" type="text" value={karyawan.namaBelakang}/>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Tempat lahir</label>
                                                    <input onChange={(e)=> setKaryawan({ ...karyawan, tempatLahir: e.target.value })}  className="form-control" type="text" value={karyawan.tempatLahir}/>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Tanggal lahir</label>
                                                    <input onChange={(e)=> setKaryawan({ ...karyawan, tanggalLahir: e.target.value })}  className="form-control" type="date" value={karyawan.tanggalLahir ? karyawan.tanggalLahir.slice(0, 10) : null}/>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Jenis Kelamin</label>
                                                    <select onChange={(e)=> setKaryawan({ ...karyawan, jenisKelamin: e.target.value })}  className="select2 form-select">
                                                        <option value="">Select</option>
                                                        <option value="L" selected={karyawan.jenisKelamin === 'L' ? karyawan.jenisKelamin : ""}>Laki - Laki</option>
                                                        <option value="P" selected={karyawan.jenisKelamin === 'P' ? karyawan.jenisKelamin : ""}>Perempuan</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Agama</label>
                                                    <select onChange={(e)=> setKaryawan({ ...karyawan, agama: e.target.value })}  className="select2 form-select">
                                                        <option value="">Select</option>
                                                        <option value="ISLAM" selected={karyawan.agama === 'ISLAM' ? karyawan.agama : ""}>ISLAM</option>
                                                        <option value="Kristen" selected={karyawan.agama === 'Kristen' ? karyawan.agama : ""}>Kristen</option>
                                                        <option value="Hindhu" selected={karyawan.agama === 'Hindhu' ? karyawan.agama : ""}>Hindhu</option>
                                                        <option value="Budha" selected={karyawan.agama === 'Budha' ? karyawan.agama : ""}>Budha</option>
                                                        <option value="Kongucu" selected={karyawan.agama === 'Kongucu' ? karyawan.agama : ""}>Kongucu</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Jabatan</label>
                                                    <input onChange={(e)=> setKaryawan({ ...karyawan, jabatan: e.target.value })}  className="form-control" type="text" value={karyawan.jabatan}/>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">No Handphone</label>
                                                    <input onChange={(e)=> setKaryawan({ ...karyawan, noHandphone: e.target.value })}  className="form-control" type="text" value={karyawan.noHandphone}/>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Alamat</label>
                                                    <input onChange={(e)=> setKaryawan({ ...karyawan, alamat: e.target.value })}  className="form-control" type="text" value={karyawan.alamat}/>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Tanggal Masuk</label>
                                                    <input onChange={(e)=> setKaryawan({ ...karyawan, tanggalMasuk: e.target.value })}  className="form-control" type="date" value={karyawan.tanggalMasuk ? karyawan.tanggalMasuk.slice(0, 10) : null}/>
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label className="form-label">Jumlah Tanggungan</label>
                                                    <input onChange={(e)=> setKaryawan({ ...karyawan, jumlahTanggunganAnak: e.target.value })}  className="form-control" type="number" value={karyawan.jumlahTanggunganAnak}/>
                                                </div>
                                                <div className="mb-3 col-md-4">
                                                    <label className="form-label">Pendidikan</label>
                                                    <select onChange={(e)=> setKaryawan({ ...karyawan, pendidikan: e.target.value })}  className="select2 form-select">
                                                        <option value="">Select</option>
                                                        <option value="Sd" selected={karyawan.pendidikan === "Sd" ? karyawan.pendidikan : ""}>Sd</option>
                                                        <option value="Smp" selected={karyawan.pendidikan === "Smp" ? karyawan.pendidikan : ""}>Smp</option>
                                                        <option value="Sma/Smk" selected={karyawan.pendidikan === "Sma/Smk" ? karyawan.pendidikan : ""}>Sma /
                                                        Smk</option>
                                                        <option value="Sarjana" selected={karyawan.pendidikan === "Sarjana" ? karyawan.pendidikan : ""}>Sarjana</option>
                                                        <option value="Master" selected={karyawan.pendidikan === "Master" ? karyawan.pendidikan : ""}>Master</option>
                                                        <option value="Doktor" selected={karyawan.pendidikan === "Doktor" ? karyawan.pendidikan : ""}>Doktor</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3 col-md-4">
                                                    <label className="form-label">Status Pernikahan</label>
                                                    <select onChange={(e)=> setKaryawan({ ...karyawan, statusPernikahan: e.target.value })}  className="select2 form-select">
                                                        <option value="">Select</option>
                                                        <option value="BM" selected={karyawan.statusPernikahan === "BM" ? karyawan.statusPernikahan : ""}>Belum Menikah</option>
                                                        <option value="M" selected={karyawan.statusPernikahan === "M" ? karyawan.statusPernikahan : ""}>Menikah</option>
                                                        <option value="D" selected={karyawan.statusPernikahan === "D" ? karyawan.statusPernikahan : ""}>Duda</option>
                                                        <option value="J" selected={karyawan.statusPernikahan === "J" ? karyawan.statusPernikahan : ""}>Janda</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3 col-md-4">
                                                    <label className="form-label">Status Kerja</label>
                                                    <select onChange={(e)=> setKaryawan({ ...karyawan, statusKerja: e.target.value })}  className="select2 form-select">
                                                        <option value="">Select</option>
                                                        <option value="WFH" selected={karyawan.statusKerja === "WFH" ? karyawan.statusKerja : ""}>WFH</option>
                                                        <option value="WFO" selected={karyawan.statusKerja === "WFO" ? karyawan.statusKerja : ""}>WFO</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <button type="submit" className="btn btn-primary me-2">Simpan Perubahan</button>
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

export default EditKaryawan