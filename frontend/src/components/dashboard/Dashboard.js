import React, { Component } from 'react'
import styled from 'styled-components'


const DashTable = styled.table`
    max-width: 1100px;
    margin: auto;
`
const FormGrid = styled.div`
    max-width: 1100px;
    margin: auto;
    margin-top: 3rem;
`
function DashboardConfig(){
    return(
        <>


        </>
    )
}

function DashboardAbnormal(){
    return(
        <>
        <FormGrid>
            <DashTable>
                <thead>
                    <tr>
                        <th>Initial Access</th>
                        <th>Execution</th>
                        <th>Persistence</th>
                        <th>Privilege Escalation</th>
                        <th>Defense Evasion</th>
                        <th>Credential Access</th>
                        <th>Discovery</th>
                        <th>Lateral Movement</th>
                        <th>Collection</th>
                        <th>Command and Control</th>
                        <th>Exfiltration</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </DashTable>
        </FormGrid>
        </>
    )
}

export class Dashboard extends Component {
    render() {
        return (
            <>
            <DashboardConfig/>
            <DashboardAbnormal/>
        </>
        )
    }
}

export default Dashboard
