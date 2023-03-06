import React, { useEffect, useState } from 'react'
import { Footer } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPresensi, pushClock , editPresensi, getOneKaryawanEmail, addLembur} from '../../../redux/action';
import moment from 'moment';

const Content = () => {
  const dispatch = useDispatch();
  const presensies = useSelector(state => state.presensies);
  const karyawan = useSelector(state => state.karyawanEmail);
  const email = localStorage.email;
  const idKaryawan = karyawan.id;
  const [id, setId] = useState(null)
  const [activeBtn, setActiveBtn] = useState({
    clockin: false,
    clockout: true
  })
  const [dataClock, setDataClock] = useState({
    clockin: "",
    clockout: ""
  })
  const [jamMulai, setJamMulai] = useState(0)

  // let jamMulai = 0;
  let jamSelesai = 0;
  let selisih = 0;
  
  const handleClockIn = (e) => {
    e.preventDefault();

    setActiveBtn({
      clockin: true,
      clockout: false
    })

    setDataClock({
      ...dataClock,
      clockin: moment(new Date()).format()
    })

    let payload = {
      KaryawanId: idKaryawan,
      clockin: new Date(),
      clockout: ""
    }
    console.log(payload.clockin.getHours(), `<<< jam mulai`);
    setJamMulai(payload.clockin.getHours())
    // let mulai = new Date(today + " " + payload.clockin).getHours()
    dispatch(pushClock(payload, localStorage.token)) 
  }

  const handleClockOut = (e) => {
    let todayDate = moment(new Date()).format('L');
    let dateClockIn = [];
    let dateClockOut = [];
    let id = null
    // let clockIn = false;
    if(presensies && presensies.length > 0) {
      dateClockIn = presensies.filter(e => moment(e.clockin).format('L') === todayDate);
      dateClockOut = presensies.filter(e => moment(e.clockout).format('L') === todayDate);
    }

    if(dateClockIn.length > 0) {
      setActiveBtn({
        ...activeBtn,
        clockin: true
      })
      // clockIn = true
      dateClockIn.map((e) => {
        if(moment(e.clockin).format('L') === todayDate) {
          return id = e.id
        }
      })
    }

    e.preventDefault();
    setActiveBtn({
      ...activeBtn,
      clockout: false
    })

    setDataClock({
      ...dataClock,
      clockout: moment(new Date()).format()
    })
    
    
    let payload = {
      ...dataClock,
      KaryawanId: idKaryawan,
      // clockout: moment(new Date()).format()
      clockout: new Date()
    }

    jamSelesai = payload.clockout.getHours()

    selisih = (jamSelesai + 9) - jamMulai;
    console.log(jamMulai, `<<<< mulai`);
    console.log(jamSelesai, `<<<< selesai`);
    console.log(selisih, `<<<<< selisih`);
    dispatch(editPresensi(payload, id, localStorage.token))

    if(selisih > 8) {
      let data = {
        KaryawanId: idKaryawan,
        lamaJam: selisih - 8,
        status: "waitconfirm",
        tanggal: moment(new Date()).format()
      }
      dispatch(addLembur(data, localStorage.token));

      console.log(data, `<<<<< data`);
    }
  }

  const cekDate = () => {
    console.log(`masuk cek date`);
    let todayDate = moment(new Date()).format('L');
    let dateClockIn = [];
    let dateClockOut = [];
    // let clockIn = false;
    if(presensies && presensies.length > 0) {
      dateClockIn = presensies.filter(e => moment(e.clockin).format('L') === todayDate);
      dateClockOut = presensies.filter(e => moment(e.clockout).format('L') === todayDate);
    }

    if(dateClockIn.length > 0) {
      setActiveBtn({
        ...activeBtn,
        clockin: true
      })
      // clockIn = true
      dateClockIn.map((e) => {
        console.log(e, `<<<<<< e`);
        if(moment(e.clockin).format('L') === todayDate) {
          return setId(e.id)
        }
      })
    }

    if(dateClockOut.length > 0) {
      setActiveBtn({
        ...activeBtn,
        clockout: true
      })
    }
  }

  useEffect(()=> {
    dispatch(fetchPresensi(localStorage.token));
    dispatch(getOneKaryawanEmail(email, localStorage.token));

    setTimeout(() => {
      cekDate();
    }, 2000);
  }, [dispatch])

  return (
    <>
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Presensi</h4>

              <div className="card">
                <h5 className="card-header">Silahkan Absen</h5>
                <hr />
                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          <button disabled={activeBtn.clockin} onClick={handleClockIn} type="button" className="btn btn-secondary w-100">Clock In</button>
                        </th>
                        <th>
                          <button disabled={activeBtn.clockout} onClick={handleClockOut} type="button" className="btn btn-secondary w-100">Clock Out</button>
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <hr />

                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr classNameName="text-center">
                        <th colSpan={3}>Log Absensi</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {presensies.map((e, idx) => {
                        if(e.KaryawanId === karyawan.id) {
                          return (
                            <>
                              <tr key={idx}>
                                <td><strong>Clock In</strong></td>
                                <td>{e.clockin !== "" ? moment(e.clockin).format('L') : null}</td>
                              </tr>
                              {e.clockout !== ""
                              ?
                                <tr key={idx + 1}>
                                  <td><strong>Clock Out</strong></td>
                                  <td>{e.clockout !== "" ? moment(e.clockout).format('L') : null}</td>
                                </tr>
                              : null
                              }
                            </>
                          )
                        }
                      })}
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