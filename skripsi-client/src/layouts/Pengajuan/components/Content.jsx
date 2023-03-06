import React, { useEffect } from "react";
import { Footer } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLembur,
  editLembur,

  fetchCuti,
  editCuti,

  fetchReimbursement,
  editReimbursement
} from "../../../redux/action";
import moment from "moment";
import { formatRupiah } from "../../../utils/formatRupiah";

const Content = () => {
  const dispatch = useDispatch();
  const lemburs = useSelector((state) => state.lemburs);
  const cuties = useSelector((state) => state.cuties);
  const reimbursements = useSelector((state) => state.reimbursements);

  const handleAcceptLembur = (data) => {
    let payload = {
      ...data,
      status : "accept"
    }
    dispatch(editLembur(payload, data.id))
  }

  const handleRejectLembur = (data) => {
    let payload = {
      ...data,
      status : "reject"
    }
    dispatch(editLembur(payload, data.id))
  }

  const handleAcceptCuti = (data) => {
    let payload = {
      ...data,
      status : "accept"
    }
    dispatch(editCuti(payload, data.id))
  }

  const handleRejectCuti = (data) => {
    let payload = {
      ...data,
      status : "reject"
    }
    dispatch(editCuti(payload, data.id))
  }

  const handleAcceptReimbursement = (data) => {
    let payload = {
      ...data,
      status : "accept"
    }
    dispatch(editReimbursement(payload, data.id))
  }

  const handleRejectReimbursement = (data) => {
    let payload = {
      ...data,
      status : "reject"
    }
    dispatch(editReimbursement(payload, data.id))
  }

  useEffect(() => {
    dispatch(fetchLembur(localStorage.token));
    dispatch(fetchCuti(localStorage.token));
    dispatch(fetchReimbursement(localStorage.token));
  }, [dispatch]);

  return (
    <>
      <div className="layout-page">
        <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">
              <span className="text-muted fw-light">Home /</span> Pengajuan
            </h4>

            {/* LEMBUR */}
            <div className="card">
              <div className="row">
                <h5 className="card-header">Pengajuan Lembur</h5>
              </div>
              <hr />
              <div className="table-responsive text-nowrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID Karyawan</th>
                      <th>Nama Karyawan</th>
                      <th>Tanggal Pengajuan</th>
                      <th>Jumlah Jam</th>
                      <th className="d-flex justify-content-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-border-bottom-0">
                    {lemburs && lemburs.length > 0
                      ? lemburs.map((e) => {
                          if (e.status === "waitconfirm") {
                            return (
                              <tr key={e.id}>
                                <td>
                                  <span className="badge bg-label-primary me-1">
                                    <strong>{e.KaryawanId}</strong>
                                  </span>
                                </td>
                                <td>
                                  {e.Karyawan ? e.Karyawan.namaDepan : null}
                                </td>
                                <td>
                                  {e.tanggal ? e.tanggal.slice(0, 10) : null}
                                </td>
                                <td>{e.lamaJam}</td>
                                <td className="d-flex justify-content-center">
                                  <button onClick={()=> handleAcceptLembur(e)} type="button" class="btn btn-success">
                                    Accept
                                  </button> 
                                  <button className="btn"></button>
                                  <button onClick={()=> handleRejectLembur(e)} type="button" class="btn btn-danger">
                                    Reject
                                  </button>
                                </td>
                              </tr>
                            );
                          }
                        })
                      : null}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CUTI */}
            <div className="card mt-3">
              <div className="row">
                <h5 className="card-header">Pengajuan Cuti</h5>
              </div>
              <hr />
              <div className="table-responsive text-nowrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID Karyawan</th>
                      <th>Nama Karyawan</th>
                      <th>Mulai Tanggal</th>
                      <th>Sampai Tanggal</th>
                      <th>Alasan</th>
                      <th className="d-flex justify-content-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-border-bottom-0">
                    {cuties && cuties.length > 0
                      ? cuties.map((e) => {
                          if (e.status === "waitconfirm") {
                            return (
                              <tr key={e.id}>
                                <td>
                                  <span className="badge bg-label-primary me-1">
                                    <strong>{e.KaryawanId}</strong>
                                  </span>
                                </td>
                                <td>
                                  {e.Karyawan ? e.Karyawan.namaDepan : null}
                                </td>
                                <td>{moment(e.mulaiTanggal).format('L')}</td>
                                <td>{moment(e.sampaiTanggal).format('L')}</td>
                                <td>{e.alasan}</td>
                                <td className="d-flex justify-content-center">
                                  <button onClick={()=> handleAcceptCuti(e)} type="button" class="btn btn-success">
                                    Accept
                                  </button>
                                  <button className="btn"></button>
                                  <button onClick={()=> handleRejectCuti(e)} type="button" class="btn btn-danger">
                                    Reject
                                  </button>
                                </td>
                              </tr>
                            );
                          }
                        })
                      : null}
                  </tbody>
                </table>
              </div>
            </div>

            {/* REIMBURSEMENT */}
            <div className="card mt-3">
              <div className="row">
                <h5 className="card-header">Pengajuan Reimbursement</h5>
              </div>
              <hr />
              <div className="table-responsive text-nowrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID Karyawan</th>
                      <th>Nama Karyawan</th>
                      <th>Tanggal Pengajuan</th>
                      <th>Nama Reimbursement</th>
                      <th>Jumlah</th>
                      <th className="d-flex justify-content-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-border-bottom-0">
                    {reimbursements && reimbursements.length > 0
                      ? reimbursements.map((e) => {
                          if (e.status === "waitconfirm") {
                            return (
                              <tr key={e.id}>
                                <td>
                                  <span className="badge bg-label-primary me-1">
                                    <strong>{e.KaryawanId}</strong>
                                  </span>
                                </td>
                                <td>
                                  {e.Karyawan ? e.Karyawan.namaDepan : null}
                                </td>
                                <td>
                                  {moment(e.tanggal).format('L')}
                                </td>
                                <td>{e.namaReimbursement}</td>
                                <td>{formatRupiah(e.jumlah)}</td>
                                <td className="d-flex justify-content-center">
                                  <button onClick={()=> handleAcceptReimbursement(e)} type="button" class="btn btn-success">
                                    Accept
                                  </button>
                                  <button className="btn"></button>
                                  <button onClick={()=> handleRejectReimbursement(e)} type="button" class="btn btn-danger">
                                    Reject
                                  </button>
                                </td>
                              </tr>
                            );
                          }
                        })
                      : null}
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
  );
};

export default Content;
