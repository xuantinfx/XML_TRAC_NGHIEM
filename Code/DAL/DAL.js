const fs = require("fs");
const xml2js = require("xml2js");

module.exports.read = function (pathData) {
  return fs.readFileSync(pathData).toString();
};

module.exports.boDeWrite = (pathData, xmlDomBoDe, maNguoiTao, maCacCauHoi) => {
  let maDe = parseInt(xmlDomBoDe.DS_BO_DE.DE[xmlDomBoDe.DS_BO_DE.DE.length - 1].$.Ma_de) + 1;
  let ds_Cau_Hoi = maCacCauHoi.map((item, index) => {
    return {
      $: {
        'Ma_cau_hoi': maCacCauHoi[index]
      }
    }
  })
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

module.exports.boDeUpdate = (pathData, xmlDomBoDe, maDe, maNguoiTao, maCacCauHoi) => {
  let ds_Cau_Hoi = maCacCauHoi.map((item, index) => {
    return {
      $: {
        'Ma_cau_hoi': maCacCauHoi[index]
      }
    }
  })

  let boDeMoi = {
    $: {
      'Ma_de': maDe,
      'Ma_nguoi_tao': maNguoiTao
    },
    DS_CAU_HOI: [{
      'CAU': ds_Cau_Hoi
    }]
  }

  //tim bo de co ma tuong ung va thay
  for(let i = 0; i < xmlDomBoDe.DS_BO_DE.DE.length; i++){
    if(xmlDomBoDe.DS_BO_DE.DE[i].$.Ma_de == maDe){
      xmlDomBoDe.DS_BO_DE.DE[i] = boDeMoi;
      break;
    }
  }

  var builder = new xml2js.Builder();
  var xmlres = builder.buildObject(xmlDomBoDe);
  fs.writeFileSync(pathData, xmlres, {
    encoding: "utf-8",
    flag: "w"
  });
  return [xmlDomBoDe, xmlres];
}

module.exports.cauHoiWrite = (pathData, xmlDomCauHoi, cauHoi, dsDapAn, dapAn, maNguoiDang) => {
  let maCauHoi = parseInt(xmlDomCauHoi.DS_CAU_HOI.CAU_HOI[xmlDomCauHoi.DS_CAU_HOI.CAU_HOI.length - 1].$.Ma_cau_hoi) + 1;
  let ds_Dap_An = dsDapAn.map((item, index) => {
    return {
      $: {
        'Ma_dap_an': index
      },
      _: item
    }
  })
  xmlDomCauHoi.DS_CAU_HOI.CAU_HOI.push({
    $: {
      'Ma_cau_hoi': maCauHoi,
      'Dap_an': dapAn,
      'Da_duyet': false,
      'Ma_nguoi_dang': maNguoiDang
    },
    DE: [cauHoi],
    DS_DAP_AN: [{
      DAP_AN: ds_Dap_An
    }],
  })
  var builder = new xml2js.Builder();
  var xmlres = builder.buildObject(xmlDomCauHoi);
  fs.writeFileSync(pathData, xmlres, {
    encoding: "utf-8",
    flag: "w"
  });
  return [xmlDomCauHoi, xmlres];
}

module.exports.cauHoiUpdate = (pathData, xmlDomCauHoi, maCauHoi, daDuyet, maNguoiDang, maNguoiDuyet, cauHoi, dsDapAn, dapAn) => {
  let ds_Dap_An = dsDapAn.map((item, index) => {
    return {
      $: {
        'Ma_dap_an': index
      },
      _: item
    }
  })
  
  let cauHoiMoi = {
    $: {
      'Ma_cau_hoi': maCauHoi,
      'Dap_an': dapAn,
      'Da_duyet': daDuyet,
      'Ma_nguoi_dang': maNguoiDang,
      'Ma_nguoi_duyet': maNguoiDuyet
    },
    DE: [cauHoi],
    DS_DAP_AN: [{
      DAP_AN: ds_Dap_An
    }],
  }

  for(let i = 0; i < xmlDomCauHoi.DS_CAU_HOI.CAU_HOI.length; i++){
    if(xmlDomCauHoi.DS_CAU_HOI.CAU_HOI[i].$.Ma_cau_hoi == maCauHoi){
      xmlDomCauHoi.DS_CAU_HOI.CAU_HOI[i] = cauHoiMoi;
      break;
    }
  }

  var builder = new xml2js.Builder();
  var xmlres = builder.buildObject(xmlDomCauHoi);
  fs.writeFileSync(pathData, xmlres, {
    encoding: "utf-8",
    flag: "w"
  });
  return [xmlDomCauHoi, xmlres];
}

module.exports.nguoiDungWrite = (pathData, xmlDomNguoiDung, laGiaoVien, ten, matKhau) => {
  if (laGiaoVien == 'true') {
    let maGV = parseInt(xmlDomNguoiDung.DS_NGUOI_DUNG.DS_GIAO_VIEN[0].GIAO_VIEN[xmlDomNguoiDung.DS_NGUOI_DUNG.DS_GIAO_VIEN[0].GIAO_VIEN.length - 1].$.Ma_giao_vien) + 1;
    xmlDomNguoiDung.DS_NGUOI_DUNG.DS_GIAO_VIEN[0].GIAO_VIEN.push({
      $: {
        'Ma_giao_vien': maGV,
        'Ten': ten,
        'Mat_khau': matKhau
      }
    })
  }
  else {
    let maQL = parseInt(xmlDomNguoiDung.DS_NGUOI_DUNG.DS_QUAN_LY[0].QUAN_LY[xmlDomNguoiDung.DS_NGUOI_DUNG.DS_QUAN_LY[0].QUAN_LY.length - 1].$.Ma_quan_ly) + 1;
    xmlDomNguoiDung.DS_NGUOI_DUNG.DS_QUAN_LY[0].QUAN_LY.push({
      $: {
        'Ma_quan_ly': maQL,
        'Ten': ten,
        'Mat_khau': matKhau
      }
    })
  }

  var builder = new xml2js.Builder();
  var xmlres = builder.buildObject(xmlDomNguoiDung);
  fs.writeFileSync(pathData, xmlres, {
    encoding: "utf-8",
    flag: "w"
  });
  return [xmlDomNguoiDung, xmlres];
}

module.exports.nguoiDungUpdate = (pathData, xmlDomNguoiDung, laGiaoVien, ma, ten, matKhau) => {
  if (laGiaoVien == 'true') {
    let giaoVienMoi = {
      $: {
        'Ma_giao_vien': ma,
        'Ten': ten,
        'Mat_khau': matKhau
      }
    }
    for(let i = 0; i< xmlDomNguoiDung.DS_NGUOI_DUNG.DS_GIAO_VIEN[0].GIAO_VIEN.length; i++){
      if(xmlDomNguoiDung.DS_NGUOI_DUNG.DS_GIAO_VIEN[0].GIAO_VIEN[i].$.Ma_giao_vien == ma){
        xmlDomNguoiDung.DS_NGUOI_DUNG.DS_GIAO_VIEN[0].GIAO_VIEN[i] = giaoVienMoi;
        break;
      }
    }
  }
  else {
    let quanLyMoi = {
      $: {
        'Ma_quan_ly': ma,
        'Ten': ten,
        'Mat_khau': matKhau
      }
    }
    for(let i = 0; i < xmlDomNguoiDung.DS_NGUOI_DUNG.DS_QUAN_LY[0].QUAN_LY.length; i++){
      if(xmlDomNguoiDung.DS_NGUOI_DUNG.DS_QUAN_LY[0].QUAN_LY[i].$.Ma_quan_ly == ma){
        xmlDomNguoiDung.DS_NGUOI_DUNG.DS_QUAN_LY[0].QUAN_LY[i] = quanLyMoi;
        break;
      }
    }
  }

  var builder = new xml2js.Builder();
  var xmlres = builder.buildObject(xmlDomNguoiDung);
  fs.writeFileSync(pathData, xmlres, {
    encoding: "utf-8",
    flag: "w"
  });
  return [xmlDomNguoiDung, xmlres];
}