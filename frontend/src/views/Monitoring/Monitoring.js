import React, {useState, useContext,useEffect} from 'react'
import {
  CCardBody,
  CRow,
  CCol,
  CCard,
  CDataTable,
  CFormGroup,
  CInput,
  CButton,
  CSelect
} from '@coreui/react'
import axios from "axios";

//페이지 Import
import Page404 from '../pages/page404/Page404'
import Loading from '../pages/Loading/Loading'
import Context from "../Context"


function Monitoring () {
  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);
  const [firsthostDatas, setFirHostDatas] = useState(null);

  //모니터링 정보 받는 HOOK
  const [ProcessData, setProcessData] = useState(null)
  const [CpuData, setCPUData] = useState(null)
  const [Memory, setMemoryData] = useState(null)
  const [Storage, setStorageData] = useState(null)
  const [Network, setNetworkData] = useState(null)

  //예외처리 Hook
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false)
  
  const todayformat = useState(new Date().getFullYear() +"-"+ ("00"+ (new Date().getMonth() + 1)).slice(-2) +"-"+ ("00" + new Date().getDate()).slice(-2))
 
  //reflesh btn toggle
  const [toggleState, setToggleState] = useState(false);
  const [switchtitle, setswitchtitle] = useState("STOP")

  function toggle() {
    setToggleState(toggleState === true ? false : true);
    setswitchtitle(switchtitle === "START" ? "STOP" : "START");
  }

  const [cputoggleState, setCpuToggleState] = useState(false);
  const [cpuswitchtitle, setCpuswitchtitle] = useState("STOP")

  function cputoggle() {
    setCpuToggleState(cputoggleState === true ? false : true);
    setCpuswitchtitle(cpuswitchtitle === "START" ? "STOP" : "START");
  }

  const [memotoggleState, setMemoToggleState] = useState(false);
  const [memoswitchtitle, setMemoswitchtitle] = useState("STOP")

  function memotoggle() {
    setMemoToggleState(memotoggleState === true ? false : true);
    setMemoswitchtitle(memoswitchtitle === "START" ? "STOP" : "START");
  }

  const [stortoggleState, setStorToggleState] = useState(false);
  const [storswitchtitle, setStorswitchtitle] = useState("STOP")

  function stortoggle() {
    setStorToggleState(stortoggleState === true ? false : true);
    setStorswitchtitle(storswitchtitle === "START" ? "STOP" : "START");
  }

  const [nettoggleState, setNetToggleState] = useState(false);
  const [netswitchtitle, setNetswitchtitle] = useState("STOP")

  function nettoggle() {
    setNetToggleState(nettoggleState === true ? false : true);
    setNetswitchtitle(netswitchtitle === "START" ? "STOP" : "START");
  }

  useEffect(()=>{
    setTimeout(function run(){
      setFlag(true)
      setTimeout(run,5000);
    },5000)
  }, []);


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


  function totalFlag(){
    proceslotation()
    cpulotation()
    memolotation()
    storlotation() 
    netlotation()
  }

function proceslotation() {
  if(toggleState){
    if(!selectHostIp){
      ProcessAxios(startDate, endDate, firsthostDatas)
    }else{
      ProcessAxios(startDate, endDate, selectHostIp)
    }
  }
  setFlag(false)
}

function cpulotation() {
  if(cputoggleState){
    if(!cpuselectHostIp){
      CPUAxios(firsthostDatas,cpustartDate,cpuendDate)
    }else{
      CPUAxios(cpuselectHostIp,cpustartDate,cpuendDate)
    }
  }
  setFlag(false)
}

function memolotation() {
  if(memotoggleState){
    if(!memoselectHostIp){
      MemoryAxios(memostartDate, memoendDate, firsthostDatas)
    }else{
      MemoryAxios(memostartDate, memoendDate, memoselectHostIp )
    }
  }
  setFlag(false)
}
   
