const http = require("http");
const { port, URL_DAL,access_token } = require("./config.js");
const URL = require("url");
const BUS = require("./BUS.js");

let Cache = undefined;

// Khởi tạo dữ liệu cho Cache
BUS.InitCache(URL_DAL, (err, result) => {
  if (err) {
    console.log(err + "");
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

    //Kiểm tra đơn giản bằng cách kiểm tra access_token
    //Sau này phức tạp hơn phải xây dựng 1 class đảm nhận việc này
    if(req.headers.access_token != access_token){
      //Nếu access_token không hợp lệ thì không cho sử dụng hàm bên dưới
      return res.end('deny');
    }

    //Kiểm tra Cache đã xong chưa
    if (Cache == undefined) {
      console.log("Chưa khởi tạo Cache xong, từ chối mọi dịch vụ!");
      res.end();
    }
    //Method GET
    if (req.method == "GET" || req.method == "get") {
      //Decode URL
      const { pathname, query } = URL.parse(req.url, true);
      //API
      switch (pathname) {
        case "/lay-thong-tin-tivi": {
          res.setHeader("Content-type", "text/xml");
          //console.log(Cache.AllXML);
          if (query.DoiTuong == undefined) {
            //console.log(Cache.AllXML);
            return res.end();
          }
          switch (query.DoiTuong) {
            case "Khach":
              return res.end(Cache.CacheLayThongTinTiViChoKhach);
              break;
            case "NVNhap":
              return res.end(Cache.CacheLayThongTinTiViChoNVNhap);
              break;
            case "QLNhap":
              return res.end(Cache.CacheLayThongTinTiViChoQLNhap);
              break;
            case "NVBan":
              return res.end(Cache.CacheLayThongTinTiViChoNVBan);
              break;
            case "QLBan":
              return res.end(Cache.CacheLayThongTinTiViChoQLBan);
              break;

            default:
              return res.end();
              break;
          }
        }
        case "/lay-thong-tin-tivi-theo-nhom":
          {
            res.setHeader("Content-type", "text/xml");
            //console.log('abc');
            if (query.DoiTuong == "QLNhap") {
              return res.end(Cache.CacheLayThongTinTiViTheoNhomChoQLNhap);
            } else if (query.DoiTuong == "QLBan") {
              return res.end(Cache.CacheLayThongTinTiViTheoNhomChoQLBan);
            }
            return res.end();
          }
          break;
        case "/ban-tivi":
          {
            if (
              query.Ngay == undefined ||
              query.Tien == undefined ||
              query.MaTV == undefined ||
              query.SoLuong == undefined ||
              query.DonGia == undefined
            )
              return res("false");
            BUS.BanTiVi(
              URL_DAL,
              query.Ngay,
              query.Tien,
              query.MaTV,
              query.SoLuong,
              query.DonGia,
              (err, xmlResult) => {
                //Nếu như request lỗi thì trả về chuỗi false
                if (err) {
                  //console.log(err+'')
                  return res.end("false");
                }
                res.end("true");
                //Nếu request thành công thì tiến hành build lại Cache từ XML được trả về từ DAL
                BUS.RebuildCache(xmlResult, (err, CacheResult) => {
                  //Build lỗi thì tiến hành build từ đầu
                  if (err) {
                    return BUS.InitCache(URL_DAL, (err, result) => {
                      if (err) {
                        return (Cache = undefined);
                      }
                      console.log(
                        "đã gán lại cache bằng cách chạy lên DAL lấy dữ liệu"
                      );
                      Cache = result;
                    });
                  }
                  //build lại xong và gán ngược Cache vừa build cho Cache
                  console.log("đã gán lại cache");
                  return (Cache = CacheResult);
                });
              }
            );
          }
          break;
        case "/nhap-tivi":
          {
            if (
              query.Ngay == undefined ||
              query.Tien == undefined ||
              query.MaTV == undefined ||
              query.SoLuong == undefined ||
              query.DonGia == undefined
            )
              return res("false");
            BUS.NhapTiVi(
              URL_DAL,
              query.Ngay,
              query.Tien,
              query.MaTV,
              query.SoLuong,
              query.DonGia,
              (err, xmlResult) => {
                //Nếu như request lỗi thì trả về chuỗi false
                if (err) {
                  //console.log(err+'')
                  return res.end("false");
                }
                res.end("true");
                //Nếu request thành công thì tiến hành build lại Cache từ XML được trả về từ DAL
                BUS.RebuildCache(xmlResult, (err, CacheResult) => {
                  //Build lỗi thì tiến hành build từ đầu
                  if (err) {
                    return BUS.InitCache(URL_DAL, (err, result) => {
                      if (err) {
                        return (Cache = undefined);
                      }
                      console.log(
                        "đã gán lại cache bằng cách chạy lên DAL lấy dữ liệu"
                      );
                      Cache = result;
                    });
                  }
                  //build lại xong và gán ngược Cache vừa build cho Cache
                  console.log("đã gán lại cache");
                  return (Cache = CacheResult);
                });
              }
            );
          }
          break;
        case "/cap-nhat-don-gia-ban":
          {
            if (query.MaTV == undefined || query.DonGia == undefined)
              return res("false");
            BUS.CapNhatDonGiaBan(
              URL_DAL,
              query.MaTV,
              query.DonGia,
              (err, xmlResult) => {
                //Nếu như request lỗi thì trả về chuỗi false
                if (err) {
                  //console.log(err+'')
                  return res.end("false");
                }
                res.end("true");
                //Nếu request thành công thì tiến hành build lại Cache từ XML được trả về từ DAL
                BUS.RebuildCache(xmlResult, (err, CacheResult) => {
                  //Build lỗi thì tiến hành build từ đầu
                  if (err) {
                    return BUS.InitCache(URL_DAL, (err, result) => {
                      if (err) {
                        return (Cache = undefined);
                      }
                      console.log(
                        "đã gán lại cache bằng cách chạy lên DAL lấy dữ liệu"
                      );
                      Cache = result;
                    });
                  }
                  //build lại xong và gán ngược Cache vừa build cho Cache
                  console.log("đã gán lại cache");
                  return (Cache = CacheResult);
                });
              }
            );
          }
          break;
        case "/cap-nhat-don-gia-nhap":
          {
            if (query.MaTV == undefined || query.DonGia == undefined)
              return res("false");
            BUS.CapNhatDonGiaNhap(
              URL_DAL,
              query.MaTV,
              query.DonGia,
              (err, xmlResult) => {
                //Nếu như request lỗi thì trả về chuỗi false
                if (err) {
                  //console.log(err+'')
                  return res.end("false");
                }
                res.end("true");
                //Nếu request thành công thì tiến hành build lại Cache từ XML được trả về từ DAL
                BUS.RebuildCache(xmlResult, (err, CacheResult) => {
                  //Build lỗi thì tiến hành build từ đầu
                  if (err) {
                    return BUS.InitCache(URL_DAL, (err, result) => {
                      if (err) {
                        return (Cache = undefined);
                      }
                      console.log(
                        "đã gán lại cache bằng cách chạy lên DAL lấy dữ liệu"
                      );
                      Cache = result;
                    });
                  }
                  //build lại xong và gán ngược Cache vừa build cho Cache
                  console.log("đã gán lại cache");
                  return (Cache = CacheResult);
                });
              }
            );
          }
          break;
        default:
          return res.end();
          break;
      }
    } else {
      return res.end();
    }
  })
  .listen(port, server => {
    console.log("server listen on", port);
  });
