﻿angular.module('WebApiApp').controller('BaoCaoSoBoController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', 'FactoryConstant', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, FactoryConstant) {
    $scope.ItemKeHoachDGN = {}
    //Filter danh sach ke hoach ngoai
    $scope.ServiceLoadKeHoachDGN = function (data) {
        return $http.post("api/KeHoachDGN/FilterKHDGN", data)
    }
    $scope.filterKeHoachDGN = {
        GetAll: true,
        IsThanhVien: true
    };
    $scope.LoadKeHoachDGN = function () {
        $scope.item = {}
        $scope.KeHoachDGN = []
        $scope.ItemKeHoachDGN = {}
        $scope.IsBaoCao = null
        if ($scope.filterKeHoachDGN.IdTruong == null)
            return
        $scope.ServiceLoadKeHoachDGN($scope.filterKeHoachDGN).then(function successCallback(response) {
            $scope.KeHoachDGN = response.data.ListOut;
            if (response.data.ListOut != null && response.data.ListOut.length > 0) {
                $scope.ItemKeHoachDGN = $scope.KeHoachDGN[0]
                $scope.ItemKeHoachDGN.Id = $scope.ItemKeHoachDGN.Id + ''
                $http.get("api/BaoCaoSoBo/GetByIdKeHoach?IdKeHoach=" + $scope.ItemKeHoachDGN.Id).then(function (rs) {
                    if (rs.data != null) {
                        if (!rs.data.IsBaoCao) {
                            $scope.IsBaoCao = false
                           // confirm("Bạn không được phân quyền viết báo cáo sơ bộ!")
                            return;
                        }
                        $scope.IsBaoCao = true

                        $scope.item = rs.data

                        $scope.config.readOnly = $scope.item != null && !$scope.CheckView($scope.item, 'EDIT')
                        if ($scope.item.Id == null || $scope.item.Id == 0) {
                            $scope.LoadTemplate();
                        }
                    }
                })
            }
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    // $scope.LoadKeHoachDGN();
    $scope.onCancelKeHoachDGN = function () {
        $scope.filterKeHoachDGN = {
            GetAll: true,
            IsThanhVien: true,
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
        $scope.ItemKeHoachDGN = $scope.KeHoachDGN.find(s => s.Id == IdKeHoach)
        $http.get("api/BaoCaoSoBo/GetByIdKeHoach?IdKeHoach=" + IdKeHoach).then(function (rs) {
            if (rs.data != null) {
                if (!rs.data.IsBaoCao) {
                    confirm("Bạn không được phân quyền viết báo cáo sơ bộ!")
                    return;
                }
               
                $scope.item = rs.data

                $scope.config.readOnly = $scope.item != null && !$scope.CheckView($scope.item, 'EDIT')
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
            if ($scope.DonVis != null && $scope.DonVis != '' && $scope.DonVis.length > 0) {
                let indexTruong = $scope.DonVis.findIndex(s => s.LoaiDonVi == 'TRUONG')
                if (indexTruong > -1) {
                    $scope.filterKeHoachDGN.IdTruong = $scope.DonVis[indexTruong].Id + ''
                    $scope.onSearchKeHoachDGN()
                }
            }
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


    //$scope.CheckView = function (item, type) {
    //    switch (type) {
    //        case "HOANTHANH":
    //            return item.Id != null && (item.TrangThai == FactoryConstant.DANG_SOAN.FCode)
    //            break;
    //        case "EDIT":
    //            return  item.TrangThai != FactoryConstant.HOAN_THANH.FCode
    //            break;
    //        default:
    //            break;
    //    }
    //}
    $scope.CheckView = function (item, type) {
        switch (type) {

            case "EDIT":
                return $scope.ItemKeHoachDGN.TrangThai == FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI.FCode && item != null && item.IsBaoCao == true
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
    $scope.SaveModal = function (typeUpdate) {
        if (!$scope.ConfirmAction(typeUpdate)) {
            return
        }
        switch (typeUpdate) {
            case "HOANTHANH":
                $scope.item.TrangThai = FactoryConstant.HOAN_THANH_KE_HOACH_NGOAI.FCode
                break;
        }
        $http({
            method: 'POST',
            url: 'api/BaoCaoSoBo/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item.Id = response.data.Id
            $scope.itemError = "";
            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
        }, function errorCallback(response) {
            $scope.itemError = response.data;
            if ($scope.itemError.ModelState)
                toastr.error('Có lỗi xảy ra trong quá trình cập nhật dữ liệu !', 'Thông báo');
            else
                toastr.error('Có lỗi xảy ra! ' + $scope.itemError.Message, 'Thông báo');
        });

    }
    $scope.config = {
        // readOnly: $scope.item != null && !$scope.CheckView($scope.item, 'EDIT'),
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

