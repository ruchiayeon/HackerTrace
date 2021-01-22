import React, { lazy, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
} from '@coreui/react'
import axios from 'axios'

import Clock from '../Clock/Clock'
import ConfigCharts from './Configchart'
import Page404 from "../pages/page404/Page404"
import Loading from "../pages/Loading/Loading"

function Dashboard() {
  const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))



  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //이상행위 대시보드 Count 조회
  const [abnormalData, setAbnormalData] =useState(null) 

  const AbnormalDash = async() => {
    try{
      setLoading(true);
      const respose = await axios.post(
        `http://210.114.18.175:8080/ht/dashboard/statics/mitre-attack?hostIp=210.114.19.179`
      )
      const responseDatas = respose.data.data
      setAbnormalData(responseDatas)

      console.log(respose.data.data)
    }catch(e){
      setError(e)
      console.log(e)
    }
    setLoading(false);
  }
  
  const fields = [
    {key:'term', label:"TIME"},
    {key:'initial-access', label:"Initial Access"},
    {key:'execution', label:"Execution"},
    {key:'persistence', label:"Persistence"}, 
    {key:'privilege-escalation', label:"Privilege Escalation"},
    {key:'defense-evasion', label:"Defense Evasion"},
    {key:'credential-access', label:"Credential Access"},
    {key:'discovery', label:"Discovery"}, 
    {key:'lateral-movement', label:"Lateral Movement"},
    {key:'command-and-control', label:"Command And Control"},
    {key:'exfiltration', label:"Exfiltration"},
    {key:'impact', label:"Impact"},
  ]

  if(loading) return <Loading/>;
  if(error) return <Page404/>;
  if(!abnormalData) return AbnormalDash();

  return (
    <>
      {/*첫번째 숫자위젯 */}
      <WidgetsDropdown />
      {/*형상관리 template */}
      <CCard>
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 id="traffic" className="card-title mb-0">형상관리</h4>
              <div className="small text-muted"><Clock/></div>
            </CCol>
          </CRow>
          <ConfigCharts style={{height: '300px', marginTop: '40px'}}/>
        </CCardBody>
      </CCard>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol >
                  <h4 id="traffic" className="card-title mb-0">이상행위</h4>
                  <div className="small text-muted">
                    <h6>업데이트 일자 : {abnormalData[0].updateTime}</h6>
                  </div>
                  <CDataTable
                    items={abnormalData}
                    fields={fields}
                  />
                </CCol>
              </CRow>             
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
