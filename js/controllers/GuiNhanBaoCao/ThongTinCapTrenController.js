angular.module('WebApiApp').controller('ThongTinCapTrenController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {

    $scope.LoadTTCapTren = function () {

        $http({
            method: 'GET',
            url: 'api/ThongBao/GetThongBao?DonViNhan=' + $rootScope.CurDonVi.Id
        }).then(function successCallback(response) {

            $scope.TTCapTren = response.data.filter(x => x.Loai == 1);

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.LoadTTCapTren();

}]);