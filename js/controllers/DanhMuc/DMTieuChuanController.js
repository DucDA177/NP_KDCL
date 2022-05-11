﻿angular.module('WebApiApp').controller('DMTieuChuanController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.Paging = {
        "searchKey": ''
    };
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
            url: 'api/DanhMucTieuChuan/LayDuLieuBang?noiDung=' + $scope.Paging.searchKey
        }).then(function successCallback(response) {

            $scope.DMTieuChuan = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $rootScope.LoadDMTieuChuan();

}]);