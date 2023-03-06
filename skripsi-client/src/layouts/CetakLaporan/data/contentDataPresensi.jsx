import React, { useEffect } from 'react';
import { Footer, Search } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPresensi, getOneKaryawanEmail } from '../../../redux/action';
import moment from 'moment';

const Content = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const presensies = useSelector(state => state.presensies);
  const karyawan = useSelector(state => state.karyawanEmail);
  const role = localStorage.role;
  const id = karyawan.id;
  const email = localStorage.email;

  useEffect(() => {
    dispatch(fetchPresensi(localStorage.token))
    dispatch(getOneKaryawanEmail(email, localStorage.token))
    // window.print()
  }, [dispatch])

  return (
    <>
        <div ref={ref} className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">

              <div className="card">
                <h5 className="card-header">Data Absensi</h5>
                <hr />
                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Nama</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {presensies && presensies.length > 0
                      ?
                      presensies.map((e) => {
                        if(role === "admin" || e.Karyawan.id === id) {
                          return (
                            <tr key={e.id}>
                              <td><strong>{moment(e.date).format('dddd')}</strong></td>
                              <td>{moment(e.clockin).format('LT')}</td>
                              <td>{e.clockout !== "" ? moment(e.clockout).format('LT') : null}</td>
                              <td>{e.Karyawan.namaDepan}{' '}{e.Karyawan.namaBelakang}</td>
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