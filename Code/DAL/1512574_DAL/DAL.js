const fs = require("fs");
const xml2js = require("xml2js");

module.exports.boDeWrite = (pathData, xmlDomBoDe, maNguoiTao, maCacCauHoi) => {
  //console.log(xmlDomBoDe.DS_BO_DE.DE[0].DS_CAU_HOI);
  let maDe = parseInt(xmlDomBoDe.DS_BO_DE.DE[xmlDomBoDe.DS_BO_DE.DE.length - 1].$.Ma_de) + 1;
  let ds_Cau_Hoi = maCacCauHoi.map((item, index) => {
    return {
      $: {
        'Ma_cau_hoi': maCacCauHoi[index]
      }
    }
  })
  //console.log(ds_Cau_Hoi);
  xmlDomBoDe.DS_BO_DE.DE.push({
    $: {
      'Ma_de': maDe,
      'Ma_nguoi_tao': maNguoiTao
    },
    DS_CAU_HOI: [{
      'CAU': ds_Cau_Hoi
    }]

  })
  var builder = new xml2js.Builder();
  var xmlres = builder.buildObject(xmlDomBoDe);
  fs.writeFileSync(pathData, xmlres, {
    encoding: "utf-8",
    flag: "w"
  });
  return [xmlDomBoDe, xmlres];
}

//***************************************************** */
//Code cu
//************************************* */

module.exports.read = function (pathData) {
  return fs.readFileSync(pathData).toString();
};

module.exports.updateBan = function (pathData, CacheXMLDOM, DonGia, MaTV) {
  //Tìm và sửa đổi vào CacheXMLDOM
  let i;
  for (i = 0; i < CacheXMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
    if (CacheXMLDOM.Danh_sach_Tivi.Tivi[i].$.Ma_so == MaTV) {
      //console.log(CacheXMLDOM.Danh_sach_Tivi.Tivi[i]);
      CacheXMLDOM.Danh_sach_Tivi.Tivi[i].$.Don_gia_Ban = DonGia;
      //console.log(CacheXMLDOM.Danh_sach_Tivi.Tivi[i]);
      break;
    }
  }
  //không tìm thấy sản phẩm
  if (i == CacheXMLDOM.Danh_sach_Tivi.Tivi.length) {
    return false;
  }
  var builder = new xml2js.Builder();
  var xmlres = builder.buildObject(CacheXMLDOM);
  fs.writeFileSync(pathData, xmlres, {
    encoding: "utf-8",
    flag: "w"
  });
  return [CacheXMLDOM, xmlres];
};

module.exports.updateNhap = function (pathData, CacheXMLDOM, DonGia, MaTV) {
  //Tìm và sửa đổi vào CacheXMLDOM
  let i;
  for (i = 0; i < CacheXMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
    if (CacheXMLDOM.Danh_sach_Tivi.Tivi[i].$.Ma_so == MaTV) {
      //console.log(CacheXMLDOM.Danh_sach_Tivi.Tivi[i]);
      CacheXMLDOM.Danh_sach_Tivi.Tivi[i].$.Don_gia_Nhap = DonGia;
      //console.log(CacheXMLDOM.Danh_sach_Tivi.Tivi[i]);
      break;
    }
  }
  //không tìm thấy sản phẩm
  if (i == CacheXMLDOM.Danh_sach_Tivi.Tivi.length) {
    return false;
  }
  var builder = new xml2js.Builder();
  var xmlres = builder.buildObject(CacheXMLDOM);
  fs.writeFileSync(pathData, xmlres, {
    encoding: "utf-8",
    flag: "w"
  });
  return [CacheXMLDOM, xmlres];
};

module.exports.insertBan = function (
  pathData,
  CacheXMLDOM,
  Ngay,
  Tien,
  MaTV,
  SoLuong,
  DonGia
) {
  //Tìm và sửa đổi vào CacheXMLDOM
  let i;
  for (i = 0; i < CacheXMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
    if (CacheXMLDOM.Danh_sach_Tivi.Tivi[i].$.Ma_so == MaTV) {
      //console.log(CacheXMLDOM.Danh_sach_Tivi.Tivi[i].Danh_sach_Ban_hang[0].Ban_hang);
      CacheXMLDOM.Danh_sach_Tivi.Tivi[i].Danh_sach_Ban_hang[0].Ban_hang.push({
        $: {
          Ngay: Ngay,
          Don_gia: DonGia,
          So_luong: SoLuong,
          Tien: Tien
        }
      });

      //update số lượng tồn
      let soLuongTon = parseInt(CacheXMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton);
      soLuongTon = soLuongTon - parseInt(SoLuong);
      CacheXMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton = soLuongTon;
      break;
    }
  }
  //không tìm thấy sản phẩm
  if (i == CacheXMLDOM.Danh_sach_Tivi.Tivi.length) {
    return false;
  }
  var builder = new xml2js.Builder();
  var xmlres = builder.buildObject(CacheXMLDOM);
  fs.writeFileSync(pathData, xmlres, {
    encoding: "utf-8",
    flag: "w"
  });
  return [CacheXMLDOM, xmlres];
};

module.exports.insertNhap = function (
  pathData,
  CacheXMLDOM,
  Ngay,
  Tien,
  MaTV,
  SoLuong,
  DonGia
) {
  //Tìm và sửa đổi vào CacheXMLDOM
  let i;
  for (i = 0; i < CacheXMLDOM.Danh_sach_Tivi.Tivi.length; i++) {
    if (CacheXMLDOM.Danh_sach_Tivi.Tivi[i].$.Ma_so == MaTV) {
      //console.log(CacheXMLDOM.Danh_sach_Tivi.Tivi[i].Danh_sach_Nhap_hang[0].Nhap_hang)
      CacheXMLDOM.Danh_sach_Tivi.Tivi[i].Danh_sach_Nhap_hang[0].Nhap_hang.push({
        $: {
          Ngay: Ngay,
          Don_gia: DonGia,
          So_luong: SoLuong,
          Tien: Tien
        }
      });

      //update số lượng tồn
      let soLuongTon = parseInt(CacheXMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton);
      soLuongTon = soLuongTon + parseInt(SoLuong);
      CacheXMLDOM.Danh_sach_Tivi.Tivi[i].$.So_luong_Ton = soLuongTon;

      break;
    }
  }
  //không tìm thấy sản phẩm
  if (i == CacheXMLDOM.Danh_sach_Tivi.Tivi.length) {
    return false;
  }
  var builder = new xml2js.Builder();
  var xmlres = builder.buildObject(CacheXMLDOM);
  fs.writeFileSync(pathData, xmlres, {
    encoding: "utf-8",
    flag: "w"
  });
  return [CacheXMLDOM, xmlres];
};