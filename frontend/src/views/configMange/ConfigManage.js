import React, { useState, useEffect } from 'react'
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
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import axios from 'axios'
import Clock from '../Clock/Clock'
import Page404 from '../pages/page404/Page404'


function PrivilegeEscalation() {
  const [modal, setModal] = useState(false)
  
  const[inputs, setInputs] = useState({
    search:'',
    startDate:'2020-01-01',
    endDate:'2021-01-30',
    selectColum:'uid',
    selectHostIp:'127.0.0.1'
  });

  const { search, startDate, endDate, selectColum, selectHostIp } = inputs;

  function handlerChange(e){
      const { value, name } = e.target;  
      
      setInputs({
      ...inputs,
      [name]:value
      });
  };

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [privilegeDatas, setPrivilegeDatas] = useState(false);

  //검색 버튼 및 Value값 넘겨주는 부분
  function submitValue(){
    //alert(`${selectHostIp}/${selectColum}`)
    tableAxiosData(startDate, endDate, selectColum, search, selectHostIp)
  };
  
  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);

  //host ip 받아오기
  useEffect(()=>{
    const hostResData = async() => {
      try{
        setLoading(true);
        //axios를 이용하여 해당 url에서 갑을 받아온다.
        const response = await axios.get(
            'http://210.114.18.175:8080/ht/host/list'
        )
        //받아온 값을 hostDatas에 넣어준다.
        setHostDatas(response.data.data);
        console.log(response.data.data);
      }catch(e){
        //에러시 flag를 달아서 이동
        setError(e);
        console.log(e)
      }
        //로딩 실패시 flag를 달아서 이동
        setLoading(false);
      };
    hostResData();
  }, []);

  //Host Ip를 받는 부분은 페이지 로딩시 바로 이루어져야 하므로 useEffect를 사용하여 값을 전달.
  if(!hostDatas) return <div>일치하는 데이터가 없습니다.</div>;

  const fields = [
    {key:'time',_style:{width:'10%'}},
    {key:'hostIp',_style:{width:'10%'}},
    {key:'type',_style:{width:'10%'}}, 
    {key:'ses',_style:{width:'10%'}},
    {key:'uid',_style:{width:'10%'}},
    {key:'msg',_style:{width:'40%'}},
    {key:'History',_style:{width:'40%'}},
  ]
  
  //Table axios 연결 부분. submitValue()를 통해서 값을 받아온다.
  const tableAxiosData = async(startDate, endDate, selectColum, search, selectHostIp) => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/audit-daemon/log/list',
        { 
          startDate : startDate,
          endDate   : endDate,
          hostIp    : selectHostIp,
          pageNumber: 1,
          pageSize  : 100,
          phases    : "privilege-escalation",
          searchType: selectColum,
          searchWord: search, 
        }
      )
      setPrivilegeDatas(response.data.data);
      console.log(response.data.data);
     
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
      if(!privilegeDatas) return <div>일치하는 데이터가 없습니다.</div>;
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  };
  if(loading) return <div>로딩중</div>;
  if(error) return <Page404/>;

  if(!privilegeDatas){
    submitValue()
  }

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <Clock/>
                <CRow className="searchtoolbar"> 
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
                  <CCol md="2"></CCol>
                  <CCol md="6">
                    <CRow>
                      <CCol md="4">
                        <CFormGroup>
                          <CSelect custom name="selectColum" onChange={handlerChange} value={selectColum} id="selectColum">
                            <option value='type'>type</option>
                            <option value='uid'>uid</option>
                            <option value='ses'>session</option>
                            <option value='key'>T value</option>
                          </CSelect>
                        </CFormGroup>
                      </CCol>
                      <CCol md="4">
                        <CFormGroup>
                          <CSelect custom name="selectHostIp" onChange={handlerChange} value={selectHostIp} id="selectHostIp">
                            {hostDatas.map((item, index) => {
                              return <option key={index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                            })}
                          </CSelect>
                        </CFormGroup>
                      </CCol>
                      <CCol md="4">
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
                    items={privilegeDatas}
                    fields={fields}
                    itemsPerPage= {10}
                    hover
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

export default PrivilegeEscalation