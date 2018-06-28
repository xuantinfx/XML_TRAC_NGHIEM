const http = require("http");
const fs = require('fs')
const URL = require("url");
const qs = require("querystring");
const {
	port
} = require("./config.js");
const WEB = require('./WEB')
//Khởi tạo server
http
	.createServer(async (req, res) => {
		//code thêm hàm hỗ trợ
		res.mySend = (path) => {
			fs.readFile(path, (err, data) => {
				if (err) {
					//console.log(err);
					res.statusCode = 404;
					res.setHeader("Content-type", "text/html");
					res.end(fs.readFileSync(__dirname + "/views/Error.html"));
				} else {
					res.statusCode = 200;
					res.end(data);
				}
			})
		}

		console.log(req.method, req.url);

		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
		res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");


		let user = {
			isLogin: false,
			laGiaoVien: false,
			laQuanLy: false,
			ma: ""
		}
		//Kiểm tra đã đăng nhập chưa?
		//Kiểm tra có phải là giáo viên hay quản lý
		//Kiểm tra bằng cookie
		let cookie = qs.parse(req.headers.cookie);
		let token = cookie.token;
		if (token) {
			let resultCheckLogin = await WEB.checkLogin(token);
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
		//Method GET
		if (req.method.toUpperCase() == "GET") {
			//Decode URL
			const {
				pathname,
				query
			} = URL.parse(req.url, true);

			if (pathname == "/") {
				res.writeHead(302, {
					'Location': '/trang-chu'
				});
				res.end();
				return;
			}
			//API
			switch (pathname) {
				case "/trang-chu":
				{
					res.setHeader("Content-type", "text/html");
					res.mySend(__dirname + "/views/Trang_Chu.html");
					break;
				}
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
						if (user.laGiaoVien) {
							res.setHeader("Content-type", "text/html");
							res.mySend(__dirname + "/views/Giao_vien.html");
						} else {
							res.writeHead(302, {
								'Location': '/login'
							});
							res.end();
						}
						break;
					}
				case "/quan-ly":
					{
						if (user.laQuanLy) {
							res.setHeader("Content-type", "text/html");
							res.mySend(__dirname + "/views/Quan_ly.html");
						} else {
							res.writeHead(302, {
								'Location': '/login'
							});
							res.end();
						}
						break;
					}
				case "/login":
					{
						if (user.laGiaoVien) {
							res.writeHead(302, {
								'Location': '/giao-vien'
							});
							res.end();
							return;
						}
						if (user.laQuanLy) {
							res.writeHead(302, {
								'Location': '/quan-ly'
							});
							res.end();
							return;
						}
						res.setHeader("Content-type", "text/html");
						res.mySend(__dirname + "/views/Login.html");
						break
					}
				default:
					{
						res.mySend(__dirname + "/public" + pathname);
						break;
					}
			}
		} else {
			res.mySend(__dirname + "/views/Error.html");
		}

	})
	.listen(port, server => {
		console.log("server GUI listen on", port);
	});