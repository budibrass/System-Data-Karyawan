import React, { useEffect, useState }  from 'react'
import { Footer, Search } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGolongan, deleteGolongan, addGolongan, editGolongan } from '../../../redux/action';
import { formatRupiah } from "../../../utils/formatRupiah"

const Content = () => {
  const dispatch = useDispatch();
  const golongans = useSelector(state => state.golongans);
  let role = localStorage.role;
  const [dataGolongan, setDataGolongan] = useState({
    kodeGolongan: "",
    namaGolongan: "",
    uangTunjangan: null,
    uangLembur: null
  })
  const [active, setActive] = useState(false);
  const [lblBtn, setLblBtn] = useState("Tambah");
  const [idEdit, setIdEdit] = useState(null)

  const handleEditGolongan = (data) => {
    setDataGolongan({
        kodeGolongan: data.kodeGolongan,
        namaGolongan: data.namaGolongan,
        uangTunjangan: data.uangTunjangan,
        uangLembur: data.uangLembur
    })
    setIdEdit(data.id)
    setActive(true)
    setLblBtn("Simpan")
  }

  const handleDeleteGolongan= (id) => {
    dispatch(deleteGolongan(id, localStorage.token))
  }

  const handleReset = (e) => {
    e.preventDefault()
    setDataGolongan({
        kodeGolongan: "",
        namaGolongan: "",
        uangTunjangan: "",
        uangLembur: ""
    })
    setLblBtn("Tambah")
  }

  const handleSubmitGolongan = (e) => {
    e.preventDefault();
    if(active) {
        dispatch(editGolongan(dataGolongan, idEdit, localStorage.token))
        setLblBtn("Tambah")
    } else {
        let payload = {
            ...dataGolongan,
            uangTunjangan: +dataGolongan.uangTunjangan,
            uangLembur: +dataGolongan.uangLembur,
        }
        dispatch(addGolongan(payload, localStorage.token))
    }
    dispatch(fetchGolongan(localStorage.token))
  }

  useEffect((e) => {
    dispatch(fetchGolongan(localStorage.token))
  } ,[dispatch])

  return (
    <>
        <div className="layout-page">
          {/* <Search /> */}
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Golongan</h4>

                {/* FORM */}
              <div className="card">
                <h5 className="card-header">Tambah Data Golongan</h5>
                <hr />
                <div className="row">
                    <form onSubmit={handleSubmitGolongan} id="formAccountSettings">
                        <div className="row">
                            <div className="mb-3 col-md-5 offset-md-1">
                              <label className="form-label">Kode Golongan</label>
                              <input value={active ? dataGolongan.kodeGolongan : dataGolongan.kodeGolongan} onChange={(e) => setDataGolongan({ ...dataGolongan, kodeGolongan: e.target.value })} className="form-control" type="number" />
                            </div>
                            <div className="mb-3 col-md-5">
                              <label className="form-label">Nama Golongan</label>
                              <input value={active ? dataGolongan.namaGolongan : dataGolongan.namaGolongan} onChange={(e) => setDataGolongan({ ...dataGolongan, namaGolongan: e.target.value })} className="form-control" type="text" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-5 offset-md-1">
                              <label className="form-label">Uang Tunjangan</label>
                              <input value={active ? dataGolongan.uangTunjangan : dataGolongan.uangTunjangan} onChange={(e) => setDataGolongan({ ...dataGolongan, uangTunjangan: e.target.value })} className="form-control" type="number" />
                            </div>
                            <div className="mb-3 col-md-5">
                              <label className="form-label">Uang Lembur</label>
                              <input value={active ? dataGolongan.uangLembur : dataGolongan.uangLembur} onChange={(e) => setDataGolongan({ ...dataGolongan, uangLembur: e.target.value })} className="form-control" type="number" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-10 offset-md-1">
                                <button type="submit" class="btn btn-primary">{lblBtn}</button> {' '}
                                <button onClick={handleReset} class="btn btn-secondary">Batal</button>
                            </div>
                        </div>
                    </form>
                </div>
              </div>

            {/* DATA GOLONGAN */}
              <div className="card mt-3">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="card-header mt-2">Data Golongan</h5>
                  </div>
                </div>
                <hr />
                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Kode Golongan</th>
                        <th>Nama Golongan</th>
                        <th>Uang Lembur</th>
                        <th>uang Tunjangan</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {golongans && golongans.length > 0 
                      ?
                      golongans.map((e) => {
                        return (
                            <tr key={e.id}>
                                <td>{e.kodeGolongan}</td>
                                <td>{e.namaGolongan}</td>
                                <td>{formatRupiah(e.uangLembur)}</td>
                                <td>{formatRupiah(e.uangTunjangan)}</td>
                                <td>
                                    <div className="row">
                                        <div className="col">
                                            <i onClick={()=> handleEditGolongan(e)} class="fa-solid fa-pen-to-square mr-5"></i>
                                        </div>
                                        <div className="col">
                                            <i onClick={()=> handleDeleteGolongan(e.id)} class="fa-solid fa-trash-can"></i>
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