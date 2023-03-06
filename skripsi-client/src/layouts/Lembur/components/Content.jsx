import React, { useEffect, useState } from 'react'
import { Footer } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLembur, addLembur, getOneKaryawanEmail } from '../../../redux/action';
import moment from "moment";

const Content = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const lemburs = useSelector(state => state.lemburs);
  const karyawan = useSelector(state => state.karyawanEmail);
  const role = localStorage.role;
  const id = karyawan.id;
  const email = localStorage.email;

  const [dataLembur, setDataLembur] = useState({
    tanggal: "",
    lamaJam: 0,
    status: "waitconfirm"
  })

  const handlePengajuanLembur = (e) => {
    e.preventDefault();
    let payload = {
      ...dataLembur,
      KaryawanId: id
    }
    console.log(payload, `<<<< payload`);
    dispatch(addLembur(payload, localStorage.token));
  }

  useEffect(() => {
    dispatch(getOneKaryawanEmail(email, localStorage.token))
    dispatch(fetchLembur(localStorage.token))
  }, [dispatch])

  return (
    <>
        <div className="layout-page">
          
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Lembur</h4>

              <div className="card">
                <h5 className="card-header">Ajukan Lembur</h5>
                <hr />
                <div className="row">
                    <form onSubmit={handlePengajuanLembur} id="formAccountSettings">
                        <div className="row">
                            <div className="mb-3 col-md-5 offset-md-1">
                              <label className="form-label">Tanggal</label>
                              <input onChange={(e)=> setDataLembur({ ...dataLembur, tanggal: e.target.value })} className="form-control" type="date" />
                            </div>
                            <div className="mb-3 col-md-5">
                              <label className="form-label">Berapa Jam</label>
                              <input onChange={(e)=> setDataLembur({ ...dataLembur, lamaJam: e.target.value })} className="form-control" type="number" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-10 offset-md-1">
                                <button type="submit" class="btn btn-primary">Ajukan Lembur</button>
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
                        <th>Data Lembur</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      <tr>
                        <td><strong>Nama</strong></td>
                        <td><strong>Hari</strong></td>
                        <td><strong>Tanggal</strong></td>
                        <td><strong>Jam</strong></td>
                        <td><strong>Status</strong></td>
                      </tr>
                      {lemburs && lemburs.length > 0
                      ?
                        lemburs.map((e) => {
                          if(role === "admin" || e.KaryawanId === id) {
                            return (
                              <tr key={e.id}>
                                <td>{e.Karyawan ? e.Karyawan.namaDepan : null}</td>
                                <td>{moment(e.tanggal).format('dddd')}</td>
                                <td>{moment(e.tanggal).format('L')}</td>
                                <td>{e.lamaJam}</td>
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