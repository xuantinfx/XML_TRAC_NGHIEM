module.exports = {
    port: 3001,
    URL_DAL: "http://localhost:3002",
    URL_SECURITY: "http://localhost:3003",
    API: {
        BoDe: {
            read: '/bo-de/read',
            insert: '/bo-de/insert',
            update: '/bo-de/update'
        },
        CauHoi: {
            read: '/cau-hoi/read',
            insert: '/cau-hoi/insert',
            update: '/cau-hoi/update'
        },
        NguoiDung: {
            read: '/nguoi-dung/read',
            insert: '/nguoi-dung/insert',
            update: '/nguoi-dung/update'
        }
    },
    DAL_access_token: "abcdef123123",
    Tag: {
        BoDe: {
            DS_BO_DE: 'DS_BO_DE',
            DE: 'DE',
            DS_CAU_HOI: 'DS_CAU_HOI',
            CAU: 'CAU'
        },
        CauHoi: {
            DS_CAU_HOI: 'DS_CAU_HOI',
            CAU_HOI: 'CAU_HOI',
            DE: 'DE',
            DS_DAP_AN: 'DS_DAP_AN',
            DAP_AN: 'DAP_AN'
        },
        NguoiDung: {
            DS_NGUOI_DUNG: 'DS_NGUOI_DUNG',
            DS_GIAO_VIEN: 'DS_GIAO_VIEN',
            GIAO_VIEN: 'GIAO_VIEN',
            DS_QUAN_LY: 'DS_QUAN_LY',
            QUAN_LY: 'QUAN_LY'
        },
    },

    Atrib: {
        BoDe: {
            Ma_de: 'Ma_de',
            Ma_nguoi_tao: 'Ma_nguoi_tao',
        },
        CauHoi: {
            Ma_cau_hoi: 'Ma_cau_hoi',
            Dap_an: 'Dap_an',
            Da_duyet: 'Da_duyet',
            Ma_nguoi_dang: 'Ma_nguoi_dang',
            Ma_nguoi_duyet: 'Ma_nguoi_duyet'
        },
        NguoiDung: {
            Ma_giao_vien: 'Ma_giao_vien',
            Ma_quan_ly: 'Ma_quan_ly',
            Ten: 'Ten',
            Mat_khau: 'Mat_khau'
        },
    }
}