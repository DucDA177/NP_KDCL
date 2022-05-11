angular.module('WebApiApp').controller('DMTieuChuanController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $rootScope.IdQuyDinh = 0;
    // Xử lý xóa danh mục tiêu chuẩn
    $scope.Delete = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/DanhMucTieuChuan/XoaDanhMucTieuChuan?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadDMTieuChuan();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    // Xử lý load danh mục tiêu chuẩn
    $rootScope.LoadDMTieuChuan = function () {

        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChuan/LayDuLieuBang?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdQuyDinh=' + $rootScope.IdQuyDinh
        }).then(function successCallback(response) {

            $scope.DMTieuChuan = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.AfterGetQuyDinh = function () {
        if ($scope.QuyDinh.length > 0) {
            $rootScope.IdQuyDinh = $scope.QuyDinh[0].Id;
            $rootScope.LoadDMTieuChuan();
        }
    }

    // Load danh mục trong bảng tblDanhmuc
    $scope.LoadDanhMuc('QuyDinh', 'QUYDINH', '', '', '', $scope.AfterGetQuyDinh);
}]);