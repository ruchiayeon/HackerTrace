import React from 'react'
import {
  CRow,
  CCard,
  CCardBody,
  CCol,
} from '@coreui/react'
import MatrixTable from './MatrixTable'


const Correlation = () => {
  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <div>table</div>
              {/*Attack Mattrix tempalte */}
              <CRow>
                <CCol md={10}>
                  <MatrixTable/>
                </CCol>
                <CCol md={2}>
                  TOP 3 Matching
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  )
}

export default Correlation
