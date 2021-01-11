import React from 'react'
import {
  CWidgetDropdown,
  CRow,
  CCol,
} from '@coreui/react'


const WidgetsDropdown = () => {
  // render
  return (
    <CRow>
      <CCol>
        <CWidgetDropdown
          color="gradient-primary"
          header="823"
          text="일[DAY]"
          footerSlot={<br/>}
        >
        </CWidgetDropdown>
      </CCol>

      <CCol >
        <CWidgetDropdown
          color="gradient-info"
          header="823"
          text="주[WEEK]"
          footerSlot={<br/>}
        >
        </CWidgetDropdown>
      </CCol>

      <CCol>
        <CWidgetDropdown
          color="gradient-warning"
          header="823"
          text="월[MONTH]"
          footerSlot={<br/>}
        >
        </CWidgetDropdown>
      </CCol>

    </CRow>
  )
}

export default WidgetsDropdown
