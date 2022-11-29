﻿angular.module('WebApiApp').controller('TongHopBCSoBoController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', 'FactoryConstant', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, FactoryConstant) {
    var InitLoad = function () {
        $scope.TieuChuans = []
        $scope.TieuChis = []
        $scope.ItemPhieu = {}
        $scope.ItemKeHoachDGN = {}
        $scope.HoiDongDGN = []
     
        $scope.filterPhieuDG = {
          
        }
    }
    //Load hoi dong
    $scope.LoadHoiDongDGN = function (IdKeHoach) {

        $http({
            method: 'GET',
            url: 'api/HoiDongDGN/GetAll?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachDGN=' + IdKeHoach
        }).then(function successCallback(response) {

            $scope.HoiDongDGN = response.data.filter(s => s.hd.VietBCSoBo==true);
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
        if ($scope.filterPhieuDG.UserName == null )
            return;
        $scope.filterPhieuDG.IdKeHoach = $scope.ItemKeHoachDGN.Id
        $scope.ItemPhieu = {}
        let api = 'api/BaoCaoSoBo/Filter'
        //if ($scope.filterPhieuDG.PhanLoaiDanhGia == 'TIEUCHI') {
        //    api = 'api/DanhGiaTieuChiKHDGN/Filter'
        //}
        //if ($scope.filterPhieuDG.PhanLoaiDanhGia == 'SOBO') {
        //    api = 'api/BaoCaoSoBo/Filter'
        //}
        $http({
            method: 'POST',
            url: api,
            data: $scope.filterPhieuDG
        }).then(function successCallback(response) {
            if (response.data.ListOut != null && response.data.ListOut.length > 0) {
                $scope.ItemPhieu = response.data.ListOut[0]
               // $scope.ItemPhieu.KQChiBaoObj = $scope.ItemPhieu.KQChiBao != null ? JSON.parse($scope.ItemPhieu.KQChiBao) : $scope.ObjTieuChi.listChiBaoA
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
    $scope.OpenModalKeHoachDGN = function (item, type) {
        $scope.modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            animation: true,
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views-client/template/KeHoachDGN/ModalKeHoachDGN.html?bust=' + Math.random().toString(36).slice(2),
            controller: 'ModalViewKeHoachDGN',
            controllerAs: 'vm',
            scope: $scope,
            backdrop: 'static',
            size: 'full',
            index: 10000,
            resolve: {
                item: function () { return item },
                type: function () { return type },
            }
        });

    };

    $scope.OpenModalBaoCaoSoBo = function (item, type) {
        $scope.modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            animation: true,
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views-client/template/BaoCaoDGN/BaoCaoSoBo/ModalBCSoBo.html?bust=' + Math.random().toString(36).slice(2),
            controller: 'ModalBaoCaoSoBo',
            controllerAs: 'vm',
            scope: $scope,
            backdrop: 'static',
            size: 'full',
            index: 10000,
            resolve: {
                item: function () { return item },
                type: function () { return type },
            }
        });

    };


    //lap bao cao sobo
  

    $scope.LoadTemplate = function () {
        setTimeout(function () {

            if (!$scope.item.NhanXetHinhThuc)
                $scope.item.NhanXetHinhThuc = $('#TemplateNhanXetHinhThuc').html();
            if (!$scope.item.NhanXetNoiDung)
                $scope.item.NhanXetNoiDung = $('#TemplateNhanXetNoiDung').html();
            $scope.$apply();

        }, 500)

    };

    $scope.LoadBaoCao = function (IdKeHoach) {
        $scope.item = {}
        $http.get("api/BaoCaoSoBo/GetByIdKeHoach?IdKeHoach=" + IdKeHoach).then(function (rs) {
           

            if (rs.data != null) {
                $scope.item = rs.data
                if ($scope.item.Id == null || $scope.item.Id == 0) {
                    $scope.LoadTemplate();
                }
            }
        })


    }
    //end lap bao cao so bo


    

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

    //  $scope.FactoryConstant = FactoryConstant;
    $scope.TrangThaiKHDGNs = [FactoryConstant.DA_LAP_KE_HOACH_NGOAI, FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI, FactoryConstant.DANG_DUNG_KE_HOACH_NGOAI, FactoryConstant.HOAN_THANH_KE_HOACH_NGOAI,]
    $scope.TrangThaiBaoCaos = [FactoryConstant.DANG_SOAN, FactoryConstant.HOAN_THANH]


    $scope.CheckView = function (item, type) {
        switch (type) {
            case "HOANTHANH":
                return item.Id != null && (item.TrangThai == FactoryConstant.DANG_SOAN.FCode)
                break;
            case "EDIT":
                return  item.TrangThai != FactoryConstant.HOAN_THANH.FCode
                break;
            default:
                break;
        }
    }

    $scope.ConfirmAction = function (typeUpdate) {
        switch (typeUpdate) {
            case "HOANTHANH":
                if (!confirm("Bạn có chắc chắn muốn hoàn thành báo cáo?")) {
                    return false;
                }
                break;
        }
        return true
    }
   

    $scope.config = {
        readOnly: $scope.item != null && !$scope.CheckView($scope.item, 'EDIT'),
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
 }]);


angular.module('WebApiApp').controller("ModalViewKeHoachDGN", function ($rootScope, $scope, $http, $uibModalInstance, FactoryConstant, $uibModal) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;

    $scope.NguonLucDB = $scope.item.NguonLuc;
    $scope.IdQuyDinhDB = $scope.item.IdQuyDinhTC;
    //$scope.LoadTemplate = function () {
    //    setTimeout(function () {

    //        if (!$scope.item.MucDich)
    //            $scope.item.MucDich = $('#TemplateMucDich').html();
    //        if (!$scope.item.NghienCuuHSDG)
    //            $scope.item.NghienCuuHSDG = $('#TemplateNoiDung').html();
    //        if (!$scope.item.KhaoSatSoBo)
    //            $scope.item.KhaoSatSoBo = $('#TemplateNoiDung').html();
    //        if (!$scope.item.KhaoSatChinhThuc)
    //            $scope.item.KhaoSatChinhThuc = $('#TemplateNoiDung').html();
    //        if (!$scope.item.DuThaoBaoCao)
    //            $scope.item.DuThaoBaoCao = $('#TemplateNoiDung').html();
    //        if (!$scope.item.LayYKienPhanHoi)
    //            $scope.item.LayYKienPhanHoi = $('#TemplateNoiDung').html();
    //        if (!$scope.item.HoanThienBaoCao)
    //            $scope.item.HoanThienBaoCao = $('#TemplateNoiDung').html();

    //        $scope.$apply();

    //    }, 500)

    //};

    $scope.OnLoad = function () {
        if ($scope.type == "KeHoachTDG") {

            if ($scope.item.IdKeHoachDGN == null) {
                $scope.itemKHTDG = $scope.item;
                $scope.item = {}
                $scope.item.NoiDung = "Kế hoạch làm việc của đoàn đánh giá ngoài " + $scope.itemKHTDG.DonViName;
                $scope.item.KeHoachTDGName = $scope.itemKHTDG.KeHoachTDGName;
                $scope.item.DonViName = $scope.itemKHTDG.DonViName;
                $scope.item.IdTruong = $scope.itemKHTDG.IdDonVi;
                $scope.item.IdKeHoachTDG = $scope.itemKHTDG.Id;
                $scope.item.TrangThai = FactoryConstant.DA_LAP_KE_HOACH_NGOAI.FCode;
                $scope.item.IdDonVi = $rootScope.CurDonVi.Id;
                $scope.item.FInUse = true;
                $scope.LoadTemplate();
            } else {
                $scope.item = {}
                let filterKHDGN = {
                    GetAll: true,
                    IdKeHoach: $scope.item.IdKeHoachDGN
                }
                $scope.ServiceLoadKeHoachDGN(filterKHDGN).then(function successCallback(response) {
                    $scope.item = response.data.ListOut[0]
                })
            }

        }
    }
    $scope.OnLoad()

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    $scope.config = {
        readOnly: true,
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

   

});
