import React, { useState, useEffect } from 'react';
import { Footer, Navbar } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getOneInfo, editInfo } from "../../../redux/action";
import { useNavigate, useParams } from "react-router-dom";

const EditInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const dataKaryawan = useSelector(state => state.karyawan);
  const info = useSelector(state => state.info)

    console.log(info, `<<<<< info`);

    useEffect(() => {
        dispatch(getOneInfo(+id, localStorage.token))
        // dispatch(fetchGolongan(localStorage.token))
    }, [dispatch, id])

  return (
    <>
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <Navbar />
            <div className="layout-page">
                <div className="content-wrapper">
                    <div className="container-xxl flex-grow-1 container-p-y">
                    <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Ubah Info</h4>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card mb-4">
                                <h5 className="card-header">Ubah Informasi</h5>
                                <hr className="my-0" />
                                <div className="card-body">
                                    <div className="row">
                                        <form id="formAccountSettings">
                                            <div className="row">
                                                <div className="mb-3 col-md-5 offset-md-1">
                                                    <label className="form-label">Judul</label>
                                                    <input className="form-control" type="text" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="mb-3 col-md-10 offset-md-1">
                                                    <label className="form-label">Deskripsi</label>
                                                    <textarea className="form-control" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="mb-3 col-md-10 offset-md-1">
                                                    <button type="submit" class="btn btn-primary">Ubah</button> {' '}
                                                    <button class="btn btn-secondary">Bersihkan</button>
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
        </div>
    </div>
    </>
  )
}

export default EditInfo