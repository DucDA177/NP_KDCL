angular.module('WebApiApp').
    controller('KetQuaKhaoSatController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', 'FactoryConstant', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, FactoryConstant) {
        $scope.config = {
            // readOnly: !$scope.CheckView($scope.item, 'EDITKHDGN'),
            height: '300px',
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
            $scope.ItemKeHoachDGN = {}
            $scope.HoiDongDGN = []
            $scope.filterTCTC = {
                type: 'KHDGN'
            }
            $scope.filterPhieuDG = {
                PhanLoaiDanhGia: 'TIEUCHI'
            }
            $scope.ListPhieuTCTCKHTDG = []
        }
        //Load hoi dong
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
            $scope.ServiceLoadKeHoachDGN($scope.filterKeHoachDGN).then(function successCallback(response) {
                $scope.KeHoachDGN = response.data.ListOut;
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
                    rs = rs.concat([obj.tchuan], obj.tchi)
                    return rs;
                }, []);
                $scope.LoadKQKhaoSat();
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
            if ($scope.filterPhieuDG.UserName == null || ($scope.filterPhieuDG.IdTieuChi == null && $scope.filterPhieuDG.PhanLoaiDanhGia == 'TIEUCHI'))
                return;
            $scope.filterPhieuDG.IdKeHoach = $scope.ItemKeHoachDGN.Id
            $scope.ItemPhieu = {}
            let api = ''
            if ($scope.filterPhieuDG.PhanLoaiDanhGia == 'TIEUCHI') {
                api = 'api/DanhGiaTieuChiKHDGN/Filter'
            }
            if ($scope.filterPhieuDG.PhanLoaiDanhGia == 'SOBO') {
                api = 'api/BaoCaoSoBo/Filter'
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
            $scope.item = {}

            $http({
                method: 'GET',
                url: 'api/KQKhaoSat/GetByIdKeHoach',
                params: {
                    IdKeHoach: $scope.ItemKeHoachDGN.Id,
                }
            }).then(function successCallback(response) {
                $scope.item = response.data
                $scope.config.readOnly = $scope.item != null && !$scope.CheckView($scope.item, 'EDIT') 
                //console.warn('$scope.config.readOnly', $scope.config)
                $scope.item.KQDatMuc = $scope.item.KQDatMuc+''
                if ($scope.item.KQChiBao != null) {
                    let KQChiBaoObj = JSON.parse($scope.item.KQChiBao)
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




        //Load Danh muc
        $scope.PhanLoaiDanhGias = [
            {
                Code: 'SOBO', Ten: 'Báo cáo sơ bộ'
            },
            {
                Code: 'TIEUCHI', Ten: 'Đánh giá tiêu chí'
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
        //$scope.checkKQDatMuc = function () {
        //    return $scope.item.KQDatC ? 3 : $scope.item.KQDatB ? 2 : $scope.item.KQDatA ? 1 : 0;
        //}
        $scope.InitSaveKQChiBao = function () {
            return $scope.ListTieuChuanTieuChis.filter(s => s.IdTieuChuan != null).reduce(function (rs, obj, index) {
                let o = {
                    IdTieuChi: obj.Id,
                    DGN_KQDatA: obj.DGN_KQDatA,
                    DGN_KQDatB: obj.DGN_KQDatB,
                    DGN_KQDatC: obj.DGN_KQDatC
                }
                rs.push(o)
                return rs;
            }, []);
        }
        $scope.SaveModal = function () {
            $scope.item.KQChiBao = JSON.stringify($scope.InitSaveKQChiBao())
            $http({
                method: 'POST',
                url: 'api/KQKhaoSat/Save',
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
                    return $scope.ItemKeHoachDGN.TrangThai == FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI.FCode && item!=null && item.IsBaoCao==true
                    break;
                default:
                    break;
            }
        }
        //end Xu ly update baocao


        $scope.ReturnObjFromId = function (array, id, propFrom) {
            if (array == null)
                return {}
            let rs = array.find(s => s[propFrom] == id)
            if (rs == null)
                return {}
            return rs;
        }


        //xu ly tong hop tieu chi từ phiếu đnahs giá
        $scope.TongHop = function (item) {
            let obj=$scope.ListTieuChuanTieuChis.find(s => s.Id == item.IdTieuChi && s.IdTieuChuan != null)
            if (obj != null) {
                obj.DGN_KQDatA = item.KQDatA
                obj.DGN_KQDatB = item.KQDatB
                obj.DGN_KQDatC = item.KQDatC
            }
        }
    }]);

