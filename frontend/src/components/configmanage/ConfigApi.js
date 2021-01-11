import Axios from 'axios';

const configApi = Axios.get({
    baseURL: 'http://210.114.18.175:8080/ht/mitre/get/matrix?isSubT=T'
})

export default configApi
