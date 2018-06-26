const http = require('http')
const {port} = require('./config');

http.createServer((req,res) => {

}).listen(port,() => {
    console.log("Security listen on port", port);
})