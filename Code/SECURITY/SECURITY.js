const request = require('request')

module.exports.requestApi = (uri, method, data) => {
    return new Promise((resole, reject) => {
        if(method.toLowerCase() == 'get' && data) {
            uri += "?";
            let first = true;
            for(i in data) {
                if(first) {
                    uri += i + "=" + data[i];

                    first = false;
                } else {
                    uri += "&" + i + "=" + data[i];
                }
            }
            data = null;
        }
        request({uri: uri, headers: {}, },(err, response) => {
            if(err) reject(err)
            else resole(response);
        })
    })
}