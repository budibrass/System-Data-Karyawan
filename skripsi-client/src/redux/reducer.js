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
    GET_ONE_GAJI,
    ADD_GAJI,
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
    GET_ONE_PROJECT,
    ADD_PROJECT,
    EDIT_PROJECT,
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
  
  const initState = {
    karyawans: [],
    karyawan: {},
    karyawanEmail: {},
    presensies: [],
    login: {},
    salaries: [],
    salary: {},
    lemburs: [],
    lembur: {},
    cuties: [],
    cuti: {},
    reimbursements: [],
    reimbursement: {},
    golongans: [],
    golongan: {},
    projects: [],
    project: {},
    performances: [],
    performance: {},
    infoes: [],
    info: {}
  };
  
  const reducer = (state = initState, action) => {
    switch (action.type) {
      // KARYAWAN
      case FETCH_KARYAWAN:
        return {
          ...state,
          karyawans: action.payload,
        };
      case ADD_KARYAWAN:
        return {
          ...state,
          karyawans: [...state.karyawans, action.payload],
        };
      case GET_ONE_KARYAWAN:
        return {
          ...state,
          karyawan: action.payload,
        };
      case GET_ONE_KARYAWAN_EMAIL:
        return {
          ...state,
          karyawanEmail: action.payload,
        };
      case EDIT_KARYAWAN:
        return {
          ...state,
          karyawans: [...state.karyawans, action.payload],
        };
      case DELETE_KARYAWAN:
        return {
          ...state,
        };
      
      // PRESENSI
      case FETCH_PRESENSI:
        return {
          ...state,
          presensies: action.payload,
        };
      case PUSH_CLOCK:
        return {
          ...state,
          presensies: [...state.presensies, action.payload],
        };
      case EDIT_PRESENSI:
        return {
          ...state,
          presensies: [...state.presensies, action.payload],
        };

      // USER
      case LOGIN:
        return {
          ...state,
          login: action.payload,
        };
      
      // GAJI
      case FETCH_GAJI:
        return {
          ...state,
          salaries: action.payload,
        };
      case ADD_GAJI:
        return {
          ...state,
          salaries: [...state.salaries, action.payload],
        };
      case GET_ONE_GAJI:
        return {
          ...state,
          salary: action.payload,
        };
      case EDIT_GAJI:
        return {
          ...state,
          salaries: [...state.salaries, action.payload],
        };
      case DELETE_GAJI:
        return {
          ...state,
        };
      
      // LEMBUR
      case FETCH_LEMBUR:
        return {
          ...state,
          lemburs: action.payload,
        };
      case ADD_LEMBUR:
        return {
          ...state,
          lemburs: [...state.lemburs, action.payload],
        };
      case GET_ONE_LEMBUR:
        return {
          ...state,
          lembur: action.payload,
        };
      case EDIT_LEMBUR:
        return {
          ...state,
          lemburs: [...state.lemburs, action.payload],
        };

      // CUTI
      case FETCH_CUTI:
        return {
          ...state,
          cuties: action.payload,
        };
      case ADD_CUTI:
        return {
          ...state,
          cuties: [...state.cuties, action.payload],
        };
      case GET_ONE_CUTI:
        return {
          ...state,
          cuti: action.payload,
        };
      case EDIT_CUTI:
        return {
          ...state,
          cuties: [...state.cuties, action.payload],
        };

      // REIMBURSEMENT
      case FETCH_REIMBURSEMENT:
        return {
          ...state,
          reimbursements: action.payload,
        };
      case ADD_REIMBURSEMENT:
        return {
          ...state,
          reimbursements: [...state.reimbursements, action.payload],
        };
      case GET_ONE_REIMBURSEMENT:
        return {
          ...state,
          reimbursement: action.payload,
        };
      case EDIT_REIMBURSEMENT:
        return {
          ...state,
          reimbursements: [...state.reimbursements, action.payload],
        };

      // GOLONGAN
      case FETCH_GOLONGAN:
        return {
          ...state,
          golongans: action.payload,
        };
      case GET_ONE_GOLONGAN:
        return {
          ...state,
          golongan: action.payload,
        };
      case ADD_GOLONGAN:
        return {
          ...state,
          golongans: [...state.golongans, action.payload],
        };
      case EDIT_GOLONGAN:
        return {
          ...state,
          golongans: [...state.golongans, action.payload],
        };
      case DELETE_GOLONGAN:
        return {
          ...state,
        };
      
      // PROJECT
      case FETCH_PROJECT:
        return {
          ...state,
          projects: action.payload,
        };
      case GET_ONE_PROJECT:
        return {
          ...state,
          project: action.payload,
        };
      case ADD_PROJECT:
        return {
          ...state,
          projects: [...state.projects, action.payload],
        };
      case EDIT_PROJECT:
        return {
          ...state,
          projects: [...state.projects, action.payload],
        };
      case DELETE_PROJECT:
        return {
          ...state,
        };

      // PROJECT
      case FETCH_PERFORMA:
        return {
          ...state,
          performances: action.payload,
        };
      case GET_ONE_PERFORMA:
        return {
          ...state,
          performance: action.payload,
        };
      case ADD_PERFORMA:
        return {
          ...state,
          performances: [...state.performances, action.payload],
        };
      case EDIT_PERFORMA:
        return {
          ...state,
          performances: [...state.performances, action.payload],
        };
      case DELETE_PERFORMA:
        return {
          ...state,
        };

      // INFO
      case FETCH_INFO:
        return {
          ...state,
          infoes: action.payload,
        };
      case GET_ONE_INFO:
        return {
          ...state,
          info: action.payload,
        };
      case ADD_INFO:
        return {
          ...state,
          infoes: [...state.infoes, action.payload],
        };
      case EDIT_INFO:
        return {
          ...state,
          infoes: [...state.infoes, action.payload],
        };
      case DELETE_INFO:
        return {
          ...state,
        };

      default:
        return state;
    }
  };
  
  export default reducer;
  