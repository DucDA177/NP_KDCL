angular.module('WebApiApp').controller('KetQuaNghienCuuDGNController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.filterHoiDongDGN = {
        IdTruong: 0,
        IdKeHoachDGN: 0,
        IdTruongDGN: 0,
        IdKeHoachTDG: 0,
        IdTieuChuan: 0,
        IdTieuChi: 0
    }

    $scope.config = {
        readOnly: false,
        height: '450px',
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
            ['Table', 'HorizontalRule', 'SpecialChar']
        ],
        removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar',
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
            $scope.DonVis = response.data;

            let listTruong = $scope.DonVis.filter(x => x.LoaiDonVi == 'TRUONG');
            if (listTruong.length > 0) {
                $scope.filterHoiDongDGN.IdTruong = listTruong[0].Id;
                $scope.LoadKeHoachDGN();
            }

        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }
    $scope.LoadDonVi();

    $scope.checkQuyen = true;
    $scope.LoadKeHoachDGN = function () {

        $scope.filterHoiDongDGN.IdKeHoachDGN = 0
        $http({
            method: 'POST',
            url: 'api/KeHoachDGN/FilterKHDGN',
            data: {
                IdTruong: $scope.filterHoiDongDGN.IdTruong,
                GetAll: true
            }
        }).then(function successCallback(response) {
            $scope.KeHoachDGN = response.data.ListOut;
            if ($scope.KeHoachDGN.length > 0) {
                let selectedKeHoachDGN = $scope.KeHoachDGN[0];
                $scope.filterHoiDongDGN.IdKeHoachDGN = selectedKeHoachDGN.Id;
                $scope.filterHoiDongDGN.IdTruongDGN = selectedKeHoachDGN.IdTruongDGN;
                $scope.filterHoiDongDGN.IdKeHoachTDG = selectedKeHoachDGN.IdKeHoachTDG;

                $scope.checkQuyen = $scope.CheckQuyenThanhVien(selectedKeHoachDGN, 'NghienCuuHSDG', $rootScope.user.UserName)
                if ($scope.checkQuyen) {
                    $scope.LoadTCTC();
                    $scope.LoadKQNghienCuuDGN();
                }
                   
            }
            else
                $scope.filterHoiDongDGN.IdKeHoachDGN = 0

        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }

    $scope.LoadKQNghienCuuDGN = function () {
        $http({
            method: 'GET',
            url: 'api/KetQuaNghienCuuDGN/Get',
            params: {
                IdDonVi: $rootScope.CurDonVi.Id,
                IdKeHoachDGN: $scope.filterHoiDongDGN.IdKeHoachDGN
            }
        }).then(function successCallback(response) {
            $scope.item = response.data;

            if (!$scope.item)
                $scope.item = {
                    IdDonVi: $rootScope.CurDonVi.Id,
                    IdKeHoachDGN: $scope.filterHoiDongDGN.IdKeHoachDGN,
                    TrinhBay: null,
                    NoiDung: null,
                    CoSoVatChat: null,
                }
        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }

    $scope.Save = function () {
        $http({
            method: 'POST',
            url: 'api/KetQuaNghienCuuDGN/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            $scope.SaveBoSungTC();
        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.error('Có lỗi xảy ra hoặc bạn chưa điền đầy đủ các trường bắt buộc !', 'Thông báo');

        });

    }

    $scope.Del = function (id) {

        if (confirm('Bạn có chắc chắn muốn tạo lại hồ sơ này ?')) {
            if (id)
                $http({
                    method: 'POST',
                    url: 'api/KetQuaNghienCuuDGN/Del?Id=' + id,
                }).then(function successCallback(response) {
                    toastr.success('Tạo lại dữ liệu thành công !', 'Thông báo');
                    $scope.LoadKQNghienCuuDGN();
                }, function errorCallback(response) {
                    //$scope.itemError = response.data;
                    toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
                });
            else
                $scope.item = {
                    IdDonVi: $rootScope.CurDonVi.Id,
                    IdKeHoachDGN: $scope.filterHoiDongDGN.IdKeHoachDGN,
                    TrinhBay: null,
                    NoiDung: null,
                    CoSoVatChat: null,
                }
        }


    }

    $scope.LoadTCTC = function () {
        $scope.TieuChuans = []
        $scope.TieuChis = []

        $http.get("api/KeHoachDGN/GetTCTC", {
            params: {
                IdKeHoach: $scope.filterHoiDongDGN.IdKeHoachDGN,
                type: 'KHDGN'
            }
        }).then(function (rs) {

            $scope.TieuChuanTieuChis = rs.data
            $scope.TieuChuans = rs.data.map(s => { return s.tchuan })

        })
    }

    $scope.OnChangeTieuChuan = function (Id, type) {
        if (type == 'TIEUCHUAN') {
            $scope.TieuChis = []
            $scope.ObjTieuChuan = $scope.TieuChuans.find(s => s.Id == Id)
            $scope.TieuChis = $scope.TieuChuanTieuChis.find(s => s.tchuan.Id == Id).tchi
            $scope.filterHoiDongDGN.IdTieuChi = 0;
        }
        if (type == 'TIEUCHI') {
            $scope.ObjTieuChi = $scope.TieuChis.find(s => s.Id == Id)
            $scope.ObjTieuChi.listChiBaoA = JSON.parse($scope.ObjTieuChi.ChiBaoA)
            $scope.ObjTieuChi.listChiBaoB = JSON.parse($scope.ObjTieuChi.ChiBaoB)
            $scope.ObjTieuChi.listChiBaoC = JSON.parse($scope.ObjTieuChi.ChiBaoC)
        
            let curIdKeHoachDGN = $scope.filterHoiDongDGN.IdKeHoachDGN != 0 ? $scope.filterHoiDongDGN.IdKeHoachDGN : 0; //Id Kế hoạch ĐGN
            let curIdKeHoachTDG = $scope.filterHoiDongDGN.IdKeHoachTDG != 0 ? $scope.filterHoiDongDGN.IdKeHoachTDG : 0; // Id Kế hoạch TĐG
            let curIdTieuChi = $scope.filterHoiDongDGN.IdTieuChi != 0 ? $scope.filterHoiDongDGN.IdTieuChi : 0; // Id Tiêu chí
            $scope.LoadTTBoSungTieuChi(curIdKeHoachDGN, curIdKeHoachTDG, curIdTieuChi); // Find this in main.js
        }


    }


    ComponentsSelect2.init();
}]);