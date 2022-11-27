angular.module('WebApiApp').controller('HoiDongDGNController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.filterHoiDongDGN = {
        IdTruong: 0,
        IdKeHoachDGN: 0
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

    $scope.LoadKeHoachDGN = function () {
        $http({
            method: 'POST',
            url: 'api/KeHoachDGN/FilterKHDGN',
            data: {
                IdTruong: $scope.filterHoiDongDGN.IdTruong,
                GetAll: true
            }
        }).then(function successCallback(response) {
            $scope.KeHoachDGN = response.data.ListOut
        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }

    $scope.Del = function (item) {

        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/HoiDongDGN/Del?Id=' + item.Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadHoiDongDGN();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    $rootScope.LoadHoiDongDGN = function () {

        $http({
            method: 'GET',
            url: 'api/HoiDongDGN/GetAll?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachDGN=' + $scope.filterHoiDongDGN.IdKeHoachDGN
        }).then(function successCallback(response) {

            $rootScope.HoiDongDGN = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    //$rootScope.LoadHoiDongDGN();
    ComponentsSelect2.init();
}]);

angular.module('WebApiApp').controller('NhomCongTacController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {

    $rootScope.LoadNhomCongTac = function () {

        $http({
            method: 'GET',
            url: 'api/NhomCongTac/Get?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachDGN=' + $rootScope.KeHoachTDG.Id
        }).then(function successCallback(response) {

            $scope.NhomCongTac = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $rootScope.LoadNhomCongTac();
    $scope.DelNhomCongTac = function (Id) {
        $http({
            method: 'GET',
            url: 'api/NhomCongTac/Del?IdNhom=' + Id
        }).then(function successCallback(response) {
            $rootScope.LoadNhomCongTac();
            toastr.success('Xóa nhóm thành công!', 'Thông báo');

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
}]);