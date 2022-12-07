angular.module('WebApiApp').
    controller('KeHoachDGNController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$timeout', 'FactoryConstant', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $timeout, FactoryConstant) {
        $scope.InDanhGia = function (item) {
            $scope.modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                animation: true,
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views-client/template/KeHoachDGN/ModalInKehoach.html?bust=' + Math.random().toString(36).slice(2),
                controller: 'ModalInKeHoachDGNController',
                controllerAs: 'vm',
                scope: $scope,
                backdrop: 'static',
                size: 'lg',
                index: 10000,
                resolve: {
                    item: function () { return item },
                }
            });
            // $scope.ItemKeHoach = item
            // $timeout(() => {
            //     $scope.exportBaoCao('PrintDiv', 'Kế hoạch đánh giá ngoài.doc', 'application/vnd.ms-word')
            // },
            //     50)
        }
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
        // $scope.LoadKeHoachTDG();
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
            IsThanhVien: true,
        };
        $scope.LoadKeHoachDGN = function () {
            if ($scope.filterKeHoachDGN.IdTruong == null) return
            $scope.ServiceLoadKeHoachDGN($scope.filterKeHoachDGN).then(function successCallback(response) {
                $scope.KeHoachDGN = response.data.ListOut;
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }
        //  $scope.LoadKeHoachDGN();
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


        $scope.CheckView = function (item, type) {
            switch (type) {
                case "TAOKHDGN":
                    return item.IdKeHoachDGN == null && !item.ViewOnly && item.TruongDoan == true
                    break;
                case "VIEWKHDGN":
                    return item.IdKeHoachDGN != null && !item.ViewOnly
                    break;
                case "BATDAUKHDGN":
                    return item.Id != null && (item.TrangThai == FactoryConstant.DA_LAP_KE_HOACH_NGOAI.FCode || item.TrangThai == FactoryConstant.DANG_DUNG_KE_HOACH_NGOAI.FCode) && item.TruongDoan == true
                    break;
                case "TAMDUNGKHDGN":
                    return item.Id != null && (item.TrangThai == FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI.FCode) && item.TruongDoan == true
                    break;
                case "HOANTHANHKHDGN":
                    return item.Id != null && (item.TrangThai == FactoryConstant.DANG_THUC_HIEN_KE_HOACH_NGOAI.FCode) && item.TruongDoan == true
                    break;
                case "EDITKHDGN":
                    return item.TrangThai != FactoryConstant.HOAN_THANH_KE_HOACH_NGOAI.FCode && item.TruongDoan == true
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

    $scope.LoadThanhVienDGN = function (objParams) {
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
    $scope.LoadTemplate = function () {
        setTimeout(function () {

            if (!$scope.item.MucDich)
                $scope.item.MucDich = $('#TemplateMucDich').html();
            $scope.$apply();

        }, 500)

    };
    var initLoad = function (item) {
        item.NghienCuuHSDGArray = []
        item.KhaoSatSoBoArray = []
        item.KhaoSatChinhThucArray = []
        item.DuThaoBaoCaoArray = []
        item.LayYKienPhanHoiArray = []
        item.HoanThienBaoCaoArray = []
        if (item.Id == null || item.Id == 0) return;
        if (item.NghienCuuHSDG != null) {
            item.NghienCuuHSDGArray = JSON.parse(item.NghienCuuHSDG)
        }
        if (item.KhaoSatSoBo != null) {
            item.KhaoSatSoBoArray = JSON.parse(item.KhaoSatSoBo)
        }
        if (item.KhaoSatChinhThuc != null) {
            item.KhaoSatChinhThucArray = JSON.parse(item.KhaoSatChinhThuc)
        }
        if (item.DuThaoBaoCao != null) {
            item.DuThaoBaoCaoArray = JSON.parse(item.DuThaoBaoCao)
        }
        if (item.LayYKienPhanHoi != null) {
            item.LayYKienPhanHoiArray = JSON.parse(item.LayYKienPhanHoi)
        }
        if (item.HoanThienBaoCao != null) {
            item.HoanThienBaoCaoArray = JSON.parse(item.HoanThienBaoCao)
        }
    }
    var initSave = function () {
        if ($scope.item.NghienCuuHSDGArray.length > 0) {
            $scope.item.NghienCuuHSDG = JSON.stringify($scope.item.NghienCuuHSDGArray)
        } else {
            $scope.item.NghienCuuHSDG = null
        }
        if ($scope.item.KhaoSatSoBoArray.length > 0) {
            $scope.item.KhaoSatSoBo = JSON.stringify($scope.item.KhaoSatSoBoArray)
        } else {
            $scope.item.KhaoSatSoBo = null
        }
        if ($scope.item.KhaoSatChinhThucArray.length > 0) {
            $scope.item.KhaoSatChinhThuc = JSON.stringify($scope.item.KhaoSatChinhThucArray)
        } else {
            $scope.item.KhaoSatChinhThuc = null
        }
        if ($scope.item.DuThaoBaoCaoArray.length > 0) {
            $scope.item.DuThaoBaoCao = JSON.stringify($scope.item.DuThaoBaoCaoArray)
        } else {
            $scope.item.DuThaoBaoCao = null
        }
        if ($scope.item.LayYKienPhanHoiArray.length > 0) {
            $scope.item.LayYKienPhanHoi = JSON.stringify($scope.item.LayYKienPhanHoiArray)
        } else {
            $scope.item.LayYKienPhanHoi = null
        }
        if ($scope.item.HoanThienBaoCaoArray.length > 0) {
            $scope.item.HoanThienBaoCao = JSON.stringify($scope.item.HoanThienBaoCaoArray)
        } else {
            $scope.item.HoanThienBaoCao = null
        }
    }


    $scope.cancelModal = function () {
        if ($scope.item.Id == null || $scope.item.Id == 0) {
            $scope.item.TrangThai = null
            $scope.item.NoiDung = null
        }

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
    var initSavePhanCong = function () {
        //s.UserName = objPhanCong.UserName;
        //s.IdTieuChi = objPhanCong.IdTieuChi;
        //s.IdPhanCong = objPhanCong.Id;
        let result = $scope.ListTieuChuanTieuChis.filter(s => s.IdTieuChuan != null).reduce(function (rs, obj, index) {
            let objPhanCong = {
                Id: obj.IdPhanCong,
                UserName: obj.UserName,
                IdTieuChi: obj.Id,
            }
            rs.push(objPhanCong)
            return rs;
        }, []);
        return result
    }
    $scope.SaveModal = function (typeUpdate) {

        if (!$scope.ConfirmAction(typeUpdate)) {
            return
        }
        initSave()
        $scope.item.ListPhanCongTCDGN = initSavePhanCong()
        $scope.item.ListThanhVien = $scope.ThanhVienDGNs.map(s => { return s.tv; })
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
            //  $scope.LoadKeHoachTDG();
            $scope.cancelModal();

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            if ($scope.itemError.ModelState)
                toastr.error('Có lỗi xảy ra trong quá trình cập nhật dữ liệu !', 'Thông báo');
            else
                toastr.error('Có lỗi xảy ra! ' + $scope.itemError.Message, 'Thông báo');
        });

    }

    $scope.UpdateNoiDung = function (type, arr, index) {
        arr == null ? arr = [] : ''
        if (type == 'ADD') {
            let obj = {}
            arr.push(obj)
        }
        if (type == 'DELETE') {
            if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này?'))
                return
            arr.splice(index, 1)
        }
        //setTimeout('')
    }

    $scope.onChangeThanhVien = function (item) {
        item.HoTenThanhVien = $scope.ThanhVienDGNs.find(s => s.us.UserName == item.ThanhVien).us.HoTen
    }

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $scope.LoadTemplate();
    });



    //Load Tieu chuan tieu chi


    $scope.LoadTCTC = function () {
        $scope.TieuChuans = []
        $scope.TieuChis = []
        if ($scope.item.IdKeHoachTDG == null)
            return
        let configGetTCTC = {
            params: {
                type: '',
                IdKeHoach: $scope.item.IdKeHoachTDG
            }
        }
        $http.get("api/KeHoachDGN/GetTCTC", configGetTCTC).then(function (rs) {
            $scope.TieuChuanTieuChis = rs.data
            $scope.TieuChuans = rs.data.map(s => { return s.tchuan })
            $scope.ListTieuChuanTieuChis = $scope.TieuChuanTieuChis.reduce(function (rs, obj, index) {
                rs = rs.concat([obj.tchuan], obj.tchi)
                return rs;
            }, []);
            if ($scope.item.Id != null) {
                $http.get("api/KeHoachDGN/GetPhanCongTCTC?IdKeHoach=" + $scope.item.Id).then(function (rs) {
                    let tmpPhanCong = rs.data

                    if (rs.data != null && rs.data != '') {
                        $scope.ListTieuChuanTieuChis.map(s => {
                            if (s.IdTieuChuan != null) {
                                let objPhanCong = tmpPhanCong.find(x => x.IdTieuChi == s.Id)
                                if (objPhanCong != null) {
                                    s.UserName = objPhanCong.UserName;
                                    s.IdTieuChi = objPhanCong.IdTieuChi;
                                    s.IdPhanCong = objPhanCong.Id;
                                }
                            }
                            return s;
                        })
                    }
                })
            }

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
            // $scope.LoadPhieuDanhGia();
        }


    }
    $scope.filterPCTieuChi = {}
    $scope.onCheck = function (item, phanloai, type) {
        if (phanloai == 'TIEUCHUAN') {
            let tmpTieuChis = $scope.ListTieuChuanTieuChis.filter(s => s.IdTieuChuan == item.Id)
            if (type == "CLICK") {
                let checkExist = tmpTieuChis.some(s => s.UserName != null && s.UserName != $scope.filterPCTieuChi.UserName)
                if (checkExist) {
                    if (!confirm("Một số tiêu chí đã được phân công bởi thành viên khác. Nếu tiếp tục bạn sẽ hủy bỏ những tiêu chí đã phân công của thành viên khác!")) {
                        return;
                    }
                }
                if (tmpTieuChis.some(s => s.UserName != $scope.filterPCTieuChi.UserName)) {
                    let obj = item
                    angular.forEach(tmpTieuChis, (value, key) => {
                        value.UserName = $scope.filterPCTieuChi.UserName
                    })
                } else {
                    angular.forEach(tmpTieuChis, (value, key) => {
                        value.UserName = null
                    })
                }
            }
            else if (type == 'MODEL') {
                try {
                    return !tmpTieuChis.some(s => s.UserName != $scope.filterPCTieuChi.UserName)
                } catch (ex) {
                }
            }
        }
        if (phanloai == 'TIEUCHI') {
            let indexExist = $scope.ListTieuChuanTieuChis.findIndex(s => s.IdTieuChuan != null && s.UserName == $scope.filterPCTieuChi.UserName && s.Id == item.Id)

            if (type == "CLICK") {
                //    debugger
                if (indexExist > -1) {
                    $scope.ListTieuChuanTieuChis[indexExist].UserName = null

                } else {
                    let indexTieuChi = $scope.ListTieuChuanTieuChis.findIndex(s => s.IdTieuChuan != null && s.Id == item.Id)
                    if ($scope.ListTieuChuanTieuChis[indexTieuChi].UserName != null) {
                        if (!confirm("Tiêu chí này đã được phân công bởi thành viên khác. Nếu tiếp tục bạn sẽ hủy bỏ tiêu chí đã phân công của thành viên khác!")) {
                            return;
                        }
                    }
                    $scope.ListTieuChuanTieuChis[indexTieuChi].UserName = $scope.filterPCTieuChi.UserName
                }
            }
            else if (type == 'MODEL') {
                try {
                    return indexExist > -1
                } catch (ex) {
                }
            }
        }

    }
    //end load tieu chuan tieu chi
    //check phan cong
    $scope.checkPhanCong = function () {
        if ($scope.ThanhVienDGNs == null || $scope.ThanhVienDGNs == '' || $scope.ThanhVienDGNs.length == 0) return false;
        let check = $scope.ThanhVienDGNs.some(s => s.tv.TruongDoan != true && s.tv.UyVien != true && s.tv.ThuKy != true)
        return !check
    }
    //end check phan cong
    $scope.OnLoad = function () {
        if ($scope.item == null || $scope.item.Id == 0) {
            $scope.itemOLD = $scope.item;
            // $scope.item = {}
            $scope.item.NoiDung = "Kế hoạch làm việc của đoàn đánh giá ngoài " + $scope.item.DonViName;
            //$scope.item.KeHoachTDGName = $scope.itemKHTDG.KeHoachTDGName;
            //$scope.item.DonViName = $scope.itemKHTDG.DonViName;
            //$scope.item.IdTruong = $scope.itemKHTDG.IdDonVi;
            //$scope.item.IdKeHoachTDG = $scope.itemKHTDG.Id;
            $scope.item.TrangThai = FactoryConstant.DA_LAP_KE_HOACH_NGOAI.FCode;
            $scope.item.IdDonVi = $rootScope.CurDonVi.Id;
            $scope.item.FInUse = true;
            $scope.LoadTemplate();
            initLoad($scope.item)
        } else {
            // $scope.item = {}
            initLoad($scope.item)
            //let filterKHDGN = {
            //    GetAll: true,
            //    IdKeHoach: $scope.item.Id
            //}
            //$scope.ServiceLoadKeHoachDGN(filterKHDGN).then(function successCallback(response) {
            //    $scope.item = response.data.ListOut[0]
            //    initLoad($scope.item)
            //})


        }
        let filterThanhVienDGN = {
            PhanLoai: '',
            IdDonVi: 0,
            IdKeHoachTDG: $scope.item.IdKeHoachTDG,
            IdKeHoachDGN: $scope.item.Id,
        }
        $scope.LoadThanhVienDGN(filterThanhVienDGN)
        $scope.LoadTCTC();
    }
    $scope.ChangeChucVu = function (item, type) {
        if (type == 'UYVIEN') {
            if (item.tv.TruongDoan || item.tv.ThuKy) {
                item.tv.UyVien = false
                confirm("Thành viên chỉ được phép đảm nhiệm 1 chức vụ trong đoàn")
            }
        }
        if (type == 'THUKY') {
            if (item.tv.TruongDoan || item.tv.UyVien) {
                item.tv.ThuKy = false
                confirm("Thành viên chỉ được phép đảm nhiệm 1 chức vụ trong đoàn")
            }
        }
    }
    $scope.OnLoad()
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
angular.module('WebApiApp').controller("ModalInKeHoachDGNController", function ($rootScope, $scope, $http, $uibModalInstance, $uibModal) {
    $scope.item = $scope.$resolve.item;
    var initLoad = function (item) {
        item.NghienCuuHSDGArray = []
        item.KhaoSatSoBoArray = []
        item.KhaoSatChinhThucArray = []
        item.DuThaoBaoCaoArray = []
        item.LayYKienPhanHoiArray = []
        item.HoanThienBaoCaoArray = []
        if (item.Id == null || item.Id == 0) return;
        if (item.NghienCuuHSDG != null) {
            item.NghienCuuHSDGArray = JSON.parse(item.NghienCuuHSDG)
        }
        if (item.KhaoSatSoBo != null) {
            item.KhaoSatSoBoArray = JSON.parse(item.KhaoSatSoBo)
        }
        if (item.KhaoSatChinhThuc != null) {
            item.KhaoSatChinhThucArray = JSON.parse(item.KhaoSatChinhThuc)
        }
        if (item.DuThaoBaoCao != null) {
            item.DuThaoBaoCaoArray = JSON.parse(item.DuThaoBaoCao)
        }
        if (item.LayYKienPhanHoi != null) {
            item.LayYKienPhanHoiArray = JSON.parse(item.LayYKienPhanHoi)
        }
        if (item.HoanThienBaoCao != null) {
            item.HoanThienBaoCaoArray = JSON.parse(item.HoanThienBaoCao)
        }
    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

});
