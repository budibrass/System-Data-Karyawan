import React, { useRef } from 'react'
import { Footer } from '../../../components';
import { useReactToPrint } from 'react-to-print';
import { ComponentToPrint } from "../test"

// const ComponentToPrint = React.forwardRef((props, ref) => {
//     return (
//       <div ref={ref}>My cool content here!</div>
//     );
//   });

const Content = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    

  return (
    <>

        <ComponentToPrint ref={componentRef} />
        <button onClick={handlePrint}>Print this out!</button>

        {/* <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /</span> Cetak Laporan</h4>

              <div className="card">
                <h5 className="card-header">Cetak Laporan</h5>
                <hr />
                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Judul Laporan</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                    <tr>
                        <td>Laporan Presensi</td>
                        <td>
                            <button type="button" onClick={handlePrintPresensi} className="btn btn-secondary me-2">Cetak</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Laporan Gaji</td>
                        <td>
                            <button type="button" className="btn btn-secondary me-2">Cetak</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Laporan Lembur</td>
                        <td>
                            <button type="button" className="btn btn-secondary me-2">Cetak</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Laporan Cuti</td>
                        <td>
                            <button type="button" className="btn btn-secondary me-2">Cetak</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Laporan Reimbursement</td>
                        <td>
                            <button type="button" className="btn btn-secondary me-2">Cetak</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Laporan Kinerja</td>
                        <td>
                            <button type="button" className="btn btn-secondary me-2">Cetak</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Laporan Project</td>
                        <td>
                            <button type="button" className="btn btn-secondary me-2">Cetak</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Laporan Keuangan</td>
                        <td>
                            <button type="button" className="btn btn-secondary me-2">Cetak</button>
                        </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <hr className="my-5" />
            </div>

            <Footer />

            <div className="content-backdrop fade"></div>
          </div>
        </div> */}
    </>
  )
}

export default Content