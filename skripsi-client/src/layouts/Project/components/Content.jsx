import React, { useEffect, useState }  from 'react'
import { Footer, Search } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject, addProject, editProject, deleteProject } from '../../../redux/action';

const Content = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects);
  const [nama, setNama] = useState("")
  const [active, setActive] = useState(false);
  const [lblBtn, setLblBtn] = useState("Tambah");
  const [idEdit, setIdEdit] = useState(null)

  const handleEditProject = (data) => {
    setNama(data.nama)
    setIdEdit(data.id)
    setActive(true)
    setLblBtn("Simpan")
  }

  const handleDeleteProject= (id) => {
    dispatch(deleteProject(id, localStorage.token))
  }

  const handleSubmitGolongan = (e) => {
    e.preventDefault();
    let payload = {
      nama: nama
    }
    if(active) {
        dispatch(editProject(payload, idEdit, localStorage.token))
        setLblBtn("Tambah")
    } else {
        dispatch(addProject(payload, localStorage.token))
    }
    setNama("")
  }

  useEffect((e) => {
    dispatch(fetchProject(localStorage.token))
  } ,[dispatch])

  return (
    <>
        <div className="layout-page">
          {/* <Search /> */}
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Project</h4>

            {/* FORM */}
              <div className="card">
                <h5 className="card-header">Tambah Project</h5>
                <hr />
                <div className="row">
                    <form onSubmit={handleSubmitGolongan} id="formAccountSettings">
                        <div className="row">
                            <div className="mb-3 col-md-10 offset-md-1">
                              <label className="form-label">Nama project</label>
                              <input value={nama} onChange={(e) => setNama(e.target.value)} className="form-control" type="text" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-10 offset-md-1">
                                <button type="submit" class="btn btn-primary">{lblBtn}</button> {' '}
                            </div>
                        </div>
                    </form>
                </div>
              </div>

            {/* DATA PROJECT */}
              <div ref={ref} className="card mt-3">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="card-header mt-2">Data Project</h5>
                  </div>
                </div>
                <hr />
                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {projects && projects.length > 0 
                      ?
                      projects.map((e) => {
                        return (
                            <tr key={e.id}>
                                <td>{e.id}</td>
                                <td>{e.nama}</td>
                                <td>
                                    <div className="row">
                                        <div className="col">
                                            <i onClick={()=> handleEditProject(e)} class="fa-solid fa-pen-to-square mr-5"></i>
                                        </div>
                                        <div className="col">
                                            <i onClick={()=> handleDeleteProject(e.id)} class="fa-solid fa-trash-can"></i>
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