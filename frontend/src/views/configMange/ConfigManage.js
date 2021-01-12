import React from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
} from '@coreui/react'

import usersData from './configData'
import Clock from '../Clock/Clock'



const fields = ['Logid','TIME','IP', 'File_Path', 'User','btn']



const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}


const ConfigManage = () => {
  return (
    <>

      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <Clock/>
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

export default ConfigManage
