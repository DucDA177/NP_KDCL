angular.module('WebApiApp').controller('HoiDongController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
 
    $scope.Del = function (item) {
       
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/HoiDong/Del?Id=' + item.Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadHoiDong();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    $rootScope.LoadHoiDong = function () {

        $http({
            method: 'GET',
            url: 'api/HoiDong/GetAll?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
        }).then(function successCallback(response) {

            $rootScope.HoiDong = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $rootScope.LoadHoiDong();
}]);

angular.module('WebApiApp').controller('NhomCongTacController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    
    $rootScope.LoadNhomCongTac = function () {

        $http({
            method: 'GET',
            url: 'api/NhomCongTac/Get?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
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