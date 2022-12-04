angular.module('WebApiApp').
    controller('BaoCaoDGNController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', 'FactoryConstant', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, FactoryConstant) {
        $scope.config = {
            // readOnly: !$scope.CheckView($scope.item, 'EDITKHDGN'),
            height: '150px',
            toolbar: [
                ['Source'],
                ['Print', 'Preview'],
                ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'],
                ['NumberedList', 'BulletedList', 'Blockquote'],
                ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                ['Link', 'Unlink'],
                ['Undo', 'Redo'],
                ['Find', 'Replace'],
                ['Bold', 'Italic', 'Underline', 'Strike'],
                ['Table', 'HorizontalRule', 'SpecialChar'],
                //["InsertMinhChung", "SetReadOnly"]
            ],
            removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar',
        }
        var InitLoad = function () {
            $scope.TieuChuans = []
            $scope.TieuChis = []
            $scope.item = {}
            $scope.ItemPhieu = {}
            $scope.ItemKQKS = {}
            $scope.ItemKeHoachDGN = {}
            $scope.HoiDongDGN = []
            $scope.ThanhVienDGNs = []
            $scope.filterTCTC = {
                type: 'KHDGN'
            }
            $scope.filterPhieuDG = {
                PhanLoaiDanhGia: 'TIEUCHI'
            }
            $scope.filterBaoCao = {
                PhanLoaiDG: 'TIEUCHUAN'
            }
            $scope.ListPhieuTCTCKHTDG = []

        }
        $scope.filterBaoCao = {
            PhanLoaiDG: 'TIEUCHUAN'
        }
        //Load hoi dong
        //Load hoi dong
        $scope.LoadThanhVienDGN = function (objParams) {
            $scope.ThanhVienDGNs = []
            if (objParams == null) {
                let PhanLoai = ""
                if ($scope.filterPhieuDG.PhanLoaiDanhGia == "SOBO") {
                    PhanLoai = 'ALLBAOCAOSOBO'
                }
                if ($scope.filterPhieuDG.PhanLoaiDanhGia == "TIEUCHI") {
                    PhanLoai = 'ALLBAOCAOTIEUCHI'
                }
                if (PhanLoai == '') return
                objParams = {
                    // PhanLoai: 'BAOCAOSOBO',
                    PhanLoai: PhanLoai,
                    IdDonVi: 0,
                    IdKeHoachTDG: 0,
                    IdKeHoachDGN: $scope.ItemKeHoachDGN.Id,
                }
            }
            $http({
                method: 'GET',
                url: 'api/Base/GetThanhVienDGN',
                params: objParams
            }).then(function successCallback(response) {
                $scope.ThanhVienDGNs = response.data

            }, function errorCallback(response) {
                $scope.itemError = response.data;
                if ($scope.itemError.ModelState)
                    toastr.error('Có lỗi xảy ra trong quá trình tải dữ liệu !', 'Thông báo');
                else
                    toastr.error('Có lỗi xảy ra! ' + $scope.itemError.Message, 'Thông báo');
            });
        }
        $scope.LoadHoiDongDGN = function (IdKeHoach) {

            $http({
                method: 'GET',
                url: 'api/HoiDongDGN/GetAll?IdDonVi=' + $rootScope.CurDonVi.Id
                    + '&IdKeHoachDGN=' + IdKeHoach
            }).then(function successCallback(response) {

                $scope.HoiDongDGN = response.data;

            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }

        //end load hoi dong
        //Filter danh sach ke hoach ngoai
        $scope.onChangeKeHoach = function (Id) {
            if (Id == null || Id == 0) {
                $scope.filterTCTC.IdKeHoach = 0;
                InitLoad()
                return;
            }
            $scope.ItemKeHoachDGN = $scope.KeHoachDGN.find(s => s.Id == Id)
            $scope.LoadHoiDongDGN(Id);
            $scope.LoadTCTC();
            $scope.LoadPhieuTuDanhGia($scope.ItemKeHoachDGN.IdKeHoachTDG);
        }
        $scope.ServiceLoadKeHoachDGN = function (data) {
            return $http.post("api/KeHoachDGN/FilterKHDGN", data)
        }
        $scope.filterKeHoachDGN = {
            GetAll: true,
        };
        $scope.LoadKeHoachDGN = function () {
            InitLoad()
            if ($scope.filterKeHoachDGN.IdTruong == null) return;
            $scope.ServiceLoadKeHoachDGN($scope.filterKeHoachDGN).then(function successCallback(response) {
                $scope.KeHoachDGN = response.data.ListOut;
                if (response.data.ListOut != null && response.data.ListOut != '') {
                    $scope.ItemKeHoachDGN = $scope.KeHoachDGN[0]
                    $scope.ItemKeHoachDGN.Id = $scope.ItemKeHoachDGN.Id + ''
                    $scope.filterTCTC.IdKeHoach = $scope.ItemKeHoachDGN.Id
                    let filterThanhVienDGN = {
                        PhanLoai: 'ALLBAOCAOTIEUCHI',
                        IdDonVi: 0,
                        IdKeHoachTDG: 0,
                        IdKeHoachDGN: $scope.ItemKeHoachDGN.Id,
                    }
                    $scope.LoadThanhVienDGN(filterThanhVienDGN)
                    $scope.LoadTCTC();
                    $scope.LoadPhieuTuDanhGia($scope.ItemKeHoachDGN.IdKeHoachTDG);
                }
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }
        $scope.LoadKeHoachDGN();
        //end Filter danh sach ke hoach ngoai

        //Load Tieu chuan tieu chi

        $scope.filterTCTC = {
            type: 'KHDGN'
        }
        $scope.LoadTCTC = function () {
            $scope.TieuChuans = []
            $scope.TieuChis = []
            if ($scope.filterTCTC.IdKeHoach == null)
                return
            let configGetTCTC = {
                params: $scope.filterTCTC
            }
            $http.get("api/KeHoachDGN/GetTCTC", configGetTCTC).then(function (rs) {
                $scope.TieuChuanTieuChis = rs.data
                $scope.TieuChuans = rs.data.map(s => { return s.tchuan })
                $scope.ListTieuChuanTieuChis = $scope.TieuChuanTieuChis.reduce(function (rs, obj, index) {
                    obj.tchi.map(s => {
                        if (s.ChiBaoA != null) s.listChiBaoA = JSON.parse(s.ChiBaoA)
                        if (s.ChiBaoB != null) s.listChiBaoB = JSON.parse(s.ChiBaoB)
                        if (s.ChiBaoC != null) s.listChiBaoC = JSON.parse(s.ChiBaoC)
                        return s;
                    })
                    rs = rs.concat([obj.tchuan], obj.tchi)
                    return rs;
                }, []);
                $scope.ListTieuChis = $scope.TieuChuanTieuChis.reduce(function (rs, obj, index) {
                    rs = rs.concat(obj.tchi)
                    return rs;
                }, []);
                $scope.LoadKQKhaoSat();
                $scope.LoadBaoCaoDGN();
            })
        }
        $scope.OnChangeTieuChuan = function (Id, type) {
            if (type == 'TIEUCHUAN') {
                $scope.TieuChis = []
                $scope.ObjTieuChuan = $scope.TieuChuans.find(s => s.Id == Id)
                $scope.TieuChis = $scope.TieuChuanTieuChis.find(s => s.tchuan.Id == Id).tchi
            }
            if (type == 'TIEUCHI') {
                $scope.ObjTieuChi = $scope.TieuChis.find(s => s.Id == Id)
                $scope.ObjTieuChi.listChiBaoA = JSON.parse($scope.ObjTieuChi.ChiBaoA)
                $scope.ObjTieuChi.listChiBaoB = JSON.parse($scope.ObjTieuChi.ChiBaoB)
                $scope.ObjTieuChi.listChiBaoC = JSON.parse($scope.ObjTieuChi.ChiBaoC)
                $scope.LoadPhieuDanhGia();
            }
            if (type == 'TIEUCHUAN_BAOCAO') {
                $scope.TieuChi_BAOCAOs = []
                // $scope.ObjTieuChuan = $scope.TieuChuans.find(s => s.Id == Id)
                $scope.TieuChi_BAOCAOs = $scope.TieuChuanTieuChis.find(s => s.tchuan.Id == Id).tchi
            }
            if (type == 'TIEUCHI_BAOCAO') {
                $scope.ObjTieuChi_BAOCAO = $scope.TieuChi_BAOCAOs.find(s => s.Id == Id)
                $scope.ObjTieuChi_BAOCAO.listChiBaoA = JSON.parse($scope.ObjTieuChi_BAOCAO.ChiBaoA)
                $scope.ObjTieuChi_BAOCAO.listChiBaoB = JSON.parse($scope.ObjTieuChi_BAOCAO.ChiBaoB)
                $scope.ObjTieuChi_BAOCAO.listChiBaoC = JSON.parse($scope.ObjTieuChi_BAOCAO.ChiBaoC)


                if ($scope.item.Id == null || $scope.item.Id == 0) {
                    let filterDGTieuChi = {
                        IdKeHoach: $scope.ItemKeHoachDGN.Id,
                        IdTieuChi: Id
                    }
                    $http({
                        method: 'POST',
                        url: 'api/DanhGiaTieuChiKHDGN/Filter',
                        data: filterDGTieuChi
                    }).then(function successCallback(response) {
                        if (response.data.ListOut != null && response.data.ListOut.length > 0) {
                            let ItemDGTieuChi = response.data.ListOut[0]
                            let ItemDGTieuChiEdit = $scope.ListTieuChis.find(s => s.Id == filterDGTieuChi.IdTieuChi)
                            if (ItemDGTieuChiEdit != null) {
                                ItemDGTieuChiEdit.DiemManh = ItemDGTieuChi.DiemManh;
                                ItemDGTieuChiEdit.DiemYeu = ItemDGTieuChi.DiemYeu;
                                ItemDGTieuChiEdit.NoiDungCanBoSung = ItemDGTieuChi.NoiDungCanBoSung;
                                ItemDGTieuChiEdit.KQDatMuc = ItemDGTieuChi.KQDatMuc
                            }
                        }
                    }, function errorCallback(response) {
                        toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
                    });
                }

                //$scope.LoadPhieuDanhGia();
            }


        }

        //end load tieu chuan tieu chi



        //Load Phieu  danh gia

        $scope.filterPhieuDG = {
            //IdKeHoach:0,
            //IdTieuChi:0,
            //UserName:'',
            PhanLoaiDanhGia: 'TIEUCHI'
        }
        $scope.LoadPhieuDanhGia = function () {
            $scope.ItemPhieu = {}
            if ($scope.filterPhieuDG.UserName == null && $scope.filterPhieuDG.PhanLoaiDanhGia == 'SOBO')
                return;

            if (($scope.filterPhieuDG.UserName == null || $scope.filterPhieuDG.IdTieuChi == null) && $scope.filterPhieuDG.PhanLoaiDanhGia == 'TIEUCHI')
                return;

            $scope.filterPhieuDG.IdKeHoach = $scope.ItemKeHoachDGN.Id

            let api = ''
            if ($scope.filterPhieuDG.PhanLoaiDanhGia == 'TIEUCHI') {
                api = 'api/DanhGiaTieuChiKHDGN/Filter'
            }
            if ($scope.filterPhieuDG.PhanLoaiDanhGia == 'SOBO') {
                api = 'api/BaoCaoSoBo/Filter'
            }
            if ($scope.filterPhieuDG.PhanLoaiDanhGia == 'KQKS') {
                $scope.ItemPhieu = $scope.ItemKQKS
                return
            }
            $http({
                method: 'POST',
                url: api,
                data: $scope.filterPhieuDG
            }).then(function successCallback(response) {
                if (response.data.ListOut != null && response.data.ListOut.length > 0) {
                    $scope.ItemPhieu = response.data.ListOut[0]
                    $scope.ItemPhieu.KQChiBaoObj = $scope.ItemPhieu.KQChiBao != null ? JSON.parse($scope.ItemPhieu.KQChiBao) : $scope.ObjTieuChi.listChiBaoA
                }
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });

        }

        $scope.LoadPhieuTuDanhGia = function (IdKHTDG) {
            $http({
                method: 'GET',
                url: 'api/DanhGiaTieuChiKHDGN/GetDGTieuChiTDG',
                params: {
                    IdKeHoachTDG: IdKHTDG,
                    IdTieuChi: 0
                }
            }).then(function successCallback(response) {
                $scope.ListPhieuTCTCKHTDG = response.data
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
        }
        //end Load Phieu danh gia

        //Load  Ket qua khao sat
        $scope.LoadKQKhaoSat = function () {
            $scope.ItemKQKS = {}

            $http({
                method: 'GET',
                url: 'api/KQKhaoSat/GetByIdKeHoach',
                params: {
                    IdKeHoach: $scope.ItemKeHoachDGN.Id,
                }
            }).then(function successCallback(response) {
                $scope.ItemKQKS = response.data

                $scope.ItemKQKS.KQDatMuc = $scope.ItemKQKS.KQDatMuc + ''
                if ($scope.ItemKQKS.KQChiBao != null) {
                    let KQChiBaoObj = JSON.parse($scope.ItemKQKS.KQChiBao)
                    $scope.ListTieuChuanTieuChis.map(s => {
                        let objTieuChi = KQChiBaoObj.find(x => x.IdTieuChi == s.Id)
                        if (objTieuChi != null && s.IdTieuChuan != null)
                            Object.assign(s, objTieuChi)
                    })
                }

            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
        }
        //end  Ket qua khao sat



        //Load  Ket qua khao sat
        $scope.LoadBaoCaoDGN = function () {
            $scope.item = {}

            $http({
                method: 'GET',
                url: 'api/BaoCaoDGN/GetByIdKeHoach',
                params: {
                    IdKeHoach: $scope.ItemKeHoachDGN.Id,
                }
            }).then(function successCallback(response) {
                $scope.item = response.data
                $scope.config.readOnly = $scope.item != null && !$scope.CheckView($scope.item, 'EDIT')
                if ($scope.item.DanhGiaTieuChi != null) {
                    let DanhGiaTieuChiObj = JSON.parse($scope.item.DanhGiaTieuChi)
                    $scope.ListTieuChis.map(s => {
                        let objTieuChi = DanhGiaTieuChiObj.find(x => x.IdTieuChi == s.Id)
                        if (objTieuChi != null && s.IdTieuChuan != null)
                            Object.assign(s, objTieuChi)
                    })
                }
                if ($scope.item.DanhGiaTieuChuan != null) {
                    let DanhGiaTieuChuanObj = JSON.parse($scope.item.DanhGiaTieuChuan)
                    $scope.TieuChuans.map(s => {
                        let objTieuChuan = DanhGiaTieuChuanObj.find(x => x.IdTieuChiuan == s.Id)
                        if (objTieuChuan != null && s.objTieuChuan != null)
                            Object.assign(s, objTieuChuan)
                    })
                }
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
        }
        //end  Ket qua khao sat




        //Load Danh muc
        $scope.PhanLoaiDanhGias = [
            {
                Code: 'SOBO', Ten: 'Báo cáo sơ bộ'
            },
            {
                Code: 'TIEUCHI', Ten: 'Đánh giá tiêu chí'
            }
            ,
            {
                Code: 'KQKS', Ten: 'Kết quả khảo sát'
            }
        ]
        $scope.LoadDonVi = function () {
            $http({
                method: 'GET',
                url: 'api/Base/GetDMDonVi',
                params: {
                    PhanLoai: '',
                    SearchKey: ''
                }
            }).then(function successCallback(response) {
                $scope.DonVis = response.data
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
        }
        $scope.LoadDonVi();
        ComponentsSelect2.init();

        $scope.TrangThaiKHDGNs = [FactoryConstant.DA_LAP_KE_HOACH_NGOAI, FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI, FactoryConstant.DANG_DUNG_KE_HOACH_NGOAI, FactoryConstant.HOAN_THANH_KE_HOACH_NGOAI,]
        $scope.TrangThaiBaoCaos = [FactoryConstant.DANG_SOAN, FactoryConstant.HOAN_THANH]
        //End Load Danh muc


        //Xu ly update baocao

        $scope.InitSaveDanhGiaTieuChi = function () {
            return $scope.ListTieuChis.reduce(function (rs, obj, index) {
                let o = {
                    IdTieuChi: obj.Id,
                    DiemManh: obj.DiemManh,
                    DiemYeu: obj.DiemYeu,
                    KeHoachCaiTien: obj.KeHoachCaiTien,
                    NoiDungCanBoSung: obj.NoiDungCanBoSung,
                    KQDatMuc: obj.KQDatMuc,
                    DiemManhCoBan: obj.DiemManhCoBan,
                    DiemYeuCoBan: obj.DiemYeuCoBan,
                    KienNghi: obj.KienNghi,
                }
                rs.push(o)
                return rs;
            }, []);
        }
        $scope.InitSaveDanhGiaTieuChuan = function () {
            return $scope.TieuChuans.reduce(function (rs, obj, index) {
                let o = {
                    IdTieuChuan: obj.Id,
                    DiemManhCoBan: obj.DiemManhCoBan,
                    DiemYeuCoBan: obj.DiemYeuCoBan,
                    KienNghi: obj.KienNghi,
                }
                rs.push(o)
                return rs;
            }, []);
        }
        $scope.SaveModal = function () {
            $scope.item.DanhGiaTieuChi = JSON.stringify($scope.InitSaveDanhGiaTieuChi())
            $scope.item.DanhGiaTieuChuan = JSON.stringify($scope.InitSaveDanhGiaTieuChuan())
            $http({
                method: 'POST',
                url: 'api/BaoCaoDGN/Save',
                data: $scope.item
            }).then(function successCallback(response) {
                $scope.itemError = "";
                toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
                $scope.item.Id = response.data.Id

            }, function errorCallback(response) {
                $scope.itemError = response.data;
                if ($scope.itemError.ModelState)
                    toastr.error('Có lỗi xảy ra trong quá trình cập nhật dữ liệu !', 'Thông báo');
                else
                    toastr.error('Có lỗi xảy ra! ' + $scope.itemError.Message, 'Thông báo');
            });

        }

        $scope.CheckView = function (item, type) {
            switch (type) {

                case "EDIT":
                    return $scope.ItemKeHoachDGN.TrangThai == FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI.FCode && item != null && item.IsBaoCao == true
                    break;
                default:
                    break;
            }
        }
        //end Xu ly update baocao


        $scope.ReturnObjFromId = function (array, id, propFrom, propTo) {
            if (array == null)
                return propTo != null ? '' : {}
            let rs = array.find(s => s[propFrom] == id)
            if (rs == null)
                return propTo != null ? '' : {}

            return propTo != null ? rs[propTo] : rs;
        }
        $scope.CheckTieuChiThuTuCuoi = function (IdTieuChuan, IdTieuChi) {

            let rs = $scope.ListTieuChuanTieuChis.filter(s => s.IdTieuChuan == IdTieuChuan).sort((a, b) => { return b.ThuTu - a.ThuTu })
            if (rs == null)
                return false
            return rs[0].Id == IdTieuChi
        }

        $scope.romanize = function (num) {
            if (isNaN(num))
                return NaN;
            var digits = String(+num).split(""),
                key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
                    "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
                    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
                roman = "",
                i = 3;
            while (i--)
                roman = (key[+digits.pop() + (i * 10)] || "") + roman;
            return Array(+digits.join("") + 1).join("M") + roman;
        }

    }]);

