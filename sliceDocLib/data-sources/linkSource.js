const axios = require("axios");

exports.getLinkData = async (url) => {
    let response = await axios.get(url, {
        mode: 'no-cors',
        responseType: 'arraybuffer'
    });

    return response;
}