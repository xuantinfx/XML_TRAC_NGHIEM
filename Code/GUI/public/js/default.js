const BUS_API = "http://localhost:3001";

var requestApi = (uri, method, data, BaseURL) => {
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
        if(typeof data == "object") {
            data = JSON.stringify(data);
        }
        let token = window.localStorage.getItem("token");
        let url = BUS_API + uri;
        if(BaseURL) {
            url = BaseURL + uri;
        }
        $.ajax({
            method: method,
            url: url,
            data: data,
            headers: {
                Authorization: token
            }
        }).done((result) => {
            if(result == "need login") {
                window.location.href = "/login"
            }
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

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

const logOut = () => {
    eraseCookie("token");
    localStorage.removeItem("token");
    location.href = "/login"
}