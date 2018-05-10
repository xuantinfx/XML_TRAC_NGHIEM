const http = require("http");
const qs = require('querystring');
const {
  port,
  pathDataBoDe,
  access_token
} = require("./config.js");
const URL = require("url");
const DAL = require("./DAL.js");
const fs = require("fs");
const xml2js = require("xml2js");

//Đọc sẵn dữ liệu để cache
let CacheXMLBoDe = fs.readFileSync(__dirname + "/" + pathDataBoDe).toString();
let CacheXMLDOMBoDe;
xml2js.parseString(CacheXMLBoDe, (err, result) => {
  CacheXMLDOMBoDe = result;
});

http
  .createServer(async (req, res) => {
    //In ra request và method
    console.log(req.method, req.url);
    //Set header cho các địa chỉ khác vẫn gửi request đc
    res.setHeader("Access-Control-Allow-Origin", "*");

    //Trường hợp này chỉ sử dụng 1 key nên làm đơn giản như này
    //Sau này làm phức tạp hơn phải xây dựng 1 class để xử lí
    if (req.headers.access_token != access_token) {
      return res.end('deny');
    }

    res.setHeader("Content-type", "text/xml");

    if (req.method == "GET" || req.method == "get") {
      //Decode URL
      const {
        pathname,
        query
      } = URL.parse(req.url, true);
      //API
      switch (pathname) {
        // case "/read":
        //   {
        //     if (CacheXML == "") {
        //       CacheXML = await DAL.read(__dirname + "/" + pathData);
        //       console.log("reread");
        //     }
        //     res.setHeader("Content-type", "text/xml");
        //     res.end(CacheXML);
        //   }
        //   break;
        // case "/update":
        //   {
        //     if (query.Mode == "Ban") {
        //       if (query.DonGia != undefined && query.MaTV != undefined) {
        //         let result = await DAL.updateBan(
        //           __dirname + "/" + pathData,
        //           CacheXMLDOM,
        //           query.DonGia,
        //           query.MaTV
        //         );
        //         if (result != false) {
        //           CacheXMLDOM = result[0];
        //           CacheXML = result[1];
        //           //console.log(CacheXMLDOM.Danh_sach_Tivi.Tivi[0]);
        //           return res.end(CacheXML);
        //         } else {
        //           return res.end();
        //         }
        //       } else {
        //         return res.end();
        //       }
        //     } else if (query.Mode == "Nhap") {
        //       if (query.DonGia != undefined && query.MaTV != undefined) {
        //         let result = await DAL.updateNhap(
        //           __dirname + "/" + pathData,
        //           CacheXMLDOM,
        //           query.DonGia,
        //           query.MaTV
        //         );
        //         if (result != false) {
        //           CacheXMLDOM = result[0];
        //           CacheXML = result[1];
        //           //console.log(CacheXMLDOM.Danh_sach_Tivi.Tivi[0]);
        //           return res.end(CacheXML);
        //         } else {
        //           return res.end();
        //         }
        //       } else {
        //         return res.end();
        //       }
        //     }
        //     res.end();
        //   }
        //   break;
        // case "/insert":
        //   {
        //     if (query.Mode == "Ban") {
        //       if (
        //         query.Ngay != undefined &&
        //         query.Tien != undefined &&
        //         query.MaTV != undefined &&
        //         query.SoLuong != undefined &&
        //         query.DonGia != undefined
        //       ) {
        //         let result = await DAL.insertBan(
        //           __dirname + "/" + pathData,
        //           CacheXMLDOM,
        //           query.Ngay,
        //           query.Tien,
        //           query.MaTV,
        //           query.SoLuong,
        //           query.DonGia
        //         );
        //         if (result != false) {
        //           CacheXMLDOM = result[0];
        //           CacheXML = result[1];
        //           //console.log(CacheXMLDOM.Danh_sach_Tivi.Tivi[0]);
        //           return res.end(CacheXML);
        //         } else {
        //           return res.end();
        //         }
        //       } else {
        //         return res.end();
        //       }
        //     } else if (query.Mode == "Nhap") {
        //       if (
        //         query.Ngay != undefined &&
        //         query.Tien != undefined &&
        //         query.MaTV != undefined &&
        //         query.SoLuong != undefined &&
        //         query.DonGia != undefined
        //       ) {
        //         let result = await DAL.insertNhap(
        //           __dirname + "/" + pathData,
        //           CacheXMLDOM,
        //           query.Ngay,
        //           query.Tien,
        //           query.MaTV,
        //           query.SoLuong,
        //           query.DonGia
        //         );
        //         if (result != false) {
        //           CacheXMLDOM = result[0];
        //           CacheXML = result[1];
        //           //console.log(CacheXMLDOM.Danh_sach_Tivi.Tivi[0]);
        //           return res.end(CacheXML);
        //         } else {
        //           return res.end();
        //         }
        //       } else {
        //         return res.end();
        //       }
        //     }
        //     res.end();
        //   }
        //   break;
        default: res.end();
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
              var postdata = qs.parse(body);
              //console.log(postdata)
              var maCacCauHoi = JSON.parse("[" + postdata.maCacCauHoi + "]")[0];
              let result = DAL.boDeWrite(pathDataBoDe, CacheXMLDOMBoDe, postdata.maNguoiTao, maCacCauHoi);
              res.end(result[1]);
              CacheXMLDOMBoDe = result[0];
            });
          }
          break;

        default:
          break;
      }
    } else {
      return res.end();
    }
  })
  .listen(port, server => {
    console.log("Listen on port ", port);
  });