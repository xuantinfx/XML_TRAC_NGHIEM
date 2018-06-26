const URL = require("url");
const http = require('http')
const qs = require("querystring");
const {
    port
} = require('./config');
const {
    requestApi,
    initUser,
} = require('./SECURITY')
const SECURITY = require('./SECURITY')

var giaoVien = [],
    quanLy = [];

//status: true/false
//data: string/object
const mauTraVe = (status, data) => {
    if (status == true) {
        status = "success"
    } else {
        status = "error"
    }
    return JSON.stringify({
        status,
        data
    })
}

initUser().then(result => {
        giaoVien = result.giaoVien;
        quanLy = result.quanLy;
    })
    .catch(err => {
        console.log(err);
        giaoVien = [];
        quanLy = [];
    })

http.createServer((req, res) => {
    console.log(req.method, req.url);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-type", "text/json");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");


    //Method GET
    if (req.method.toUpperCase() == "GET") {
        //Decode URL
        const {
            pathname,
            query
        } = URL.parse(req.url, true);
        //API
        switch (pathname) {
            default: return res.end();
            break;
        }
    } else if (req.method.toUpperCase() == "POST") {
        switch (req.url) {
            case "/login":
                {
                    let body = '';
                    req.on('data', function (data) {
                        body += data;

                        if (body.length > 1e6)
                            req.connection.destroy();
                    });
                    req.on('end', function () {
                        try {
                            body = JSON.parse(body);
                        } catch (err) {
                            res.end(mauTraVe(false, "Dữ liệu truyền lên không đúng format"))
                            return;
                        }
                        let result = SECURITY.postLogin(giaoVien, quanLy, body.ten, body.matKhau)
                        if (result == false) {
                            res.end(mauTraVe(false, "Sai tên hoặc mật khẩu"))
                        } else {
                            res.end(mauTraVe(true, result));
                        }
                    })
                }
            case "/check-login":
                {
                    let body = '';
                    req.on('data', function (data) {
                        body += data;

                        if (body.length > 1e6)
                            req.connection.destroy();
                    });
                    req.on('end', function () {
                        try {
                            body = JSON.parse(body);
                        } catch (err) {
                            res.end(mauTraVe(false, "Dữ liệu truyền lên không đúng format"))
                            return;
                        }
                        SECURITY.postCheckLogin(body.token)
                        .then(decode => {
                            res.end(mauTraVe(true, decode));
                        })
                        .catch(err => {
                            res.end(mauTraVe(false, "Sai token"))
                        })
                    })
                }
                case "/check-is-giao-vien-login":
                {
                    let body = '';
                    req.on('data', function (data) {
                        body += data;

                        if (body.length > 1e6)
                            req.connection.destroy();
                    });
                    req.on('end', function () {
                        try {
                            body = JSON.parse(body);
                        } catch (err) {
                            res.end(mauTraVe(false, "Dữ liệu truyền lên không đúng format"))
                            return;
                        }
                        SECURITY.postCheckLogin(body.token)
                        .then(decode => {
                            if(decode.type == 'giáo viên') {
                                res.end(mauTraVe(true, decode));
                            } else {
                                res.end(mauTraVe(false, "Không phải giáo viên"))
                            }
                        })
                        .catch(err => {
                            res.end(mauTraVe(false, "Sai token"))
                        })
                    })
                }
                case "/check-is-quan-ly-login":
                {
                    let body = '';
                    req.on('data', function (data) {
                        body += data;

                        if (body.length > 1e6)
                            req.connection.destroy();
                    });
                    req.on('end', function () {
                        try {
                            body = JSON.parse(body);
                        } catch (err) {
                            res.end(mauTraVe(false, "Dữ liệu truyền lên không đúng format"))
                            return;
                        }
                        SECURITY.postCheckLogin(body.token)
                        .then(decode => {
                            if(decode.type == 'quản lý') {
                                res.end(mauTraVe(true, decode));
                            } else {
                                res.end(mauTraVe(false, "Không phải quản lý"))
                            }
                        })
                        .catch(err => {
                            res.end(mauTraVe(false, "Sai token"))
                        })
                    })
                }
            default:
                break
        }
    } else {
        res.end();
    }
}).listen(port, () => {
    console.log("Security listen on port", port);
})