import React, { useState } from 'react';
import { Footer } from '../../../components';
import { useDispatch } from 'react-redux';
import { addInfo } from '../../../redux/action';

const Content = () => {
  const dispatch = useDispatch();

    const [info, setInfo] = useState({
        judul: "",
        deskripsi: ""
    })

    const handleBersihkanField = (e) => {
        e.preventDefault();
        setInfo({
            judul: "",
            deskripsiL: ""
        })
    }

    const handleAddInfo = (e) => {
        e.preventDefault();
        dispatch(addInfo(info, localStorage.token));
    }

  return (
    <>
    <div className="layout-page">
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
                <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Tambah Informasi</h4>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card mb-4">
                            <h5 className="card-header">Masukkan Informasi</h5>
                            <hr className="my-0" />
                            <div className="card-body">
                                <div className="row">
                                    <form onSubmit={handleAddInfo} id="formAccountSettings">
                                        <div className="row">
                                            <div className="mb-3 col-md-5 offset-md-1">
                                                <label className="form-label">Judul</label>
                                                <input className="form-control" onChange={(e) => setInfo({ ...info, judul: e.target.value })} type="text" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-10 offset-md-1">
                                                <label className="form-label">Deskripsi</label>
                                                <textarea className="form-control" onChange={(e) => setInfo({ ...info, deskripsi: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-10 offset-md-1">
                                                <button type="submit" class="btn btn-primary">Tambah</button> {' '}
                                                <button onClick={handleBersihkanField} class="btn btn-secondary">Bersihkan</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <div className="content-backdrop fade"></div>
        </div>
    </div>
    </>
  )
}

export default Content