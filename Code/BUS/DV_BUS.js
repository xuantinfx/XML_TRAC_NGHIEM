const http = require("http");
const qs = require("querystring");
const {
  port,
  URL_DAL,
  access_token
} = require("./config.js");
const URL = require("url");
const BUS = require("./BUS.js");
const boDe = 0,
  cauHoi = 1,
  nguoiDung = 2;
let Cache = undefined;

// Khởi tạo dữ liệu cho Cache
BUS.InitCache(URL_DAL, (err, result) => {
  if (err) {
    console.log(err);
    return;
  }
  Cache = result;
  console.log("Đã khởi tạo Cache xong!");
  //console.log(Cache);
});

//Khởi tạo server
http
  .createServer(async (req, res) => {
    console.log(req.method, req.url);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    //res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-type", "text/xml");

    let user = {
      isLogin: false,
      laGiaoVien: false,
      laQuanLy: false,
      ma: ""
    }
    //Kiểm tra đã đăng nhập chưa?
    //Kiểm tra có phải là giáo viên hay quản lý
    if (req.headers.authorization) {
      let resultCheckLogin = await BUS.checkLogin(req.headers.authorization);
      if (resultCheckLogin != false) {
        resultCheckLogin = JSON.parse(resultCheckLogin);
        if (resultCheckLogin.status != "error") {
          user.isLogin = true;
          user.ma = resultCheckLogin.data.ma;
          if (resultCheckLogin.data.type == 'giáo viên') {
            user.laGiaoVien = true;
          } else {
            user.laQuanLy = true;
          }
        }
      }
    }

    //Kiểm tra Cache đã xong chưa
    if (Cache == undefined) {
      console.log("Chưa khởi tạo Cache xong, từ chối mọi dịch vụ!");
      res.end();
    }
    //Method GET
    if (req.method.toUpperCase() == "GET") {
      //Decode URL
      const {
        pathname,
        query
      } = URL.parse(req.url, true);
      //API
      switch (pathname) {
        case "/lay-cau-hoi":
          {
            let result = BUS.layCauHoi(Cache[cauHoi], query.maCauHoi);
            res.end(result);
          }
          break;
        case "/lay-danh-sach-cau-hoi":
          {
            let result = BUS.layDSCauHoi(Cache[cauHoi]);
            res.end(result);
          }
          break;
        case "/lay-danh-sach-bo-de":
          {
            let result = BUS.layDSBoDe(Cache[boDe]);
            res.end(result);
          }
          break;
        case "/lay-bo-de":
          {
            let result = BUS.layBoDe(Cache[boDe], query.maDe);
            res.end(result);
          }
          break;
        default:
          return res.end();
          break;
      }
    } else if (req.method.toUpperCase() == "POST") {
      switch (req.url) {
        case '/them-cau-hoi':
          {
            if(!user.isLogin) {
              res.end("need login")
              return;
            }
            let body = '';
            req.on('data', function (data) {
              body += data;

              if (body.length > 1e6)
                req.connection.destroy();
            });
            req.on('end', function () {
              console.log(body, '---------')

              let cauHoiMoi = qs.parse(body);
              console.log(cauHoiMoi)
              let result = BUS.themCauHoi(Cache[cauHoi], cauHoiMoi);
            })
            break
          }
        case '/duyet-cau-hoi':
          {
            let body = '';
            req.on('data', function (data) {
              body += data;

              if (body.length > 1e6)
                req.connection.destroy();
            });

            req.on('end', function () {
              console.log(typeof (body), body);
              let postdata = qs.parse(body);
              let result = BUS.duyetCauHoi(Cache[cauHoi], postdata);
            })
            break
          }
        case '/tao-bo-de':
          {
            let body = '';
            req.on('data', function (data) {
              body += data;

              if (body.length > 1e6)
                req.connection.destroy();
            });

            req.on('end', function () {
              console.log(typeof (body), body);
              let postdata = qs.parse(body);
              postdata.maCacCauHoi = postdata.maCacCauHoi.split(';')
              console.log(postdata)
              let result = BUS.taoBoDe(Cache[cauHoi], postdata);
            })
            break
          }
        default:
          break
      }
    }
    else {
      return res.end();
    }
  })
  .listen(port, server => {
    console.log("server listen on", port);
  });