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
            default:
                break
        }
    }
}).listen(port, () => {
    console.log("Security listen on port", port);
})