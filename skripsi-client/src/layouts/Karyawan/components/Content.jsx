import React, { useEffect }  from 'react'
import { Footer, Search } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKaryawan, deleteKaryawan } from '../../../redux/action';
import { useNavigate } from "react-router-dom";

const Content = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const karyawans = useSelector(state => state.karyawans);
  let role = localStorage.role;

  const toAddKaryawanPage = (e) => {
    e.preventDefault();
    navigate("/karyawan/add-karyawan")
  }

  const toEditPage = (data) => {
    console.log(data, `<<<< data`);
    navigate(`/karyawan/edit-karyawan/${data.id}`)
  }

  const handleDeletekaryawan = (id) => {
    dispatch(deleteKaryawan(id, localStorage.token))
  }

  useEffect(() => {
    dispatch(fetchKaryawan(localStorage.token))
  } ,[dispatch])

  return (
    <>
        <div className="layout-page">
          {/* <Search /> */}
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Karyawan</h4>

              <div className="card">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="card-header mt-2">Data Karyawan</h5>
                  </div>
                  {role === "admin"
                  ?
                    <div className="col-md-3 offset-md-3 mt-4">
                      <button onClick={toAddKaryawanPage} type="button" class="btn btn-primary mr-3">Tambah Karyawan</button>
                    </div>
                  : null
                  }
                </div>
                <hr />
                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>NIP</th>
                        <th>Nama</th>
                        <th>Jabatan</th>
                        <th>Email</th>
                        <th>Golongan</th>
                        {role === "admin" ? <th>Actions</th> : null}
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {karyawans && karyawans.length > 0 
                      ?
                      karyawans.map((e, idx) => {
                        return (
                          <tr key={e.id}>
                            <td>{e.nip}</td>
                            <td>{e.namaDepan}{' '}{e.namaBelakang}</td>
                            <td>{e.jabatan}</td>
                            <td>{e.email}</td>
                            <td><span className="badge bg-label-primary me-1">{e.Golongan ? e.Golongan.namaGolongan : null}</span></td>
                            {role === "admin"
                            ?
                              <td>
                                <div className="row">
                                  <div className="col">
                                    <i onClick={()=> toEditPage(e)} class="fa-solid fa-pen-to-square mr-5"></i>
                                  </div>
                                  <div className="col">
                                    <i onClick={()=> handleDeletekaryawan(e.id)} class="fa-solid fa-trash-can"></i>
                                  </div>
                                </div>
                              </td>
                            : null
                            }
                          </tr>
                        )
                      })
                      : null
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <hr className="my-5" />
            </div>

            <Footer />

            <div className="content-backdrop fade"></div>
          </div>
        </div>
    </>
  )
}

export default Content