import React, { useEffect }  from 'react'
import { Footer } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGaji } from '../../../redux/action';
import { useNavigate } from "react-router-dom";

const Content = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const salaries = useSelector(state => state.salaries);
  let tmp = 0

  console.log(salaries, `<<<< salaries`);
//   const data = salaries.reduce((e) => e.totalGaji)
//   console.log(data, `<<<, data`);

  useEffect(() => {
    dispatch(fetchGaji(localStorage.token))
  } ,[dispatch])

  return (
    <>
        <div className="layout-page">
          {/* <Search /> */}
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> keuangan</h4>

              <div className="card">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="card-header mt-2">Data Keuangan</h5>
                  </div>
                </div>
                <hr />
                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Tahun</th>
                        <th>Bulan</th>
                        <th>Total Pengeluaran</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {/* {karyawans && karyawans.length > 0 
                      ?
                      karyawans.map((e, idx) => {
                        return (
                          <tr key={e.id}>
                            <td>{e.nip}</td>
                            <td>{e.namaDepan}{' '}{e.namaBelakang}</td>
                            <td>{e.jabatan}</td>
                            <td>{e.email}</td>
                          </tr>
                        )
                      })
                      : null
                      } */}
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