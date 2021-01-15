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
//import MatrixTable from './MatrixTable'
import Page404 from '../pages/page404/Page404'

function Correlation() {
  const [modal, setModal] = useState(false)

  const[inputs, setInputs] = useState({
    startDate:'2020-01-01',
    endDate:'2021-01-30',
    selectHostColum:'127.0.0.1',
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
    }else{
      sessUidResDatas(startDate, endDate, selectHostColum);
    }  
  };

  //Axios부분 
  //실패/ 로딩중 메세지 --> 로딩 성공시 넘어가게 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);
  //matrix받아오는 부분
  const [attackMatrixs, setMiterData] = useState(null);
  const [attackMatrixTitle, setMiterTitleData] = useState(null);
  const [version, setMiterVerData] = useState(null);
  const [spec, setMiterSpecData] = useState(null);

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
    
    //<matrix-table> --> 나중에 쪼개기 
    //Att&CK map info
    const matrixResData = async() => {
      try{
          //요청이 왔을때 원래 있던 값을 초기화해준다.
          //miterData(null);
          //setError(null);

          setLoading(true);
          //axios를 이용하여 해당 url에서 갑을 받아온다.
          const response = await axios.get(
              'http://210.114.18.175:8080/ht/mitre/matrix?isSubT=T'
          )
          //받아온 값을 setMiterData에 넣어준다.
          
          setMiterTitleData(response.data.data.kill_chain_phases);
          setMiterVerData(response.data.data.version)
          setMiterSpecData(response.data.data.spec_version)
          setMiterData(response.data.data.attack_matrix);
         

      }catch(e){
          //에러시 flag를 달아서 이동
          setError(e);
          console.log(e)
      }
          //로딩 실패시 flag를 달아서 이동
          setLoading(false);
     };
     //<호출하기>
      matrixResData();
      hostResData();
  }, []);

  //session / uid 받아오는 부분
  const [uidDatas, setUidDatas] = useState(['uid | session을 먼저 눌러주세요.']);
  const [sessDatas, setSessDatas] = useState(['uid | session을 먼저 눌러주세요.']);

  const sessUidResDatas = async(startDate, endDate, selectHostColum) => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
          'http://210.114.18.175:8080/ht/mitre/condition',
          {
            endDate   : endDate,
            startDate : startDate,
            hostIp    : selectHostColum
          }
      )
      //받아온 값을 setUidDatas/setSessDatas에 넣어준다.
      setUidDatas(response.data.data.uid_list);
      setSessDatas(response.data.data.ses_list);

    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
    if(!sessDatas) return <div>sessUidDatas일치하는 데이터가 없습니다.</div>;
    if(!uidDatas) return <div>sessUidDatas일치하는 데이터가 없습니다.</div>;
  };
  
  //<table 검색 파트>

  //선학님이 DB넘겨주는것 확인하고 fields key값 변경하기.
  const fields = [
    {key:'external_ids',_style:{width:'20%'}},
    {key:'count',_style:{width:'30%'}},
  ]

  //Table 조건을 다걸고 axios쪽으로 값을 넘겨준다.
  function submitTableValue(){
    corrResData(startDate, endDate, selectHostColum, selectUIDColum, selectSESSColum);
  };

  //table 검색 결과값 보내주기
  const [corrDatas, setCorrData] = useState(null);
  const [matchAttGroupDatas, setMatchAttGroupDatas] = useState("null");

  //Table Search Axios 넣는 부분.
  const corrResData = async(startDate, endDate, selectHostColum, selectUIDColum, selectSESSColum) => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
        'http://210.114.18.175:8080/ht/mitre/list',
        { endDate   : endDate,
          startDate : startDate,
          hostIp    : selectHostColum,
          ses       : selectSESSColum,
          uid       : selectUIDColum 
        }
      )

      //받아온 값을 setMiterData에 넣어준다.
      if(!response.data.data || response.data.data === ''){
        setCorrData(null);
        setMatchAttGroupDatas(null)
      }else{
        setCorrData(response.data.data[1].user_audit_match_t);
        setMatchAttGroupDatas(response.data.data[0].attack_group_matching)
        console.log(response.data.data[0].attack_group_matching[0].external_ids);
      }
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
      if(!corrDatas) return <div>일치하는 데이터가 없습니다.</div>;
      if(!matchAttGroupDatas) return <div>일치하는 데이터가 없습니다.</div>;
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
    //값 넘기는 부분 작성 --> matrixTable쪽으로.
    //addTClass()
  };

  //<table 검색된 부분을 가지고 className 변경 파트>
  //2021-01-15 해당 부분 확인 필
  function changeColors(){
    const AttSpotChange = matchAttGroupDatas[0];
    const corrSpotChange = corrDatas;

    if(!AttSpotChange || AttSpotChange === 'n'){
      alert('아래 조건을 먼저 선택해주세요.')
    }else{
      alert(`${AttSpotChange.external_ids}`);
      console.log(AttSpotChange.external_ids)
    }

    if(!corrSpotChange || corrSpotChange === 'n'){
      alert('아래 조건을 먼저 선택해주세요.')
    }else{
      alert(`${corrSpotChange.length}`);
      console.log(corrSpotChange.length)
    }
  }
  
 
  //로딩관련 예외처리를 해준다. --> 페이지 만들어졌을때 변경 하기 
  if(loading) return <div>로딩중</div>;
  if(error) return <Page404/>;
  if(!attackMatrixs) return <div>일치하는 데이터가 없습니다.</div>;
  if(!attackMatrixTitle) return <div>일치하는 데이터가 없습니다.</div>;
  if(!version) return <div>일치하는 데이터가 없습니다.</div>;
  if(!spec) return <div>일치하는 데이터가 없습니다.</div>;

  //Host Ip를 받는 부분은 페이지 로딩시 바로 이루어져야 하므로 useEffect를 사용하여 값을 전달.
  if(!hostDatas) return <div>일치하는 데이터가 없습니다.</div>;
 

  //진짜 드럽다.. 방법 바꿀시간 있으면 바꾸기
  const initialAccess = attackMatrixs[0]
  const Execution = attackMatrixs[1]
  const Persistence = attackMatrixs[2]
  const Privilege = attackMatrixs[3]
  const Defense = attackMatrixs[4]
  const Credential = attackMatrixs[5]
  const Discovery = attackMatrixs[6]
  const Collection = attackMatrixs[7]
  const Command = attackMatrixs[8]
  const Exfiltration = attackMatrixs[9]
  const Impact = attackMatrixs[10]


  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                 {/*Attack Mattrix tempalte */}
                <CCol md={10}>
                  <div className="matrixtotal">
                    <CRow> 
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5 value="initial-access">initial-access</h5>
                              <p>초기 접근</p>
                          </section>
                          {initialAccess.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5 value="execution">Execution</h5>
                              <br/>
                              <p>실행</p>
                          </section>
                          {Execution.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}
                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5 value="persistence">Persistence</h5>
                              <br/>
                              <p>지속성 행위</p>
                          </section>
                          {Persistence.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5>Privilege<br/>Escalation</h5>
                              <p>권한 상승 행위</p>
                          </section>
                          {Privilege.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5>Defense<br/>Evasion</h5>
                              <p>방어 회피</p>
                          </section>
                          {Defense.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5>Credential<br/>Access</h5>
                              <p>자격증명 접근</p>
                          </section>
                          {Credential.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}

                      </CCol>
                  
                      </CRow>
                      <hr/>
                      <CRow>
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5>Discovery</h5>
                              <br/>
                              <p>뭐라고 이야기하지</p>
                          </section>
                          {Discovery.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5>Collection</h5>
                              <br/>
                              <p>수집행위</p>
                          </section>
                          {Collection.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5>Command<br/>and Control</h5>
                              <p>CLI 접근 및 조작행위</p>
                          </section>
                          {Command.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5>Exfiltration</h5>
                              <br/>
                              <p>유출 행위</p>
                          </section>
                          {Exfiltration.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section>
                              <h5>Impact</h5>
                              <br/>
                              <p>뭐라고 할까..</p>
                          </section>
                          {Impact.map((item, index) => {
                              return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> {item.name} </div>
                          })}

                      </CCol>

                      
                      </CRow>
                  </div>
                </CCol>
                {/*사용자와 유사한 공격그룹을 보여주는 section*/}
                <CCol md={2}>
                  TOP 3 유사한 공격그룹 
                  <h5>
                    1위 : {matchAttGroupDatas[0].attack_group}({matchAttGroupDatas[0].matching_rate})
                  </h5>
                  <div>
                    <CButton onClick={changeColors} color="info">확인하기</CButton><br/>
                  </div>
                  <hr/>
                  <h5>
                    2위 : {matchAttGroupDatas[1].attack_group}({matchAttGroupDatas[1].matching_rate})
                  </h5>
                  <div>
                    {matchAttGroupDatas[1].external_ids}
                  </div>
                  <hr/>
                  <h5>
                    3위 : {matchAttGroupDatas[2].attack_group}({matchAttGroupDatas[2].matching_rate})
                  </h5>
                  <div>
                    {matchAttGroupDatas[2].external_ids}
                  </div>
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
                  
                  <CCol sm="6" md="2">
                    <CFormGroup>
                      <CSelect custom name="selectHostColum" onChange={handlerChange} value={selectHostColum} id="selectHostColum">
                        {hostDatas.map((item, index) => {
                          return <option key={index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                        })}
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  <CCol md="2"> 
                    <CButton onClick={submitValue} color="info">uid | session 확인</CButton>
                  </CCol>
                  <CCol md="4">
                    <CRow>
                      <CCol md="4"sm="3">
                      <CFormGroup>
                        <CSelect custom name="selectUIDColum" onChange={handlerChange} value={selectUIDColum} id="selectUIDColum">
                          <option>UID</option>
                          {uidDatas.map((item, index) => {
                            return <option className='selectUIDColum' key={index} value={item}>UID : {item}</option>
                          })}
                        </CSelect>
                      </CFormGroup>
                      </CCol>
                      <CCol md="5"sm="3">
                      <CFormGroup>
                        <CSelect custom name="selectSESSColum" onChange={handlerChange} value={selectSESSColum} id="selectSESSColum">
                          <option>Session</option>
                          {sessDatas.map((item, index) => {
                            return <option key={index} value={item}>Session : {item}</option>
                          })}
                        </CSelect>
                      </CFormGroup>
                      </CCol>
                      <CCol md="3"sm="2">
                        <CButton onClick={submitTableValue} color="info">검색</CButton>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </div>
              <CDataTable
                items={corrDatas}
                fields={fields}
                //columnFilter
                itemsPerPage= {5}
                hover
                //tableFilter
                pagination
                scopedSlots = {{
                  /*modal 부분 --> 필요없으면 삭제할 것 */
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
              {/*modal 부분 --> 필요없으면 삭제할 것 */}
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
