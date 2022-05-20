angular.module('WebApiApp').controller('DanhGiaTieuChiController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $rootScope.IdTieuChuan = 0;
    $rootScope.IdQuyDinh = 0;
    //Xử lý load danh mục tiêu chuẩn
    $scope.LoadDMTieuChuan = function () {
        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChuan/LayDuLieuBang?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdQuyDinh=' + $rootScope.IdQuyDinh
        }).then(function successCallback(response) {
            $rootScope.DsTieuChuan = response.data.filter(x => x.YCDanhGia);
            if ($rootScope.DsTieuChuan.length > 0) {
                $rootScope.IdTieuChuan = $rootScope.DsTieuChuan[0].Id;
                $rootScope.LoadDGTC();
            }
            else {
                $rootScope.IdTieuChuan = 0;
                $scope.DGTC = []
            }

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }


    // Xử lý load danh mục đánh giá tiêu chí
    $rootScope.LoadDGTC = function () {
        $http({
            method: 'GET',
            url: 'api/DanhGiaTieuChi/GetDGTC?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                + '&IdTieuChuan=' + $rootScope.IdTieuChuan
        }).then(function successCallback(response) {

            $scope.DGTC = response.data;

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

    $scope.Del = function (Id) {
      
        if (confirm('Bạn có chắc chắn muốn đánh giá lại tiêu chí này ?'))
            $http({
                method: 'GET',
                url: 'api/DanhGiaTieuChi/Del?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadDGTC();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }
}]);