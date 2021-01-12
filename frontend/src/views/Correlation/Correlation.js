import React from 'react'
import {
  CRow,
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CBadge
} from '@coreui/react'
import MatrixTable from './MatrixTable'
import usersData from '../configMange/configData'

const fields = ['Logid','T값','Attack Type', 'Attack Count','btn']



const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}


const Correlation = () => {
  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              {/*Attack Mattrix tempalte */}
              <CRow>
                <CCol md={10}>
                  <MatrixTable/>
                </CCol>
                <CCol md={2}>
                  TOP 3 Matching
                </CCol>
              </CRow>
              <CDataTable
                    items={usersData}
                    fields={fields}
                    columnFilter
                    tableFilter
                    itemsPerPageSelect
                    itemsPerPage= {10}
                    hover
                    pagination
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


            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  )
}

export default Correlation
