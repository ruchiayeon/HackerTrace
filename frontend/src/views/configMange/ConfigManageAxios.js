import React,{useEffect, useState} from 'react'
import axios from 'axios'

//예외처리
import Page404 from '../pages/page404/Page404'



function ConfigManageAxios() {
    //실패/ 로딩중 메세지 --> 로딩 성공시 넘어가게 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    //config Data info
    const [configData, setConfigData] = useState(null);
    
    useEffect(()=>{
        const setConfigResData = async()=>{
        try{
            //요청이 왔을때 원래 있던 값을 초기화해준다.
            configData(null);
            setError(null);

            setLoading(true);
            //axios를 이용하여 해당 url에서 갑을 받아온다.
            const response = await axios.get(
                '127.0.0.1'
            );
            //받아온 값을 setMiterData에 넣어준다.
            setConfigData(JSON.stringify(response.data));
        }catch(e){

            //에러시 flag를 달아서 이동
            setError(e);
        }
            //로딩 실패시 flag를 달아서 이동
            setLoading(false);
       };
       setConfigResData();
    }, []);

    //로딩관련 예외처리를 해준다. --> 페이지 만들어졌을때 변경 하기 
    if(loading) return <div>로딩중</div>;
    if(error) return <Page404/>;
    if(!configData) return <div>일치하는 데이터가 없습니다.</div>;

    //Axios로 불러온 값을 뿌려주는 부분이다.  
    //console.log('data is ' + JSON.stringify(data)); 이렇게 사용하면  json형으로 사용이 가능하다고 하는데 
    //DB 연결후 확인을 해봐야 한다.

    return (
        <div>
            {configData.map(configData =>(
                {configData}
            ))} 
        </div>
    )
    
}

export default ConfigManageAxios


