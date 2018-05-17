const request = require("request");
const xml2js = require("xml2js");
const {DAL_access_token} = require('./config.js');

//const TAG_access_token = "access_token";

Tag = {
  Danh_sach_Tivi: "Danh_sach_Tivi",
  Danh_sach_Nhom_Tivi: "Danh_sach_Nhom_Tivi",
  Tivi: "Tivi",
  Nhom_Tivi: "Nhom_Tivi"
};

Atrib = {
  Ten: "Ten",
  Ma_so: "Ma_so",
  Don_gia_Ban: "Don_gia_Ban",
  Don_gia_Nhap: "Don_gia_Nhap",
  So_luong_Ton: "So_luong_Ton",
  Doanh_thu: "Doanh_thu",
  Trang_thai_Con_hang: "Trang_thai_Con_hang"
};

const readAllDAL = URL_DAL => {
  return new Promise((resolve, reject) => {
    request(
      {
        headers: {
          //insert header later
          "access_token": DAL_access_token
        },
        uri: URL_DAL + "/read",
        method: "GET"
      },
      (err, res, body) => {
        if(body == "deny"){
          console.log('wrong access_token to DAL!')
          return reject(new Error('Wrong access_token to DAL'))
        }
        if (err) {
          return reject(err);
        }
        return resolve(body);
      }
    );
  });
};

const parseStringXML = XML => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(XML, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
};

const LayThongTinTiViChoKhach = XMLDOM => {
  return new Promise((resolve, reject) => {
    //Thêm thẻ ngoài cùng
    let result = `<${Tag.Danh_sach_Tivi}>`;

    for (let i = 0; i < XMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
      //Mở tag Tivi
      result += `<${Tag.Tivi} `;
      //Thêm thuộc tính cho Tivi
      result += `${Atrib.Ten}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ten}"` + " ";
      result +=
        `${Atrib.Don_gia_Ban}="${
          XMLDOM.Danh_sach_Tivi.Tivi[i].$.Don_gia_Ban
        }"` + " ";
      result +=
        `${Atrib.Trang_thai_Con_hang}="${
          XMLDOM.Danh_sach_Tivi.Tivi[i].$.Trang_thai_Con_hang
        }"` + " ";
      //Đóng tag Tivi
      result += ">";

      result += `</${Tag.Tivi}>`;
    }

    //Thêm thẻ đóng ngoài cùng
    result += `</${Tag.Danh_sach_Tivi}>`;
    return resolve(result);
  });
};

const LayThongTinTiViChoNVNhap = XMLDOM => {
  return new Promise((resolve, reject) => {
    //Thêm thẻ ngoài cùng
    let result = `<${Tag.Danh_sach_Tivi}>`;

    for (let i = 0; i < XMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
      //Mở tag Tivi
      result += `<${Tag.Tivi} `;
      //Thêm thuộc tính cho Tivi
      result += `${Atrib.Ten}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ten}"` + " ";
      result +=
        `${Atrib.Ma_so}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ma_so}"` + " ";
      result +=
        `${Atrib.Don_gia_Nhap}="${
          XMLDOM.Danh_sach_Tivi.Tivi[i].$.Don_gia_Nhap
        }"` + " ";
      result +=
        `${Atrib.So_luong_Ton}="${
          XMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton
        }"` + " ";
      //Đóng tag Tivi
      result += ">";

      result += `</${Tag.Tivi}>`;
    }

    //Thêm thẻ đóng ngoài cùng
    result += `</${Tag.Danh_sach_Tivi}>`;

    return resolve(result);
  });
};

