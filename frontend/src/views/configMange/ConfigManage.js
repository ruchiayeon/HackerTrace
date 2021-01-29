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
  CInputCheckbox
} from '@coreui/react'
import axios from 'axios'
import ReactDiffViewer from 'react-diff-viewer'
import Tree from 'react-animated-tree'

//페이지 import
import Clock from '../Clock/Clock'
import Page404 from '../pages/page404/Page404'
import Loading from '../pages/Loading/Loading'


function ConfigManage() {
  //형상 변경 Hook
  const [configChange, setConfigChange] = useState(false)
  const [configDatas, setConfigDatas] = useState(null);
  const [oldCode , setOldCode] = useState("old")
  const [newCode , setNewCode] = useState("new")
  //contents View
  const [contentsView, setContentsView ] =useState([null])
  const [contentsModal, setContentsModal] = useState(false)

  //configHistroy Hook
  const [configHistory, setconfigHistory] = useState([null])
  
  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);
  const [firsthostDatas, setFirHostDatas] = useState(null);

  //file tree 부분
  const defaultTreeName = "/etc"
  const [treeSource, setTreeSource] = useState([{name:null}])
  const [treeChildSource, setTreeChildSource] = useState([{name:null},{children:[null]}])
  const [treeFilesSource, setTreeFilesSource] = useState([null])

  //예외처리 Hook
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
        setFirHostDatas(response.data.data[0].hostIp)
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
  
  const[inputs, setInputs] = useState({
    search:'',
    startDate:'2021-01-01',
    endDate:'2021-01-30',
    selectHostIp: "",
    setDircList: ""
  });

  const { search, startDate, endDate, selectHostIp } = inputs;

  function handlerChange(e){
    const { value, name } = e.target;
    setInputs({
    ...inputs,
    [name]:value
    });
  };

  //형상관리 디렉토리 리스트 
  const getDircList = async(selectHostIp, changeTreeName) => {
    try{
      setLoading(true);
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/config/directory',
        { 
          hostIp        : selectHostIp,
          topDirectory  : changeTreeName
        }
      )
      if(response.data.data.length === 0){
        setTreeSource([{name:null}]);
        alert("형상변경 파일이 없습니다. 검색 조건을 변경하십시오.")
      }else{
        setTreeSource(response.data.data)
      }
      if(response.data.data.children.length === 0){
        setTreeChildSource([{name:null},{children:[null]}]);
      }else{
        setTreeChildSource(response.data.data.children);
      }
      
      if(response.data.data.files.length === 0){
        setTreeFilesSource([null]);
      }else{
        setTreeFilesSource(response.data.data.files);
      }
 
    }catch(e){
      setError(e);
      console.log(e)
    }
    setLoading(false);
  }

  //검색 버튼 및 Value값 넘겨주는 부분
  function submitTreeLog(){
    if(!selectHostIp){
      getDircList(firsthostDatas, defaultTreeName)
    }else{
      getDircList(selectHostIp, defaultTreeName)
    }
  };
 
  //CData Tables의 Fileds값
  const fields = [
    {label:"TIME", key:'fileCreateDate',_style:{width:'10%'}},
    {label:"Id", key:'_id',_style:{width:'10%'}},
    {label:"HOST IP", key:'hostIp',_style:{width:'10%'}},
    {label:"Owner", key:'owner',_style:{width:'10%'}},
    {label:"File Name", key:'fileName',_style:{width:'10%'}}, 
    {label:"File Path", key:'filePath',_style:{width:'30%'}}, 
    {label:"Integerity Check", key:'Integrity',_style:{width:'10%'}},
    {label:"Contents View",  key:'Contents View'}
  ]
  
  //Table axios 연결 부분. submitValue()를 통해서 값을 받아온다.
  const tableAxiosData = async(startDate, endDate, selectHostIp, fileName, filepath) => {
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
          filePath  : filepath,//selectFilePath,
          fileName  : fileName,
          searchType: "ALL",
          searchWord: "", 
        }
      )
      setConfigDatas(response.data.data);
      console.log(response.data.data);
     
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  };

  //Integrity check해서 modal에서 Diff하기
  function toggleModal(item,index){
    var rowId = item._id;
    var rowPath = item.filePath;
    var rowFileNam = item.fileName;
    var rowHostIp = item.hostIp;
    console.log(rowId, rowPath, rowFileNam, rowHostIp)
    IntgrityCheck()
    setConfigChange(!configChange);
  }
  
  //Integrity Check Axios
  const IntgrityCheck = async() => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/config/origin-log/contents',
        { 
          logObjId: "5ffeaaa38a35c62284cd8587",
          orgObjId: "5ffeaaa38a35c62284cd8587"
        }
      )
      console.log(response.data.data)
      setOldCode("asdf");//.origin_config_file_contents.contents
      setNewCode("asdfasdfasdfasdf");//.log_config_file_contents.contents
     
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  }

  //Config History
  const ConfigHistory =  async() =>{
    try{
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/config/log/modify/history',
        {
          fileCreateDate: "2021-01-30 01:00:01",
          fileName: "crontab",
          hostIp: "127.0.0.1",
          isAll: "T",
          ses: 0,
          term: 1,
          uid: 0
        }
      )
      console.log(response.data.data)
      setconfigHistory(response.data.data)
    }catch(e){
      setError(e);
      console.log(e)
    }
  }

  //폴더 클릭시 하위 폴더 및 파일 검색 submit
  function SendTreeValue(index){
    const cilckValue = treeSource.name+treeChildSource[index].name
    if(!selectHostIp){
      if(!cilckValue){
        getDircList(firsthostDatas, defaultTreeName)
      }else{
        getDircList(firsthostDatas, cilckValue)
      }
    }else{
      if(!cilckValue){
        getDircList(selectHostIp, defaultTreeName)
      }else{
        getDircList(selectHostIp, cilckValue) 
      }
    }
  }

  //선택한 파일의 형상변경 이력 로그 검색
  function submitValue(index){
    const fileName = treeFilesSource[index];
    const filePath = treeSource.name;
    console.log(startDate, endDate, selectHostIp, fileName, filePath)
    if(!selectHostIp){
      tableAxiosData(startDate, endDate, firsthostDatas, fileName, filePath)
    }else{
      tableAxiosData(startDate, endDate, selectHostIp, fileName, filePath)
    }
  }

  function submitContentsView(item,index) {
    const rowId= item._id
    ContentsView(rowId)
    setContentsModal(!contentsModal)
  }

  //클릭한 contents 내용 자세히 보기
  const ContentsView = async(rowId) =>{
    try{
      setLoading(true);
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/config/view/contents',
        {
          objId: rowId
        }
      )
      if(response.data.data[0].contents.length === 0 ){
        setContentsView([{contents:null}])
      }else {
        setContentsView(response.data.data[0].contents)
      }
      
      console.log(response.data.data)

    }catch(e){
      setError(e);
    }
    setLoading(false);
  }

 
  if(loading) return <Loading/>;
  if(error) return <Page404/>;
  if(!hostDatas) return <div>일치하는 데이터가 없습니다.</div>;
  if(!configHistory) return ConfigHistory()
  if(!treeFilesSource[0]) return submitTreeLog();
  


  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
            <Clock/>
              <CRow className="searchtoolbar"> 
                  <CCol md="3"> 
                  
                  </CCol>
                  <CCol md="2">
                    <CFormGroup row>
                      <CCol xs="12" md="12">
                        <CInput type="date" id="startDate" placeholder="start_date" onChange={handlerChange} value={startDate} name='startDate'/>
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
                  <CCol md="2">
                    <CFormGroup>
                      <CSelect custom name="selectHostIp" onChange={handlerChange} value={selectHostIp} id="selectHostIp">
                        {hostDatas.map((item, index) => {
                          return <option key={index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                        })}
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  
                  <CCol md="3">
                    <CInputGroup className="input-prepend">
                      <CInput size="100" type="text" placeholder="search" onChange={handlerChange} value={search} name='search' />
                      <CInputGroupAppend>
                        <CButton color="info" onClick={() =>submitTreeLog()}>검색</CButton>
                      </CInputGroupAppend>
                    </CInputGroup>
                  </CCol>
                  
                </CRow>
              <CRow>
              <CCol className="folderTree" md={2}>
                <CButton color="info"onClick={()=>submitTreeLog()}>최상위 폴더 이동</CButton>
                <Tree content={treeSource.name} type={<button className="treeBtn folderimage" value={treeSource.name}>📁</button>} open>
                  {treeChildSource.map((item,index) => {
                    if(!treeChildSource[0].name){
                      return null
                    }else{
                      return <Tree key={index} content={item.name} type={<button className="treeBtn folderimage" value={index} onClick={()=>SendTreeValue(index)}>📁</button>}/>
                    }
                  })}
                  {treeFilesSource.map((item,index) => {
                    if(treeFilesSource.length === 0){
                      return null
                    }else{
                      return <Tree key={item} content={item} type={<button className="treeBtn folderimage" value={item} onClick={()=>submitValue(index)}>📄</button>}/>
                    }
                  
                  })}
                </Tree>
            
               
              </CCol>
              <CCol className="folderTree" md={10}>
                
                <h1>History</h1>
                <section>
                  <CRow>
                    <div className="attckGrouptLegend"/>
                    <div><Clock/> 파일 위치/</div>
                  </CRow>
                  <ul>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                  </ul>
                </section>
                <section>
                  <CRow>
                    <div className="attckGrouptLegend"/>
                    <div><Clock/> 파일 위치/</div>
                  </CRow>
                  <ul>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                  </ul>
                </section>
                <section>
                  <CRow>
                    <div className="attckGrouptLegend"/>
                    <div><Clock/> 파일 위치/</div>
                  </CRow>
                  <ul>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                    <li>safasdf</li>
                  </ul>
                </section>
              </CCol>
              </CRow>
              <br/>
                <CDataTable
                  items={configDatas}
                  fields={fields}
                  itemsPerPage= {10}
                  hover
                  pagination
                  clickableRows={true}
                  onRowClick = {(item, index)=>{
                    
                  }}
                  scopedSlots = {{
                    'Integrity':
                    (item, index)=>{
                      return (
                        <td className="py-2">
                          <CInputCheckbox 
                          id="checkbox1" 
                          name="checkbox1" 
                          value="option1" 
                          onClick={()=>{toggleModal(item, index)}}
                          />
                         
                        </td>
                        )
                    },
                    'Contents View':
                    (item, index)=>{
                      return (
                        <td className="py-2">
                          <CButton 
                        
                          value="option1" 
                          color="info"
                          onClick={()=>{submitContentsView(item, index)}}
                          >Contents</CButton>
                         
                        </td>
                        )
                    },
                    
                  }}
                />
               {/*형상변경 관련 내용 onClick={() =>toggleModal(index, item)} */} 
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

               {/*형상변경 관련 내용 onClick={() =>toggleModal(index, item)} */} 
               <CModal show={contentsModal} onClose={setContentsModal}>
                <CModalHeader closeButton>
                  <CModalTitle>형상 변경 내용</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <ul>
                    {contentsView.map((item,index)=>{
                      return <li key={item+index}>{item}</li>
                    })}
                  </ul>
                </CModalBody>
                <CModalFooter>
                  <CButton 
                    color="secondary" 
                    onClick={() => setContentsModal(false)}
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