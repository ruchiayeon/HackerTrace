import React, { useState, useContext } from 'react'
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
import axios from 'axios'
import Clock from '../../Clock/Clock'
import Page404 from '../../pages/page404/Page404'
import Loading from '../../pages/Loading/Loading'
import Context from "../../Context"

function Exfiltration() {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exfiltrationDatas, setExfiltrationDatas] = useState(false);
  const [pageNumbers, setpageNumbers] = useState(1)
  
  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);
  const [firsthostDatas, setFirHostDatas] = useState(null);

  let today = new Date();   
  let year = today.getFullYear(); // 년도
  let month = ("00"+ (today.getMonth() + 1)).slice(-2);  // 월
  let date = ("00" + today.getDate()).slice(-2);  // 날짜
  const formatdate = year + '-' + month + '-' + date

  //host ip 받아오기
  const {state} = useContext(Context)
  const hostResData = async() => {
    try{
    setLoading(true);
    //axios를 이용하여 해당 url에서 갑을 받아온다.
    const response = await axios.post(
      `http://210.114.18.175:8080/ht/host/list/user?adminUserId=${state.userId}`
    )
    //받아온 값을 setMiterData에 넣어준다.
    
    setHostDatas(response.data.data);
    setFirHostDatas(response.data.data[0].hostIp)

    }catch(e){
    //에러시 flag를 달아서 이동
    setError(e);
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  };

  const[inputs, setInputs] = useState({
    search:'',
    startDate:formatdate,
    endDate:formatdate,
    selectColum:'uid',
    selectHostIp: firsthostDatas
  });

  const { search, startDate, endDate, selectColum, selectHostIp } = inputs;

  function handlerChange(e){
      const { value, name } = e.target;  
      
      setInputs({
      ...inputs,
      [name]:value
      });
  };
 
 //검색 버튼 및 Value값 넘겨주는 부분
 function submitValue(){
  if(!selectHostIp){
    tableAxiosData(startDate, endDate, selectColum, search, firsthostDatas, pageNumbers)
  }else{
    tableAxiosData(startDate, endDate, selectColum, search, selectHostIp, pageNumbers)
  }
};

  const fields = [
    {key:'body_event_time', label:"TIME"},
    {key:'body_success', label:"Success"},
    {key:'body_key',label:"Mitre ID"},
    {key:'header_message:type', label:"Audit Type"}, 
    {key:'body_ses', label:"Session"},
    {key:'body_uid', label:"Uid"},
    {key:'body_exe', label:"Exe"},
    {key:'body_syscall', label:"syscall number"}
  ]
  
  //Table axios 연결 부분. submitValue()를 통해서 값을 받아온다.
  const tableAxiosData = async(startDate, endDate, selectColum, search, selectHostIp, pageNumbers) => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/audit-daemon/log/list',
        { 
          startDate : startDate,
          endDate   : endDate,
          hostIp    : selectHostIp,
          pageNumber: pageNumbers,
          pageSize  : 1000,
          phases    : "exfiltration",
          searchType: selectColum,
          searchWord: search, 
        }
      )
      if(pageNumbers>1){
        for(let i =0; i<1000; i++){
          exfiltrationDatas.push(response.data.data[i])
        }
      }else{
        setExfiltrationDatas(response.data.data);
      }
     
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      if(!exfiltrationDatas) return <div>일치하는 데이터가 없습니다.</div>;
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  };
  if(loading) return <Loading/>;;
  if(error) return <Page404/>;
  if(!hostDatas) return hostResData();
  if(!exfiltrationDatas) return submitValue()
  

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
                            <option value='body_success'>Success</option>
                            <option value='body_key'>Mitre ID</option>
                            <option value='body_uid'>Uid</option>
                            <option value='body_ses'>Session</option>
                            <option value='body_exe'>Exe</option>
                            <option value='body_syscall'>Syscall Number</option>
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
                            <CButton color="info" onClick={submitValue}>검색</CButton>
                          </CInputGroupAppend>
                        </CInputGroup>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                  <CDataTable
                    items={exfiltrationDatas}
                    fields={fields}
                    itemsPerPage= {10}
                    hover
                    pagination
                    onPageChange={(index) => {
                      if(index === exfiltrationDatas.length/10){
                        setpageNumbers(pageNumbers+1)
                        submitValue()
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

export default Exfiltration