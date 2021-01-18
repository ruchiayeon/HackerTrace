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
  CModalFooter,
 // CCollapse
} from '@coreui/react'
import axios from 'axios'
import ReactDiffViewer from 'react-diff-viewer'

//페이지 import
import Clock from '../Clock/Clock'
import Page404 from '../pages/page404/Page404'
import Loading from '../pages/Loading/Loading'
import ConfigHistory from './configHistory'


function ConfigManage() {
  const [configChange, setConfigChange] = useState(false)
  
  const [oldCode , setOldCode] = useState('null')
  const [newCode , setNewCode] = useState('null')

  //config integrity 부분 선언
  //const [items, setItems] = useState(configDatas)


  const[inputs, setInputs] = useState({
    search:'',
    startDate:'2021-01-01',
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
  const [configDatas, setConfigDatas] = useState(false);

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
    {key:'fileCreateDate',_style:{width:'10%'}},
    {key:'hostIp',_style:{width:'10%'}},
    {key:'uid',_style:{width:'10%'}},
    {key:'fileName',_style:{width:'10%'}}, 
    {key:'filePath',_style:{width:'30%'}}, 
    {key:'Integrity',_style:{width:'10%'}},

  ]
  
  //Table axios 연결 부분. submitValue()를 통해서 값을 받아온다.
  const tableAxiosData = async(startDate, endDate, selectColum, search, selectHostIp) => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/config/log/list',
        { 
          startDate : startDate,
          endDate   : endDate,
          hostIp    : selectHostIp,
          pageNumber: 1,
          pageSize  : 1000,
          filePath : "/etc",
          searchType: selectColum,
          searchWord: search, 
        }
      )
      setConfigDatas(response.data.data);
      //console.log(response.data.data[0]._id);
     
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
      if(!configDatas) return <div>일치하는 데이터가 없습니다.</div>;
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
    };
  if(loading) return <Loading/>;
  if(error) return <Page404/>;

  if(!configDatas){
    submitValue()
  }
  function toggleModal(index,item){
    
    var rowId = item._id;
    var rowPath = item.filePath;
    var rowFileNam = item.fileName;
    var rowHostIp = item.hostIp;
    var rowUid = item.uid;
    
    IntgrityCheck(rowId, rowPath, rowFileNam, rowHostIp, rowUid)
    setConfigChange(!configChange);
  }
  
  const IntgrityCheck = async(rowId, rowPath, rowFileNam, rowHostIp, rowUid) => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/config/origin-log/contents',
        { 
          fileName  : rowFileNam,
          filePath  : rowPath,
          hostIp    : rowHostIp,
          logObjId  : rowId,
          uid       : rowUid
        }
      )
      setOldCode(response.data.data.origin_config_file_contents.contents);
      setNewCode(response.data.data.log_config_file_contents.contents);
     
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
      if(!oldCode) return <div>일치하는 데이터가 없습니다.</div>;
      if(!newCode) return <div>일치하는 데이터가 없습니다.</div>;
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  }


  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <ConfigHistory/>
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
                            <option value='uid'>uid</option>
                            <option value='fileName'>fileName</option>
                            <option value='filePath'>filePath</option>
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
                  items={configDatas}
                  fields={fields}
                  itemsPerPage= {10}
                  hover
                  pagination
                  clickableRows={true}
                  scopedSlots = {{
                    'Integrity':
                    (item, index)=>{
                      return (
                        <td className="py-2">
                          <CButton 
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={() =>toggleModal(index, item)}>
                            Integrity
                          </CButton>
                        </td>
                        )
                    },
                    
                  }}
                />
               {/*형상변경 관련 내용 */} 
              <CModal show={configChange} onClose={setConfigChange}>
                <CModalHeader closeButton>
                  <CModalTitle>형상 변경 내용</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CRow>
                    <CCol><h5>원본</h5></CCol>
                    <CCol><h5>비교본</h5></CCol>
                  </CRow>
                  <ReactDiffViewer oldValue={oldCode} newValue={newCode} splitView={true} showDiffOnly={true}/>
                </CModalBody>
                <CModalFooter>
                  <CButton 
                    color="secondary" 
                    onClick={() => setConfigChange(false)}
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