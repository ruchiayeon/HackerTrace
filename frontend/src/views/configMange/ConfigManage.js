import React, { useState, useContext } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CFormGroup,
  CInput,
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
import Context from "../Context"



function ConfigManage() {
  //형상 변경 Hook
  const [configChange, setConfigChange] = useState(false)
  const [configDatas, setConfigDatas] = useState(null);
  const [oldCode , setOldCode] = useState("old")
  const [newCode , setNewCode] = useState("new")
  const [IntegrityNull, setIntegrityNull] = useState(null)

  //contents View
  const [contentsView, setContentsView ] =useState([null])
  const [contentsModal, setContentsModal] = useState(false)

  //configHistroy Hook
  const [historyModal, setHistoryModal] = useState(false)
  const [configChangeHistory, setconfigChangeHistory] = useState([null])
  
  //config Audit History hook
  const [fristSes, setfirstSes] = useState("0000")
  const [historyAuditlog, setHistoryAuditLog] = useState([null])
  const [historySes, setHistorySes] = useState([""])
  const [rowHistoryTime, setRowHistroyTime] = useState({
    afterTerm: 1,
    beforeTerm: 1,
    fileCreateDate: '',
    fileName: '',
    filePath: '',
    hostIp: '',
    session: fristSes
  })
  
  const { afterTerm, beforeTerm, session} = rowHistoryTime;

  function HistoryViewHandler(e){
    const { value, name } = e.target;
    setHistoryAuditLog([null])
    setRowHistroyTime({
    ...rowHistoryTime,
    [name]:value
    });
  };

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

  //오늘 날짜 받아오기
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
    startDate: formatdate,
    endDate: formatdate,
    selectHostIp: "",
    setDircList: ""
  });

  const { startDate, endDate, selectHostIp } = inputs;

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
      if(!startDate || !endDate){
        alert("검색 날짜를 지정해주십시오.")
      }else{
        getDircList(firsthostDatas, defaultTreeName)
        ConfigChangeDirList(startDate,endDate,firsthostDatas)
      }
      
    }else{
      if(!startDate || !endDate){
        alert("검색 날짜를 지정해주십시오.")
      }else{
        ConfigChangeDirList(startDate,endDate,selectHostIp)
        getDircList(selectHostIp, defaultTreeName)
      }
    }
  };
 
  //CData Tables의 Fileds값
  const fields = [
    {label:"Time", key:'logTime'},
    {label:"Owner", key:'owner'},
    {label:"File Name", key:'fileName'}, 
    {label:"File Modify Time", key:'fileCreateDate'},
    {label:"File Path", key:'filePath'}, 
    {label:"Integerity Check", key:'Integrity'},
    {label:"Contents",  key:'Contents'},
    {label:"History",  key:'History'}
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
     
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  };

  const [rowDatas1, setRowDatas1] = useState([null])
  const [rowDatas2, setRowDatas2] = useState([null])
  const [filedate1, setfiledate1] = useState(null)
  const [filedate2, setfiledate2] = useState(null)

  //Integrity check해서 modal에서 Diff하기
  function toggleModal(item,index){

    if(!rowDatas1[0]){
      setRowDatas1(item._id)
      setfiledate1(item.logTime)
    }else if(!rowDatas2[0] && rowDatas1 !== rowDatas2){
      setRowDatas2(item._id)
      setfiledate2(item.logTime)
    }else if(rowDatas1 !== item._id){
      setRowDatas1(item._id)
      setfiledate1(item.logTime)
    }else if(rowDatas2 !== item._id){
      setRowDatas2(item._id)
      setfiledate2(item.logTime)
    }
  }

  function SubmitIntegrity(){
    if(!rowDatas1[0] | !rowDatas2[0]){
      alert("Integrity 대상을 클릭하십시오.")
    }else{
      IntegrityCheck(rowDatas1, rowDatas2)
      setConfigChange(!configChange);
      setRowDatas1([null])
      setRowDatas2([null])
    }
    
  }
  
  //Integrity Check Axios
  const IntegrityCheck = async(rowDatas1, rowDatas2) => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/config/origin-log/contents',
        { 
          logObjId: rowDatas1,
          orgObjId: rowDatas2
        }
      )
      const oldValue = response.data.data[0].contents.toString()
      const newValue = response.data.data[1].contents.toString()
      if(oldValue === newValue){
        setIntegrityNull("선택한 형상이 동일합니다.")
        setOldCode(oldValue.replace(/,/gi,"\r\n"))
        setNewCode(newValue.replace(/,/gi,"\r\n"))
      }else{
        setIntegrityNull(null)
        setOldCode(oldValue.replace(/,/gi,"\r\n"))
        setNewCode(newValue.replace(/,/gi,"\r\n"))
      }

    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  }

  //Config History
  const ConfigChangeDirList =  async(startDate,endDate,selectHostIp) =>{
    try{
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/config/log/paths',
        {
          endDate: endDate,
          hostIp: selectHostIp,
          startDate: startDate
        }
      )
      if(response.data.data.length === 0){
        setconfigChangeHistory([null])
      }else{
        setconfigChangeHistory(response.data.data)
      }
     
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

  function changeListSendTreeValue(item, index){
    if(!item){
      alert("검색을 먼저 해주십시오.")
    }else{
      const splitpoint = item.lastIndexOf("/")
      const submitValueitempath =item.substring(0,splitpoint)
    
      if(!selectHostIp){
        if(!submitValueitempath){
          getDircList(firsthostDatas, defaultTreeName)
        }else{
          getDircList(firsthostDatas, submitValueitempath)
        }
      }else{
        if(!submitValueitempath){
          getDircList(selectHostIp, defaultTreeName)
        }else{
          getDircList(selectHostIp, submitValueitempath) 
        }
      }
    }
    
  }


  //선택한 파일의 형상변경 이력 로그 검색
  function submitValue(index){
    const fileName = treeFilesSource[index];
    const filePath = treeSource.name;
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
    

    }catch(e){
      setError(e);
    }
    setLoading(false);
  }

  
  function submitHistoryView(item,index) {
    setHistoryAuditLog([null])
    const rowCreateDate= item.fileCreateDate
    const rowFileName= item.fileName
    const rowFilePath= item.filePath
    const rowHostIp= item.hostIp
    const afterTerm = 1
    const beforeTerm = 1
    HistorySess(rowCreateDate, rowFileName, rowFilePath, rowHostIp, afterTerm, beforeTerm)
    setRowHistroyTime({
      afterTerm: afterTerm,
      beforeTerm: beforeTerm,
      fileCreateDate: rowCreateDate,
      fileName: rowFileName,
      filePath: rowFilePath,
      hostIp: rowHostIp,
      session: fristSes 
    })
    setHistoryModal(!historyModal)
  }

  const HistorySess = async(rowCreateDate, rowFileName, rowFilePath, rowHostIp, afterTerm, beforeTerm) => {
    try{
      setLoading(true);
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/config/audit/history/ses',
        {
          afterTerm: afterTerm,
          beforeTerm: beforeTerm,
          fileCreateDate: rowCreateDate,
          fileName: rowFileName,
          filePath: rowFilePath,
          hostIp: rowHostIp
        }
      )
      setHistorySes(response.data.data)
      setfirstSes(response.data.data[0])

    }catch(e){
      setError(e);
    }
    setLoading(false);
  }

  function HistoryInnerCheck() {
    const rowCreateDate = rowHistoryTime.fileCreateDate
    const rowHostIp = rowHistoryTime.hostIp
    const afterTerm = Number(rowHistoryTime.afterTerm)
    const beforTerm = Number(rowHistoryTime.beforeTerm)
    if(session === "0000"){
      HistoryView(rowCreateDate, rowHostIp, afterTerm, beforTerm, fristSes)
    }else{
      HistoryView(rowCreateDate, rowHostIp, afterTerm, beforTerm, session)
    }
    
  }
  
  const HistoryView = async(rowCreateDate, rowHostIp, afterTerm, beforeterm, session) => {
    setHistoryAuditLog([null])
    try{
      setLoading(true);
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/config/audit/history',
        {
          afterTerm: afterTerm,
          beforeTerm: beforeterm,
          fileCreateDate: rowCreateDate,
          hostIp: rowHostIp,
          pageNumber: 1,
          pageSize: 1000,
          ses: session
        }
      )
      if(response.data.data.length === 0){
        alert("검출된 유저행위 Audit log History가 없습니다.")
      }else{
        const responseDatas = response.data.data
        const replacetotalLog = JSON.stringify(responseDatas).replace(/header_message:type/gi, 'headerType')
        const parser = JSON.parse(replacetotalLog)
        setHistoryAuditLog(parser)
      }
    }catch(e){
      setError(e);
      console.log(e)
    }
    setLoading(false);
  }

  function reset() {
    getDircList(firsthostDatas, defaultTreeName)
    ConfigChangeDirList(formatdate,formatdate,firsthostDatas)
    setConfigDatas(null)
  }



  if(loading) return <Loading/>;
  if(error) return <Page404/>;
  if(!hostDatas) return hostResData();
  if(treeSource.length <= 2) return submitTreeLog()
  

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
            <Clock/>
              <CRow className="searchtoolbar"> 
           
                
                <CCol>
                  <CFormGroup row>
                    <CCol xs="12" md="12">
                      <CInput type="date" id="startDate" placeholder="start_date" onChange={handlerChange} value={startDate} name='startDate'/>
                    </CCol>
                  </CFormGroup>
                </CCol>
                <CCol>
                  <CFormGroup row>
                    <CCol xs="12" md="12">
                      <CInput type="date" id="endDate" placeholder="end_date" onChange={handlerChange} value={endDate} name='endDate'/>
                    </CCol>
                  </CFormGroup>
                </CCol >
                <CCol>
                  <CFormGroup>
                    <CSelect custom name="selectHostIp" onChange={handlerChange} value={selectHostIp} id="selectHostIp">
                      {hostDatas.map((item, index) => {
                        return <option key={item.hostIp+index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                      })}
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol sm={1}>
                  <CButton className="btmholl" color="info" onClick={() => submitTreeLog()}>검색</CButton>
                </CCol>
                <CCol >
                  <CButton  className="btmholl" onClick={() => SubmitIntegrity()} color="info">Integrity Check</CButton>
                </CCol>
                <CCol sm={1}>
                  <CButton  className="btmholl" onClick={() => reset()} color="info">초기화</CButton>
                </CCol>
              </CRow>
           

              <CRow>
                
              
              <CCol className="folderTree" md={2}>
                <h5 className="textBold">변경 파일 리스트</h5>

                <ul>
                  {configChangeHistory.map((item,index) =>{
                    if(!configChangeHistory[0]){
                      return <li>변경된 파일이 없습니다.</li>
                    }else{
                      if (item.length > 30) {
                        const enditem = item.substr(0, 30) + "...";
                        return <li title={item} key={item+index} className="changeDirList" onClick={()=>changeListSendTreeValue(item,index)}>📄 {enditem}</li>
                      }else{
                        return <li title={item} key={item+index} className="changeDirList" onClick={()=>changeListSendTreeValue(item,index)}>📄 {item}</li>
                      }
                    }
                  })}
                </ul>
              </CCol>
              <CCol className="folderTree" md={2}>
                <CButton color="info"onClick={()=>submitTreeLog()}>최상위 폴더 이동</CButton>
                <Tree content={treeSource.name} type={<button className="treeBtn folderimage" value={treeSource.name}>📁</button>} open>
                  {treeChildSource.map((item,index) => {
                    if(!treeChildSource[0].name){
                      return null
                    }else{
                      return <Tree key={item.name+index} content={item.name} type={<button className="treeBtn folderimage" value={index} onClick={()=>SendTreeValue(index)}>📁</button>}/>
                    }
                  })}
                  {treeFilesSource.map((item,index) => {
                    if(treeFilesSource.length === 0){
                      return null
                    }else{
                      return <Tree key={item+index} content={item} type={<button className="treeBtn folderimage" value={item} onClick={()=>submitValue(index)}>📄</button>}/>
                    }
                  
                  })}
                </Tree>
            
               
              </CCol>
              <CCol md={8}>
                <CDataTable
                  items={configDatas}
                  fields={fields}
                  itemsPerPage= {6}
                  hover
                  pagination
                  scopedSlots = {{
                    'Integrity':
                    (item, index)=>{
                      return (
                        <td className="py-2">
                          <CInputCheckbox 
                          id="checkbox" 
                          name="checkbox"
                          onClick={()=>{toggleModal(item, index)}}
                          />
                        </td>
                        )
                    },
                    'History':
                    (item, index)=>{
                      return (
                        <td className="py-2">
                          <CButton 
                        
                          value="option1" 
                          color="info"
                          onClick={()=>{submitHistoryView(item, index)}}
                          >History</CButton>
                         
                        </td>
                        )
                    },
                    'Contents':
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
              </CCol>
              </CRow>
              <br/>
               {/*Integrity Check*/} 
              <CModal show={configChange} onClose={setConfigChange}>
                <CModalHeader closeButton>
                  <CModalTitle>Integrity Check</CModalTitle>
                </CModalHeader>
                <CModalBody>   
                  <h5>{IntegrityNull}</h5>
                  <ReactDiffViewer oldValue={oldCode} newValue={newCode} splitView={false} showDiffOnly={true}/>
                </CModalBody>
                <CModalFooter>
                  <div className="footerlogCount">
                    <CRow>
                      <div className="redLegend"/><p>{filedate1}</p>
                      <div className="greenLegend"/><p>{filedate2}</p>
                    </CRow>
                  </div>
                
                  <CButton 
                    color="secondary" 
                    onClick={() => setConfigChange(false)}
                  >Cancel</CButton>
                </CModalFooter>
              </CModal>

               {/*Contents*/} 
               <CModal show={contentsModal} onClose={setContentsModal}>
                <CModalHeader closeButton>
                  <CModalTitle>Contents</CModalTitle>
                </CModalHeader>
                <CModalBody className="cus_modal_body">
                  <ul>
                    {contentsView.map((item,index)=>{
                      return <li className="contentsList" key={index+item}>{item}</li>
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

              {/*History*/} 
              <CModal show={historyModal} onClose={setHistoryModal}>
                <CModalHeader closeButton>
                  <CModalTitle>History</CModalTitle>
                </CModalHeader>
                <CModalBody>
                <CFormGroup row>
                    <CCol title="기준시간 대비 과거" xs="3" md="3">
                      <CSelect custom name="afterTerm" onChange={HistoryViewHandler} value={afterTerm} id="afterTerm">
                        <option value="1">- 1일</option>
                        <option value="2">- 2일</option>
                        <option value="3">- 3일</option>
                        <option value="4">- 4일</option>
                        <option value="5">- 5일</option>
                        <option value="6">- 6일</option>
                      </CSelect>
                    </CCol>
                    <CCol title="기준시간" xs="2" md="2">
                      <h5 className="centerTime">{rowHistoryTime.fileCreateDate.substring(0,10)}</h5>
                    </CCol>
                    <CCol title="기준시간 대비 미래" xs="3" md="3">
                      <CSelect custom name="beforeTerm" onChange={HistoryViewHandler} value={beforeTerm} id="beforeTerm">
                        <option value="1">+ 1일</option>
                        <option value="2">+ 2일</option>
                        <option value="3">+ 3일</option>
                        <option value="4">+ 4일</option>
                        <option value="5">+ 5일</option>
                        <option value="6">+ 6일</option>
                      </CSelect>
                    </CCol>
                    <CCol title="세션선택" xs="2" md="2">
                    <CSelect custom name="session" onChange={HistoryViewHandler} value={session} id="session">
                      {historySes.map((item, index) => {
                        return <option key={item+index} value={item}>{item}</option>
                      })}
                    </CSelect>
                  </CCol>
                    <CCol >
                      <CButton title="히스토리 변경기간 검색" className="btmholl" color="info" onClick={() =>HistoryInnerCheck()}>검색</CButton>
                    </CCol>
                  </CFormGroup>
              
                  <section className="logsection">
                    <table className="tableclass">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>로그내용</th>
                        </tr>
                      </thead>
                      <tbody>
                      {historyAuditlog.map((parser,index) => {
                        if(historyAuditlog.length === 1) {
                          return  <tr key={"null"+index}>
                                    <td>검색 결과가 없습니다.</td>
                                  </tr>
                        }else{
                          const timeformating = parser.time.lastIndexOf(".") 
                          const timeValue = parser.time.substring(0,timeformating).replace(/T/gi, "\r\n")
                          if(parser.headerType === "SYSCALL"){
                            return  <tr key={"history"+index} className="historytr">
                                      <td className="itemTimeValue">{timeValue}<br/><strong>header_message:type:</strong>{parser.headerType}</td>
                                      <td className="totalLog">
                                        <strong>a0: </strong>{parser.body_a0}, <strong>a1: </strong>{parser.body_a1},
                                        <strong>a2:</strong>{parser.body_a3}, <strong>a3: </strong>{parser.body_a3},<strong>arch: </strong>{parser.body_arch}, <strong>auid: </strong>{parser.body_auid},
                                        <strong>comm: </strong>{parser.body_comm}, <strong>egid: </strong>{parser.body_egid}, <strong>euid:</strong>{parser.body_euid}, <strong>event_time: </strong>{parser.body_event_time},   
                                        <strong>exe: </strong>{parser.body_exe}, <strong>exit: </strong>{parser.body_exit}, <strong>fsgid: </strong>{parser.body_fsgid}, <strong>fsuid: </strong>{parser.body_fsuid},   
                                        <strong>host_ip: </strong>{parser.body_host_ip}, <strong>host name: </strong>{parser.body_host_name}, <strong>items: </strong>{parser.body_items}, <strong>key: </strong>{parser.body_key},  
                                        <strong>pid: </strong>{parser.body_pid}, <strong>ppid: </strong>{parser.body_ppid}, <strong>ses: </strong>{parser.body_ses}, <strong>sgid: </strong>{parser.body_sgid},    
                                        <strong>success: </strong>{parser.body_success}, <strong>suid: </strong>{parser.body_suid}, <strong>syscall: </strong>{parser.body_syscall}, <strong>tty: </strong>{parser.body_tty},   
                                        <strong>uid: </strong>{parser.body_uid}, <strong>header_msg: </strong>{parser.header_msg}
                                      </td>
                                    </tr>
                          }else if(parser.headerType === "PROCTITLE"){
                            return  <tr key={"history"+index}  className="historytr">
                                      <td className="itemTimeValue">{timeValue}<br/><strong>header_message:type:</strong>{parser.headerType}</td>
                                      <td className="totalLog">
                                        <strong>cwd: </strong>{parser.body_proctitle}, <strong>event_time: </strong>{parser.body_event_time},
                                        <strong>host_ip:</strong>{parser.body_host_ip}, <strong>host_name: </strong>{parser.body_host_name}, <strong>header_msg: </strong>{parser.header_msg},
                                      </td>
                                    </tr>
                          }else if(parser.headerType === "PATH"){
                            return  <tr key={"history"+index}  className="historytr">
                                      <td className="itemTimeValue">{timeValue}<br/><strong>header_message:type:</strong>{parser.headerType}</td>
                                      <td className="totalLog">
                                        <strong>cap_fe: </strong>{parser.body_cap_fe}, <strong>cap_fi: </strong>{parser.body_cap_fi},
                                        <strong>cap_fp:</strong>{parser.body_cap_fp}, <strong>cap_fver: </strong>{parser.body_cap_fver}, <strong>dev: </strong>{parser.body_dev},
                                        <strong>event_time:</strong>{parser.body_event_time}, <strong>host_ip: </strong>{parser.body_host_ip}, <strong>host_name: </strong>{parser.body_host_name},
                                        <strong>inode:</strong>{parser.body_inode}, <strong>item: </strong>{parser.body_item}, <strong>mode: </strong>{parser.body_mode},
                                        <strong>name:</strong>{parser.body_name}, <strong>objtype: </strong>{parser.body_objtype}, <strong>ogid: </strong>{parser.body_ogid},
                                        <strong>ouid:</strong>{parser.body_ouid}, <strong>rdev: </strong>{parser.body_rdev}, <strong>header_msg: </strong>{parser.header_msg}
                                      </td>
                                    </tr>
                          }else if( parser.headerType === "EXECVE"){
                            return  <tr key={"history"+index}  className="historytr">
                                      <td className="itemTimeValue">{timeValue}<br/><strong>header_message:type:</strong>{parser.headerType}</td>
                                      <td className="totalLog">
                                        <strong>a0:</strong>{parser.body_a0}, <strong>a1: </strong>{parser.body_a1}, <strong>argc: </strong>{parser.body_argc},
                                        <strong>event_time:</strong>{parser.body_event_time}, <strong>host_ip: </strong>{parser.body_host_ip}, <strong>host_name: </strong>{parser.body_host_name},
                                        <strong>header_msg:</strong>{parser.header_msg}
                                      </td>
                                    </tr>
                          }else{
                            console.log(parser.headerType)
                          }
                        }


                      })}
                      </tbody>
                    </table>
                  </section>
                </CModalBody>
                <CModalFooter>
                  <p className="footerlogCount">검출된 로그 갯수 : {historyAuditlog.length}</p>
                  <CButton 
                    color="secondary" 
                    onClick={() => setHistoryModal(false)}
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