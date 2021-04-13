import axios from "axios";

class Api_Link {
    getFile = (linkUrl) => {
        return axios.post('http://localhost:8001/getdocs/temp', {
            url: linkUrl
        }, {
            headers: {
                mode: 'no-cors',
                responseType: 'arraybuffer'
            }
        });
    }
}

export default new Api_Link();