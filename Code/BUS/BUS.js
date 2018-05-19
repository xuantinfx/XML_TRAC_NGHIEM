const request = require("request");
const xml2js = require("xml2js");
const {URL_DAL, API, Tag, Atrib, DAL_access_token} = require('./config')

const boDe = 0, cauHoi = 1, nguoiDung = 2;

//const TAG_access_token = "access_token";

const readDataFromDal = (url) => {
  return new Promise((resolve, reject) => {
    request(
      {
        headers: {
          //insert header later
          "access_token": DAL_access_token
        },
        uri: url,
        method: "GET"
      },
      (err, res, body) => {
        if (err) {
          return reject(err);
        }
        else{
          if(body == '') {
            return reject(new Error('respone data is empty'))
          }
          return resolve(body);
        }
      }
    );
  })
}

const readAllDAL = () => {
  return new Promise((resolve, reject) => {
    let pdataBoDe = readDataFromDal(URL_DAL + API.BoDe.read);
    let pdataCauHoi = readDataFromDal(URL_DAL + API.CauHoi.read);
    let pdataNguoiDung = readDataFromDal(URL_DAL + API.NguoiDung.read);
    
    Promise.all([pdataBoDe, pdataCauHoi, pdataNguoiDung])
    .then(value => {
      let allData = [];
      allData[boDe] = value[0];
      allData[cauHoi] = value[1];
      allData[nguoiDung] = value[2];
      return resolve(allData);
    }).catch(err => {
      return reject(err);
    })
  });
};

const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  })
}

const parseStringXML = xmls => {
  return new Promise((resolve, reject) => {
    let listPromise = [];
    for(let i = 0;i < xmls.length; i++) {
      listPromise.push(parseXML(xmls[i]));
    }
    Promise.all(listPromise)
    .then(value => {
      return resolve(value);
    })
    .catch(err => {
      return reject(err);
    })
  });
};

module.exports.InitCache = async function(URL_DAL, cb) {
  let Cache = {};
  try {
    //Lấy toàn bộ dữ liệu từ DAL
    let result = await readAllDAL(URL_DAL);
    // Chuyển từ dạng XML sang DOMXML
    let resultDOM = await parseStringXML(result);



    //Đã cache đủ thì trả về
    cb(null, Cache);
    return;
  } catch (err) {
    //lỗi
    cb(err);
    return;
  }
};

module.exports.RebuildCache = async function(XML,cb) {
  let Cache = {};
  try {
    // Chuyển từ dạng XML sang DOMXML
    let resultDOM = await parseStringXML(XML);

    //Đã cache đủ thì trả về
    return cb(null, Cache);
  } catch (err) {
    //lỗi
    return cb(err);
  }
};