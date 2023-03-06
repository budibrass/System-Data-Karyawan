import React, { useEffect } from 'react';
import { Footer, Search } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInfo, deleteInfo } from '../../../redux/action';
import { useNavigate } from 'react-router-dom';
import moment from "moment";

const Content = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const infoes = useSelector(state => state.infoes);
  const role = localStorage.role;
  console.log(role, `<<< role`);

  console.log(infoes, `<<<< infoes`);

  const handleDeleteInfo = (id) => {
    dispatch(deleteInfo(id))
  }

  const handleToEditInfoPage = (id) => {
    navigate(`edit-info/${id}`)
  }

  useEffect(() => {
    dispatch(fetchInfo())
  }, [dispatch])

  return (
    <>
        <div className="layout-page">
          {/* <Search /> */}

          <div className="content-wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Informasi</h4>

              {/* DATA INFO*/}

              {infoes && infoes.length > 0
              ? infoes.map((e) => {
                return (
                  <div class="card accordion-item active mt-2">
                      <h2 class="accordion-header" id="headingOne">
                        <button
                          type="button"
                          class="accordion-button"
                          data-bs-toggle="collapse"
                          data-bs-target="#accordionOne"
                          aria-expanded="true"
                          aria-controls="accordionOne"
                        >
                          <h1>{e.judul}</h1>
                        </button>
                      </h2>

                      <div
                        id="accordionOne"
                        class="accordion-collapse collapse show"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                          {e.deskripsi}
                        </div>
                      </div>
                      <div class="card-footer">
                        <small class="text-muted">Last updated {moment(e.updatedAt).format('L')}</small>
                        {role === "admin"
                        ?
                          <div className='d-flex justify-content-between'>
                            {/* <i onClick={()=> handleToEditInfoPage(e.id)}  class="fa-solid fa-pen-to-square mr-3"></i> */}
                            <i onClick={()=> handleDeleteInfo(e.id)} class="fa-solid fa-trash-can"></i>
                          </div>
                        : null
                        }
                      </div>
                  </div>
                )
              })
              : null
              }
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