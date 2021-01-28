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
import Tree from 'react-animated-tree'

//페이지 import
import Clock from '../Clock/Clock'
import Page404 from '../pages/page404/Page404'
import Loading from '../pages/Loading/Loading'


function ConfigManage() {
  //형상 변경 Hook
  const [configChange, setConfigChange] = useState(false)
  const [configDatas, setConfigDatas] = useState(false);
  const [oldCode , setOldCode] = useState("old")
  const [newCode , setNewCode] = useState("new")

  //configHistroy Hook
  const [configHistory, setconfigHistory] = useState([null])
  
  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);
  const [firsthostDatas, setFirHostDatas] = useState(null);
  //const [dircList, setDircList] = useState([null]);
  //const [firstdircList, setFirDircList] = useState(null);

  //file tree 부분
  const treeSource = useState([
    {
      name: 'root',
      children: [
          {
              name: 'parent',
              children: [
                  { name: 'child1' },
                  { name: 'child2' }
              ]
          },
          {
              name: 'loading parent',
              children: []
          },
          {
              name: 'parent',
              children: [
                  {
                      name: 'nested parent',
                      children: [
                          { name: 'nested child 1'},
                          { name: 'nested child 2' }
                      ]
                  }
              ]
          }
      ]
  }
  ])

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

      //형상관리 디렉토리 리스트 
      const getDircList = async() => {
        try{
          const response = await axios.get(
            'http://210.114.18.175:8080/ht/config/directory'
          )
          //setDircList(response.data.data)
         // setFirDircList(response.data.data)
          console.log(response.data.data);
        }catch(e){
          setError(e);
          console.log(e)
        }
      }
    getDircList();
    hostResData();
  }, []);

  
  const[inputs, setInputs] = useState({
    search:'',
    startDate:'2021-01-01',
    endDate:'2021-01-30',
    selectColum:'uid',
    selectHostIp: "",
    setDircList: ""
  });

  const { search, startDate, endDate, selectColum, selectHostIp, selectDircList } = inputs;

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
      if(!selectDircList){
        console.log("1")
        tableAxiosData(startDate, endDate, selectColum, search, firsthostDatas)
      }else{
        console.log("2")
        tableAxiosData(startDate, endDate, selectColum, search, firsthostDatas)
      }
    }else{
      if(!selectDircList){
        console.log("3")
        tableAxiosData(startDate, endDate, selectColum, search, selectHostIp)
      }else{
        console.log("4")
        tableAxiosData(startDate, endDate, selectColum, search, selectHostIp)
      }
    }
  };

  const fields = [
    {label:"TIME", key:'fileCreateDate',_style:{width:'10%'}},
    {label:"HOST IP", key:'hostIp',_style:{width:'10%'}},
    {label:"Uid", key:'uid',_style:{width:'10%'}},
    {label:"File Name", key:'fileName',_style:{width:'10%'}}, 
    {label:"File Path", key:'filePath',_style:{width:'30%'}}, 
    {label:"Integerity Check", key:'Integrity',_style:{width:'10%'}},
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
          filePath  : "/etc",//selectFilePath
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
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  };

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
  function alertSubmit(){
    alert("asdfasdf")
  }
  const tree = treeSource[0]
  console.log(tree[0].children)

  if(loading) return <Loading/>;
  if(error) return <Page404/>;
  if(!hostDatas) return <div>일치하는 데이터가 없습니다.</div>;
  if(!configDatas) return submitValue();
  if(!configHistory) return ConfigHistory()

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

                  <CCol md="5">
                    <CRow>
                      <CCol md="3">
                        <CFormGroup>
                          <CSelect custom name="selectColum" onChange={handlerChange} value={selectColum} id="selectColum">
                            <option value='uid'>uid</option>
                            <option value='fileName'>fileName</option>
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
                     
                      <CCol md="5">
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
              <CRow>
              <CCol className="folderTree" md={2}>
                {tree[0].children.map((item,index)=>{
                  return <Tree content={item.name} type={<span className="folderimage">📁</span>} open/>
                })}
                
                

                <Tree content="./etc" type={<span className="folderimage">📁</span>} open>
                  <Tree content="hello" type={<span className="folderimage">📁</span>} />
                  <Tree content="subtree with children" >
                    <Tree content="hello" />
                    <Tree content="sub-subtree with children">
                      <Tree content="child 1" style={{ color: '#63b1de' }} />
                      <Tree content="child 2" style={{ color: '#63b1de' }} />
                      <Tree content="child 3" style={{ color: '#63b1de' }} />
                    </Tree>
                    <Tree content="hello" />
                  </Tree>
                  <Tree content="hello"/>
                  <Tree content="hello"/>
                </Tree>
                <Tree content="./bash" type={<span value="dlrkdus" className="folderimage">📁</span>} open>
                  <Tree content="hello" type={<span className="folderimage">📁</span>} />
                  <Tree content="subtree with children" >
                    <Tree content="hello" />
                    <Tree content="sub-subtree with children">
                      <button content="child 1.png" style={{ color: '#63b1de' }} />
                      <Tree content="child 2" style={{ color: '#63b1de' }} />
                      <Tree content="child 3" style={{ color: '#63b1de' }} />
                      <Tree content="child 3" type={<p content="hello" ></p>}></Tree>
          
                    </Tree>
                    <button content="hello" />
                  </Tree>
                  <button content="hello" onClick={alertSubmit}>hello</button>
                  <Tree content="hello"/>
                </Tree>
              </CCol>
              <CCol className="folderTree" md={10}>
                
                <h1>history</h1>
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