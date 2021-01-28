import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCol,
  CFormGroup,
  CSelect,
} from '@coreui/react'

function HostipImport(){
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  //host Ip받아오는 부분
  const [hostDatas, setHostDatas] = useState(null);
  const [frishostDatas, setFrisHostDatas] = useState(null);

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
    //console.log(response.data.data);

    }catch(e){
    //에러시 flag를 달아서 이동
    setError(e);
    //console.log(e)
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
    setInputs({
    ...inputs,
    [name]:value
    });
  };
  
  if(loading) return <div>로딩중</div>;
  if(error) return <div>에러</div>;
  if(!hostDatas) return <div>일치하는 데이터가 없습니다.</div>;
  
  
  
  return (
    <> 
    <div className="d-md-down-none mfe-2 c-subheader-nav">
      <CCol md="12">
        <CFormGroup>
          <CSelect  custom name="selectHostIp" onChange={handlerChange} value={selectHostIp} id="selectHostIp">
            {hostDatas.map((item, index) => {
              return <option key={index} value={item.hostIp}>{item.hostName}({item.hostIp})</option>
            })}
          </CSelect>
        </CFormGroup>
      </CCol>
    </div>
    </>
  )
  
}



export default HostipImport
