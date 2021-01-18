import React,{useEffect, useState} from 'react'
import axios from 'axios'
import {
    CRow,
    CCol,
} from '@coreui/react'

//에러 페이지
import Page404 from '../pages/page404/Page404'

function MatrixTable() {
    //console.log(spotChange)
    //실패/ 로딩중 메세지 --> 로딩 성공시 넘어가게 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    //Att&CK map info
    const [attackMatrixs, setMiterData] = useState(null);
    const [attackMatrixTitle, setMiterTitleData] = useState(null);
    const [version, setMiterVerData] = useState(null);
    const [spec, setMiterSpecData] = useState(null);
    

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
        


    //로딩관련 예외처리를 해준다. --> 페이지 만들어졌을때 변경 하기 
    if(loading) return <div>로딩중</div>;
    if(error) return <Page404/>;
    if(!attackMatrixs || !attackMatrixTitle || !version ||!spec){
        matrixResData();
    };
  

    //Axios로 불러온 값을 뿌려주는 부분이다.  
    //console.log('data is ' + JSON.stringify(data)); 이렇게 사용하면  json형으로 사용이 가능하다고 하는데 
    //DB 연결후 확인을 해봐야 한다.
   
  
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
        </>
    )
    
}



export default MatrixTable