const LayThongTinTiViChoQLNhap = XMLDOM => {
  return new Promise((resolve, reject) => {
    //Thêm thẻ ngoài cùng
    let result = `<${Tag.Danh_sach_Tivi}>`;

    for (let i = 0; i < XMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
      //Mở tag Tivi
      result += `<${Tag.Tivi} `;
      //Thêm thuộc tính cho Tivi
      result += `${Atrib.Ten}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ten}"` + " ";
      result +=
        `${Atrib.Ma_so}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ma_so}"` + " ";
      result +=
        `${Atrib.Don_gia_Nhap}="${
          XMLDOM.Danh_sach_Tivi.Tivi[i].$.Don_gia_Nhap
        }"` + " ";
      result +=
        `${Atrib.So_luong_Ton}="${
          XMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton
        }"` + " ";
      //Đóng tag Tivi
      result += ">";

      result += `</${Tag.Tivi}>`;
    }

    //Thêm thẻ đóng ngoài cùng
    result += `</${Tag.Danh_sach_Tivi}>`;

    return resolve(result);
  });
};

const LayThongTinTiViChoNVBan = XMLDOM => {
  return new Promise((resolve, reject) => {
    //Thêm thẻ ngoài cùng
    let result = `<${Tag.Danh_sach_Tivi}>`;

    for (let i = 0; i < XMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
      //Mở tag Tivi
      result += `<${Tag.Tivi} `;
      //Thêm thuộc tính cho Tivi
      result += `${Atrib.Ten}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ten}"` + " ";
      result +=
        `${Atrib.Ma_so}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ma_so}"` + " ";
      result +=
        `${Atrib.Don_gia_Nhap}="${
          XMLDOM.Danh_sach_Tivi.Tivi[i].$.Don_gia_Ban 
        }"` + " ";
      result +=
        `${Atrib.So_luong_Ton}="${
          XMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton
        }"` + " ";
      result +=
        `${Atrib.Doanh_thu}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Doanh_thu}"` +
        " ";
      //Đóng tag Tivi
      result += ">";

      result += `</${Tag.Tivi}>`;
    }

    //Thêm thẻ đóng ngoài cùng
    result += `</${Tag.Danh_sach_Tivi}>`;

    return resolve(result);
  });
};

const LayThongTinTiViChoQLBan = XMLDOM => {
  return new Promise((resolve, reject) => {
    //Thêm thẻ ngoài cùng
    let result = `<${Tag.Danh_sach_Tivi}>`;

    for (let i = 0; i < XMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
      //Mở tag Tivi
      result += `<${Tag.Tivi} `;
      //Thêm thuộc tính cho Tivi
      result += `${Atrib.Ten}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ten}"` + " ";
      result +=
        `${Atrib.Ma_so}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ma_so}"` + " ";
      result +=
        `${Atrib.Don_gia_Nhap}="${
          XMLDOM.Danh_sach_Tivi.Tivi[i].$.Don_gia_Ban 
        }"` + " ";
      result +=
        `${Atrib.So_luong_Ton}="${
          XMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton
        }"` + " ";
      result +=
        `${Atrib.Doanh_thu}="${XMLDOM.Danh_sach_Tivi.Tivi[i].$.Doanh_thu}"` +
        " ";
      //Đóng tag Tivi
      result += ">";

      result += `</${Tag.Tivi}>`;
    }

    //Thêm thẻ đóng ngoài cùng
    result += `</${Tag.Danh_sach_Tivi}>`;

    return resolve(result);
  });
};

