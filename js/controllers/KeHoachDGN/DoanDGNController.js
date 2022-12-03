angular.module('WebApiApp').controller('DoanDGNController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
 
    $scope.Del = function (Id) {

        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/DoanDGN/Del?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadDoanDGN();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    $rootScope.LoadDoanDGN = function () {

        $http({
            method: 'GET',
            url: 'api/DoanDGN/GetAll?IdDonVi=' + $rootScope.CurDonVi.Id
        }).then(function successCallback(response) {

            $rootScope.DoanDGN = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.LoadDoanDGN();
}]);
