import React, { useState, useEffect } from 'react';
import { Footer, Navbar } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getOnePerforma, editPerforma, fetchKaryawan, fetchProject } from "../../../redux/action";
import { useNavigate, useParams } from "react-router-dom";
// import moment from "moment";

const EditPerforma = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const karyawans = useSelector(state => state.karyawans)
  const projects = useSelector(state => state.projects)
  const performance = useSelector(state => state.performance)

  const [performa, setPerforma] = useState({
    KaryawanId: performance.KaryawanId,
    ProjectId: performance.ProjectId,
    bulan: performance.bulan,
    presensiJumlahKehadiran: performance.presensiJumlahKehadiran,
    presensiIzinSakit: performance.presensiIzinSakit,
    presensiAlfa: performance.presensiAlfa,
    kinerja: performance.kinerja,
  });

    const handleEditPerforma = (e) => {
        e.preventDefault();
        dispatch(editPerforma(performa, id, localStorage.token))
        navigate("/performa")
    }

    useEffect(() => {
        dispatch(getOnePerforma(+id, localStorage.token))
        dispatch(fetchKaryawan(localStorage.token))
        dispatch(fetchProject(localStorage.token))
    }, [dispatch, id])

  return (
    <>
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <Navbar />
            <div className="layout-page">
                <div className="content-wrapper">
                    <div className="container-xxl flex-grow-1 container-p-y">
                        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Performa /</span> Edit Performa</h4>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card mb-4">
                                    <h5 className="card-header">Ubah Data Performa Karyawan</h5>
                                    <hr className="my-0" />
                                    <div className="card-body">
                                    <form onSubmit={handleEditPerforma} id="formAccountSettings">
                                        <div className="row">
                                            <div className="mb-3 col-md-4">
                                            <label className="form-label">Karyawan ID</label>
                                            <select
                                                onChange={(e) =>
                                                setPerforma({
                                                    ...performa,
                                                    KaryawanId: e.target.value,
                                                })
                                                }
                                                className="select2 form-select"
                                                autofocus
                                            >
                                                <option value="">Select</option>
                                                {karyawans && karyawans.length > 0
                                                ? karyawans.map((e) => {
                                                    return (
                                                        <option value={e.id} selected={e.id === performance.KaryawanId ? performance.KaryawanId : ""}>
                                                        {e.namaDepan} {e.namaBelakang}
                                                        </option>
                                                    );
                                                    })
                                                : null}
                                            </select>
                                            </div>
                                            <div className="mb-3 col-md-4">
                                            <label className="form-label">Project ID</label>
                                            <select
                                                onChange={(e) =>
                                                setPerforma({
                                                    ...performa,
                                                    ProjectId: e.target.value,
                                                })
                                                }
                                                className="select2 form-select"
                                                autofocus
                                            >
                                                <option value="">Select</option>
                                                {projects && projects.length > 0
                                                ? projects.map((e) => {
                                                    return <option value={e.id} selected={e.id === performance.ProjectId ? performance.ProjectId : ""}>{e.nama}</option>;
                                                    })
                                                : null}
                                            </select>
                                            </div>
                                            <div className="mb-3 col-md-4">
                                            <label className="form-label">Bulan</label>
                                            <input
                                                onChange={(e) =>
                                                setPerforma({
                                                    ...performa,
                                                    bulan: e.target.value,
                                                })
                                                }
                                                className="form-control"
                                                type="date"
                                                // value={moment(performance.bulan).format('L')}
                                                value={performa.bulan ? performa.bulan.slice(0, 10) : null}
                                            />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                            <label className="form-label">Jumlah Kehadiran</label>
                                            <input
                                                onChange={(e) =>
                                                setPerforma({
                                                    ...performa,
                                                    presensiJumlahKehadiran: e.target.value,
                                                })
                                                }
                                                className="form-control"
                                                type="number"
                                                value={performa.presensiJumlahKehadiran}
                                            />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                            <label className="form-label">Izin / Sakit</label>
                                            <input
                                                onChange={(e) =>
                                                setPerforma({
                                                    ...performa,
                                                    presensiIzinSakit: e.target.value,
                                                })
                                                }
                                                className="form-control"
                                                type="number"
                                                value={performa.presensiIzinSakit}
                                            />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                            <label className="form-label">
                                                Tidak Hadir Tanpa Keterangan
                                            </label>
                                            <input
                                                onChange={(e) =>
                                                setPerforma({
                                                    ...performa,
                                                    presensiAlfa: e.target.value,
                                                })
                                                }
                                                className="form-control"
                                                type="number"
                                                value={performa.presensiAlfa}
                                            />
                                            </div>
                                            <div className="mb-3 col-md-6">
                                            <label className="form-label">Kinerja</label>
                                            <input
                                                onChange={(e) =>
                                                setPerforma({
                                                    ...performa,
                                                    kinerja: e.target.value.toUpperCase(),
                                                })
                                                }
                                                className="form-control"
                                                type="text"
                                                value={performa.kinerja}
                                            />
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <button type="submit" className="btn btn-primary me-2">
                                            Simpan
                                            </button>
                                            <button
                                            type="reset"
                                            className="btn btn-outline-secondary"
                                            >
                                            Batal
                                            </button>
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

export default EditPerforma