import React, { useState, useEffect } from 'react'
import { Footer } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCuti, addCuti, getOneKaryawanEmail } from '../../../redux/action';
import moment from "moment";

const Content = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const cuties = useSelector(state => state.cuties);
  const karyawan = useSelector(state => state.karyawanEmail);
  const id = karyawan.id;
  const role = localStorage.role;
  const email = localStorage.email;
  const [dataCuti, setDataCuti] = useState({
    mulaiTanggal: "",
    sampaiTanggal: "",
    alasan: "",
    status: "waitconfirm",
  })

  const handlePengajuanCuti = (e) => {
    e.preventDefault();
    let payload = {
      ...dataCuti,
      KaryawanId: id
    }
    console.log(payload, `<<<<< payload`);
    dispatch(addCuti(payload, localStorage.token))
  }

  console.log(cuties, `<<<< cuties`);

  useEffect(() => {
    dispatch(fetchCuti(localStorage.token))
    dispatch(getOneKaryawanEmail(email, localStorage.token))
  }, [dispatch])

  return (
    <>
        <div className="layout-page">
          
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Cuti</h4>

              <div className="card">
                <h5 className="card-header">Ajukan Cuti</h5>
                <hr />
                <div className="row">
                    <form onSubmit={handlePengajuanCuti} id="formAccountSettings">
                        <div className="row">
                          <div className="mb-3 col-md-5 offset-md-1">
                              <label className="form-label">Mulai Tanggal</label>
                              <input onChange={(e) => setDataCuti({ ...dataCuti, mulaiTanggal: e.target.value })} className="form-control" type="date" />
                            </div>
                            <div className="mb-3 col-md-5">
                              <label className="form-label">Sampai Tanggal</label>
                              <input onChange={(e) => setDataCuti({ ...dataCuti, sampaiTanggal: e.target.value })} className="form-control" type="date" />
                            </div>
                        </div>
                        <div className="row">
                          <div className="mb-3 col-md-10 offset-md-1">
                              <label className="form-label">Alasan</label>
                              <textarea onChange={(e) => setDataCuti({ ...dataCuti, alasan: e.target.value })} class="form-control"></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-10 offset-md-1">
                                <button type="submit" class="btn btn-primary">Ajukan Cuti</button>
                            </div>
                        </div>
                    </form>
                </div>
              </div>

              <div ref={ref} className="card my-2">
              <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Data Cuti</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      <tr>
                        <td><strong>Nama</strong></td>
                        <td><strong>Tanggal Mulai</strong></td>
                        <td><strong>Tanggal Akhir</strong></td>
                        <td><strong>Alasan</strong></td>
                        <td><strong>Status</strong></td>
                      </tr>
                      {cuties && cuties.length > 0
                      ?
                        cuties.map((e) => {
                          if(role === "admin" || e.KaryawanId === id) {
                            return (
                              <tr>
                                <td>{e.Karyawan ? e.Karyawan.namaDepan : null}</td>
                                <td>{moment(e.mulaiTanggal).format('L')}</td>
                                <td>{moment(e.sampaiTanggal).format('L')}</td>
                                <td>{e.alasan}</td>
                                <td>
                                  {e.status === "accept"
                                  ? <span class="badge rounded-pill bg-success">Disetujui</span>
                                  : e.status === "waitconfirm"
                                  ? <span class="badge rounded-pill bg-warning">Menunggu Konfirmasi</span>
                                  : <span class="badge rounded-pill bg-danger">Ditolak</span>
                                  }
                                </td>
                              </tr>
                            )
                          }
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