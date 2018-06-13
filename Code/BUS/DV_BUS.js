const http = require("http");
const { port, URL_DAL, access_token } = require("./config.js");
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
  .createServer((req, res) => {
    console.log(req.method, req.url);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-type", "text/xml");

    //Kiểm tra đơn giản bằng cách kiểm tra access_token
    //Sau này phức tạp hơn phải xây dựng 1 class đảm nhận việc này
    // if(req.headers.access_token != access_token){
    //   //Nếu access_token không hợp lệ thì không cho sử dụng hàm bên dưới
    //   return res.end('deny');
    // }

    //Kiểm tra Cache đã xong chưa
    if (Cache == undefined) {
      console.log("Chưa khởi tạo Cache xong, từ chối mọi dịch vụ!");
      res.end();
    }
    //Method GET
    if (req.method.toUpperCase() == "GET") {
      //Decode URL
      const { pathname, query } = URL.parse(req.url, true);
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
      return res.end();
    }
  })
  .listen(port, server => {
    console.log("server listen on", port);
  });