const LayThongTinTiViTheoNhomChoQLNhap = XMLDOM => {
  return new Promise((resolve, reject) => {
    //Thêm thẻ ngoài cùng
    let result = `<${Tag.Danh_sach_Nhom_Tivi}>`;

    let NhomTV = {};
    let Ten_NhomTV = [];
    //Tính các nhóm Tivi
    for (let i = 0; i < XMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
      let Nhom = XMLDOM.Danh_sach_Tivi.Tivi[i].Nhom_Tivi[0];
      //console.log(XMLDOM.Danh_sach_Tivi.Tivi[i].Nhom_Tivi[0]);
      if (NhomTV[Nhom.$.Ma_so] == undefined) {
        NhomTV[Nhom.$.Ma_so] = {};
        NhomTV[Nhom.$.Ma_so].SoLuongTon = 0;
        NhomTV[Nhom.$.Ma_so].Ten = Nhom.$.Ten;
        Ten_NhomTV.push(Nhom.$.Ma_so);
      }
      //console.log(XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ten,XMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton);
      let temp = parseInt(XMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton);
      if (!isNaN(temp)) {
        NhomTV[Nhom.$.Ma_so].SoLuongTon += temp;
      }
    }

    //Bỏ các nhóm vừa tính xong vào kết quả
    for (let i = 0; i < Ten_NhomTV.length; i++) {
      //Mở tag Tivi
      result += `<${Tag.Nhom_Tivi} `;
      //Thêm thuộc tính cho Tivi
      result += `${Atrib.Ten}="${NhomTV[Ten_NhomTV[i]].Ten}"` + " ";
      result += `${Atrib.Ma_so}="${Ten_NhomTV[i]}"` + " ";
      result +=
        `${Atrib.So_luong_Ton}="${NhomTV[Ten_NhomTV[i]].SoLuongTon}"` + " ";
      //Đóng tag Tivi
      result += ">";

      result += `</${Tag.Nhom_Tivi}>`;
    }
    //Thêm thẻ đóng ngoài cùng
    result += `</${Tag.Danh_sach_Nhom_Tivi}>`;

    return resolve(result);
  });
};

const LayThongTinTiViTheoNhomChoQLBan = XMLDOM => {
  return new Promise((resolve, reject) => {
    //Thêm thẻ ngoài cùng
    let result = `<${Tag.Danh_sach_Nhom_Tivi}>`;

    let NhomTV = {};
    let Ten_NhomTV = [];
    //Tính các nhóm Tivi
    for (let i = 0; i < XMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
      let Nhom = XMLDOM.Danh_sach_Tivi.Tivi[i].Nhom_Tivi[0];
      //console.log(XMLDOM.Danh_sach_Tivi.Tivi[i].Nhom_Tivi[0]);
      if (NhomTV[Nhom.$.Ma_so] == undefined) {
        NhomTV[Nhom.$.Ma_so] = {};
        NhomTV[Nhom.$.Ma_so].SoLuongTon = 0;
        NhomTV[Nhom.$.Ma_so].DoanhThu = 0;
        NhomTV[Nhom.$.Ma_so].Ten = Nhom.$.Ten;
        Ten_NhomTV.push(Nhom.$.Ma_so);
      }
      //Tính doanh thu của Tivi
      let Tivi = XMLDOM.Danh_sach_Tivi.Tivi[i];
      let DoanhThuTivi = 0;
      //console.log(Tivi.Danh_sach_Ban_hang[0].Ban_hang);
      for (let i = 0; i < Tivi.Danh_sach_Ban_hang[0].Ban_hang.length; i++) {
        let temp = parseInt(Tivi.Danh_sach_Ban_hang[0].Ban_hang[i].$.Tien);
        if (!isNaN(temp)) {
          DoanhThuTivi += temp;
        }
      }
      NhomTV[Nhom.$.Ma_so].DoanhThu += DoanhThuTivi;
      //console.log(XMLDOM.Danh_sach_Tivi.Tivi[i].$.Ten,XMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton);
      let temp = parseInt(XMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton);
      if (!isNaN(temp)) {
        NhomTV[Nhom.$.Ma_so].SoLuongTon += temp;
      }
    }

    //Bỏ các nhóm vừa tính xong vào kết quả
    for (let i = 0; i < Ten_NhomTV.length; i++) {
      //Mở tag Tivi
      result += `<${Tag.Nhom_Tivi} `;
      //Thêm thuộc tính cho Tivi
      result += `${Atrib.Ten}="${NhomTV[Ten_NhomTV[i]].Ten}"` + " ";
      result += `${Atrib.Ma_so}="${Ten_NhomTV[i]}"` + " ";
      result +=
        `${Atrib.So_luong_Ton}="${NhomTV[Ten_NhomTV[i]].SoLuongTon}"` + " ";
      result += `${Atrib.Doanh_thu}="${NhomTV[Ten_NhomTV[i]].DoanhThu}"` + " ";
      //Đóng tag Tivi
      result += ">";

      result += `</${Tag.Nhom_Tivi}>`;
    }
    //Thêm thẻ đóng ngoài cùng
    result += `</${Tag.Danh_sach_Nhom_Tivi}>`;

    return resolve(result);
  });
};

