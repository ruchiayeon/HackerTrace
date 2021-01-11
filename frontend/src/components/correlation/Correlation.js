import React,{useEffect,useState} from 'react'
import axios from 'axios'


function Correlation(){
    const [mattrix, setMa] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCorrelation = async () => {
          try {
            // 요청이 시작 할 때에는 error 와 users 를 초기화하고
            setError(null);
            // loading 상태를 true 로 바꿉니다.
            setLoading(true);
            const response = await axios.get(
              'http://210.114.18.175:8080/ht/mitre/get/matrix?isSubT=T'
            );
            setUsers(response.data); // 데이터는 response.data 안에 들어있습니다.
          } catch (e) {
            setError(e);
          }
          setLoading(false);
        };
    
        loadCorrelation();
      }, []);
    
      if (loading) return <div>로딩중..</div>;
      if (error) return <div>에러가 발생했습니다.</div>;
      if (!mattrix) return null;
      return (
        <>

        </>
      )
    
}

export default Correlation
