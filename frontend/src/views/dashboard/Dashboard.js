import React, { lazy } from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
} from '@coreui/react'

import usersData from '../../views/users/UsersData'
import Clock from '../Clock/Clock'
import MainChartExample from '../charts/MainChartExample.js'


const fields = ['TIME','Initial_Access', 'Execution', 'Persistence','Privilege_Escalation',
'Defense_Evasion','Credential_Access','Discovery','Lateral_Movement','Collection','Command_and_Control','Exfiltration','Impact']

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
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
            <CCardBody>
              <CRow>
                <CCol >
                <h4 id="traffic" className="card-title mb-0">이상행위</h4>
                <div className="small text-muted"><Clock/></div>
                  <CDataTable
                    items={usersData}
                    fields={fields}
                   
                   
                    scopedSlots = {{
                      'status':
                        (item)=>(
                          <td>
                            <CBadge color={getBadge(item.status)}>
                              {item.status}
                            </CBadge>
                          </td>
                        )

                    }}
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
