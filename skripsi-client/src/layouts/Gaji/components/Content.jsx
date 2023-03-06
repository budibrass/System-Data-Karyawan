import React, { useEffect } from 'react'
import { Footer, Search } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGaji, deleteGaji } from '../../../redux/action';
import { formatRupiah } from "../../../utils/formatRupiah";
import { useNavigate } from 'react-router-dom';
import moment from "moment"

const Content = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const salaries = useSelector(state => state.salaries);

  const toDetailPage = (id) => {
    navigate(`/gaji/detail-gaji/${id}`)
  }

  const handleDeleteGaji = (id) => {
    dispatch(deleteGaji(id, localStorage.token))
  }

  const toAddGajiPage = () => {
    navigate("/gaji/add-gaji")
  }

  useEffect(() => {
    dispatch(fetchGaji(localStorage.token))
  }, [dispatch]);

  return (
    <>
        <div className="layout-page">
          {/* <Search /> */}
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Gaji</h4>

              <div className="card" ref={ref}>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="card-header">Input Gaji Karyawan</h5>
                  </div>
                  <div className="col-md-3 offset-md-3 mt-4">
                    <button onClick={toAddGajiPage} type="button" class="btn btn-primary mr-3">Tambah Gaji Baru</button>
                  </div>
                </div>
                <hr />
                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID Karyawan</th>
                        <th>Nama Karyawan</th>
                        <th>Tanggal</th>
                        <th>Total Gaji</th>
                        <th className="d-flex justify-content-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {salaries && salaries.length > 0
                      ?
                      salaries.map((e) => {
                        return (
                          <tr key={e.id}>
                            <td><span className="badge bg-label-primary me-1"><strong>{e.KaryawanId}</strong></span></td>
                            <td>{e.Karyawan ? e.Karyawan.email : null}</td>
                            <td>{moment(e.tanggal).format('L')}</td>
                            <td>{formatRupiah(e.totalGaji)}</td>
                            <td className="d-flex justify-content-center">
                              <div className="row">
                                <div className="col">
                                  <i onClick={()=> toDetailPage(e.KaryawanId)} class="fa-solid fa-info"></i>
                                </div>
                                <div className="col">
                                  <i onClick={()=> handleDeleteGaji(e.id)} class="fa-solid fa-trash-can"></i>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                      : null
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <button type="button" onClick={props.handlePrint} class="btn btn-info mt-3">Cetak Laporan</button>
              <hr className="my-5" />
            </div>

            <Footer />

            <div className="content-backdrop fade"></div>
          </div>
        </div>
    </>
  )
})

export default Content