const http = require("http");
const qs = require('querystring');
const {
  port,
  pathDataBoDe,
  pathDataCauHoi,
  pathDataNguoiDung,
  access_token
} = require("./config.js");
const URL = require("url");
const DAL = require("./DAL.js");
const fs = require("fs");
const xml2js = require("xml2js");

//Đọc sẵn dữ liệu để cache
//Đọc dữ liệu bộ đề
let CacheXMLBoDe = '';
CacheXMLBoDe = DAL.read(__dirname + "/" + pathDataBoDe);
let CacheXMLDOMBoDe;
xml2js.parseString(CacheXMLBoDe, (err, result) => {
  if (err) {
    console.log(err + '');
  }
  CacheXMLDOMBoDe = result;
});

//Đọc dữ liệu câu hỏi
let CacheXMLCauHoi = '';
CacheXMLCauHoi = DAL.read(__dirname + "/" + pathDataCauHoi);
let CacheXMLDOMCauHoi;
xml2js.parseString(CacheXMLCauHoi, (err, result) => {
  if (err) {
    console.log(err + '');
  }
  CacheXMLDOMCauHoi = result;
});

//Đọc dữ liệu người dùng
let CacheXMLNguoiDung = '';
CacheXMLNguoiDung = DAL.read(__dirname + "/" + pathDataNguoiDung);
let CacheXMLDOMNguoiDung;
xml2js.parseString(CacheXMLNguoiDung, (err, result) => {
  if (err) {
    console.log(err + '');
  }
  CacheXMLDOMNguoiDung = result;
});


