import React,{useState, useEffect} from 'react'
//import {CButton} from '@coreui/react'

import axios from 'axios'
import { CCol, CRow } from '@coreui/react';


function ConfigHistory() {
     //host Ip받아오는 부분
  const [configHistory, setConfigHistory] = useState(null);

  //host ip 받아오기
  useEffect(()=>{
    const configHistoryResData = async() => {
      try{
        //setLoading(true);
        //axios를 이용하여 해당 url에서 갑을 받아온다.
        const response = await axios.get(
            'http://210.114.18.175:8080/ht/config/directory'
        )
        //받아온 값을 hostDatas에 넣어준다.
        setConfigHistory(response.data.data);
        //console.log(response.data.data[0])
      }catch(e){
        //에러시 flag를 달아서 이동
        //setError(e);
        console.log(e)
      }
        //로딩 실패시 flag를 달아서 이동
        //setLoading(false);
      };
      configHistoryResData();
  }, []);
  if(!configHistory) return <div>일치하는 데이터가 없습니다.</div>;
  function postPath() {
    alert(`.`)
  }

    return (
        <div>
            <p>형상변경 History</p>
          <CRow>
            <CCol>
              {configHistory.map((item, index) => {
                
                  return <button key={index} value={item._id} onClick={postPath}> {item._id}</button>
              })}
            </CCol>
          </CRow>
            
        </div>
    )
    
}

export default ConfigHistory
