import {
    FETCH_KARYAWAN,
    ADD_KARYAWAN,
    GET_ONE_KARYAWAN,
    GET_ONE_KARYAWAN_EMAIL,
    EDIT_KARYAWAN,
    DELETE_KARYAWAN,

    FETCH_PRESENSI,
    PUSH_CLOCK,
    EDIT_PRESENSI,

    LOGIN,

    FETCH_GAJI,
    ADD_GAJI,
    GET_ONE_GAJI,
    EDIT_GAJI,
    DELETE_GAJI,

    FETCH_LEMBUR,
    ADD_LEMBUR,
    GET_ONE_LEMBUR,
    EDIT_LEMBUR,

    FETCH_CUTI,
    ADD_CUTI,
    GET_ONE_CUTI,
    EDIT_CUTI,

    FETCH_REIMBURSEMENT,
    ADD_REIMBURSEMENT,
    GET_ONE_REIMBURSEMENT,
    EDIT_REIMBURSEMENT,

    FETCH_GOLONGAN,
    GET_ONE_GOLONGAN,
    ADD_GOLONGAN,
    DELETE_GOLONGAN,
    EDIT_GOLONGAN,

    FETCH_PROJECT,
    ADD_PROJECT,
    EDIT_PROJECT,
    GET_ONE_PROJECT,
    DELETE_PROJECT,
    FETCH_PERFORMA,
    GET_ONE_PERFORMA,
    ADD_PERFORMA,
    EDIT_PERFORMA,
    DELETE_PERFORMA,

    FETCH_INFO,
    GET_ONE_INFO,
    ADD_INFO,
    EDIT_INFO,
    DELETE_INFO
  } from "../utils/constants";
  import swal from 'sweetalert';
  import api from "../api/api";
  
