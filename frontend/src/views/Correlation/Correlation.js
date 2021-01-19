import React,{useLayoutEffect, useState} from 'react'

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
} from '@coreui/react'

//import MatrixTable from './MatrixTable'
import Loading from '../pages/Loading/Loading'



function Correlation() {
 
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
 


  // matrix 값 맞춰서 변경하기 
  const [initialAccess, setinitialAccess]=  useState("")
  const [Execution, setExecution] = useState("")
  const [Persistence, setPersistence] = useState("")
  const [Privilege, setPrivilege] = useState("")
  const [Defense, setDefense] = useState("")
  const [Credential, setCredential] = useState("")
  const [Discovery, setDiscovery] = useState("")
  const [Collection, setCollection] = useState("")
  const [Command, setCommand] = useState("")
  const [Exfiltration, setExfiltration] = useState("")
  const [Impact, setImpact] = useState("")

  useLayoutEffect(()=>{
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
     
      setCorrData(response.data.data[1].user_audit_match_t);
      setMatchAttGroupDatas(response.data.data[0].attack_group_matching)
   
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e)
      if(!corrDatas) return <div>일치하는 데이터가 없습니다.</div>;
      if(!matchAttGroupDatas) return <div>일치하는 데이터가 없습니다.</div>;
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
    //값 넘기는 부분 작성 --> matrixTable쪽으로.
    //addTClass()
  };

//<matrix-table> --> 나중에 쪼개기 
    //Att&CK map info
    const matrixResData = async() => {
      try{
          //요청이 왔을때 원래 있던 값을 초기화해준다.
          setLoading(true);

          //axios를 이용하여 해당 url에서 값을 받아온다.
          const response = await axios.get(
              'http://210.114.18.175:8080/ht/mitre/matrix?isSubT=T'
          )

          //받아온 값을 setMiterData에 넣어준다.
          setMiterData(response.data.data.attack_matrix);

          setinitialAccess(response.data.data.attack_matrix[0])
          setExecution(response.data.data.attack_matrix[1])
          setPersistence(response.data.data.attack_matrix[2])
          setPrivilege(response.data.data.attack_matrix[3])
          setDefense(response.data.data.attack_matrix[4])
          setCredential(response.data.data.attack_matrix[5])
          setDiscovery(response.data.data.attack_matrix[6])
          setCollection(response.data.data.attack_matrix[7])
          setCommand(response.data.data.attack_matrix[8])
          setExfiltration(response.data.data.attack_matrix[9])
          setImpact(response.data.data.attack_matrix[10])
      }catch(e){
          //에러시 flag를 달아서 이동
          setError(e);
          console.log(e)
      }
          //로딩 실패시 flag를 달아서 이동
          setLoading(false);
     };
     //<호출하기>



  //<table 검색된 부분을 가지고 className 변경 파트>
  //2021-01-15 해당 부분 확인 필
  //matrix color change className
  const[initcolor, setInitColor] =useState("matrixtable")
  const[execolor, setExecolor] =useState("matrixtable")
  function changeColors(){
    const AttSpotChange1 = matchAttGroupDatas[0].external_ids;
    //const corrSpotChange = corrDatas;
    console.log(AttSpotChange1)

    //init-access 비교
    var init
    for(init=0; init< initialAccess.length; init++){
      const initClass = initialAccess[init].external_ids[0]
      var initnum
      for(initnum=0; initnum< AttSpotChange1.length; initnum++){
        const AttSpot = AttSpotChange1[initnum]
        //console.log(corrSpot);
        // console.log(initClass);
        if(initClass === AttSpot){
          alert('변경ㅇ')
          setInitColor("attckGroupT")
        }
        //setinitialAccess(initClassArray)
      }
    }
    
    //execution 비교
    var exei
    for(exei=0; exei< Execution.length; exei++){
      const exeClass = Execution[exei].external_ids[0]
      var exeinum
      for(exeinum=0; exeinum< AttSpotChange1.length; exeinum++){
        const AttSpot = AttSpotChange1[exeinum]
        //console.log(corrSpot);
        // console.log(initClass);
        if(exeClass === AttSpot){
          alert('변경')
          setExecolor("attckGroupT")
        }
        //setinitialAccess(initClassArray)
      }
    }

    //Persistence 비교
    var psersi
    for(psersi=0; psersi< Persistence.length; psersi++){
      const persisClass = Persistence[psersi].external_ids[0]
      var psersinum
      for(psersinum=0; psersinum< AttSpotChange1.length; psersinum++){
        const AttSpot = AttSpotChange1[psersinum]
        //console.log(corrSpot);
        // console.log(initClass);
        if(persisClass === AttSpot){
          alert('변경')
          setExecolor("attckGroupT")
        }
        //setinitialAccess(initClassArray)
      }
    }

    //Privilege Escalation 비교
    var pei
    for(pei=0; pei< Persistence.length; pei++){
      const preEscalClass = Persistence[pei].external_ids[0]
      var peinum
      for(peinum=0; peinum< AttSpotChange1.length; peinum++){
        const AttSpot = AttSpotChange1[peinum]
        //console.log(corrSpot);
        // console.log(initClass);
        if(preEscalClass === AttSpot){
          alert('변경preEscalClass')
          setExecolor("attckGroupT")
        }
        //setinitialAccess(initClassArray)
      }
    }

     //Defense Evasion 비교
     var defi
     for(defi=0; defi< Defense.length; defi++){
       const DefenseClass = Defense[defi].external_ids[0]
       var definum
       for(definum=0; definum< AttSpotChange1.length; definum++){
         const AttSpot = AttSpotChange1[definum]
         //console.log(corrSpot);
         // console.log(initClass);
         if(DefenseClass === AttSpot){
           alert('변경preEscalClass')
           setExecolor("attckGroupT")
         }
         //setinitialAccess(initClassArray)
       }
     }



  }
 
  
 
  //로딩관련 예외처리를 해준다. --> 페이지 만들어졌을때 변경 하기 
  if(loading) return <Loading/>;
  if(error) return alert('상관분석을 위한 데이터가 없습니다.');
  if(!attackMatrixs) return matrixResData();


  //Host Ip를 받는 부분은 페이지 로딩시 바로 이루어져야 하므로 useEffect를 사용하여 값을 전달.
  if(!hostDatas) return <div>일치하는 데이터가 없습니다.</div>;
 


  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CRow className='legend'>
                <div className="matchTLegend"/><p>상관분석 결과 검출된 공격</p>
                <div className="attckGrouptLegend"/><p>유사공격그룹 패턴</p>
              </CRow>
              <CRow>
                 {/*Attack Mattrix tempalte */}
                <CCol md={10}>
                  <div className="matrixtotal">
                    <CRow> 
                      <CCol sm={2} className= {initcolor}>
                          <section className="title">
                              <h5 value="initial-access">Initial-access</h5>
                              <p>초기 접근</p>
                          </section>
                            {initialAccess.map((item, index) => {
                                return <div key={index} className={item.external_ids[0]} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div>
                            })}
                          
                      </CCol>
                      <CCol sm={2} className={execolor}>
                          <section className="title">
                              <h5 value="execution">Execution</h5>
                              
                              <p>실행</p>
                          </section>
                         
                            {Execution.map((item, index) => {
                                return <div key={index} name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div>
                            })}
                          
                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section className="title"> 
                              <h5 value="persistence">Persistence</h5>
                           
                              <p>지속성 행위</p>
                          </section>
                          {Persistence.map((item, index) => {
                              return <div key={index} name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section className="title">
                              <h5>Privilege Escalation</h5>
                              <p>권한 상승 행위</p>
                          </section>
                          {Privilege.map((item, index) => {
                              return <div key={index} name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section className="title">
                              <h5>Defense Evasion</h5>
                              <p>방어 회피</p>
                          </section>
                          {Defense.map((item, index) => {
                              return <div key={index} name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name}</div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section className="title">
                              <h5>Credential Access</h5>
                              <p>자격증명 접근</p>
                          </section>
                          {Credential.map((item, index) => {
                              return <div key={index} name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div>
                          })}

                      </CCol>
                  
                      </CRow>
                      <hr/>
                      <CRow>
                      <CCol sm={2} className="matrixtable">
                          <section className="title">
                              <h5>Discovery</h5>
                              <p>뭐라고 이야기하지</p>
                          </section>
                          {Discovery.map((item, index) => {
                              return <div key={index} name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section className="title">
                              <h5>Collection</h5>
                              <p>수집행위</p>
                          </section>
                          {Collection.map((item, index) => {
                              return <div key={index} name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section className="title">
                              <h5>Command and Control</h5>
                              <p>CLI 접근 및 조작행위</p>
                          </section>
                          {Command.map((item, index) => {
                              return <div key={index} name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className="matrixtable">
                          <section className="title">
                              <h5>Exfiltration</h5>
                              <p>유출 행위</p>
                          </section>
                          {Exfiltration.map((item, index) => {
                              return <div key={index} name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div>
                          })}

                      </CCol>
                      <CCol sm={2} className= "matrixtable">
                          <section className="title">
                              <h5>Impact</h5>
                              <p>뭐라고 할까..</p>
                          </section>
                          {Impact.map((item, index) => {
                              return <div key={index} name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name}</div>
                          })}

                      </CCol>

                      
                      </CRow>
                  </div>
                </CCol>
                {/*사용자와 유사한 공격그룹을 보여주는 section*/}
                <CCol md={2}>
                  <h5>TOP 3 유사한 공격그룹 </h5>
                  <h5>
                    1위 : {matchAttGroupDatas[0].attack_group}[{matchAttGroupDatas[0].matching_rate}]
                  </h5>
                  <p>공격 유형 : {matchAttGroupDatas[0].external_ids}</p>
                  <div>
                    <CButton onClick={changeColors} color="info">확인하기</CButton><br/>
                  </div>
                  <hr/>
                  <h5>
                    2위 : {matchAttGroupDatas[1].attack_group}[{matchAttGroupDatas[1].matching_rate}]
                  </h5>
                  <p>공격 유형 : {matchAttGroupDatas[1].external_ids}</p>
                  <div>
                  <CButton  color="info">확인하기</CButton><br/>
              
                  </div>
                  <hr/>
                  <h5>
                    3위 : {matchAttGroupDatas[2].attack_group}[{matchAttGroupDatas[2].matching_rate}]
                  </h5>
                  <p>공격 유형 : {matchAttGroupDatas[2].external_ids}</p>
                  <div>
                  <CButton  color="info">확인하기</CButton><br/>
                  </div>
                  <hr/>
                 
                    
                   
               

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
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  )
}





export default Correlation
