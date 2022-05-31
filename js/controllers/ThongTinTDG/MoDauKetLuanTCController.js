angular.module('WebApiApp').controller('MoDauKetLuanTCController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.IdTieuChuan = '';
    $scope.LoadTieuChuan = function () {

        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChuan/LoadTCTCByUser'
        }).then(function successCallback(response) {

            $scope.TieuChuan = response.data;
            if (!$scope.TieuChuan || $scope.TieuChuan.length == 0) {
                $scope.MoDau = {};
                $scope.KetLuan = {};
                $scope.IdTieuChuan = '';
            }
            else {
                $scope.IdTieuChuan = $scope.TieuChuan[0].tchuan.Id;
                $scope.LoadMDKLTieuChuan();
            }
            

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();

    $scope.LoadMDKLTieuChuan = function () {
        $http({
            method: 'GET',
            url: 'api/MoDauKetLuanTC/LoadMDKLTC?IdTieuChuan=' + $scope.IdTieuChuan
                + '&IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
        }).then(function successCallback(response) {

            $scope.MoDau = response.data.MoDau;
            $scope.KetLuan = response.data.KetLuan;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.Save = function (data, type) {
        data.Loai = type;
        if (!data.Id) {
            data.IdDonVi = $rootScope.CurDonVi.Id;
            data.IdKeHoachTDG = $rootScope.KeHoachTDG.Id;
            data.IdTieuChuan = $scope.IdTieuChuan;
        }
        $http({
            method: 'POST',
            url: 'api/MoDauKetLuanTC/Save',
            data: data
        }).then(function successCallback(response) {
            if(type == "MD")
                $scope.MoDau = response.data;
            if (type == "KL")
                $scope.KetLuan = response.data;

            toastr.success('Lưu dữ liệu thành công!', 'Thông báo');

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
}]);