http
  .createServer(async (req, res) => {
    //In ra request và method
    console.log(req.method, req.url);
    //Set header cho các địa chỉ khác vẫn gửi request đc
    res.setHeader("Access-Control-Allow-Origin", "*");

    //Trường hợp này chỉ sử dụng 1 key nên làm đơn giản như này
    //Sau này làm phức tạp hơn phải xây dựng 1 class để xử lí
    // if (req.headers.access_token != access_token) {
    //   return res.end('deny');
    // }

    if (req.method == "GET" || req.method == "get") {
      //Decode URL
      const {
        pathname,
        query
      } = URL.parse(req.url, true);
      //API
      switch (pathname) {
        case "/bo-de/read":
          {
            if (CacheXMLBoDe === "") {
              CacheXMLBoDe = DAL.read(__dirname + "/" + pathDataBoDe);
              console.log("reread");
            }
            res.setHeader("Content-type", "text/xml");
            res.end(CacheXMLBoDe);
          }
          break;
        case "/cau-hoi/read":
          {
            if (CacheXMLCauHoi === "") {
              CacheXMLCauHoi = DAL.read(__dirname + "/" + pathDataCauHoi);
              console.log("reread");
            }
            res.setHeader("Content-type", "text/xml");
            res.end(CacheXMLCauHoi);
          }
          break;
        case "/nguoi-dung/read":
          {
            if (CacheXMLNguoiDung === "") {
              CacheXMLNguoiDung = DAL.read(__dirname + "/" + pathDataNguoiDung);
              console.log("reread");
            }
            res.setHeader("Content-type", "text/xml");
            res.end(CacheXMLNguoiDung);
          }
          break;
        default:
          res.setHeader("Content-type", "text/xml");
          res.end();
          break;
      }
    } else if (req.method.toLocaleUpperCase() == 'POST') {
      switch (req.url) {
        case '/bo-de/write':
          {
            let body = '';

            req.on('data', function (data) {
              body += data;

              // Too much POST data, kill the connection!
              // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
              if (body.length > 1e6)
                req.connection.destroy();
            });

            req.on('end', function () {
              let postdata = JSON.parse(body);
              console.log(body)
              if(postdata.maCacCauHoi == undefined ||
                postdata.maNguoiTao == undefined )
                {
                  res.setHeader("Content-type", "text/xml");
                  return res.end();
                }
              //console.log(postdata)
              let result = DAL.boDeWrite(pathDataBoDe, CacheXMLDOMBoDe, postdata.maNguoiTao, postdata.maCacCauHoi);
              res.setHeader("Content-type", "text/xml");
              res.end(result[1]);
              CacheXMLDOMBoDe = result[0];
            });
          }
          break;
        case '/bo-de/update':
          {
            let body = '';

            req.on('data', function (data) {
              body += data;

              // Too much POST data, kill the connection!
              // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
              if (body.length > 1e6)
                req.connection.destroy();
            });

            req.on('end', function () {
              let postdata = qs.parse(body);
              //console.log(postdata)
              if(postdata.maDe == undefined ||
                postdata.maCacCauHoi == undefined ||
                postdata.maNguoiTao == undefined )
                {
                  res.setHeader("Content-type", "text/xml");
                  return res.end();
                }
              let maDe = postdata.maDe;
              let maCacCauHoi = JSON.parse("[" + postdata.maCacCauHoi + "]")[0];
              let result = DAL.boDeUpdate(pathDataBoDe, CacheXMLDOMBoDe, maDe, postdata.maNguoiTao, maCacCauHoi);
              res.setHeader("Content-type", "text/xml");
              res.end(result[1]);
              CacheXMLDOMBoDe = result[0];
            });
          }
          break;
        case '/cau-hoi/write':
          {
            let body = '';

            req.on('data', function (data) {
              body += data;

              // Too much POST data, kill the connection!
              // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
              if (body.length > 1e6)
                req.connection.destroy();
            });

            req.on('end', function () {
              let postdata = JSON.parse(body);
              console.log(postdata)
              if(postdata.dsDapAn == undefined ||
                postdata.cauHoi == undefined ||
                postdata.dapAn == undefined ||
                postdata.maNguoiDang== undefined) {
                  res.setHeader("Content-type", "text/xml");
                  return res.end();
                }
              let dsDapAn = postdata.dsDapAn.split(';');
              console.log(dsDapAn, typeof(dsDapAn))
              let cauHoi = postdata.cauHoi;
              let dapAn = postdata.dapAn;
              let maNguoiDang = postdata.maNguoiDang;
              //console.log(cauHoi,dsDapAn,dapAn,maNguoiDang);
              let result = DAL.cauHoiWrite(pathDataCauHoi, CacheXMLDOMCauHoi, cauHoi, dsDapAn, dapAn, maNguoiDang);
              res.setHeader("Content-type", "text/xml");
              res.end(result[1]);
              CacheXMLDOMCauHoi = result[0];
            });
          }
          break;
        case '/cau-hoi/update':
          {
            let body = '';

            req.on('data', function (data) {
              body += data;

              // Too much POST data, kill the connection!
              // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
              if (body.length > 1e6)
                req.connection.destroy();
            });

            req.on('end', function () {
              let postdata = JSON.parse(body);
              console.log(postdata)
              if(postdata.CAU_HOI == undefined ||
                postdata.CAU_HOI.$ == undefined ||
                postdata.CAU_HOI.$.Ma_cau_hoi == undefined ||
                postdata.CAU_HOI.$.Da_duyet == undefined ||
                postdata.CAU_HOI.$.Ma_nguoi_dang == undefined ||
                postdata.CAU_HOI.$.Ma_nguoi_duyet == undefined ||
                postdata.CAU_HOI.DS_DAP_AN == undefined ||
                postdata.CAU_HOI.DE== undefined ||
                postdata.CAU_HOI.$.Dap_an == undefined) {
                  res.setHeader("Content-type", "text/xml");
                  return res.end();
              }
              
              let result = DAL.cauHoiUpdate(pathDataCauHoi, CacheXMLDOMCauHoi, postdata);
              res.setHeader("Content-type", "text/xml");
              res.end(result[1]);
              CacheXMLDOMCauHoi = result[0];
            });
          }
          break;
        case '/nguoi-dung/write':
          {
            let body = '';

            req.on('data', function (data) {
              body += data;

              // Too much POST data, kill the connection!
              // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
              if (body.length > 1e6)
                req.connection.destroy();
            });

            req.on('end', function () {
              let postdata = qs.parse(body);
              //console.log(postdata)
              if(postdata.laGiaoVien == undefined ||
                postdata.ten == undefined ||
                postdata.matKhau == undefined) {
                  res.setHeader("Content-type", "text/xml");
                  return res.end();
                }
              let laGiaoVien = postdata.laGiaoVien;
              let ten = postdata.ten;
              let matKhau = postdata.matKhau;

              let result = DAL.nguoiDungWrite(pathDataNguoiDung, CacheXMLDOMNguoiDung, laGiaoVien, ten, matKhau);
              res.setHeader("Content-type", "text/xml");
              res.end(result[1]);
              CacheXMLDOMNguoiDung = result[0];
            });
          }
          break;
        case '/nguoi-dung/update':
          {
            let body = '';

            req.on('data', function (data) {
              body += data;

              // Too much POST data, kill the connection!
              // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
              if (body.length > 1e6)
                req.connection.destroy();
            });

            req.on('end', function () {
              let postdata = qs.parse(body);
              //console.log(postdata)
              if(postdata.laGiaoVien == undefined ||
                postdata.ten == undefined ||
                postdata.matKhau == undefined) {
                  res.setHeader("Content-type", "text/xml");
                  return res.end();
                }
              let laGiaoVien = postdata.laGiaoVien;
              let ma;
              if(laGiaoVien == 'true'){
                ma = postdata.maGiaoVien;
              }
              else{
                ma = postdata.maQuanLy;
              }
              if(ma == undefined)
              {
                res.setHeader("Content-type", "text/xml");
                return res.end();
              }
              let ten = postdata.ten;
              let matKhau = postdata.matKhau;

              let result = DAL.nguoiDungUpdate(pathDataNguoiDung, CacheXMLDOMNguoiDung, laGiaoVien, ma, ten, matKhau);
              res.setHeader("Content-type", "text/xml");
              res.end(result[1]);
              CacheXMLDOMNguoiDung = result[0];
            });
          }
          break;

        default:
          res.setHeader("Content-type", "text/xml");
          res.end();
          break;
      }
    } else {
      return res.end();
    }
  })
  .listen(port, server => {
    console.log("Listen on port ", port);
  });