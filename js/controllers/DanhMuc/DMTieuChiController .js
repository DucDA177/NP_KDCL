angular.module('WebApiApp').controller('DMTieuChiController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.Paging = {
        "searchKey": ''
    };
    // Xử lý xóa danh mục tiêu chí
    $scope.Delete = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/DanhMucTieuChi/XoaDanhMucTieuChi?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadDMTieuChuan();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    // Xử lý load danh mục tiêu chí
    $rootScope.LoadDMTieuChi = function () {
        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChi/LayDuLieuBang?noiDung=' + $scope.Paging.searchKey
        }).then(function successCallback(response) {

            $scope.DMTieuChi = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.LoadDMTieuChi();

}]);