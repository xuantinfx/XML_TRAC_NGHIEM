const request = require('request')
const jwt = require('jsonwebtoken');
const {
    DAL_URL,
    secretkey
} = require('./config')
const xml2js = require('xml2js')

module.exports.requestApi = (uri, method, data) => {
    return new Promise((resole, reject) => {
        if (method.toLowerCase() == 'get' && data) {
            uri += "?";
            let first = true;
            for (i in data) {
                if (first) {
                    uri += i + "=" + data[i];

                    first = false;
                } else {
                    uri += "&" + i + "=" + data[i];
                }
            }
            data = null;
        } else {
            data = JSON.stringify(data);
        }
        request({
            uri: DAL_URL + uri,
            method: method,
            headers: {},
            body: data
        }, (err, response, body) => {
            if (err) reject(err)
            else resole(body);
        })
    })
}

const parseXML = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }
        });
    })
}

module.exports.initUser = () => {
    return new Promise((resole, reject) => {
        this.requestApi("/nguoi-dung/read", "get")
            .then(data => {
                return parseXML(data);
            })
            .then(data => {
                let dsGiaoVien = data.DS_NGUOI_DUNG.DS_GIAO_VIEN[0].GIAO_VIEN;
                let dsQuanLy = data.DS_NGUOI_DUNG.DS_QUAN_LY[0].QUAN_LY;

                let giaoVien = [];
                let quanLy = [];

                for (let i = 0; i < dsGiaoVien.length; i++) {
                    giaoVien.push({
                        ma: dsGiaoVien[i].$.Ma_giao_vien,
                        ten: dsGiaoVien[i].$.Ten,
                        matKhau: dsGiaoVien[i].$.Mat_khau
                    })
                }

                for (let i = 0; i < dsQuanLy.length; i++) {
                    quanLy.push({
                        ma: dsQuanLy[i].$.Ma_quan_ly,
                        ten: dsQuanLy[i].$.Ten,
                        matKhau: dsQuanLy[i].$.Mat_khau
                    })
                }

                resole({
                    giaoVien,
                    quanLy
                })
            })
            .catch(err => {
                console.log(err);
            })
    })
}

module.exports.postLogin = (dsGiaoVien, dsQuanLy, ten, matKhau) => {
    let result = "";
    //Tìm giáo viên
    for (let i = 0; i < dsGiaoVien.length; i++) {
        if (dsGiaoVien[i].ten == ten) {
            if (dsGiaoVien[i].matKhau == matKhau) {
                //login thanh cong
                result = {
                    ten: dsGiaoVien[i].ten,
                    ma: dsGiaoVien[i].ma,
                    type: "giáo viên"
                }
            } else {
                //login that bai
                return false;
            }
            break;
        }
    }
    if (result == "") {
        //Tìm quản lý
        for (let i = 0; i < dsQuanLy.length; i++) {
            if (dsQuanLy[i].ten == ten) {
                if (dsQuanLy[i].matKhau == matKhau) {
                    //login thanh cong
                    result = {
                        ten: dsQuanLy[i].ten,
                        ma: dsQuanLy[i].ma,
                        type: "quản lý"
                    }
                } else {
                    //login that bai
                    return false;
                }
                break;
            }
        }
    }
    if(result == "") return false;
    return {token: jwt.sign(result,secretkey), data: result};
}

module.exports.postCheckLogin = (token) => {
    return new Promise((resole, reject) => {
        jwt.verify(token,secretkey,(err, decode) => {
            if(err) {
                reject(err)
            }
            else {
                delete decode.iat;
                resole(decode);
            }
        })
    })
}