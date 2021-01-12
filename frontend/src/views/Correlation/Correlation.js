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
            <h2>상관분석</h2>
             <MatrixTable/>
            </CCardBody>
            </CCard>
            </CCol>
            </CRow>

    </>
  )
}

export default Correlation
