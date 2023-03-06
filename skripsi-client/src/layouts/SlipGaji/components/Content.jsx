import React, { useEffect } from 'react'
import { Footer } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGaji } from '../../../redux/action';
import moment from "moment";
import { formatRupiah } from '../../../utils/formatRupiah';

const Content = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const salaries = useSelector(state => state.salaries);
  const role = localStorage.tole;
  const email = localStorage.email;
  
  useEffect(() => {
    dispatch(fetchGaji(localStorage.token))
  }, [dispatch])

  return (
    <>
        <div className="layout-page">
          
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Slip Gaji</h4>

              <div className="card">
                <h5 className="card-header">Pilih Periode</h5>
                <hr />
                <div className="row">
                    <form id="formAccountSettings" method="POST" onsubmit="return false">
                        <div className="row">
                            <div className="mb-3 col-md-10 offset-md-1">
                            <select id="country" className="select2 form-select">
                                <option value="">Select</option>
                                <option value="Australia">Australia</option>
                                <option value="Bangladesh">Bangladesh</option>
                            </select>
                            </div>
                        </div>
                    </form>
                </div>
              </div>

              {salaries && salaries.length > 0
              ?
              salaries.map((e) => {
                if(e.Karyawan.email === email) {
                  return (
                    <div ref={ref}>
                      <div class="card mt-3">
                        <div class="card-body">
                          <h5>
                              <span>Tanggal: {moment(e.tanggal).format('L')}</span>
                          </h5>
                        </div>
                      </div>
                      <div className="row">
                        {/* PEMASUKAN */}
                        <div className="col-md-6">
                          <div className="card my-2">
                            <div className="table-responsive text-nowrap">
                              <table className="table">
                                <thead>
                                  <tr className='d-flex justify-content-between'>
                                    <th>Pemasukan</th>
                                  </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                  <tr>
                                    <td colSpan={2}><strong>Gaji Pokok</strong></td>
                                    <td colSpan={3}>{formatRupiah(e.gajiPokok)}</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2}><strong>Gaji Tunjangan</strong></td>
                                    <td colSpan={3}>{formatRupiah(e.gajiTunjangan)}</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2}><strong>Lembur</strong></td>
                                    <td colSpan={3}>{e.lembur === true ? "Ada" : "Tidak Ada"}</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2}><strong>Lama Lembur</strong></td>
                                    <td colSpan={3}>{e.lamaLembur} jam</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2}><strong>Total Gaji Lembur</strong></td>
                                    <td colSpan={3}>{formatRupiah(e.totalGajiLembur)}</td>
                                  </tr>
                                  <tr className='table-info'>
                                    <td colSpan={2}><strong>Total</strong></td>
                                    <td colSpan={3}>{formatRupiah(e.gajiPokok + e.gajiTunjangan + e.totalGajiLembur)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
  
                        {/* PENGELUARAN */}
                        <div className="col-md-6">
                          <div className="card my-2">
                            <div className="table-responsive text-nowrap">
                              <table className="table">
                                <thead>
                                  <tr className='d-flex justify-content-between'>
                                    <th>Pemotongan</th>
                                  </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                  <tr>
                                    <td colSpan={2}><strong>Pph 21</strong></td>
                                    <td colSpan={3}>{e.potongan[0].pph21}</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2}><strong>Bpjs Kesehatan</strong></td>
                                    <td colSpan={3}>{e.potongan[0].bpjsKesehatan}</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2}><strong>Bpjs Ketenaga Kerjaan</strong></td>
                                    <td colSpan={3}>{e.potongan[0].bpjsKetenagaKerjaan}</td>
                                  </tr>
                                  <tr className='table-danger'>
                                    <td colSpan={2}><strong>Total</strong></td>
                                    <td colSpan={3}>{formatRupiah(e.potongan[0].pph21 + e.potongan[0].bpjsKesehatan + e.potongan[0].bpjsKetenagaKerjaan)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
  
                        </div>
                      </div>
  
                      <div className="card my-2">
                        <div className="table-responsive text-nowrap">
                          <table className="table">
                            <tbody className="table-border-bottom-0">
                              <tr className='table-success'>
                                <td colSpan={2}><strong>Total Gaji</strong></td>
                                <td colSpan={3}>{formatRupiah((e.gajiPokok + e.gajiTunjangan + e.totalGajiLembur) - (e.potongan[0].pph21 + e.potongan[0].bpjsKesehatan + e.potongan[0].bpjsKetenagaKerjaan))}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                }
              })
              : null
              }

              <button type="button" onClick={props.handlePrint} class="btn btn-info mt-3">Cetak Laporan</button>
              <hr className="my-5" />

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