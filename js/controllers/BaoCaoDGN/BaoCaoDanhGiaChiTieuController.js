﻿angular.module('WebApiApp').
    controller('BaoCaoDanhGiaChiTieuController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', 'FactoryConstant', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, FactoryConstant) {
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
            $scope.ThanhVienDGNs = []
            //$scope.filterKeHoachDGN = {
            //    GetAll: true,
            //};
            $scope.filterTCTC = {
                type: 'KHDGN_MYTC'
            }
            $scope.filterPhieuDG = {
               // PhanLoaiDanhGia: 'TIEUCHI'
            }
        }
        //Filter danh sach ke hoach ngoai
        $scope.onChangeKeHoach = function (Id) {
            if (Id == null || Id == 0) {
                $scope.filterTCTC.IdKeHoach = 0;
                InitLoad()
                return;
            }
            $scope.ItemKeHoachDGN = $scope.KeHoachDGN.find(s => s.Id == Id)
            $scope.config.readOnly = $scope.item != null && !$scope.CheckView($scope.item, 'EDIT')
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
                    //$scope.config.readOnly = $scope.item != null && !$scope.CheckView($scope.item, 'EDIT')
                    $scope.LoadTCTC()
                }
              
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }
        $scope.LoadKeHoachDGN();
        //end Filter danh sach ke hoach ngoai

        //Load Tieu chuan tieu chi

        $scope.filterTCTC = {
            //IdKeHoach: $scope.item.Id,
            type: 'KHDGN_MYTC'
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
                $scope.item = {}
                $scope.TieuChuanTieuChis = rs.data
                $scope.TieuChuans = rs.data.map(s => { return s.tchuan })

            })
        }

        //Load Thông tin bổ sung tiêu chí - mục 4
        $scope.LoadTTBoSungTieuChi = function () {
            $scope.BoSungTC = {
                IdDonVi: $rootScope.CurDonVi.Id,
                IdKeHoachDGN: $scope.ItemKeHoachDGN.Id != 0 ? $scope.ItemKeHoachDGN.Id : 0,
                IdTieuChi: $scope.filterPhieuDG.IdTieuChi != null && $scope.filterPhieuDG.IdTieuChi != 0 ? $scope.filterPhieuDG.IdTieuChi : 0,
                ArrMC: [],
                ChuaDG: false,
                ChuaDGDung: false,
                ChuaDGDayDu: false,
                MCKiemTra: [],
                MCBoSung: [],
                DoiTuongPV: null,
                SoLuong: null,
                NoiDungPV: null
            };

            $http({
                method: 'GET',
                url: 'api/KetQuaNghienCuuDGN/LoadKQNghienCuuTieuChiDGN',
                params: {
                    IdKeHoachDGN: $scope.ItemKeHoachDGN.Id != 0 ? $scope.ItemKeHoachDGN.Id : 0,
                    IdTieuChi: $scope.filterPhieuDG.IdTieuChi != null && $scope.filterPhieuDG.IdTieuChi != 0 ? $scope.filterPhieuDG.IdTieuChi : 0,
                    IdDonVi: $rootScope.CurDonVi.Id
                }
            }).then(function successCallback(response) {
                if (response.data) {
                    $scope.BoSungTC = response.data;
                    if ($scope.BoSungTC.MCKiemTra)
                        $scope.BoSungTC.MCKiemTra = JSON.parse($scope.BoSungTC.MCKiemTra)
                    if ($scope.BoSungTC.MCBoSung)
                        $scope.BoSungTC.MCBoSung = JSON.parse($scope.BoSungTC.MCBoSung)
                }
                $scope.LoadMinhChungByTieuChi();
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });

        }

        //Load minh chứng theo tiêu chí
        $scope.LoadMinhChungByTieuChi = function () {

            $http({
                method: 'GET',
                url: 'api/KetQuaNghienCuuDGN/LoadMinhChung',
                params: {
                    IdKeHoachTDG: $scope.ItemKeHoachDGN.IdKeHoachTDG != 0 ? $scope.ItemKeHoachDGN.IdKeHoachTDG : 0,
                    IdTieuChi: $scope.filterPhieuDG.IdTieuChi != null && $scope.filterPhieuDG.IdTieuChi != 0 ? $scope.filterPhieuDG.IdTieuChi : 0
                }
            }).then(function successCallback(response) {

                $scope.BoSungTC.ArrMC = response.data;
                angular.forEach($scope.BoSungTC.ArrMC, function (value, key) {
                    
                    if ($scope.BoSungTC.MCKiemTra && $scope.BoSungTC.MCKiemTra.includes(value.Id))
                        value.KTLai = true;

                    if ($scope.BoSungTC.MCBoSung && $scope.BoSungTC.MCBoSung.includes(value.Id))
                        value.BoSung = true;
                });

            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });

        }

        $scope.SaveBoSungTC = function () {
            $scope.BoSungTC.MCKiemTra = JSON.stringify($scope.BoSungTC.ArrMC.filter(x => x.KTLai).map(x => x.Id))
            $scope.BoSungTC.MCBoSung = JSON.stringify($scope.BoSungTC.ArrMC.filter(x => x.BoSung).map(x => x.Id))
            
            $http({
                method: 'POST',
                url: 'api/KetQuaNghienCuuDGN/SaveBoSungTC',
                data: $scope.BoSungTC
            }).then(function successCallback(response) {

                toastr.success('Lưu dữ liệu thành công !', 'Thông báo');

            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
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
                $scope.LoadPhieuTuDanhGia();
                $scope.LoadTTBoSungTieuChi();
            }


        }

        //end load tieu chuan tieu chi
        //Load Phieu danh gia chi tieu
        $scope.filterPhieuDG = {}
        $scope.LoadPhieuDanhGia = function () {
            $scope.item = {}
            $scope.filterPhieuDG.IdKeHoach = $scope.ItemKeHoachDGN.Id
            let configGetPhieuDG = {
                params: $scope.filterPhieuDG
            }
            $http({
                method: 'GET',
                url: 'api/DanhGiaTieuChiKHDGN/GetByIdKeHoach',
                params: $scope.filterPhieuDG
            }).then(function successCallback(response) {
                $scope.item = response.data
                $scope.config.readOnly = $scope.item != null && !$scope.CheckView($scope.item, 'EDIT')
                $scope.item.KQChiBaoObj = $scope.item.KQChiBao != null ? JSON.parse($scope.item.KQChiBao) : $scope.ObjTieuChi.listChiBaoA

            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });

        }
        //end Load Phieu danh gia chi tieu
        //Load Phieu Tu danh gia chi tieu
        $scope.LoadPhieuTuDanhGia = function () {
            $scope.ItemPhieu = {}
            let paramPhieus = {
                IdKeHoach: $scope.ItemKeHoachDGN.IdKeHoachTDG != 0 ? $scope.ItemKeHoachDGN.IdKeHoachTDG : 0,
                IdTieuChi: $scope.filterPhieuDG.IdTieuChi != null && $scope.filterPhieuDG.IdTieuChi != 0 ? $scope.filterPhieuDG.IdTieuChi : 0,
                IdDonVi: 0
            }
            $http({
                method: 'GET',
                url: 'api/DanhGiaTieuChi/GetByIdKeHoach',
                params: paramPhieus
            }).then(function successCallback(response) {

                if (response.data != null && response.data != '' && response.data.length > 0) {
                    $scope.ItemPhieu = response.data[0]
                    let tieuchi = $scope.TieuChis.find(s => s.Id == $scope.filterPhieuDG.IdTieuChi)
                    $scope.ItemPhieu.TieuChiName = tieuchi != null ? tieuchi.NoiDung : ''
                }


            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });

        }
        //end Load Phieu Tu danh gia chi tieu

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

        $scope.checkKQDatMuc = function () {
            return $scope.item.KQDatC ? 3 : $scope.item.KQDatB ? 2 : $scope.item.KQDatA ? 1 : 0;
        }
        $scope.SaveModal = function () {
            $scope.item.KQDatMuc = $scope.checkKQDatMuc();
            //if ($scope.item.KQDatC)
            $scope.item.KQChiBao = JSON.stringify($scope.item.KQChiBaoObj)
            $http({
                method: 'POST',
                url: 'api/DanhGiaTieuChiKHDGN/Save',
                data: $scope.item
            }).then(function successCallback(response) {
                $scope.itemError = "";
                $scope.item.Id = response.data.Id;

                $scope.SaveBoSungTC();
                    

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
                    return $scope.ItemKeHoachDGN.TrangThai == FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI.FCode
                    break;
                default:
                    break;
            }
        }


    }]);

