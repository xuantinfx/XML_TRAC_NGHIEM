const BUS_API = "http://localhost:3001";

var requestApi = (uri, method, data) => {
    return new Promise((resole, reject) => {
        if (method.toLowerCase() == 'get' && data) {
            uri += "?";
            let first = true;
            for (i in data) {
                if (first) {
                    uri += i + "=" + data[i];

                    first = false;
                } else {
                    uri += "&" + i + "=" + data[i];
                }
            }
            data = null;
        }
        let token = window.localStorage.getItem("token");
        $.ajax({
            method: method,
            url: BUS_API + uri,
            data: data,
            headers: {
                Authorization: token
            }
        }).done((result) => {
            resole(result);
        })
    })
}

var Tag = {
    CAU_HOI: "CAU_HOI",
    DE: "DE",
    DAP_AN: "DAP_AN",
    CAU: "CAU"
}

var Attri = {
    Ma_cau_hoi: "Ma_cau_hoi",
    Dap_an: "Dap_an",
    Da_duyet: "Da_duyet",
    Ma_dap_an: "Ma_dap_an",
    Ma_de: "Ma_de"
}