angular.module('WebApiApp').controller('ThongKeMinhChungController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    
    $scope.LoadPhuLucMinhChung = function () {
        $http({
            method: 'GET',
            url: 'api/BaoCao/LoadPhuLucMinhChung?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                + '&RequiredFile=true'
        }).then(function successCallback(response) {

            $scope.PhuLucMC = response.data;
            console.log($scope.PhuLucMC)
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();
}]);