module.exports.InitCache = async function(URL_DAL, cb) {
  let Cache = {};
  try {
    /**
    |--------------------------------------------------
    | Hai thao tác nặng nhất
    |--------------------------------------------------
    */
    //Lấy toàn bộ dữ liệu từ DAL
    let result = await readAllDAL(URL_DAL);
    // Chuyển từ dạng XML sang DOMXML
    let resultDOM = await parseStringXML(result);
    //console.log(resultDOM)
    /**
    |--------------------------------------------------
    | Cho API lay-thong-tin-tivi
    |--------------------------------------------------
    */
    //Tính Cache LayThongTinTivi cho Khach
    Cache.CacheLayThongTinTiViChoKhach = await LayThongTinTiViChoKhach(resultDOM);
    //Tính Cache LayThongTinTivi Cho NVNhap
    Cache.CacheLayThongTinTiViChoNVNhap = await LayThongTinTiViChoNVNhap(resultDOM);
    //Tính Cache LayThongTinTivi Cho QLNhap
    Cache.CacheLayThongTinTiViChoQLNhap = await LayThongTinTiViChoQLNhap(resultDOM);
    //Tính Cache LayThongTinTivi Cho NVBan
    Cache.CacheLayThongTinTiViChoNVBan = await LayThongTinTiViChoNVBan(resultDOM);
    //Tính Cache LayThongTinTivi Cho QLBan
    Cache.CacheLayThongTinTiViChoQLBan = await LayThongTinTiViChoQLBan(resultDOM);

    /**
    |--------------------------------------------------
    | Cho API lay-thong-tin-tivi-theo-thom
    |--------------------------------------------------
    */
    //Tính Cache cho lay-thong-tin-tivi-theo-thom cho QLNhap
    Cache.CacheLayThongTinTiViTheoNhomChoQLNhap = await LayThongTinTiViTheoNhomChoQLNhap(
      resultDOM
    );
    //Tính Cache cho lay-thong-tin-tivi-theo-thom cho QLNhap
    Cache.CacheLayThongTinTiViTheoNhomChoQLBan = await LayThongTinTiViTheoNhomChoQLBan(
      resultDOM
    );
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
    /**
    |--------------------------------------------------
    | Thao tác nặng nhất
    |--------------------------------------------------
    */
    // Chuyển từ dạng XML sang DOMXML
    let resultDOM = await parseStringXML(XML);
    //console.log(resultDOM)
    /**
    |--------------------------------------------------
    | Cho API lay-thong-tin-tivi
    |--------------------------------------------------
    */
    //Tính Cache LayThongTinTivi cho Khach
    Cache.CacheLayThongTinTiViChoKhach = await LayThongTinTiViChoKhach(resultDOM);
    //Tính Cache LayThongTinTivi Cho NVNhap
    Cache.CacheLayThongTinTiViChoNVNhap = await LayThongTinTiViChoNVNhap(resultDOM);
    //Tính Cache LayThongTinTivi Cho QLNhap
    Cache.CacheLayThongTinTiViChoQLNhap = await LayThongTinTiViChoQLNhap(resultDOM);
    //Tính Cache LayThongTinTivi Cho NVBan
    Cache.CacheLayThongTinTiViChoNVBan = await LayThongTinTiViChoNVBan(resultDOM);
    //Tính Cache LayThongTinTivi Cho QLBan
    Cache.CacheLayThongTinTiViChoQLBan = await LayThongTinTiViChoQLBan(resultDOM);

    /**
    |--------------------------------------------------
    | Cho API lay-thong-tin-tivi-theo-thom
    |--------------------------------------------------
    */
    //Tính Cache cho lay-thong-tin-tivi-theo-thom cho QLNhap
    Cache.CacheLayThongTinTiViTheoNhomChoQLNhap = await LayThongTinTiViTheoNhomChoQLNhap(
      resultDOM
    );
    //Tính Cache cho lay-thong-tin-tivi-theo-thom cho QLNhap
    Cache.CacheLayThongTinTiViTheoNhomChoQLBan = await LayThongTinTiViTheoNhomChoQLBan(
      resultDOM
    );
    //Đã cache đủ thì trả về
    return cb(null, Cache);
  } catch (err) {
    //lỗi
    return cb(err);
  }
};


