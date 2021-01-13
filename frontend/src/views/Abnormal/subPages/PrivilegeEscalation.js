import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CButton,
  CSelect
} from '@coreui/react'

import usersData from './abnormalData'
import Clock from '../../Clock/Clock'




const fields = [
  {key:'Logid',_style:{width:'10%'}},
  {key:'TIME',_style:{width:'20%'}},
  {key:'IP',_style:{width:'10%'}}, 
  {key:'File_Path',_style:{width:'30%'}},
  {key:'UUID',_style:{width:'10%'}},
  {key:'Detail',_style:{width:'10%'}, lable:''}
]

function PrivilegeEscalation() {

    const[inputs, setInputs] =useState({
      search:'',
      startDate:'',
      endDate:'',
      selectColum:''
    });

    const { search, startDate,endDate,selectColum } = inputs;

    function handlerChange(e){
       const { value, name } = e.target;  
       
       setInputs({
        ...inputs,
        [name]:value
       });
    };

    function submitValue(){
      alert(`searchValue: ${search} & startValue: ${startDate} & endValue: ${endDate} & selectColum:${selectColum}`)
    };

    function detailShow(){
      alert(`detail`)
    }

  return (
    <>

      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <Clock/>
                <CRow>
                 
                  <CCol md="2">
                    <CFormGroup row>
                      <CCol xs="12" md="12">
                        <CInput type="date" id="startDate" placeholder="start_date"  onChange={handlerChange} value={startDate} name='startDate'/>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol md="2">
                    <CFormGroup row>
                      <CCol xs="12" md="12">
                        <CInput type="date" id="endDate" placeholder="end_date" onChange={handlerChange} value={endDate} name='endDate'/>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol md="4"></CCol>
                  <CCol md="4">
                    <CRow>
                      <CCol md="4">
                      <CFormGroup>
                        <CSelect custom name="selectColum" onChange={handlerChange} value={selectColum} id="ccyear">
                          <option selected>colum</option>
                          <option>IP</option>
                          <option>File Path</option>
                          <option>UUID</option>
                        </CSelect>
                      </CFormGroup>
                      </CCol>
                      <CCol md="8">
                        <CInputGroup className="input-prepend">
                          <CInput size="100" type="text" placeholder="search" onChange={handlerChange} value={search} name='search' />
                          <CInputGroupAppend>
                            <CButton color="info" onClick={submitValue}>Search</CButton>
                          </CInputGroupAppend>
                        </CInputGroup>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                  <CDataTable
                    items={usersData}
                    fields={fields}
                    //columnFilter
                    itemsPerPage= {10}
                    hover
                    tableFilter
                    pagination
                    scopedSlots = {{
                      'Detail':
                      (item, index)=>{
                        return (
                          <td className="py-2">
                            <CButton
                              color="primary"
                              variant="outline"
                              shape="square"
                              size="sm"
                              onClick={detailShow}
                            >
                             Detail show
                            </CButton>
                          </td>
                          )
                      }

                    }}
                  />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default PrivilegeEscalation


 