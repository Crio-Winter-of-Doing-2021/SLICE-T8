import axios from "axios";

class Api_digimocker {
  authDigiMocker = (mockerCred) => {
    return axios.post('http://localhost:8001/auth/digiMocker', mockerCred)
  }

  getAllMockerData = ({email, token}) => {
    return axios.post('http://localhost:8001/getdocs/digiMocker', {
      email
    }, {
      headers: {
        'auth-token': token
      }
    })

  }

  getUniqueMockData = ({ email, name, token }) => {
    return axios.post(`http://localhost:8001/getdocs/digiMocker/${name}`, {
      email
    }, {
      headers: {
        'auth-token': token
      }
    })
  }

  getFile = (linkUrl) => {
            return axios.get(linkUrl, {
                mode: 'no-cors',
                responseType: 'arraybuffer'
            });
        }
}

export default new Api_digimocker();
