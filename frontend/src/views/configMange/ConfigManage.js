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
  CSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle
} from '@coreui/react'

import usersData from './configData'
import Clock from '../Clock/Clock'




const fields = [
  {key:'Logid',_style:{width:'10%'}},
  {key:'TIME',_style:{width:'20%'}},
  {key:'IP',_style:{width:'10%'}}, 
  {key:'File_Path',_style:{width:'30%'}},
  {key:'UUID',_style:{width:'10%'}},
  {key:'History',_style:{width:'10%'}, lable:''}
]

function ConfigManage() {

    const [modal, setModal] = useState(false)

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
                      'History':
                      (item, index)=>{
                        return (
                          <td className="py-2">
                            <CButton 
                            color="primary"
                            variant="outline"
                            shape="square"
                            size="sm"
                            onClick={() => setModal(!modal)}>
                              Detail
                            </CButton>
                          </td>
                          )
                      }

                    }}
                  />

              <CModal show={modal} onClose={setModal}>
                <CModalHeader closeButton>
                  <CModalTitle>형상 변경 내용</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </CModalBody>
                <CModalFooter>
                  <CButton 
                    color="secondary" 
                    onClick={() => setModal(false)}
                  >Cancel</CButton>
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ConfigManage


 