angular.module('WebApiApp').
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
                ["InsertMinhChung", "SetReadOnly"]
            ],
            removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar',
        }
        //Filter danh sach ke hoach ngoai
        $scope.onChangeKeHoach = function (Id) {
            $scope.ItemKeHoachDGN = $scope.KeHoachDGN.find(s => s.Id == Id)
            console.warn($scope.ItemKeHoachDGN)
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

        //Load Tieu chuan tieu chi

        $scope.filterTCTC = {
            //IdKeHoach: $scope.item.Id,
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
                $scope.item = {}
                $scope.TieuChuanTieuChis = rs.data
                $scope.TieuChuans = rs.data.map(s => { return s.tchuan })

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
                //console.warn($scope.ObjTieuChi)
            }


        }

        //end load tieu chuan tieu chi
        //Load Phieu danh gia chi tieu
        $scope.filterPhieuDG = {}
        $scope.LoadPhieuDanhGia = function () {
            $scope.item = {}
            console.warn('item', $scope.item)
            let configGetPhieuDG = {
                params: $scope.filterPhieuDG
            }
            $http({
                method: 'GET',
                url: 'api/DanhGiaTieuChiKHDGN/GetByIdKeHoach',
                params: {
                    IdKeHoach: $scope.filterPhieuDG.IdKeHoach,
                    IdTieuChuan: $scope.filterPhieuDG.IdTieuChuan,
                    IdTieuChi: $scope.filterPhieuDG.IdTieuChi,
                }
            }).then(function successCallback(response) {
                $scope.item = response.data
                console.warn(' rs.data', response)
                console.warn(' rs.data', response.data)
                console.warn('item', $scope.item)
                $scope.item.KQChiBaoObj = $scope.item.KQChiBao != null ? JSON.parse($scope.item.KQChiBao) : $scope.ObjTieuChi.listChiBaoA

            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
            });
            //$http.get("api/DanhGiaTieuChiKHDGN/GetByIdKeHoach", configGetPhieuDG).then(function (rs) {
            //   // debugger
            //    $scope.item = rs.data
            //    console.warn(' rs.data', rs)
            //    console.warn(' rs.data', rs.data)
            //    console.warn('item',$scope.item)
            //    $scope.item.KQChiBaoObj = $scope.item.KQChiBao != null ? JSON.parse($scope.item.KQChiBao) :  $scope.ObjTieuChi.listChiBaoA
            //})
        }
        //end Load Phieu danh gia chi tieu

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
                toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
                $scope.LoadPhieuDanhGia();

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

