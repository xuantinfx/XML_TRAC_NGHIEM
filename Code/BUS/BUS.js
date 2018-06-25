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
    cb(null, resultDOM);
    return;
  } catch (err) {
    //lỗi
    cb(err);
    return;
  }
};

module.exports.layCauHoi = (XMLDOMCauHoi, maCauHoi) => {
  //console.log(XMLDOMCauHoi.DS_CAU_HOI.CAU_HOI);
  let result = {};
  let listCauHoi = XMLDOMCauHoi.DS_CAU_HOI.CAU_HOI;
  let i;
  for(i = 0; i < listCauHoi.length; i++) {
    if((maCauHoi == listCauHoi[i].$.Ma_cau_hoi) && (listCauHoi[i].$.Da_duyet == 'true')) {
      result.CAU_HOI = listCauHoi[i];
      break;
    }
  }
  if(i >= listCauHoi.length) {
    return "";
  }
  return (new xml2js.Builder).buildObject(result)
  //return result;
}

module.exports.layDSCauHoi = (XMLDOMCauHoi) => {
  return (new xml2js.Builder).buildObject(XMLDOMCauHoi)
}

module.exports.layDSBoDe = (XMLDOMBoDe) => {
  return (new xml2js.Builder).buildObject(XMLDOMBoDe)
}

module.exports.layBoDe = (XMLDOMBoDe, maDe) => {
  let listBoDe = XMLDOMBoDe.DS_BO_DE.DE;
  let result = {};
  let i = 0;
  for(i = 0; i < listBoDe.length; i++) {
    if(listBoDe[i].$.Ma_de == maDe) {
      result.DE = listBoDe[i];
      break;
    }
  }
  return (new xml2js.Builder).buildObject(result)
}

module.exports.themCauHoi = async (XMLDOMCauHoi, data) => {
  return new Promise((resolve, reject) => {
    console.log(data)
    request(
      {
        uri: URL_DAL + '/cau-hoi/write',
        method: 'POST',
        json: data
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
    )
  })
}

module.exports.duyetCauHoi = async (XMLDOMCauHoi, data) => {
  let result = {};
  let maCauHoi = data.maCauHoi;
  let listCauHoi = XMLDOMCauHoi.DS_CAU_HOI.CAU_HOI;
  let i;
  for(i = 0; i < listCauHoi.length; i++) {
    console.log(typeof(maCauHoi), typeof(listCauHoi[i].$.Ma_cau_hoi))
    if(maCauHoi == listCauHoi[i].$.Ma_cau_hoi) {
      result.CAU_HOI = listCauHoi[i];
      break;
    }
  }
  let cauHoi = (new xml2js.Builder).buildObject(result)
  cauHoi = await parseXML(cauHoi);
  cauHoi.CAU_HOI.$.Ma_nguoi_duyet = 'Trinh'
  cauHoi.CAU_HOI.$.Da_duyet = 'true'
  return new Promise((resolve, reject) => {
    console.log(data)
    request(
      {
        uri: URL_DAL + '/cau-hoi/update',
        method: 'POST',
        json: cauHoi
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
    )
  })
}


module.exports.taoBoDe = async (XMLDOMCauHoi, data) => {
  return new Promise((resolve, reject) => {
    data.maNguoiTao = "12";
    console.log(data,'-------')
    request(
      {
        uri: URL_DAL + '/bo-de/write',
        method: 'POST',
        json: data
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
    )
  })
}