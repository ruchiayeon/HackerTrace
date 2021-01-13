import React from 'react'
import {
    CRow,
    CCol,
  } from '@coreui/react'

function MatrixTable()  {
    
    return (
        <div className="matrixtotal">
            <CRow>

            <CCol sm={2} className="matrixtable">
                <section>
                    <h5 value="initial-access">Initial<br/>Access</h5>
                    <p>초기 접근</p>
                </section>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1190">Exploit Public-Facing Application</div>
                <div value="T1133">External Remote Services</div>
                <div value="T1200">Hardware Additions</div>
                <div value="T1566">Phishing</div>
                <div value="T1195">Supply Chain Compromise</div> 
                <div value="T1199">Trusted Relationship</div>
                <div value="T1078">Valid Accounts</div>

            </CCol>
            <CCol sm={2} className="matrixtable">
                <section>
                    <h5 value="execution">Execution</h5>
                    <br/>
                    <p>실행</p>
                </section>
                <div value="T1059">Command and Scripting Interpreter</div>
                <div value="T1203">Exploitation for Client Execution</div>
                <div value="T1061">Graphical User Interface</div>
                <div value="T1106">Native API</div>
                <div value="T1053">Scheduled Task/Job</div>
                <div value="T1064">Scripting</div> 
                <div value="T1072">Software Deployment Tools</div>
                <div value="T1153">Source</div>
                <div value="T1204">User Execution</div>
            </CCol>
            <CCol sm={2} className="matrixtable">
                <section>
                    <h5 value="persistence">Persistence</h5>
                    <br/>
                    <p>지속성 행위</p>
                </section>
                <div value="T1098">Account Manipulation</div>
                <div value="T1547">Drive-by Compromise</div>
                <div value="T1037">Drive-by Compromise</div>
                <div value="T1176">Drive-by Compromise</div>
                <div value="T1554">Drive-by Compromise</div>
                <div value="T1136">Drive-by Compromise</div> 
                <div value="T1543">Drive-by Compromise</div>
                <div value="T1546">Drive-by Compromise</div>
                <div value="T1133">Drive-by Compromise</div> 
                <div value="T1574">Drive-by Compromise</div>
                <div value="T1542">Drive-by Compromise</div>
                <div value="T1108">Drive-by Compromise</div> 
                <div value="T1108">Drive-by Compromise</div>
                <div value="T1505">Drive-by Compromise</div>
                <div value="T1205">Drive-by Compromise</div>
                <div value="T1078">Drive-by Compromise</div>

            </CCol>
            <CCol sm={2} className="matrixtable">
                <section>
                    <h5>Privilege<br/>Escalation</h5>
                    <p>권한 상승 행위</p>
                </section>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div> 
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>

            </CCol>
            <CCol sm={2} className="matrixtable">
                <section>
                    <h5>Defense<br/>Evasion</h5>
                    <p>방어 회피</p>
                </section>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div> 
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>

            </CCol>
            <CCol sm={2} className="matrixtable">
                <section>
                    <h5>Credential<br/>Access</h5>
                    <p>자격증명 접근</p>
                </section>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div> 
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>

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
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div> 
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>

            </CCol>
            <CCol sm={2} className="matrixtable">
                <section>
                    <h5>Collection</h5>
                    <br/>
                    <p>수집행위</p>
                </section>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div> 
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>

            </CCol>
            <CCol sm={2} className="matrixtable">
                <section>
                    <h5>Command<br/>and Control</h5>
                    <p>CLI 접근 및 조작행위</p>
                </section>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div> 
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>

            </CCol>
            <CCol sm={2} className="matrixtable">
                <section>
                    <h5>Exfiltration</h5>
                    <br/>
                    <p>유출 행위</p>
                </section>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div> 
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>

            </CCol>
            <CCol sm={2} className="matrixtable">
                <section>
                    <h5>Impact</h5>
                    <br/>
                    <p>뭐라고 할까..</p>
                </section>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div> 
                <div value="T1189">Drive-by Compromise</div>
                <div value="T1189">Drive-by Compromise</div>

            </CCol>

            
            </CRow>
        </div>

    )
}


export default MatrixTable