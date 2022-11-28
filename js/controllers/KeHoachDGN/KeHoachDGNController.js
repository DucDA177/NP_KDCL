angular.module('WebApiApp').controller('KeHoachDGNController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', 'FactoryConstant', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, FactoryConstant) {
    // Filter danh sach ke hoach Tu danh gia
    $scope.ServiceLoadKeHoachTDG = function (data) {
        return $http.post("api/KeHoachTDG/FilterKeHoachTDG", data)
    }
    $scope.filterKeHoachTDG = {
        GetAll: true,
        ChuyenKeHoach: true,
    };
    $scope.LoadKeHoachTDG = function () {
        $scope.ServiceLoadKeHoachTDG($scope.filterKeHoachTDG).then(function successCallback(response) {

            $scope.KeHoachTDG = response.data.ListOut;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $scope.LoadKeHoachTDG();
    $scope.onCancelKeHoachTDG = function () {
        $scope.filterKeHoachTDG = {
            GetAll: true,
            ChuyenKeHoach: true,
        };
        $scope.LoadKeHoachTDG();
        $('.filter-select').val(null).trigger("change.select2");
    };
    $scope.onSearchKeHoachTDG = function () {
        $scope.LoadKeHoachTDG();
    };
    //end Filter danh sach ke hoach Tu danh gia

    //Filter danh sach ke hoach ngoai
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
    $scope.onCancelKeHoachDGN = function () {
        $scope.filterKeHoachDGN = {
            GetAll: true,
        };
        $scope.LoadKeHoachDGN();
        $('.filter-select').val(null).trigger("change.select2");
    };
    $scope.onSearchKeHoachDGN = function () {
        $scope.LoadKeHoachDGN();
    };
    //end Filter danh sach ke hoach ngoai
    $scope.OpenModalKeHoachDGN = function (item, type) {
        $scope.modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            animation: true,
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views-client/template/KeHoachDGN/ModalKeHoachDGN.html?bust=' + Math.random().toString(36).slice(2),
            controller: 'ModalKeHoachDGN',
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
    $scope.OpenDetailKeHoachTDG = function (item, type) {
        $scope.modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            animation: true,
            ariaDescribedBy: 'modal-body',
            templateUrl: 'views-client/template/KeHoachDGN/DetailKeHoachTDG.html?bust=' + Math.random().toString(36).slice(2),
            controller: 'DetailKeHoachTDGHandlerController',
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


    $scope.Del = function (item) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/KeHoachDGN/Del?Id=' + item.Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $scope.LoadKeHoachDGN();
                $scope.LoadKeHoachTDG();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }
    $scope.LoadDonVi = function () {
        $http({
            method: 'GET',
            url: 'api/Base/GetDMDonVi',
            params: {
                PhanLoai: 'TRUONG',
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


    $scope.CheckView = function (item, type) {
        switch (type) {
            case "TAOKHDGN":
                return item.IdKeHoachDGN == null && !item.ViewOnly
                break;
            case "VIEWKHDGN":
                return item.IdKeHoachDGN != null && !item.ViewOnly
                break;
            case "BATDAUKHDGN":
                return item.Id != null && (item.TrangThai == FactoryConstant.DA_LAP_KE_HOACH_NGOAI.FCode || item.TrangThai == FactoryConstant.DANG_DUNG_KE_HOACH_NGOAI.FCode)
                break;
            case "TAMDUNGKHDGN":
                return item.Id != null && (item.TrangThai == FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI.FCode)
                break;
            case "HOANTHANHKHDGN":
                return item.Id != null && (item.TrangThai == FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI.FCode)
                break;
           case "EDITKHDGN":
                return item.TrangThai != FactoryConstant.HOAN_THANH_KE_HOACH_NGOAI.FCode
                break;
            default:
                break;
        }
    }

    $scope.ConfirmAction = function (typeUpdate) {
        switch (typeUpdate) {
            case "BATDAU":
                if (!confirm("Bạn có chắc chắn muốn bắt đầu kế hoạch?")) {
                    return false;
                }
                break;
            case "TAMDUNG":
                if (!confirm("Bạn có chắc chắn muốn dừng kế hoạch?")) {
                    return false;
                }
                break;
            case "HOANTHANH":
                if (!confirm("Bạn có chắc chắn muốn hoàn thành kế hoạch?")) {
                    return false;
                }
                break;
               
        }
        return true
    }
    $scope.UpdateTrangThaiKH = function (item, typeUpdate) {
        if (!$scope.ConfirmAction(typeUpdate)) {
            return
        }
        switch (typeUpdate) {
            case "BATDAU":
                item.TrangThai = FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI.FCode
                break;
            case "TAMDUNG":
                item.TrangThai = FactoryConstant.DANG_DUNG_KE_HOACH_NGOAI.FCode
                break;
            case "HOANTHANH":
                item.TrangThai = FactoryConstant.HOAN_THANH_KE_HOACH_NGOAI.FCode
                break;
        }
        $http({
            method: 'POST',
            url: 'api/KeHoachDGN/Save',
            data: item
        }).then(function successCallback(response) {
            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
            $scope.LoadKeHoachDGN();
            $scope.LoadKeHoachTDG();

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            if ($scope.itemError.ModelState)
                toastr.error('Có lỗi xảy ra trong quá trình cập nhật dữ liệu !', 'Thông báo');
            else
                toastr.error('Có lỗi xảy ra! ' + $scope.itemError.Message, 'Thông báo');
        });

    }
}]);


angular.module('WebApiApp').controller("ModalKeHoachDGN", function ($rootScope, $scope, $http, $uibModalInstance, FactoryConstant, $uibModal) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;

    $scope.NguonLucDB = $scope.item.NguonLuc;
    $scope.IdQuyDinhDB = $scope.item.IdQuyDinhTC;
    $scope.LoadTemplate = function () {
        setTimeout(function () {

            if (!$scope.item.MucDich)
                $scope.item.MucDich = $('#TemplateMucDich').html();
            if (!$scope.item.NghienCuuHSDG)
                $scope.item.NghienCuuHSDG = $('#TemplateNoiDung').html();
            if (!$scope.item.KhaoSatSoBo)
                $scope.item.KhaoSatSoBo = $('#TemplateNoiDung').html();
            if (!$scope.item.KhaoSatChinhThuc)
                $scope.item.KhaoSatChinhThuc = $('#TemplateNoiDung').html();
            if (!$scope.item.DuThaoBaoCao)
                $scope.item.DuThaoBaoCao = $('#TemplateNoiDung').html();
            if (!$scope.item.LayYKienPhanHoi)
                $scope.item.LayYKienPhanHoi = $('#TemplateNoiDung').html();
            if (!$scope.item.HoanThienBaoCao)
                $scope.item.HoanThienBaoCao = $('#TemplateNoiDung').html();

            $scope.$apply();

        }, 500)

    };

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
        readOnly: !$scope.CheckView($scope.item, 'EDITKHDGN'),
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

    $scope.SaveModal = function (typeUpdate) {
        if (!$scope.ConfirmAction(typeUpdate)) {
            return
        }
        switch (typeUpdate) {
            case "BATDAU":
                $scope.item.TrangThai = FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI.FCode
                break;
            case "TAMDUNG":
                $scope.item.TrangThai = FactoryConstant.DANG_DUNG_KE_HOACH_NGOAI.FCode
                break;
            case "HOANTHANH":
                $scope.item.TrangThai = FactoryConstant.HOAN_THANH_KE_HOACH_NGOAI.FCode
                break;
        }
        $http({
            method: 'POST',
            url: 'api/KeHoachDGN/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
            $scope.LoadKeHoachDGN();
            $scope.LoadKeHoachTDG();
            $scope.cancelModal();

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            if ($scope.itemError.ModelState)
                toastr.error('Có lỗi xảy ra trong quá trình cập nhật dữ liệu !', 'Thông báo');
            else
                toastr.error('Có lỗi xảy ra! ' + $scope.itemError.Message, 'Thông báo');
        });

    }

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $scope.LoadTemplate();
    });

});

//Hội đồng

angular.module('WebApiApp').controller("DetailKeHoachTDGHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $uibModal) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.NguonLucDB = $scope.item.NguonLuc;
    $scope.IdQuyDinhDB = $scope.item.IdQuyDinhTC;



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





    $scope.LoadListTCTC = function () {

        $http({
            method: 'GET',
            url: 'api/NhomCongTac/LoadTieuChuanTieuChi?idNhom=0&idQuyDinh=' + $scope.item.IdQuyDinhTC
                + '&idKeHoachTDG=' + $scope.item.Id
        }).then(function successCallback(response) {

            $scope.ListTCTC = response.data.filter(x => x.LoaiDuLieu == 2);
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    };



    if ($scope.type == "KeHoachDGN") {
        let filterKHTDG = {
            GetAll: true,
            IdKeHoach: $scope.item.IdKeHoachTDG
        }
        $scope.item = {}
        $scope.ServiceLoadKeHoachTDG(filterKHTDG).then(function successCallback(response) {
            $scope.item = response.data.ListOut[0];
            $scope.item.NgayBD = new Date($scope.item.NgayBD)
            $scope.item.NgayKT = new Date($scope.item.NgayKT)
            $scope.item.ViewOnly = true
            $scope.LoadListTCTC();
            // Load danh mục trong bảng tblDanhmuc
            $scope.LoadDanhMuc('QuyDinh', 'QUYDINH', '', '', '');
        })

    } else {
        if (!$scope.item)
            $scope.item = {
                Id: 0,
                IdDonVi: $rootScope.CurDonVi.Id,
                IdQuyDinhTC: 0,
                FInUse: true,
                TrangThai: 'CTH',
                MucDich: '',
                PhamVi: '',
                CongCu: '',
                TapHuanNghiepVu: '',
                NguonLuc: '',
                ThueChuyenGia: '',
                ThoiGianHoatDong: '',
            }
        else {
            $scope.item.NgayBD = new Date($scope.item.NgayBD)
            $scope.item.NgayKT = new Date($scope.item.NgayKT)
        }
        $scope.LoadListTCTC();

        // Load danh mục trong bảng tblDanhmuc
        $scope.LoadDanhMuc('QuyDinh', 'QUYDINH', '', '', '');
    }

});
