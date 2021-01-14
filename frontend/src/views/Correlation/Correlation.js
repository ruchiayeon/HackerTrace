import React,{useEffect, useState} from 'react'
import axios from 'axios'
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

import Page404 from '../pages/page404/Page404'

//axios값 가져오기
//import CorrelationAxios from './CorrelationAxios'


//선학님이 DB넘겨주는것 확인하고 fields key값 변경하기.
const fields = [
  {key:'Logid',_style:{width:'10%'}},
  {key:'T값',_style:{width:'20%'}},
  {key:'Attack Type',_style:{width:'30%'}},
  {key:'UUID',_style:{width:'10%'}},
  {key:'Detail',_style:{width:'10%'}, lable:''}
]


function Correlation() {
  const [modal, setModal] = useState(false)

  const[inputs, setInputs] = useState({
    startDate:'',
    endDate:'',
    selectHostColum:'',
    selectUIDColum:'',
    selectSESSColum:''
  });

  const { startDate, endDate, selectHostColum, selectUIDColum, selectSESSColum} = inputs;

  function handlerChange(e) {

    const { value, name } = e.target;  
      setInputs({
        ...inputs,
        [name] : value
      });
  };
    //값이 없는경우 확인하는 조건문
  function submitValue(){
    if(!startDate || startDate === '') {
      alert('검색 시작날짜를 선택해주세요.')
    }else if(!endDate || endDate === '') {
      alert('검색 종료날짜를 선택해주세요.')
    }else if(!selectHostColum || selectHostColum === '') {
      alert('호스트를 선택해주세요.')
    }else if(!selectUIDColum || selectUIDColum === '') {
      alert('UID를 선택해주세요.')
    }else if(!selectSESSColum || selectSESSColum === '') {
      alert('Session을 선택해주세요.')
    }else{
      alert(`${startDate}/${endDate}/${selectHostColum}/${selectUIDColum}/${selectSESSColum}`);
      //CorrReaultData();
    }  
  };

  //Axios부분 
  //실패/ 로딩중 메세지 --> 로딩 성공시 넘어가게 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  

  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);

  useEffect(()=>{
    const hostResData = async() => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 갑을 받아온다.
      const response = await axios.get(
          'http://210.114.18.175:8080/ht/host/list'
      )
      //받아온 값을 setMiterData에 넣어준다.
      
      setHostDatas(response.data.data);
      //console.log(response.data);

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

  //session / uid 받아오는 부분
  const [uidDatas, setUidDatas] = useState(null);
  const [sessDatas, setSessDatas] = useState(null);

  useEffect(()=>{
    const sessUidResDatas = async() => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 갑을 받아온다.
      const response = await axios.post(
          'http://210.114.18.175:8080/ht/mitre/condition',
          {
            endDate   : '2021-01-06',
            startDate : '2020-01-06',
            hostIp    : '127.0.0.1'
          }
      )
      //받아온 값을 setMiterData에 넣어준다.
      
      setUidDatas(response.data.data.uid_list);
      setSessDatas(response.data.data.ses_list);

    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
    }
      //로딩 실패시 flag를 달아서 이동
      setLoading(false);
    };
    sessUidResDatas();
  }, []);


//Hook 부분 에러 --> 종속하는 방법 확인해서 onClick시 function 작동하는 방향으로 갈것
//const [corrDatas, setCorrData] = useState(null);
//table 검색 결과값 보내주기
/*const CorrReaultData = () =>{

  useEffect(()=>{
    const corrResData = async() => {
    try{

      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      

      const response = await axios.post(
          'http://210.114.18.175:8080/ht/mitre/list',
          {endDate   : '2021-01-01',
          startDate : '2020-01-14',
          hostIp    : '127.0.0.1',
          ses       : 2,
          uid       : 0 }
      )
      //받아온 값을 setMiterData에 넣어준다.
      
      setCorrData(response.data.data);
      console.log(response.data.data);

    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
    }
      //로딩 실패시 flag를 달아서 이동
      setLoading(false);
    };
    corrResData();
  }, []);

  if(!corrDatas) return <div>일치하는 데이터가 없습니다.</div>;
}*/
  //로딩관련 예외처리를 해준다. --> 페이지 만들어졌을때 변경 하기 
  if(loading) return <div>로딩중</div>;
  if(error) return <Page404/>;
  if(!hostDatas) return <div>일치하는 데이터가 없습니다.</div>;
  if(!sessDatas) return <div>sessUidDatas일치하는 데이터가 없습니다.</div>;
  if(!uidDatas) return <div>sessUidDatas일치하는 데이터가 없습니다.</div>;



  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                 {/*Attack Mattrix tempalte */}
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
               {/*상관분석 관련 검색하는 테이블을 표기한다. Axios쪽에 넘겨야하는 Value가 useEffect에 정의되어있다. 확인 필.*/}
              <div className="searchtoolbar">
                <CRow>
                  <CCol sm="6" md="2">
                    <CFormGroup row>
                      <CCol  md="12">
                        <CInput type="date" id="startDate" placeholder="start_date" onChange={handlerChange} value={startDate} name='startDate'/>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol sm="6"md="2">
                    <CFormGroup row>
                      <CCol md="12">
                        <CInput type="date" id="endDate" placeholder="end_date" onChange={handlerChange} value={endDate} name='endDate'/>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol md="2"></CCol>
                  <CCol md="6">
                    <CRow>
                      <CCol md="4" sm="4">
                      <CFormGroup>
                        <CSelect custom name="selectHostColum" onChange={handlerChange} value={selectHostColum} id="selectHostColum">
                          <option value='' selected>HOST LIST</option>
                            {hostDatas.map((item, index) => {
                              return <option key={index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                            })}
                        </CSelect>
                      </CFormGroup>
                      </CCol>
                      <CCol md="3"sm="3">
                      <CFormGroup>
                        <CSelect custom name="selectUIDColum" onChange={handlerChange} value={selectUIDColum} id="selectUIDColum">
                          <option /*value={selectUUIDColum}*/ defaultValue>UID LIST</option>
                          {sessDatas.map((item, index) => {
                              return <option key={index} value={item}>{item}</option>
                            })} 
                        </CSelect>
                      </CFormGroup>
                      </CCol>
                      <CCol md="3"sm="3">
                      <CFormGroup>
                        <CSelect custom name="selectSESSColum" onChange={handlerChange} value={selectSESSColum} id="selectSESSColum">
                          <option /*value={selectUUIDColum}*/ defaultValue>SESSION LIST</option>
                          {uidDatas.map((item, index) => {
                              return <option key={index} value={item}>{item}</option>
                            })}
                        </CSelect>
                      </CFormGroup>
                      </CCol>
                      <CCol md="2"sm="2">
                      <CButton color="info" onClick={submitValue}>Search</CButton>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </div>
              <CDataTable
                items={usersData}
                fields={fields}
                //columnFilter
                itemsPerPage= {5}
                hover
                //tableFilter
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
