const http = require("http");
const fs = require('fs')
const URL = require("url");
const { port } = require("./config.js");
//Khởi tạo server
http
  .createServer((req, res) => {

    //code thêm hàm hỗ trợ
    res.mySend = (path) => {
        fs.readFile(path,(err, data) => {
            if(err) {
                res.statusCode = 404;
                res.end();
            }
            else {
                res.statusCode = 200;
                res.end(data);
            }
        })
    }

    console.log(req.method, req.url);
    res.setHeader("Access-Control-Allow-Origin", "*");
    //res.setHeader("Content-type", "text/xml");

    //Kiểm tra đơn giản bằng cách kiểm tra access_token
    //Sau này phức tạp hơn phải xây dựng 1 class đảm nhận việc này
    // if(req.headers.access_token != access_token){
    //   //Nếu access_token không hợp lệ thì không cho sử dụng hàm bên dưới
    //   return res.end('deny');
    // }

    //Method GET
    if (req.method.toUpperCase() == "GET") {
      //Decode URL
      const { pathname, query } = URL.parse(req.url, true);
      //API
      res.mySend(__dirname + query.file);
      switch (pathname) {
        
      }
    } else if (req.method.toUpperCase() == "POST") {
      return res.end();
    }
  })
  .listen(port, server => {
    console.log("server GUI listen on", port);
  });