module.exports.BanTiVi = (URL_DAL, Ngay, Tien, MaTV, SoLuong, DonGia,cb) => {
    /**
    |--------------------------------------------------
    | Requet DAL
    |--------------------------------------------------
    */
    let uri = `${URL_DAL}/insert?Mode=Ban&Ngay=${Ngay}&Tien=${Tien}&MaTV=${MaTV}&SoLuong=${SoLuong}&DonGia=${DonGia}`;
    request(
      {
        headers: {
          //insert header later
          "access_token": DAL_access_token
        },
        uri: uri,
        method: "GET"
      },
      (err, res, body) => {
        if(body == "deny"){
          console.log('wrong access_token to DAL!')
          return reject(new Error('Wrong access_token to DAL'))
        }
        if (err || body == "") {
          return cb(new Error("Không thể truy vấn!"));
        }
        return cb(null,body);
      }
    );
};

module.exports.NhapTiVi = (URL_DAL, Ngay, Tien, MaTV, SoLuong, DonGia,cb) => {
  /**
  |--------------------------------------------------
  | Requet DAL
  |--------------------------------------------------
  */
  let uri = `${URL_DAL}/insert?Mode=Nhap&Ngay=${Ngay}&Tien=${Tien}&MaTV=${MaTV}&SoLuong=${SoLuong}&DonGia=${DonGia}`;
  request(
    {
      headers: {
        //insert header later
        "access_token": DAL_access_token
      },
      uri: uri,
      method: "GET"
    },
    (err, res, body) => {
      if(body == "deny"){
        console.log('wrong access_token to DAL!')
        return reject(new Error('Wrong access_token to DAL'))
      }
      if (err || body == "") {
        return cb(new Error("Không thể truy vấn!"));
      }
      return cb(null,body);
    }
  );
};

module.exports.CapNhatDonGiaBan = (URL_DAL,MaTV,DonGia,cb) => {
  /**
  |--------------------------------------------------
  | Requet DAL
  |--------------------------------------------------
  */
  let uri = `${URL_DAL}/update?Mode=Ban&MaTV=${MaTV}&DonGia=${DonGia}`;
  request(
    {
      headers: {
        //insert header later
        "access_token": DAL_access_token
      },
      uri: uri,
      method: "GET"
    },
    (err, res, body) => {
      if(body == "deny"){
        console.log('wrong access_token to DAL!')
        return reject(new Error('Wrong access_token to DAL'))
      }
      if (err || body == "") {
        return cb(new Error("Không thể truy vấn!"));
      }
      return cb(null,body);
    }
  );
};

module.exports.CapNhatDonGiaNhap = (URL_DAL,MaTV,DonGia,cb) => {
  /**
  |--------------------------------------------------
  | Requet DAL
  |--------------------------------------------------
  */
  let uri = `${URL_DAL}/update?Mode=Nhap&MaTV=${MaTV}&DonGia=${DonGia}`;
  request(
    {
      headers: {
        //insert header later
        "access_token": DAL_access_token
      },
      uri: uri,
      method: "GET"
    },
    (err, res, body) => {
      if(body == "deny"){
        console.log('wrong access_token to DAL!')
        return reject(new Error('Wrong access_token to DAL'))
      }
      if (err || body == "") {
        return cb(new Error("Không thể truy vấn!"));
      }
      return cb(null,body);
    }
  );
};
