angular.module('WebApiApp').controller('TongHopKQDGController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {

    $scope.LoadTongHopKQDG = function () {
        $http({
            method: 'GET',
            url: 'api/BaoCao/TongHopKQDG?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
        }).then(function successCallback(response) {

            $scope.KetQua = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();

}]);