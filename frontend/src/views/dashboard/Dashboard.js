import React, { lazy } from 'react'
import {

  CCard,
  CCardBody,
  CCardHeader,
  CCol,

  CRow,

} from '@coreui/react'


import Clock from '../Clock/Clock'

import MainChartExample from '../charts/MainChartExample.js'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))


const Dashboard = () => {
  return (
    <>
      {/*첫번째 숫자위젯 */}
      <WidgetsDropdown />
      {/*형상관리 template */}
      <CCard>
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 id="traffic" className="card-title mb-0">형상변경</h4>
              <div className="small text-muted"><Clock/></div>
            </CCol>
          </CRow>
          <MainChartExample style={{height: '300px', marginTop: '40px'}}/>
        </CCardBody>
      </CCard>

     



      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              Traffic {' & '} Sales
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol >

                  <table>
                    <thead>
                      <tr>
                        <th>Initial Access</th>
                        <th>Execution</th>
                        <th>Persistence</th>
                        <th>Privilege Escalation</th>
                        <th>Defense Evasion</th>
                        <th>Credential Access</th>
                        <th>Discovery</th>
                        <th>Lateral Movement</th>
                        <th>Collection</th>
                        <th>Command and Control</th>
                        <th>Exfiltration</th>
                        <th>Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                      </tr>
                    </tbody>
                  </table>

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
