angular.module('WebApiApp').controller('MinhChungController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.Paging = {
        "idTieuChuan": '0',
        "idTieuChi": "0",
        "heThongMa": ''
    };
    $scope.LoadDMTieuChuan = function () {
        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChuan/LoadTieuChuan?IdDonVi=' + $rootScope.CurDonVi.Id
        }).then(function successCallback(response) {
            $scope.DSTieuChuan = response.data;
            if ($scope.DSTieuChuan.length > 0) {
                $scope.Paging.idTieuChuan = $scope.DSTieuChuan[0].Id;

                $scope.LoadTieuChi($scope.Paging.idTieuChuan);
            }
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.LoadTieuChi = function (tieuChuanId) {
        if (tieuChuanId != 0 && tieuChuanId != undefined) {
            $http({
                method: 'GET',
                url: 'api/DanhMucTieuChi/LayDuLieuBang?IdDonVi=' + $rootScope.CurDonVi.Id
                    + '&IdTieuChuan=' + tieuChuanId
            }).then(function successCallback(response) {
                $scope.DsTieuChi = response.data;
                if ($scope.DsTieuChi.length > 0) {
                    $scope.Paging.idTieuChi = $scope.DsTieuChi[0].Id;

                    $scope.LoadData($scope.Paging.idTieuChi, $scope.Paging.heThongMa);
                } else {
                    $scope.Paging.idTieuChi = null;
                }
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }
        
    }


    $scope.RenderHeThongMa = function () {
        $http({
            method: 'GET',
            url: 'api/MinhChung/LoadHeThongMa'
        }).then(function successCallback(response) {
            $scope.DSHeThongMa = response.data;
            if ($scope.DSHeThongMa.length > 0) {
                $scope.Paging.heThongMa = $scope.DSHeThongMa[0];

                $scope.LoadData($scope.Paging.idTieuChi, $scope.Paging.heThongMa);
            } else {
                $scope.Paging.heThongMa = "";
            }
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.LoadData = function (idTieuChi, heThongMa) {
        if (idTieuChi != undefined && !heThongMa) {
            $http({
                method: 'GET',
                url: 'api/MinhChung/LoadDSMinhChung?IdDonVi=' + $rootScope.CurDonVi.Id
                    + '&idTieuChi=' + idTieuChi
                    + '&heThongMa=' + heThongMa
            }).then(function successCallback(response) {
                $scope.DSMinhChung = response.data;
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }
    }

    $scope.LoadDMTieuChuan();
    $scope.RenderHeThongMa();
}]);