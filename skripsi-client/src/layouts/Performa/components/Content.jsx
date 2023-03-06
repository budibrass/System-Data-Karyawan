import React, { useEffect }  from 'react'
import { Footer, Search } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerforma, deletePerforma } from '../../../redux/action';
import { useNavigate } from "react-router-dom";

const Content = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const performances = useSelector(state => state.performances);

  const toAddPerformaPage = (e) => {
    e.preventDefault();
    navigate("/performa/add-performa")
  }

  const toEditPage = (id) => {
    navigate(`/performa/edit-performa/${id}`)
  }

  const handleDeletePerforma = (id) => {
    dispatch(deletePerforma(id, localStorage.token))
  }

  useEffect(() => {
    dispatch(fetchPerforma(localStorage.token))
  } ,[dispatch])

  return (
    <>
        <div className="layout-page">
          {/* <Search /> */}
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Performa Karyawan</h4>

              <div ref={ref} className="card">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="card-header mt-2">Data Performa Karyawan</h5>
                  </div>
                    <div className="col-md-3 offset-md-3 mt-4">
                      <button onClick={toAddPerformaPage} type="button" class="btn btn-primary mr-3">Tambah Performa Karyawan</button>
                    </div>
                </div>
                <hr />
                <div className="table-responsive text-nowrap">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th className='align-items-center' rowSpan={2}>Nama</th>
                        <th colSpan={4}>Presensi</th>
                        <th colSpan={3}>Project</th>
                        <th rowSpan={2}>Total</th>
                        <th rowSpan={2}>Aksi</th>
                      </tr>
                      <tr>
                        <td>Jumlah Kehadiran</td>
                        <td>Izin / Sakit</td>
                        <td>Tidak Masuk</td>
                        <td>Nilai</td>
                        <td>Nama</td>
                        <td>PM</td>
                        <td>Nilai</td>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {performances && performances.length > 0 
                      ?
                      performances.map((e, idx) => {
                        return (
                          <tr key={e.id}>
                            <td>{e.Karyawan?.namaDepan}{' '}{e.Karyawan?.namaBelakang}</td>
                            <td>{e.presensiJumlahKehadiran}</td>
                            <td>{e.presensiIzinSakit}</td>
                            <td>{e.presensiAlfa}</td>
                            <td>{e.presensiNilai}</td>
                            <td>{e.Project?.nama}</td>
                            <td>{e.Project?.productManager}</td>
                            <td>{e.kinerja}</td>
                            <td>{e.totalNilai}</td>
                            <td>
                              <div className="row">
                                <div className="col">
                                  <i onClick={()=> toEditPage(e.id)} class="fa-solid fa-pen-to-square mr-5"></i>
                                </div>
                                <div className="col">
                                  <i onClick={()=> handleDeletePerforma(e.id)} class="fa-solid fa-trash-can"></i>
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