function storlotation() {
  if(stortoggleState){
    if(!storselectHostIp){
      StorageAxios(storstartDate, storendDate,  firsthostDatas)
    }else{
      StorageAxios( storstartDate, storendDate, storselectHostIp )
    }
  }
  setFlag(false)
}
   
function netlotation() {
  if(nettoggleState){
    if(!netselectHostIp){
      NetworkAxios(netstartDate, netendDate, firsthostDatas)
    }else{
      NetworkAxios(netstartDate, netendDate, netselectHostIp )
    }
  }
  setFlag(false)
}  

  

  //Process 검색 조건
  const[Processinputs, setProcessInputs] = useState({
    startDate: todayformat[0],
    endDate: todayformat[0],
    selectHostIp: "",
  });

  const { startDate, endDate, selectHostIp } = Processinputs;

  function ProcesshandlerChange(e){
    const { value, name } = e.target;
    setProcessInputs({
    ...Processinputs,
    [name]:value
    });
  };

  function SubmitProcess(){

    if(!selectHostIp){
      ProcessAxios(startDate, endDate, firsthostDatas)
    }else{
      ProcessAxios(startDate, endDate, selectHostIp)
    }
  }

  const ProcessAxios = async(startDate, endDate, selectHostIp) =>{
    try{
      
      //Process 데이터 Axios
      const process = await axios.post(
        'http://210.114.18.175:8080/ht/monitor/log/list',
        {
          endDate     : endDate,
          hostIp      : selectHostIp,
          pageNumber  : 1,
          pageSize    : 1000,
          startDate   : startDate,
          useFieldType: "Process"
        }
      )
      setProcessData(process.data.data)
    }catch(e){
      setError(e)
    }
    setLoading(false);
  }

  //CPU 검색 조건
  const[cpuinputs, setcpuInputs] = useState({
    cpustartDate: todayformat[0],
    cpuendDate: todayformat[0],
    cpuselectHostIp: firsthostDatas,
  });

  const { cpustartDate, cpuendDate, cpuselectHostIp } = cpuinputs;

  function CPUhandlerChange(e){
    const { value, name } = e.target;
    setcpuInputs({
    ...cpuinputs,
    [name]:value
    });
  };

  function SubmitCpu(){
    if(!cpuselectHostIp){
      CPUAxios(firsthostDatas,cpustartDate,cpuendDate)
    }else{
      CPUAxios(cpuselectHostIp,cpustartDate,cpuendDate)
    }
  }

  const CPUAxios = async(cpuselectHostIp,cpustartDate,cpuendDate) =>{
    try{
      
       //CPU 데이터 Axios
       const cpudata = await axios.post(
        'http://210.114.18.175:8080/ht/monitor/log/list',
        {
          endDate     : cpuendDate,
          hostIp      : cpuselectHostIp,
          pageNumber  : 1,
          pageSize    : 1000,
          startDate   : cpustartDate,
          useFieldType: "CPU"
        }
      )
      setCPUData(cpudata.data.data)

    }catch(e){
      setError(e)
    }
    setLoading(false);
  }

  //Memory 검색 조건
  const[Memoryinputs, setMemoryInputs] = useState({
    memostartDate: todayformat[0],
    memoendDate: todayformat[0],
    memoselectHostIp: "",
  });

  const { memostartDate, memoendDate, memoselectHostIp } = Memoryinputs;

  function MemoryhandlerChange(e){
    const { value, name } = e.target;
    setMemoryInputs({
    ...Memoryinputs,
    [name]:value
    });
  };

  function SubmitMemory(){
    if(!memoselectHostIp){
      MemoryAxios(memostartDate, memoendDate, firsthostDatas)
    }else{
      MemoryAxios(memostartDate, memoendDate, memoselectHostIp )
    }
  }

  const MemoryAxios = async(memostartDate, memoendDate, memoselectHostIp ) =>{
    try{
      
     //MEMORY 데이터 Axios
     const memory = await axios.post(
      'http://210.114.18.175:8080/ht/monitor/log/list',
      {
        endDate     : memoendDate,
        hostIp      : memoselectHostIp,
        pageNumber  : 1,
        pageSize    : 1000,
        startDate   : memostartDate,
        useFieldType: "Memory"
      }
    )
    setMemoryData(memory.data.data)
    }catch(e){
      setError(e)
    }
    setLoading(false);
  }

  //Storage 검색 조건
  const[Storageinputs, setStorageInputs] = useState({
    storstartDate: todayformat[0],
    storendDate: todayformat[0],
    storselectHostIp: "",
  });

  const { storstartDate, storendDate, storselectHostIp } = Storageinputs;

  function StoragehandlerChange(e){
    const { value, name } = e.target;
    setStorageInputs({
    ...Storageinputs,
    [name]:value
    });
  };

  function SubmitStorage(){
    if(!storselectHostIp){
      StorageAxios(storstartDate, storendDate,  firsthostDatas)
    }else{
      StorageAxios( storstartDate, storendDate, storselectHostIp )
    }
  }

  const StorageAxios = async(storstartDate, storendDate, storselectHostIp ) =>{
    try{
       //Storage 데이터 Axios
       const storage = await axios.post(
        'http://210.114.18.175:8080/ht/monitor/log/list',
        {
          endDate     : storendDate,
          hostIp      : storselectHostIp,
          pageNumber  : 1,
          pageSize    : 1000,
          startDate   : storstartDate,
          useFieldType: "Storage"
        }
      )
      setStorageData(storage.data.data)

    }catch(e){
      setError(e)
    }
    setLoading(false);
  }

  //Network 검색 조건
  const[Networkinputs, setNetworkInputs] = useState({
    netstartDate: todayformat[0],
    netendDate: todayformat[0],
    netselectHostIp: "",
  });

  const { netstartDate, netendDate, netselectHostIp } = Networkinputs;

  function NetworkhandlerChange(e){
    const { value, name } = e.target;
    setNetworkInputs({
    ...Networkinputs,
    [name]:value
    });
  };

  function SubmitNetwork(){
    if(!netselectHostIp){
      NetworkAxios(netstartDate, netendDate, firsthostDatas)
    }else{
      NetworkAxios(netstartDate, netendDate, netselectHostIp )
    }
  }

  const NetworkAxios = async(netstartDate, netendDate, netselectHostIp) =>{
    try{      
       //Network 데이터 Axios
       const Network = await axios.post(
        'http://210.114.18.175:8080/ht/monitor/log/list',
        {
          endDate     : netendDate,
          hostIp      : netselectHostIp,
          pageNumber  : 1,
          pageSize    : 1000,
          startDate   : netstartDate,
          useFieldType: "Network"
        }
      )
      setNetworkData(Network.data.data)

    }catch(e){
      setError(e)
    }
    setLoading(false);
  } 

  const fields = [
    {label:"Time", key:'date',_style:{width:'10%'}},
    {label:"Process", key:'Process'},
  ]

  const fields_cpu = [
    {label:"Time", key:'date',_style:{width:'10%'}},
    {label:"CPU", key:'CPU'},
  ]
  const fields_Memory = [
    {label:"Time", key:'date',_style:{width:'10%'}},
    {label:"Memory", key:'Memory'},
  ]

  const fields_Storage = [
    {label:"Time", key:'date',_style:{width:'10%'}},
    {label:"Storage", key:'Storage'},
  ]

  const fields_Network = [
    {label:"Time", key:'date',_style:{width:'10%'}},
    {label:"Network", key:'Network'},
  ]

  if(loading) return <Loading/>;
  if(error) return <Page404/>;
  if(!hostDatas) return  hostResData();
  if(flag) return totalFlag()

  return (
    <>
      <CRow>
      <CCol>
        <CCard>
          <CCardBody>
          <CButton title="CPU 실시간 로딩" value={`switch ${cputoggleState}`} onClick={cputoggle} color="info">{cpuswitchtitle}</CButton>
          <CRow className="searchtoolbar"> 
            <CCol md={4}><h2 className="textMonitor">CPU</h2></CCol>
              <CCol>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CInput type="date" id="startDate" placeholder="start_date" onChange={CPUhandlerChange} value={cpustartDate} name='cpustartDate'/>
                  </CCol>
                </CFormGroup>
              </CCol>
              <CCol>
                <CFormGroup row>
                  <CCol xs="12" md="12">
                    <CInput type="date" id="endDate" placeholder="end_date" onChange={CPUhandlerChange} value={cpuendDate} name='cpuendDate'/>
                  </CCol>
                </CFormGroup>
              </CCol >
              <CCol md={2}>
                <CFormGroup>
                  <CSelect custom name="cpuselectHostIp" onChange={CPUhandlerChange} value={cpuselectHostIp} id="cpuselectHostIp">
                    {hostDatas.map((item, index) => {
                      return <option key={item.hostIp+index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                    })}
                  </CSelect>
                </CFormGroup>
              </CCol>
              <CCol sm={1}>
                <CButton className="btmholl" color="info" onClick={() => SubmitCpu()}>검색</CButton>
              </CCol>
          </CRow>
          <CDataTable
            items={CpuData}
            fields={fields_cpu}
            itemsPerPage= {5}
            hover
            pagination
          />

          <hr/>
          <CButton title="Process 실시간 로딩" value={`switch ${toggleState}`} onClick={toggle} color="info">{switchtitle}</CButton>
          <CRow className="searchtoolbar"> 
            <CCol md={4}><h2 className="textMonitor">Process</h2></CCol>
            <CCol>
              <CFormGroup row>
                <CCol xs="12" md="12">
                  <CInput type="date" id="startDate" placeholder="start_date" onChange={ProcesshandlerChange} value={startDate} name='startDate'/>
                </CCol>
              </CFormGroup>
            </CCol>
            <CCol>
              <CFormGroup row>
                <CCol xs="12" md="12">
                  <CInput type="date" id="endDate" placeholder="end_date" onChange={ProcesshandlerChange} value={endDate} name='endDate'/>
                </CCol>
              </CFormGroup>
            </CCol >
            <CCol md={2}>
              <CFormGroup>
                <CSelect custom name="selectHostIp" onChange={ProcesshandlerChange} value={selectHostIp} id="selectHostIp">
                  {hostDatas.map((item, index) => {
                    return <option key={item.hostIp+index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                  })}
                </CSelect>
              </CFormGroup>
            </CCol>
            <CCol sm={1}>
              <CButton className="btmholl" color="info" onClick={()=>SubmitProcess()}>검색</CButton>
            </CCol>
          </CRow>
          <CDataTable
            items={ProcessData}
            fields={fields}
            itemsPerPage= {5}
            hover
            pagination
          />
          
          <hr/>
          <CButton title="Memory 실시간 로딩" value={`switch ${memotoggleState}`} onClick={memotoggle} color="info">{memoswitchtitle}</CButton>
          <CRow className="searchtoolbar"> 
            <CCol md={4}><h2 className="textMonitor">Memory</h2></CCol>
            <CCol>
              <CFormGroup row>
                <CCol xs="12" md="12">
                  <CInput type="date" id="memostartDate" placeholder="memostart_date" onChange={MemoryhandlerChange} value={memostartDate} name='memostartDate'/>
                </CCol>
              </CFormGroup>
            </CCol>
            <CCol>
              <CFormGroup row>
                <CCol xs="12" md="12">
                  <CInput type="date" id="memoendDate" placeholder="memoend_date" onChange={MemoryhandlerChange} value={memoendDate} name='memoendDate'/>
                </CCol>
              </CFormGroup>
            </CCol >
            <CCol md={2}>
              <CFormGroup>
                <CSelect custom name="memoselectHostIp" onChange={MemoryhandlerChange} value={memoselectHostIp} id="memoselectHostIp">
                  {hostDatas.map((item, index) => {
                    return <option key={item.hostIp+index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                  })}
                </CSelect>
              </CFormGroup>
            </CCol>
            <CCol sm={1}>
              <CButton className="btmholl" color="info" onClick={()=>SubmitMemory()} >검색</CButton>
            </CCol>
          </CRow>
          <CDataTable
          items={Memory}
          fields={fields_Memory}
          itemsPerPage= {5}
          hover
          pagination
          />

          <hr/>
          <CButton title="Storage 실시간 로딩" value={`switch ${stortoggleState}`} onClick={stortoggle} color="info">{storswitchtitle}</CButton>
          <CRow className="searchtoolbar"> 
            <CCol md={4}><h2 className="textMonitor">Storage</h2></CCol>
            <CCol>
              <CFormGroup row>
                <CCol xs="12" md="12">
                  <CInput type="date" id="startDate" placeholder="storstart_date" onChange={StoragehandlerChange} value={storstartDate} name='storstartDate'/>
                </CCol>
              </CFormGroup>
            </CCol>
            <CCol>
              <CFormGroup row>
                <CCol xs="12" md="12">
                  <CInput type="date" id="endDate" placeholder="storend_date" onChange={StoragehandlerChange} value={storendDate} name='storendDate'/>
                </CCol>
              </CFormGroup>
            </CCol >
            <CCol md={2}>
              <CFormGroup>
                <CSelect custom name="storselectHostIp" onChange={StoragehandlerChange} value={storselectHostIp} id="storselectHostIp">
                  {hostDatas.map((item, index) => {
                    return <option key={item.hostIp+index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                  })}
                </CSelect>
              </CFormGroup>
            </CCol>
            <CCol sm={1}>
              <CButton className="btmholl" color="info" onClick={()=>SubmitStorage()}>검색</CButton>
            </CCol>
          </CRow>
          <CDataTable
          items={Storage}
          fields={fields_Storage}
          itemsPerPage= {5}
          hover
          pagination
          />

          <hr/>
          <CButton title="Network 실시간 로딩" value={`switch ${nettoggleState}`} onClick={nettoggle} color="info">{netswitchtitle}</CButton>
          <CRow className="searchtoolbar"> 
            <CCol md={4}><h2 className="textMonitor">Network</h2></CCol>
            <CCol>
              <CFormGroup row>
                <CCol xs="12" md="12">
                  <CInput type="date" id="netstartDate" placeholder="netstart_date" onChange={NetworkhandlerChange} value={netstartDate} name='netstartDate'/>
                </CCol>
              </CFormGroup>
            </CCol>
            <CCol>
              <CFormGroup row>
                <CCol xs="12" md="12">
                  <CInput type="date" id="netendDate" placeholder="netend_date" onChange={NetworkhandlerChange} value={netendDate} name='netendDate'/>
                </CCol>
              </CFormGroup>
            </CCol >
            <CCol md={2}>
              <CFormGroup>
                <CSelect custom name="netselectHostIp" onChange={NetworkhandlerChange} value={netselectHostIp} id="netselectHostIp">
                  {hostDatas.map((item, index) => {
                    return <option key={item.hostIp+index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                  })}
                </CSelect>
              </CFormGroup>
            </CCol>
            <CCol sm={1}>
              <CButton className="btmholl" color="info" onClick={()=>SubmitNetwork()}>검색</CButton>
            </CCol>
          </CRow>
          <CDataTable
          items={Network}
          fields={fields_Network}
          itemsPerPage= {5}
          hover
          pagination
          />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    </>
  )
}

export default Monitoring
