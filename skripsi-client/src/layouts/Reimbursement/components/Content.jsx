import React, { useEffect, useState }  from 'react'
import { Footer } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReimbursement, addReimbursement, getOneKaryawanEmail } from '../../../redux/action';
import { formatRupiah } from "../../../utils/formatRupiah";
import moment from "moment";
import axios from "axios";

const Content = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const reimbursements = useSelector(state => state.reimbursements);
  const karyawan = useSelector(state => state.karyawanEmail);
  const id = karyawan.id;
  const role = localStorage.role;
  const email = localStorage.email;
  const[ dataReimbursement, setDataReimbursement] = useState({
    tanggal: "",
    namaReimbursement: "",
    jumlah: 0,
    imageUrl: "",
    status: "waitconfirm",
  })
  const [image, setImage] = useState(null);
  const [fileImage, setFileImage] = useState("")

  const handleReimbursement = (e) => {
    e.preventDefault();
    let payload = {
      ...dataReimbursement,
      KaryawanId: id
    }

    dispatch(addReimbursement(payload, localStorage.token))
    // save image to backend

    let formData = new FormData();
    formData.append("photo", fileImage);

    fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data, `<<<< data`);
        // setSubmitForm({
        //     ...submitForm,
        //     imageUrl: data.image
        // })
    });
  }

  const uploadImage =  (e) => {
      let uploaded = e.target.files[0];
      setFileImage(e.target.files[0]);
      setImage(URL.createObjectURL(uploaded));
      setDataReimbursement({
        ...dataReimbursement,
        imageUrl: URL.createObjectURL(uploaded)
      })
  }

  useEffect(() => {
    dispatch(fetchReimbursement(localStorage.token))
    dispatch(getOneKaryawanEmail(email, localStorage.token))
  }, [dispatch])

  return (
    <>
        <div className="layout-page">
          
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Reimbursement</h4>

              <div className="card">
                <h5 className="card-header">Ajukan Reimbursement</h5>
                <hr />
                <div className="row">
                    <form onSubmit={handleReimbursement} id="formAccountSettings">
                        <div className="row">
                            <div className="mb-3 col-md-5 offset-md-1">
                                <label class="form-label">Tanggal</label>
                                <input
                                  class="form-control"
                                  type="date"
                                  name="tanggal"
                                  autofocus
                                  onChange={(e) => setDataReimbursement({ ...dataReimbursement, tanggal: e.target.value })}
                                />
                            </div>
                            <div className="mb-3 col-md-5">
                                <label class="form-label">Nama Reimbursement</label>
                                <input
                                  class="form-control"
                                  type="text"
                                  name="nama"
                                  onChange={(e) => setDataReimbursement({ ...dataReimbursement, namaReimbursement: e.target.value })}
                                />
                            </div>
                            <div className="mb-3 col-md-5 offset-md-1">
                                <label class="form-label">Jumlah</label>
                                <input
                                  class="form-control"
                                  type="number"
                                  name="jumlah"
                                  onChange={(e) => setDataReimbursement({ ...dataReimbursement, jumlah: Number(e.target.value) })}
                                />
                            </div>
                            <div className="mb-3 col-md-5">
                                <label for="formFile" class="form-label">Upload bukti pembayaran / kwitansi</label>
                                <input class="form-control" accept="image/*" name="image" type="file" id="formFile" onChange={uploadImage} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-10 offset-md-1">
                                <button type="submit" class="btn btn-primary">Ajukan Reimbursement</button>
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
                        <th>Data Reimbursement</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      <tr>
                        <td><strong>Nama</strong></td>
                        <td><strong>Nama Reimbursement</strong></td>
                        <td><strong>Tanggal</strong></td>
                        <td><strong>Jumlah</strong></td>
                        <td><strong>Bukti Pengajuan</strong></td>
                        <td><strong>Status</strong></td>
                      </tr>
                      {reimbursements && reimbursements.length> 0
                      ?
                        reimbursements.map((e) => {
                          if(role === "admin" || e.KaryawanId === id) {
                            return (
                              <tr key={e.id}>
                                <td>{e.namaReimbursement}</td>
                                <td>{e.namaReimbursement}</td>
                                <td>{e.tanggal ? e.tanggal.slice(0, 10) : null}</td>
                                <td>{formatRupiah(e.jumlah)}</td>
                                {/* <td>{e.imageUrl}</td> */}
                                <td>
                                  <img src={e.imageUrl} id="output" width="280px" height="140px" className="img-thumbnail" alt="" />
                                </td>
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