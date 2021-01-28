import React from 'react'
import {
  CCol,
  CContainer,
  CRow
} from '@coreui/react'


const Page404 = () => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4">404</h1>
              <h4 className="pt-3">페이지를 찾을 수 없습니다.</h4>
              <p className="text-muted float-left">다른 페이지로 접속해주십시오.</p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
