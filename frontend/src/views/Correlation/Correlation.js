import React,{useState} from 'react'
import {
  CRow,
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CFormGroup,
  CInput,
  CSelect,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle
} from '@coreui/react'
import MatrixTable from './MatrixTable'
import usersData from '../configMange/configData'

//axios값 가져오기
import CorrelationAxios from './CorrelationAxios'

const fields = [
  {key:'Logid',_style:{width:'10%'}},
  {key:'T값',_style:{width:'20%'}},
  {key:'Attack Type',_style:{width:'10%'}},
  {key:'UUID',_style:{width:'10%'}},
  {key:'Detail',_style:{width:'10%'}, lable:''}
]


function Correlation() {

  const [modal, setModal] = useState(false)

  const[inputs, setInputs] =useState({
    startDate:'',
    endDate:'',
    selectHostColum:'',
    selectUUIDColum:''
  });

  const { startDate,endDate,selectHostColum, selectUUIDColum} = inputs;

  function handlerChange(e){
     const { value, name } = e.target;  
      
        setInputs({
          ...inputs,
          [name]:value
        });
      };

      function submitValue(){
        alert(` startValue: ${startDate} & endValue: ${endDate} & selectHostColum:${selectHostColum} & selectUUIDColum:${selectUUIDColum}`)
      };

     



  return (
    <>
      <CorrelationAxios/>
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
                  <h5>해커그룹 1({"90"}%)</h5>
                  <h5>해커그룹 2({"60"}%)</h5>
                  <h5>해커그룹 3({"20"}%)</h5>
                </CCol>
              </CRow>
              <hr className="tableTopMargin"/>
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
                 <CCol md="3"></CCol>
                 <CCol md="5">
                   <CRow>
                     <CCol md="5">
                     <CFormGroup>
                       <CSelect custom name="selectHostColum" onChange={handlerChange} value={selectHostColum} id="selectHostColum">
                         <option value={selectHostColum} selected>HOST LIST</option>
                         
                       </CSelect>
                     </CFormGroup>
                     </CCol>
                     <CCol md="5">
                     <CFormGroup>
                       <CSelect custom name="selectUUIDColum" onChange={handlerChange} value={selectUUIDColum} id="selectUUIDColum">
                         <option value={selectUUIDColum} selected>UUID LIST</option>
                         
                       </CSelect>
                     </CFormGroup>
                     </CCol>
                     <CCol md="2">
                     <CButton color="info" onClick={submitValue}>Search</CButton>
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
                  <CModalTitle>Modal title</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </CModalBody>
                <CModalFooter>
                  <CButton color="primary">Do Something</CButton>{' '}
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

export default Correlation
