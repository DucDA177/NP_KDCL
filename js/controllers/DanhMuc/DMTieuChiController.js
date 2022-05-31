angular.module('WebApiApp').controller('DMTieuChiController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $rootScope.IdTieuChuan = 0;
    $rootScope.IdQuyDinh = 0;
    //Xử lý load danh mục tiêu chuẩn
    $scope.LoadDMTieuChuan = function () {
        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChuan/LayDuLieuBang?IdQuyDinh=' + $rootScope.IdQuyDinh
        }).then(function successCallback(response) {

            $rootScope.DsTieuChuan = response.data;
            if ($rootScope.DsTieuChuan.length > 0) {
                $rootScope.IdTieuChuan = $rootScope.DsTieuChuan[0].Id;
                $rootScope.LoadDMTieuChi();
            }
            else {
                $rootScope.IdTieuChuan = 0;
                $scope.DMTieuChi = []
            }
            
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    

    // Xử lý xóa danh mục tiêu chí
    $scope.Delete = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/DanhMucTieuChi/XoaDanhMucTieuChi?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadDMTieuChi();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    // Xử lý load danh mục tiêu chí
    $rootScope.LoadDMTieuChi = function () {
        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChi/LayDuLieuBang?IdTieuChuan=' + $rootScope.IdTieuChuan
        }).then(function successCallback(response) {

            $scope.DMTieuChi = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.AfterGetQuyDinh = function () {
        if ($scope.QuyDinh.length > 0) {
            $rootScope.IdQuyDinh = $scope.QuyDinh[0].Id;
            $scope.LoadDMTieuChuan();
        }
    }

    // Load danh mục trong bảng tblDanhmuc
    $scope.LoadDanhMuc('QuyDinh', 'QUYDINH', '', '', '', $scope.AfterGetQuyDinh);
}]);