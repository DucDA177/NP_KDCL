angular.module('WebApiApp').controller('KhaoSatSoBoController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.filterHoiDongDGN = {
        IdTruong: 0,
        IdKeHoachDGN: 0,
        IdTruongDGN: 0
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

                $scope.checkQuyen = $scope.CheckQuyenThanhVien(selectedKeHoachDGN, 'KhaoSatSoBo', $rootScope.user.UserName)
                if ($scope.checkQuyen)
                    $scope.LoadKhaoSatSoBo();
            }
            else
                $scope.filterHoiDongDGN.IdKeHoachDGN = 0

        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }

    $scope.LoadKhaoSatSoBo = function () {
        $http({
            method: 'GET',
            url: 'api/KhaoSatSoBoDGN/Get',
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
                    KQNghienCuu: null,
                    YeuCau: null,
                    KeHoach: null,
                    ThoiGian: new Date()
                }
            else {
                if ($scope.item.ThoiGian)
                    $scope.item.ThoiGian = new Date($scope.item.ThoiGian)
            }
        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }

    $scope.Save = function () {
        $http({
            method: 'POST',
            url: 'api/KhaoSatSoBoDGN/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
            $scope.LoadKhaoSatSoBo();
        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.error('Có lỗi xảy ra hoặc bạn chưa điền đầy đủ các trường bắt buộc !', 'Thông báo');

        });

    }

    $scope.Del = function (id) {

        if (confirm('Bạn có chắc chắn muốn tạo lại biên bản này ?')) {
            if (id)
                $http({
                    method: 'POST',
                    url: 'api/KhaoSatSoBoDGN/Del?Id=' + id,
                }).then(function successCallback(response) {
                    toastr.success('Tạo lại dữ liệu thành công !', 'Thông báo');
                    $scope.LoadKhaoSatSoBo();
                }, function errorCallback(response) {
                    //$scope.itemError = response.data;
                    toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
                });
            else
                $scope.item = {
                    IdDonVi: $rootScope.CurDonVi.Id,
                    IdKeHoachDGN: $scope.filterHoiDongDGN.IdKeHoachDGN,
                    KQNghienCuu: null,
                    YeuCau: null,
                    KeHoach: null,
                    ThoiGian: new Date()
                }
        }


    }

    ComponentsSelect2.init();
}]);