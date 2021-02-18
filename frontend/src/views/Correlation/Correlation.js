import React,{useContext, useState} from 'react'

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
  CPopover
} from '@coreui/react'

//import MatrixTable from './MatrixTable'
import Loading from '../pages/Loading/Loading'
import Page404 from '../pages/page404/Page404';
import Context from "../Context"
import HOSTIPNAME from "../../config"

function Correlation() {

  //Axios부분 
  //실패/ 로딩중 메세지 --> 로딩 성공시 넘어가게 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);
  const [firsthostDatas, setFirHostDatas] = useState(null);

   //session / uid 받아오는 부분
   const [uidDatas, setUidDatas] = useState([null]);
   const [frisuidDatas, setFirsUidDatas] = useState([null]);
   const [sessDatas, setSessDatas] = useState([null]);
   const [frissessDatas, setFirsSessDatas] = useState([null]);

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
  const [LateralMove, setLateralMove] = useState("")
  const [Exfiltration, setExfiltration] = useState("")
  const [Impact, setImpact] = useState("")

  let today = new Date();   
  let year = today.getFullYear(); // 년도
  let month = ("00"+ (today.getMonth() + 1)).slice(-2);  // 월
  let date = ("00" + today.getDate()).slice(-2);  // 날짜
  const formatdate = year + '-' + month + '-' + date
  
  const {state} = useContext(Context)
  const hostResData = async() => {
    try{
    setLoading(true);
    //axios를 이용하여 해당 url에서 갑을 받아온다.
    const response = await axios.post(
      `http://${HOSTIPNAME}/ht/host/list/user?adminUserId=${state.userId}`
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


  const [inputs, setInputs] = useState({
    startDate: formatdate,
    endDate: formatdate,
    selectHostColum: firsthostDatas,
    selectSESSColum : ""
  });

  const [deepinputs, setDeepInputs] = useState({
    selectUIDColum : ""
  });
  
  const { selectUIDColum} = deepinputs;
  const { startDate, endDate, selectHostColum, selectSESSColum} = inputs;

  function handlerChange(e) {
    const { value, name } = e.target;  
    setInputs({
      ...inputs,
      [name] : value
    });
  };

  function deephandlerChange(e) {
    const { value, name } = e.target;  
    const changeValue = e.target.value
    sessubmitValue(changeValue);
    setDeepInputs({
      ...deepinputs,
      [name] : value
    });
  };
  
  
 //값이 없는경우 확인하는 조건문
  function submitValue(){
    if(!selectHostColum){ 
      uidResDatas(startDate, endDate, firsthostDatas);
    }else{
      uidResDatas(startDate, endDate, selectHostColum);
    }
  };

 

  const uidResDatas = async(startDate, endDate, selectHostColum) => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
          `http://${HOSTIPNAME}/ht/mitre/condition/uid`,
          {
            endDate   : endDate,
            startDate : startDate,
            hostIp    : selectHostColum
          }
      )
      //받아온 값을 setUidDatas/setSessDatas에 넣어준다.
      if(response.data.data.uid_list.length === 0){
        alert("UID가 존재하지 않습니다.")
        setUidDatas([null])
        setSessDatas([null])
      }else{
        setUidDatas(response.data.data.uid_list);
        setFirsUidDatas(response.data.data.uid_list[0]);
        sessubmitValue(response.data.data.uid_list[0])
      }
      
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  };
  
  //값이 없는경우 확인하는 조건문
  function sessubmitValue(selectUIDColum){
    if(!selectHostColum){ 
      if(!selectUIDColum){
         sesResDatas(startDate, endDate, firsthostDatas, frisuidDatas);
      }else{
        sesResDatas(startDate, endDate, firsthostDatas, selectUIDColum);
      }
    }else{
      if(!selectUIDColum){
        sesResDatas(startDate, endDate, selectHostColum, frisuidDatas);
     }else{
       sesResDatas(startDate, endDate, selectHostColum, selectUIDColum);
     }
    }
  };

  const sesResDatas = async(startDate, endDate, selectHostColum, selectUIDColum) => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
          `http://${HOSTIPNAME}/ht/mitre/condition/ses`,
          {
            endDate   : endDate,
            startDate : startDate,
            hostIp    : selectHostColum,
            uid       : selectUIDColum
          }
      )
      //받아온 값을 setUidDatas/setSessDatas에 넣어준다.
      if(response.data.data.ses_list.length === 0){
        alert("UID가 존재하지 않습니다.")
        setSessDatas(["UID가 존재하지 않습니다."])
      }else{
        setSessDatas(response.data.data.ses_list);
        setFirsSessDatas(response.data.data.ses_list[0]);
      }
      
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e);
      console.log(e)
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
  };

  
  //<table 검색 파트>

  //선학님이 DB넘겨주는것 확인하고 fields key값 변경하기.
  const fields = [
    {key:'kill_chain_phases',_style:{width:'20%'}, label: "Kill Chain Phases"},
    {key:'external_ids',_style:{width:'20%'}, label: "Mitre ID"}
  ]

  //Table 조건을 다걸고 axios쪽으로 값을 넘겨준다.
  //table 검색 결과값 보내주기
  const [corrDatas, setCorrData] = useState(null);
  const [matchAttGroupDatas, setMatchAttGroupDatas] = useState([
    {attack_group_name:"",matching_rate:"%"},
    {attack_group_name:"",matching_rate:"%"},
    {attack_group_name:"",matching_rate:"%"}
  ]);

  //Table Search Axios 넣는 부분.
  const corrResData = async(startDate, endDate, selectHostColum, selectUIDColum, selectSESSColum) => {
    try{
      setLoading(true);
      //axios를 이용하여 해당 url에서 값을 받아온다.
      const response = await axios.post(
        `http://${HOSTIPNAME}/ht/mitre/list`,
        { endDate   : endDate,
          startDate : startDate,
          hostIp    : selectHostColum,
          ses       : selectSESSColum,
          uid       : selectUIDColum 
        }
      )

      //받아온 값을 setCorrData 넣어준다.
      if(response.data.data[1].user_audit_match_t.length === 0){
        alert("검출된 사용자 Mattix T Value 내역이 없습니다.")
        setCorrData(null)
        resetMattrix();
      }else{
        setCorrData(response.data.data[1].user_audit_match_t);
      }
      //받아온 값을 setMatchAttGroupDatas 넣어준다.
      if(response.data.data[0].attack_group_matching.length === 0){
        alert("검출된 유사 공격 그룹 내역이 없습니다.")
        setMatchAttGroupDatas([
          {attack_group_name:"일치대상 없음", matching_rate:"%"},
          {attack_group_name:"일치대상 없음", matching_rate:"%"},
          {attack_group_name:"일치대상 없음", matching_rate:"%"}
        ])
        resetMattrix();
      }else{
        setMatchAttGroupDatas(response.data.data[0].attack_group_matching)
      }
      
    }catch(e){
      //에러시 flag를 달아서 이동
      setError(e)
      console.log(e)
    }
    //로딩 실패시 flag를 달아서 이동
    setLoading(false);
    //값 넘기는 부분 작성 --> matrixTable쪽으로.
  };

  //input selector를 따로 선택 안해도 받아오는 부분
  function submitTableValue(){
    if(!frisuidDatas || !frissessDatas){
      alert("상관분석 데이터가 존재 하지 않습니다. 검색 날짜를 변경해주십시오.")
    }else if(!frisuidDatas[0] || !frissessDatas[0]){
      alert("상관분석 데이터가 존재 하지 않습니다. 검색 날짜를 변경해주십시오.")
    }else{ 
      if(!selectHostColum || selectHostColum === firsthostDatas){
        if(!selectUIDColum || selectUIDColum === frisuidDatas){
          if(!selectSESSColum || selectSESSColum === frissessDatas){
            corrResData(startDate, endDate, firsthostDatas, frisuidDatas, frissessDatas);
          }else{
            corrResData(startDate, endDate, firsthostDatas, frisuidDatas, selectSESSColum);
          }
        }else{
          if(!selectSESSColum || selectSESSColum === frissessDatas){
            corrResData(startDate, endDate, firsthostDatas, selectUIDColum, frissessDatas);
          }else{
            corrResData(startDate, endDate, firsthostDatas, selectUIDColum, selectSESSColum);
          }
        }
      }else{
        if(!selectUIDColum || selectUIDColum === frisuidDatas){
          if(!selectSESSColum || selectSESSColum === frissessDatas){
            corrResData(startDate, endDate, selectHostColum, frisuidDatas, frissessDatas);
          }else{
            corrResData(startDate, endDate, selectHostColum, frisuidDatas, selectSESSColum);
          }
        }else{
          if(!selectSESSColum || selectSESSColum === frissessDatas){
            corrResData(startDate, endDate, selectHostColum, selectUIDColum, frissessDatas);
          }else{
            corrResData(startDate, endDate, selectHostColum, selectUIDColum, selectSESSColum);
          }
        }
      }
    }
  };

  //Matrix-table --> 나중에 쪼개기 
  //Att&CK map info
  const matrixResData = async(value) => {
    try{
        //요청이 왔을때 원래 있던 값을 초기화해준다.
        setLoading(true);

        //axios를 이용하여 해당 url에서 값을 받아온다.
        const response = await axios.get(
            `http://${HOSTIPNAME}/ht/mitre/matrix?isSubT=${value}`
        )

        //각 section당 값
        setinitialAccess(response.data.data.attack_matrix[0])
        setExecution(response.data.data.attack_matrix[1])
        setPersistence(response.data.data.attack_matrix[2])
        setPrivilege(response.data.data.attack_matrix[3])
        setDefense(response.data.data.attack_matrix[4])
        setCredential(response.data.data.attack_matrix[5])
        setDiscovery(response.data.data.attack_matrix[6])   
        setLateralMove(response.data.data.attack_matrix[7])
        setCollection(response.data.data.attack_matrix[8])
        setExfiltration(response.data.data.attack_matrix[9])
        setCommand(response.data.data.attack_matrix[10])
        setImpact(response.data.data.attack_matrix[11])
    }catch(e){
        //에러시 flag를 달아서 이동
        setError(e);
        console.log(e)
    }
        //로딩 실패시 flag를 달아서 이동
        setLoading(false);
  };
  const [toggleState, setToggleState] = useState("F");
  const [switchtitle, setswitchtitle] = useState("-")

  function toggle() {
    setToggleState(toggleState === "T" ? "F" : "T");
    setswitchtitle(switchtitle === "-" ? "+" : "-");
    matrixResData(toggleState)
  }

  function SubmitMatrix() {
    const valueT = "T"
    matrixResData(valueT)
  }

  //<table 검색된 부분을 가지고 className 변경 파트>
  //2021-01-15 해당 부분 확인 필
  //matrix color change className
  const[initcolor, setInitColor] =useState("matrixtable")
  const[initsearched, setInitSearched] =useState(null);

  const[execolor, setExecolor] =useState("matrixtable")
  const[exesearched, setExeSearched] =useState(null);

  const[persiscolor, setPersisColor] =useState("matrixtable")
  const[persissearched, setPersisSearched] =useState(null);

  const[preEcolor, setPreEcolor] =useState("matrixtable")
  const[presearched, setPreSearched] =useState(null);

  const[defencolor, setDefenColor] =useState("matrixtable")
  const[defensearched, setDefenSearched] =useState(null);

  const[credicolor, setCredicolor] =useState("matrixtable")
  const[credisearched, setCrediSearched] =useState(null);

  const[discocolor, setDiscoColor] =useState("matrixtable")
  const[discosearched, setDiscoSearched] =useState(null);

  const[lateralcolor, setlateralcolor] =useState("matrixtable")
  const[lateralsearched, setlateralSearched] =useState(null);

  const[collcolor, setCollcolor] =useState("matrixtable")
  const[collsearched, setCollSearched] =useState(null);
  
  const[exfcolor, setExfColor] =useState("matrixtable")
  const[exfsearched, setExfSearched] =useState(null);

  const[commcolor, setCommcolor] =useState("matrixtable")
  const[commsearched, setCommSearched] =useState(null);

  const[impaccolor, setImpaccolor] =useState("matrixtable")
  const[impacsearched, setImpacSearched] =useState(null);

  //Mattrix color값 초기화 
  function resetMattrix(){
    //color값 reset
    setInitColor("matrixtable")
    setExecolor("matrixtable")
    setPersisColor("matrixtable")
    setPreEcolor("matrixtable")
    setDefenColor("matrixtable")
    setCredicolor("matrixtable")
    setDiscoColor("matrixtable")
    setlateralcolor("matrixtable")
    setCollcolor("matrixtable")
    setCommcolor("matrixtable")
    setExfColor("matrixtable")
    setImpaccolor("matrixtable")

    //searchT Value reset
    setInitSearched(null)
    setExeSearched(null)
    setPersisSearched(null)
    setPreSearched(null)
    setDefenSearched(null)
    setCrediSearched(null)
    setDiscoSearched(null)
    setDiscoSearched(null)
    setlateralSearched(null)
    setCollSearched(null)
    setCommSearched(null)
    setExfSearched(null)
    setImpacSearched(null)
  }

  

  //사용자 검색결과 보여주기
  async function resultMatrix(){
    resetMattrix();
    //corrDatas 확인해서 있으면 동작
    const corrSpotChange = corrDatas;
    if(!corrDatas){
      alert("아래조건을 선택하세요.")
    }else{

      //Initial-access
      initialAccess.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setInitColor("searchT")
            setInitSearched("searched")
          }
        })
      })

      //execution 비교
      Execution.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setExecolor("searchT")
            setExeSearched("searched")
          }
        })
      })

      //Persistence 비교  
      Persistence.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_idstems) !== -1){
            setPersisColor("searchT")
            setPersisSearched("searched")
          }
        })
      })

      //Privilege Escalation 비교
      Privilege.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setPreEcolor("searchT")
            setPreSearched("searched")
          }
        })
      })

      //Defense Evasion 비교
      Defense.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setDefenColor("searchT")
            setDefenSearched("searched")
          }
        })
      })

      //Credential Access 비교
      Credential.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setCredicolor("searchT")
            setCrediSearched("searched")
          }
        })
      })

      //Discovery 비교
      Discovery.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setDiscoColor("searchT")
            setDiscoSearched("searched")
          }
        })
      })

      //Lateral 비교
      LateralMove.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setlateralcolor("searchT")
            setlateralSearched("searched")
          }
        })
      })

      //Collection 비교
      Collection.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setCollcolor("searchT")
            setCollSearched("searched")
          }
        })
      })
      
      //Command 비교
      Command.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setCommcolor("searchT")
            setCommSearched("searched")
          }
        })
      })

      //Exfiltration 비교
      Exfiltration.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setExfColor("searchT")
            setExfSearched("searched")
          }
        })
      })


      //Impact 비교
      Impact.forEach(function(element) {
        corrSpotChange.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items.external_ids) !== -1){
            setImpaccolor("searchT")
            setImpacSearched("searched")
          }
        })
      })

     
    
    }
  }
 
  //color-Change
  function changeColors(){

    const AttSpotChange1 = matchAttGroupDatas[0].attack_group_external_ids;
    
    if(!AttSpotChange1 || AttSpotChange1 ==='n'){
      alert('위 검색 조건을 먼저 선택해주세요.')
    }else{
      resultMatrix();
      //Initial-access
      initialAccess.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setInitColor("attckGroupT")
            if(initsearched === "searched"){
              setInitColor("matchT")
            }
          }
        })
      })

       //execution 비교
       Execution.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setExecolor("attckGroupT")
            if(exesearched === "searched"){
              setExecolor("matchT")
            }
          }
        })
      })
      
      //Persistence 비교
      Persistence.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setPersisColor("attckGroupT")
            if(persissearched === "searched"){
              setPersisColor("matchT")
            }
          }
        })
      })

      //Privilege Escalation 비교
      Privilege.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setPreEcolor("attckGroupT")
            if(presearched === "searched"){
              setPreEcolor("matchT")
            }
          }
        })
      })

      //Defense Evasion 비교
      Defense.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setDefenColor("attckGroupT")
            if(defensearched === "searched"){
              setDefenColor("matchT")
            }
          }
        })
      })
      
      //Credential Access 비교
      Credential.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setCredicolor("attckGroupT")
            if(credisearched === "searched"){
              setCredicolor("matchT")
            }
          }
        })
      })
      
      //Discovery 비교
      Discovery.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setDiscoColor("attckGroupT")
            if(discosearched === "searched"){
              setDiscoColor("matchT")
            }
          }
        })
      })

       // LateralMove 비교
       LateralMove.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setlateralcolor("attckGroupT")
            if(discosearched === "searched"){
              setlateralSearched("matchT")
            }
          }
        })
      })
      
      //Collection 비교
      Collection.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setCollcolor("attckGroupT")
            if(collsearched === "searched"){
              setCollcolor("matchT")
            }
          }
        })
      })

      //Command 비교
      Command.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setCommcolor("attckGroupT")
            if(commsearched === "searched"){
              setCommcolor("matchT")
            }
          }
        })
      })

      //Exfiltration 비교
      Exfiltration.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids

          if(external.indexOf(items) !== -1){
            setExfColor("attckGroupT")
            if(exfsearched === "searched"){
              setExfColor("matchT")
            }
          }
        })
      })

      //Impact 비교
      Impact.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setImpaccolor("attckGroupT")
            if(impacsearched === "searched"){
              setImpaccolor("matchT")
            }
          }
        })
      })    
    }
  }

  function changeColors1(){

    const AttSpotChange1 = matchAttGroupDatas[1].attack_group_external_ids;

    if(!AttSpotChange1 || AttSpotChange1 ==='n'){
      alert('아래 검색 조건을 먼저 선택해주세요.')
    }else{
      resultMatrix();

      //Initial-access
      initialAccess.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setInitColor("attckGroupT")
            if(initsearched === "searched"){
              setInitColor("matchT")
            }
          }
        })
      })

       //execution 비교
       Execution.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setExecolor("attckGroupT")
            if(exesearched === "searched"){
              setExecolor("matchT")
            }
          }
        })
      })
      
      //Persistence 비교
      Persistence.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setPersisColor("attckGroupT")
            if(persissearched === "searched"){
              setPersisColor("matchT")
            }
          }
        })
      })

      //Privilege Escalation 비교
      Privilege.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setPreEcolor("attckGroupT")
            if(presearched === "searched"){
              setPreEcolor("matchT")
            }
          }
        })
      })

      //Defense Evasion 비교
      Defense.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setDefenColor("attckGroupT")
            if(defensearched === "searched"){
              setDefenColor("matchT")
            }
          }
        })
      })
      
      //Credential Access 비교
      Credential.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setCredicolor("attckGroupT")
            if(credisearched === "searched"){
              setCredicolor("matchT")
            }
          }
        })
      })
      
      //Discovery 비교
      Discovery.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setDiscoColor("attckGroupT")
            if(discosearched === "searched"){
              setDiscoColor("matchT")
            }
          }
        })
      })

    // LateralMove 비교
    LateralMove.forEach(function(element) {
      AttSpotChange1.forEach(function(items){
        const external = element.external_ids
        if(external.indexOf(items) !== -1){
          setlateralcolor("attckGroupT")
          if(discosearched === "searched"){
            setlateralSearched("matchT")
          }
        }
      })
    })
    



      //Collection 비교
      Collection.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setCollcolor("attckGroupT")
            if(collsearched === "searched"){
              setCollcolor("matchT")
            }
          }
        })
      })

      //Command 비교
      Command.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setCommcolor("attckGroupT")
            if(commsearched === "searched"){
              setCommcolor("matchT")
            }
          }
        })
      })

      //Exfiltration 비교
      Exfiltration.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids

          if(external.indexOf(items) !== -1){
            setExfColor("attckGroupT")
            if(exfsearched === "searched"){
              setExfColor("matchT")
            }
          }
        })
      })

      //Impact 비교
      Impact.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setImpaccolor("attckGroupT")
            if(impacsearched === "searched"){
              setImpaccolor("matchT")
            }
          }
        })
      })    
    }
  }

  function changeColors2(){

    const AttSpotChange1 = matchAttGroupDatas[2].attack_group_external_ids;

    if(!AttSpotChange1 || AttSpotChange1 ==='n'){
      alert('아래 검색 조건을 먼저 선택해주세요.')
    }else{
      resultMatrix();

      //Initial-access
      initialAccess.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setInitColor("attckGroupT")
            if(initsearched === "searched"){
              setInitColor("matchT")
            }
          }
        })
      })

       //execution 비교
       Execution.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setExecolor("attckGroupT")
            if(exesearched === "searched"){
              setExecolor("matchT")
            }
          }
        })
      })
      
      //Persistence 비교
      Persistence.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setPersisColor("attckGroupT")
            if(persissearched === "searched"){
              setPersisColor("matchT")
            }
          }
        })
      })

      //Privilege Escalation 비교
      Privilege.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setPreEcolor("attckGroupT")
            if(presearched === "searched"){
              setPreEcolor("matchT")
            }
          }
        })
      })

      //Defense Evasion 비교
      Defense.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setDefenColor("attckGroupT")
            if(defensearched === "searched"){
              setDefenColor("matchT")
            }
          }
        })
      })
      
      //Credential Access 비교
      Credential.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setCredicolor("attckGroupT")
            if(credisearched === "searched"){
              setCredicolor("matchT")
            }
          }
        })
      })
      
      //Discovery 비교
      Discovery.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setDiscoColor("attckGroupT")
            if(discosearched === "searched"){
              setDiscoColor("matchT")
            }
          }
        })
      })

    // LateralMove 비교
    LateralMove.forEach(function(element) {
      AttSpotChange1.forEach(function(items){
        const external = element.external_ids
        if(external.indexOf(items) !== -1){
          setlateralcolor("attckGroupT")
          if(discosearched === "searched"){
            setlateralSearched("matchT")
          }
        }
      })
    })
    



      //Collection 비교
      Collection.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setCollcolor("attckGroupT")
            if(collsearched === "searched"){
              setCollcolor("matchT")
            }
          }
        })
      })

      //Command 비교
      Command.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setCommcolor("attckGroupT")
            if(commsearched === "searched"){
              setCommcolor("matchT")
            }
          }
        })
      })

      //Exfiltration 비교
      Exfiltration.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids

          if(external.indexOf(items) !== -1){
            setExfColor("attckGroupT")
            if(exfsearched === "searched"){
              setExfColor("matchT")
            }
          }
        })
      })

      //Impact 비교
      Impact.forEach(function(element) {
        AttSpotChange1.forEach(function(items){
          const external = element.external_ids
          if(external.indexOf(items) !== -1){
            setImpaccolor("attckGroupT")
            if(impacsearched === "searched"){
              setImpaccolor("matchT")
            }
          }
        })
      })    
    }
  }
 
  //로딩관련 예외처리를 해준다. --> 페이지 만들어졌을때 변경 하기 
  if(loading) return <Loading/>;
  if(error) return <Page404/>
  //Host Ip를 받는 부분은 페이지 로딩시 바로 이루어져야 하므로 useEffect를 사용하여 값을 전달.
  if(!hostDatas) return hostResData();
  if(!frisuidDatas[0]) return submitValue();
  if(!initialAccess) return SubmitMatrix();


 
  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              {/*상관분석 관련 검색하는 테이블을 표기한다. Axios쪽에 넘겨야하는 Value가 useEffect에 정의되어있다. 확인 필.*/}
              <div className="searchtoolbar">
                <CRow>
                  <CCol>
                    <CFormGroup row>
                      <CCol  md="12">
                        <CInput type="date" id="startDate" placeholder="start_date" onChange={handlerChange} value={startDate} name='startDate'/>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    <CFormGroup row>
                      <CCol md="12">
                        <CInput type="date" id="endDate" placeholder="end_date" onChange={handlerChange} value={endDate} name='endDate'/>
                      </CCol>
                    </CFormGroup>
                  </CCol>   
                  <CCol md="2">
                    <CFormGroup>
                      <CSelect custom name="selectHostColum" onChange={handlerChange} value={selectHostColum} id="selectHostColum">
                        {hostDatas.map((item, index) => {
                          return <option key={"selectHostColum"+index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
                        })}
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  <CCol md="2"> 
                    <CButton onClick={submitValue} color="info">uid | session 확인</CButton>
                  </CCol>
                  <CCol md="5">
                    <CRow>
                      <CCol md={4}>
                      <CFormGroup>
                        <CSelect custom name="selectUIDColum" onChange={deephandlerChange} value={selectUIDColum} id="selectUIDColum">
                          {uidDatas.map((item, index) => {
                            return <option className='selectUIDColum' key={index+"selectUIDColum"} value={item}>UID : {item}</option>
                          })}
                        </CSelect>
                      </CFormGroup>
                      </CCol>
                      <CCol md={4}>
                      <CFormGroup>
                        <CSelect custom name="selectSESSColum" onChange={handlerChange} value={selectSESSColum} id="selectSESSColum">
                           {sessDatas.map((item, index) => {
                            return <option key={index+"selectSESSColum"} value={item}>Session : {item}</option>
                          })}
                        </CSelect>
                      </CFormGroup>
                      </CCol>
                      <CCol md={2}>
                        <CButton onClick={submitTableValue} color="info">검색</CButton>
                      </CCol>
                      <CCol md={2}>
                        <CButton onClick={()=>window.location.reload()} color="info" target="초기화">초기화</CButton>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </div>
              <CDataTable
                items={corrDatas}
                fields={fields}
                itemsPerPage= {5}
                hover
                pagination
              />
               <hr className="tableTopMargin"/>
               {/*사용자와 유사한 공격그룹을 보여주는 section*/}
               <CRow>
                <section className="restbtn">
                  <CButton title="ATTCK Map초기화" onClick={resetMattrix} color="info" target="초기화">ATTCK Map 초기화</CButton>
                  <CButton title="ATTCK Map 상세보기" value={`switch ${toggleState}`}onClick={toggle} color="info">{switchtitle}</CButton>
                </section>
              </CRow>
               
              <CRow className='legend'>
                <div className="LegendRow" onClick={resultMatrix}>
                  <CRow>
                    <div className="searchTLegend"/><p>ATT&CK Mapping Data</p> 
                  </CRow>
                </div>  
                <div className="LegendRow">
                  <CRow>
                    <div className="matchTLegend"/><p>일치확인</p>
                  </CRow>
                </div>  
                <div className="LegendRow">
                  <CRow>
                    <div className="attckGrouptLegend"/><p>유사공격그룹 유형</p>
                  </CRow>
                </div>  
    
                <div className="corrlresult col-md-4">
                <h6>TOP 3 유사공격 그룹</h6>
                <CRow >
                  <CCol className="attgroupResult">
                    <CButton onClick={changeColors}>1위 :<br/> {matchAttGroupDatas[0].attack_group_name}[{matchAttGroupDatas[0].matching_rate}]</CButton>
                  </CCol>
                  <CCol  className="attgroupResult">
                    <CButton onClick={changeColors1}>2위 :<br/> {matchAttGroupDatas[1].attack_group_name}[{matchAttGroupDatas[1].matching_rate}]</CButton>
                  </CCol>
                  <CCol className="attgroupResult">
                    <CButton onClick={changeColors2}>3위 :<br/> {matchAttGroupDatas[2].attack_group_name}[{matchAttGroupDatas[2].matching_rate}]</CButton>
                  </CCol>
                  </CRow>
               </div>
              </CRow>

            
              {/*Attack Mattrix tempalte */}
              <CRow>
                <CCol md={12}>
                  <div className="matrixtotal">
                    <CRow> 
                      <CCol className= {initcolor} value={initsearched}>
                        <section className="title">
                          
                            <h5 value="initial-access">Initial-access</h5>
                         
                        </section>
                        {initialAccess.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return <CPopover key={"initialAccess"+index} header='Description' content={item.description} placement="right" trigger="click"><div className="submatrix" value=""> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }else{
                            return <CPopover key={"initialAccess"+index} header='Description' content={item.description} placement="right" trigger="click"><div className={item.external_ids[0]} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }
                          
                        })}
                      </CCol>
                      <CCol className={execolor} value={exesearched}>
                        <section className="title">
                          
                           <h5 value="execution">Execution</h5>
                         
                        </section>
                        {Execution.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"Execution"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }else{
                            return  <CPopover key={"Execution"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }
                          
                          
                        })}
                      </CCol>
                      <CCol className={persiscolor} value={persissearched}>
                        <section className="title"> 
                          
                           <h5 value="persistence">Persistence</h5>
                         
                        </section>
                        {Persistence.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"Persistence"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }else{
                            return  <CPopover key={"Persistence"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }
                          
                        })}
                      </CCol>
                      <CCol className={preEcolor} value={presearched}>
                        <section className="title">
                          
                            <h5>Privilege Escalation</h5>
                         
                        </section>
                        {Privilege.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"Privilege"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }else{
                            return  <CPopover key={"Privilege"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }
                          
                        })}
                      </CCol>
                      <CCol className={defencolor} value={defensearched}>
                        <section className="title">
                          
                            <h5>Defense Evasion</h5>
                          
                        </section>
                        {Defense.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"Defense"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name}</div></CPopover>
                          }else{
                            return  <CPopover key={"Defense"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name}</div></CPopover>
                          }
                          
                        })}
                      </CCol>
                      <CCol className={credicolor} value={credisearched}>
                        <section className="title">
                        
                            <h5>Credential Access</h5>
                          
                        </section>
                        {Credential.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"Credential"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }else{
                            return  <CPopover key={"Credential"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }
                          
                        })}
                      </CCol>    
                      <CCol className={discocolor} value={discosearched}>
                        <section className="title">
                      
                           <h5>Discovery</h5>
                          
                        </section>
                        {Discovery.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"Discovery"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }else{
                            return  <CPopover key={"Discovery"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }
                          
                        })}
                      </CCol>
                      <CCol className={lateralcolor} value={lateralsearched}>
                        <section className="title">
                          
                            <h5>Lateral Movement</h5>
                          
                        </section>
                        {LateralMove.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"LateralMove"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }else{
                            return  <CPopover key={"LateralMove"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }
                          
                        })}
                      </CCol>
                      <CCol className={collcolor} value={collsearched}>
                        <section className="title">
                          
                          <h5>Collection</h5>
                      
                        </section>
                        {Collection.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"Collection"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }else{
                            return  <CPopover key={"Collection"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }
                          
                        })}
                      </CCol>
                      <CCol className={exfcolor} value={exfsearched}>
                        <section className="title">
                          
                            <h5>Exfiltration</h5>
                          
                        </section>
                        {Exfiltration.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"Exfiltration"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }else{
                            return  <CPopover key={"Exfiltration"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }
                        })}
                      </CCol>
                      <CCol className={commcolor} value={commsearched}>
                        <section className="title">
                     
                            <h5>Command and Control</h5>
                        
                        </section>
                        {Command.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"Command"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }else{
                            return  <CPopover key={"Command"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name} </div></CPopover>
                          }
                         
                        })}
                      </CCol>
                      <CCol className= {impaccolor} value={impacsearched}>
                        <section className="title">
                      
                          <h5>Impact</h5>
                          
                        </section>
                        {Impact.map((item, index) => {
                          if(item.external_ids[0].length > 6){
                            return  <CPopover key={"Impact"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className="submatrix" value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name}</div></CPopover>
                          }else{
                            return  <CPopover key={"Impact"+index} header='Description' content={item.description} placement="right" trigger="click"><div name={item.external_ids[0]} className={item.className} value={item.external_ids[0]}> ({item.external_ids[0]})<br/>{item.name}</div></CPopover>
                          }
                          
                        })}
                      </CCol>              
                    </CRow>
                  </div>
                </CCol>

              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  )
}





export default Correlation
