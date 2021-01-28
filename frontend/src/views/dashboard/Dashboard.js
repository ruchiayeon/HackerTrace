import React, { lazy, useState,useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CFormGroup,
  CSelect,
} from '@coreui/react'
import axios from 'axios'
import { CChartLine } from '@coreui/react-chartjs'

import Page404 from "../pages/page404/Page404"
import Loading from "../pages/Loading/Loading"



function Dashboard() {
  const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //이상행위 대시보드 Count 조회
  const [abnormalData, setAbnormalData] = useState(null) 
  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);
  const [frishostDatas, setFrisHostDatas] = useState(null);

  //Chart Datas
  const [updat, setupdate] = useState(null)
  const [monchartDatas, setMonChartDatas] = useState(null);
  const [tuechartDatas, settueChartDatas] = useState(null);
  const [wedchartDatas, setwedChartDatas] = useState(null);
  const [thuchartDatas, setthuChartDatas] = useState(null);
  const [frichartDatas, setfriChartDatas] = useState(null);
  const [satchartDatas, setsatChartDatas] = useState(null);
  const [sunchartDatas, setsubChartDatas] = useState(null);


  //input data handeling 전혀 코딩 안함
  useEffect(()=>{
    const hostResData = async() => {
    try{
    setLoading(true);
    //axios를 이용하여 해당 url에서 갑을 받아온다.
    const response = await axios.get(
        'http://210.114.18.175:8080/ht/host/list'
    )
    //받아온 값을 setMiterData에 넣어준다.
    
    setHostDatas(response.data.data);
    setFrisHostDatas(response.data.data[0].hostIp)

    }catch(e){
    //에러시 flag를 달아서 이동
    setError(e);
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
    };
    hostResData();
  }, []);

  const[inputs, setInputs] = useState({
    selectHostIp: "",
  });

  const {selectHostIp} = inputs;

  function handlerChange(e){
    const { value, name } = e.target;  
    const chagneHost = e.target.value; 
    submitAbnormal(chagneHost)
    setInputs({
    ...inputs,
    [name]:value
    });
  };

  function submitAbnormal(selectHostIp){
    if(!selectHostIp){
      AbnormalDash(frishostDatas)
      ImportChart(frishostDatas)
    }else{
      AbnormalDash(selectHostIp)
      ImportChart(selectHostIp)
    }
  }
  const AbnormalDash = async(selectHostIp) => {
    try{
      setLoading(true);
      const response = await axios.post(
        `http://210.114.18.175:8080/ht/dashboard/statics/mitre-attack`,
        {
          hostIp : selectHostIp
        }
      )
      setAbnormalData(response.data.data)
    }catch(e){
      setError(e)
    }
    setLoading(false);
  }

  const ImportChart = async(selectHostIp) => {
    try{
      setLoading(true);
      const response = await axios.post(
        `http://210.114.18.175:8080/ht/dashboard/statics/chart/config`,
        {
          hostIp : selectHostIp
        }
      )
      setupdate(response.data.data.chart_data[6].updateTime)
      for(let i=0; i<7;i++){
        if(response.data.data.chart_data[i].월){
          setMonChartDatas(response.data.data.chart_data[i].월)
        }

        if(response.data.data.chart_data[i].화){
          settueChartDatas(response.data.data.chart_data[i].화)
        }

        if(response.data.data.chart_data[i].수){
          setwedChartDatas(response.data.data.chart_data[i].수)
        }

        if(response.data.data.chart_data[i].목){
          setthuChartDatas(response.data.data.chart_data[i].목)
        }
        if(response.data.data.chart_data[i].금){
          setfriChartDatas(response.data.data.chart_data[i].금)
        }

        if(response.data.data.chart_data[i].토){
          setsatChartDatas(response.data.data.chart_data[i].토)
        }

        if(response.data.data.chart_data[i].일){
          setsubChartDatas(response.data.data.chart_data[i].일)
        }
      }
    }catch(e){
      setError(e)
    }
    setLoading(false);
  }


  const fields = [
    {key:'term', label:"TIME"},
    {key:'initial-access', label:"Initial Access"},
    {key:'execution', label:"Execution"},
    {key:'persistence', label:"Persistence"}, 
    {key:'privilege-escalation', label:"Privilege Escalation"},
    {key:'defense-evasion', label:"Defense Evasion"},
    {key:'credential-access', label:"Credential Access"},
    {key:'discovery', label:"Discovery"}, 
    {key:'lateral-movement', label:"Lateral Movement"},
    {key:'command-and-control', label:"Command And Control"},
    {key:'exfiltration', label:"Exfiltration"},
    {key:'impact', label:"Impact"},
  ]

  //Chart 부분 

  const defaultDatasets = (()=>{
    const defaultChartDatas = [monchartDatas,tuechartDatas,wedchartDatas,thuchartDatas,frichartDatas,satchartDatas,sunchartDatas]
  
    return [
      {
        label: '형상관리 변경 현황',
        backgroundColor: "#321fdbb0",
        borderColor:"#321fdb",
        pointHoverBackgroundColor: "#321fdb",
        borderWidth: 3,
        data: defaultChartDatas,
        pointBorderColor: '#321fdb',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBorderColor: '#f9b115',
        pointHoverBorderWidth: 9,
        pointRadius: 1,
        pointHitRadius: 10,
      }
    ]
  })()
  
  const defaultOptions = (()=>{
    return {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              drawOnChartArea: true
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              display: true
            }
          }]
        },
        elements: {
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3
          }
        }
      }
    }
  )()
  
  if(loading) return <Loading/>;
  if(error) return <Page404/>;
  if(!hostDatas) return <Page404/>;
  if(!abnormalData) return submitAbnormal();

  return (
    <>
     <div className="dashChangeHostIp d-md-down-none c-subheader-nav">
        <CCol md="2" className="hostIpSelector">
          <CFormGroup>
            <CSelect  custom name="selectHostIp" onChange={handlerChange} value={selectHostIp} id="selectHostIp">
              {hostDatas.map((item, index) => {
                return <option key={index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
              })}
            </CSelect>
          </CFormGroup>
        </CCol>
      </div>
      {/*첫번째 숫자위젯 */}
      <WidgetsDropdown />
      {/*형상관리 template */}
      <CCard>
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 className="abnormalTitle">형상관리</h4>
              <h6>업데이트 일자 : {updat}</h6>
            </CCol>
          </CRow>
          <CChartLine
            style={{height: '300px', marginTop: '40px'}}
            datasets={defaultDatasets}
            options={defaultOptions}
            labels={['월', '화', '수', '목', '금', '토', '일']}
          />
     
        </CCardBody>
      </CCard>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol >
                  <h4 className="abnormalTitle">이상행위</h4>
                  <h6>업데이트 일자 : {abnormalData[0].updateTime}</h6>
                  <CDataTable
                    items={abnormalData}
                    fields={fields}
                  />
                </CCol>
              </CRow>             
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