// KARYAWAN
  export const fetchKaryawan = (token) => {
    return async (dispatch) => {
      try {
        const response = await api.get("karyawan", token);
        if (response) {
          dispatch({ type: FETCH_KARYAWAN, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error fetch karyawan`);
      }
    };
  };

  export const getOneKaryawan = (id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.get(`karyawan/${id}`, token);
        if (response) {
          dispatch({ type: GET_ONE_KARYAWAN, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error get one karyawan`);
      }
    };
  };

  export const getOneKaryawanEmail = (email, token) => {
    return async (dispatch) => {
      try {
        const response = await api.get(`karyawan/email/${email}`, token);
        if (response) {
          dispatch({ type: GET_ONE_KARYAWAN_EMAIL, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error get one karyawan email`);
      }
    };
  };

  export const addKaryawan = (payload, token) => {
    return async (dispatch) => {
      try {
        const response = await api.post("karyawan", payload, token);
        if (response) {
          console.log(response, `<<<< response`);
          dispatch({ type: ADD_KARYAWAN, payload: response.data });
          swal("Selamat", "Data Karyawan berhasl ditambahan", "success");
        }
      } catch (error) {
        console.log(error, `<<< error add karyawan`);
      }
    };
  };

  export const editKaryawan = (payload, id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.put(`karyawan/${id}`, payload, token);
        if (response) {
          dispatch({ type: EDIT_KARYAWAN, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<< error edit karyawan`);
      }
    };
  };

  export const deleteKaryawan = (id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.delete(`karyawan/${id}`, token);
        if (response) {
          dispatch({ type: DELETE_KARYAWAN });
          dispatch(fetchKaryawan());
        }
      } catch (error) {
        console.log(error, `<<< error delete karyawan`);
      }
    };
  };

  // PRESENSI
  export const fetchPresensi = (token) => {
    return async (dispatch) => {
      try {
        const response = await api.get("presensi", token);
        if (response) {
          dispatch({ type: FETCH_PRESENSI, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error fetch karyawan`);
      }
    };
  };

  export const pushClock = (payload, token) => {
    return async (dispatch) => {
      try {
        const response = await api.post("presensi", payload, token);
        if (response) {
          swal("Selamat", "Data Clockin berhasil tersimpan", "success");
          dispatch({ type: PUSH_CLOCK, payload: response.data });
          dispatch(fetchPresensi())
        }
      } catch (error) {
        console.log(error, `<<< error add presensi`);
      }
    };
  };

  export const editPresensi = (payload, id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.put(`presensi/${id}`, payload, token);
        if (response) {
          console.log(response, `<<<< response`);
          swal("Selamat", "Data Clockout berhasil tersimpan", "success");
          dispatch({ type: EDIT_PRESENSI, payload: response.data });
          dispatch(fetchPresensi(token))
        }
      } catch (error) {
        console.log(error, `<<< error edit presensi`);
      }
    };
  };
  
  // USER
  export const login = (payload) => {
    return async (dispatch) => {
      try {
        const response = await api.login("user/register", payload);
        if (response) {
          dispatch({ type: LOGIN, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<< error add presensi`);
      }
    };
  };

  // GAJI
  export const fetchGaji = (token) => {
    return async (dispatch) => {
      try {
        const response = await api.get("gaji", token);
        if (response) {
          dispatch({ type: FETCH_GAJI, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error fetch gaji`);
      }
    };
  };

  export const getOneGaji = (id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.get(`gaji/${id}`, token);
        if (response) {
          dispatch({ type: GET_ONE_GAJI, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error get one gaji`);
      }
    };
  };

  export const addGaji = (payload, token) => {
    return async (dispatch) => {
      try {
        const response = await api.post("gaji", payload, token);
        if (response) {
          swal("Selamat", "Data berhasil tersimpan", "success");
          dispatch({ type: ADD_GAJI, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<< error add gaji`);
      }
    };
  };

  export const editGaji = (payload, id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.put(`gaji/${id}`, payload, token);
        if (response) {
          swal("Selamat", "Data berhasil diubah", "success");
          dispatch({ type: EDIT_GAJI, payload: response.data });
        }
      } catch (error) {
        swal("Error", "Maaf terjadi kesahalahan", "error");
        console.log(error, `<<< error edit gaji`);
      }
    };
  };

  export const deleteGaji = (id, token) => {
    return async (dispatch) => {
      try {
        const del = await swal({
          title: "Peringatan",
          text: "Apakah anda yakin ingin menghapus data ini ?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })

        if(del) {
          const response = await api.delete(`gaji/${id}`, token);
          if (response) {
            dispatch({ type: DELETE_GAJI });
            dispatch(fetchGaji());
            swal("Selamat", "Data berhasil dihapus", "success", {
              icon: "success",
            });
          }
        }
      } catch (error) {
        swal("Error", "Maaf terjadi kesahalahan", "error");
        console.log(error, `<<< error delete gaji`);
      }
    };
  };

  // LEMBUR
  export const fetchLembur = (token) => {
    return async (dispatch) => {
      try {
        const response = await api.get("lembur", token);
        if (response) {
          dispatch({ type: FETCH_LEMBUR, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error fetch lembur`);
      }
    };
  };

  export const addLembur = (payload, token) => {
    return async (dispatch) => {
      try {
        const response = await api.post("lembur", payload, token);
        if (response) {
          dispatch({ type: ADD_LEMBUR, payload: response.data });
          dispatch(fetchLembur(token))
        }
      } catch (error) {
        console.log(error, `<<< error add lembur`);
      }
    };
  };
  
  export const getOneLembur = (id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.get(`lembur/${id}`, token);
        if (response) {
          dispatch({ type: GET_ONE_LEMBUR, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error get one lembur`);
      }
    };
  };

  export const editLembur = (payload, id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.put(`lembur/${id}`, payload, token);
        if (response) {
          dispatch({ type: EDIT_LEMBUR, payload: response.data });
          dispatch(fetchLembur(token))
        }
      } catch (error) {
        console.log(error, `<<< error edit lembur`);
      }
    };
  };

  // CUTI
  export const fetchCuti = (token) => {
    return async (dispatch) => {
      try {
        const response = await api.get("cuti", token);
        if (response) {
          dispatch({ type: FETCH_CUTI, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error fetch cuti`);
      }
    };
  };

  export const addCuti = (payload, token) => {
    return async (dispatch) => {
      try {
        const response = await api.post("cuti", payload, token);
        if (response) {
          dispatch({ type: ADD_CUTI, payload: response.data });
          dispatch(fetchCuti(token))
        }
      } catch (error) {
        console.log(error, `<<< error add cuti`);
      }
    };
  };

  export const getOneCuti= (id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.get(`cuti/${id}`, token);
        if (response) {
          dispatch({ type: GET_ONE_CUTI, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error get one cuti`);
      }
    };
  };

  export const editCuti = (payload, id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.put(`cuti/${id}`, payload, token);
        if (response) {
          dispatch({ type: EDIT_CUTI, payload: response.data });
          dispatch(fetchCuti(token))
        }
      } catch (error) {
        console.log(error, `<<< error edit cuti`);
      }
    };
  };

  // REIMBURSEMENT
  export const fetchReimbursement = (token) => {
    return async (dispatch) => {
      try {
        const response = await api.get("reimbursement", token);
        if (response) {
          dispatch({ type: FETCH_REIMBURSEMENT, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error fetch cuti`);
      }
    };
  };

  export const addReimbursement = (payload, token) => {
    return async (dispatch) => {
      try {
        const response = await api.post("reimbursement", payload, token);
        if (response) {
          dispatch({ type: ADD_REIMBURSEMENT, payload: response.data });
          dispatch(fetchReimbursement(token))
        }
      } catch (error) {
        console.log(error, `<<< error add reimbursement`);
      }
    };
  };

  export const getOneReimbursement= (id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.get(`reimbursement/${id}`, token);
        if (response) {
          dispatch({ type: GET_ONE_REIMBURSEMENT, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error get one reimbursement`);
      }
    };
  };

  export const editReimbursement = (payload, id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.put(`reimbursement/${id}`, payload, token);
        if (response) {
          dispatch({ type: EDIT_REIMBURSEMENT, payload: response.data });
          dispatch(fetchReimbursement(token))
        }
      } catch (error) {
        console.log(error, `<<< error edit reimbursement`);
      }
    };
  };

  // GOLONGAN
  export const fetchGolongan = (token) => {
    return async (dispatch) => {
      try {
        const response = await api.get("golongan", token);
        if (response) {
          dispatch({ type: FETCH_GOLONGAN, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error fetch golongan`);
      }
    };
  };

  export const getOneGolongan= (id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.get(`golongan/${id}`, token);
        if (response) {
          dispatch({ type: GET_ONE_GOLONGAN, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error get one golongan`);
      }
    };
  };

  export const addGolongan = (payload, token) => {
    return async (dispatch) => {
      try {
        const response = await api.post("golongan", payload, token);
        if (response) {
          swal("Selamat", "Data berhasil tersimpan", "success");
          dispatch({ type: ADD_GOLONGAN, payload: response.data });
          dispatch(fetchGolongan(token))
        }
      } catch (error) {
        console.log(error, `<<< error add golongan`);
      }
    };
  };

  export const editGolongan = (payload, id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.put(`golongan/${id}`, payload, token);
        if (response) {
          swal("Selamat", "Data berhasil diubah", "success");
          dispatch({ type: EDIT_GOLONGAN, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<< error edit golongan`);
      }
    };
  };

  export const deleteGolongan = (id, token) => {
    return async (dispatch) => {
      try {
        const del = await swal({
          title: "Peringatan",
          text: "Apakah anda yakin ingin menghapus data ini ?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })

        if(del) {
          const response = await api.delete(`golongan/${id}`, token);
          if (response) {
            dispatch({ type: DELETE_GOLONGAN });
            dispatch(fetchGolongan(token));
            swal("Selamat", "Data berhasil dihapus", "success", {
              icon: "success",
            });
          }
        }
      } catch (error) {
        console.log(error, `<<< error delete golongan`);
      }
    };
  };

  // PROJECT
  export const fetchProject = (token) => {
    return async (dispatch) => {
      try {
        const response = await api.get("project", token);
        if (response) {
          dispatch({ type: FETCH_PROJECT, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error fetch project`);
      }
    };
  };

  export const getOneProject= (id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.get(`project/${id}`, token);
        if (response) {
          dispatch({ type: GET_ONE_PROJECT, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error get one project`);
      }
    };
  };

  export const addProject = (payload, token) => {
    return async (dispatch) => {
      try {
        const response = await api.post("project", payload, token);
        if (response) {
          swal("Selamat", "Data berhasil tersimpan", "success");
          dispatch({ type: ADD_PROJECT, payload: response.data });
          dispatch(fetchProject(token));
        }
      } catch (error) {
        console.log(error, `<<< error add project`);
      }
    };
  };

  export const editProject = (payload, id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.put(`project/${id}`, payload, token);
        if (response) {
          swal("Selamat", "Data berhasil diubah", "success");
          dispatch({ type: EDIT_PROJECT, payload: response.data });
          dispatch(fetchProject(token));
        }
      } catch (error) {
        console.log(error, `<<< error edit project`);
      }
    };
  };

  export const deleteProject = (id, token) => {
    return async (dispatch) => {
      try {
        const del = await swal({
          title: "Peringatan",
          text: "Apakah anda yakin ingin menghapus data ini ?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })

        if(del) {
          const response = await api.delete(`project/${id}`, token);
          if (response) {
            dispatch({ type: DELETE_PROJECT });
            dispatch(fetchProject(token));
            swal("Selamat", "Data berhasil dihapus", "success", {
              icon: "success",
            });
          }
        }
      } catch (error) {
        console.log(error, `<<< error delete project`);
      }
    };
  };

  // PERFORMANCE
  export const fetchPerforma = (token) => {
    return async (dispatch) => {
      try {
        const response = await api.get("performa", token);
        if (response) {
          dispatch({ type: FETCH_PERFORMA, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error fetch performa`);
      }
    };
  };

  export const getOnePerforma= (id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.get(`performa/${id}`, token);
        if (response) {
          dispatch({ type: GET_ONE_PERFORMA, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error get one performa`);
      }
    };
  };

  export const addPerforma = (payload, token) => {
    return async (dispatch) => {
      try {
        const response = await api.post("performa", payload, token);
        if (response) {
          swal("Selamat", "Data berhasil tersimpan", "success");
          dispatch({ type: ADD_PERFORMA, payload: response.data });
          // dispatch(fetchProject(token));
        }
      } catch (error) {
        console.log(error, `<<< error add performa`);
      }
    };
  };

  export const editPerforma = (payload, id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.put(`performa/${id}`, payload, token);
        if (response) {
          swal("Selamat", "Data berhasil diubah", "success");
          dispatch({ type: EDIT_PERFORMA, payload: response.data });
          // dispatch(fetchProject(token));
        }
      } catch (error) {
        console.log(error, `<<< error edit performa`);
      }
    };
  };

  export const deletePerforma = (id, token) => {
    return async (dispatch) => {
      try {
        const del = await swal({
          title: "Peringatan",
          text: "Apakah anda yakin ingin menghapus data ini ?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })

        if(del) {
          const response = await api.delete(`performa/${id}`, token);
          if (response) {
            dispatch({ type: DELETE_PERFORMA });
            dispatch(fetchPerforma(token));
            swal("Selamat", "Data berhasil dihapus", "success", {
              icon: "success",
            });
          }
        }
      } catch (error) {
        console.log(error, `<<< error delete performa`);
      }
    };
  };

  // INFO
  export const fetchInfo = (token) => {
    return async (dispatch) => {
      try {
        const response = await api.get("info", token);
        if (response) {
          dispatch({ type: FETCH_INFO, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error fetch info`);
      }
    };
  };

  export const getOneInfo= (id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.get(`info/${id}`, token);
        if (response) {
          dispatch({ type: GET_ONE_INFO, payload: response.data });
        }
      } catch (error) {
        console.log(error, `<<<<<<<<< error get one info`);
      }
    };
  };

  export const addInfo = (payload, token) => {
    return async (dispatch) => {
      try {
        const response = await api.post("info", payload, token);
        if (response) {
          swal("Selamat", "Data berhasil tersimpan", "success");
          dispatch({ type: ADD_INFO, payload: response.data });
          // dispatch(fetchProject(token));
        }
      } catch (error) {
        console.log(error, `<<< error add info`);
      }
    };
  };

  export const editInfo = (payload, id, token) => {
    return async (dispatch) => {
      try {
        const response = await api.put(`info/${id}`, payload, token);
        if (response) {
          swal("Selamat", "Data berhasil diubah", "success");
          dispatch({ type: EDIT_INFO, payload: response.data });
          // dispatch(fetchProject(token));
        }
      } catch (error) {
        console.log(error, `<<< error edit info`);
      }
    };
  };

  export const deleteInfo = (id, token) => {
    return async (dispatch) => {
      try {
        const del = await swal({
          title: "Peringatan",
          text: "Apakah anda yakin ingin menghapus data ini ?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })

        if(del) {
          const response = await api.delete(`info/${id}`, token);
          if (response) {
            dispatch({ type: DELETE_INFO });
            dispatch(fetchInfo(token));
            swal("Selamat", "Data berhasil dihapus", "success", {
              icon: "success",
            });
          }
        }
      } catch (error) {
        console.log(error, `<<< error delete info`);
      }
    };
  };