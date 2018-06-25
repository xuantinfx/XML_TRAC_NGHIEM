const http = require("http");
const fs = require('fs')
const URL = require("url");
const {
	port
} = require("./config.js");
//Khởi tạo server
http
	.createServer((req, res) => {

		//code thêm hàm hỗ trợ
		res.mySend = (path) => {
			fs.readFile(path, (err, data) => {
				if (err) {
					//console.log(err);
					res.statusCode = 404;
					res.end();
				} else {
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
			const {
				pathname,
				query
			} = URL.parse(req.url, true);

			if (pathname == "/") {
				res.writeHead(302, {
					'Location': '/khach-tham-quan/tu-ren-luyen-tung-cau'
				});
				res.end();
				return;
			}
			//API
			switch (pathname) {
				case "/khach-tham-quan/tu-ren-luyen-tung-cau":
					{
						res.setHeader("Content-type", "text/html");
						res.mySend(__dirname + "/views/Tu_ren_luyen_theo_cau_hoi.html");
						break;
					}
				case "/khach-tham-quan/tu-ren-luyen-bo-de":
					{
						res.setHeader("Content-type", "text/html");
						res.mySend(__dirname + "/views/Tu_ren_luyen_theo_bo_de.html");
						break;
					}
				case "/giao-vien":
					{
						res.setHeader("Content-type", "text/html");
						res.mySend(__dirname + "/views/Giao_vien.html");
						break;
					}
				case "/quan-ly":
					{
						res.setHeader("Content-type", "text/html");
						res.mySend(__dirname + "/views/Quan_ly.html");
						break;
					}
				default:
					{
						res.mySend(__dirname + "/public" + pathname);
						break;
					}
			}
		} else if (req.method.toUpperCase() == "POST") {
			res.end();
		}

	})
	.listen(port, server => {
		console.log("server GUI listen on", port);
	});