angular.module('WebApiApp').controller('MinhChungController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    
    $rootScope.ChiThuThap = false;
    if (!$rootScope.checkAdmin && !$rootScope.checkTongHop)
        $rootScope.ChiThuThap = true;

    $scope.Paging = {
        "idTieuChuan": '0',
        "idTieuChi": "0",
        "heThongMa": ''
    };
    $scope.LoadDMTieuChuan = function () {
        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChuan/LoadTCTCByUser'
        }).then(function successCallback(response) {
            $scope.DSTCTC = response.data;
            $scope.DSTieuChuan = $scope.DSTCTC.map(t => t.tchuan);

            if ($scope.DSTieuChuan.length > 0) {
                $scope.Paging.idTieuChuan = $scope.DSTieuChuan[0].Id;
                $scope.LoadTieuChi();
            }
            else {
                $scope.Paging.idTieuChuan = '';
                $scope.DsTieuChi = []
                $scope.Paging.idTieuChi =  ''
            }
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.LoadTieuChi = function () {
        
        $scope.DsTieuChi = $scope.DSTCTC
            .filter(x => x.tchuan.Id == $scope.Paging.idTieuChuan)
            .map(t => t.tchi)[0];

        if ($scope.DsTieuChi.length > 0) {
            $scope.Paging.idTieuChi = $scope.DsTieuChi[0].Id;

            $rootScope.LoadMinhChung();
        } else {
            $scope.Paging.idTieuChi = null;
            $scope.DSMinhChung = []
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

                $rootScope.LoadMinhChung();
            } else {
                $scope.Paging.heThongMa = "";
            }
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $rootScope.LoadMinhChung = function () {
        
            $http({
                method: 'GET',
                url: 'api/MinhChung/LoadDSMinhChung?IdDonVi=' + $rootScope.CurDonVi.Id
                    + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                    + '&idTieuChi=' + $scope.Paging.idTieuChi
                    + '&heThongMa=' + $scope.Paging.heThongMa
                    + '&ChiThuThap=' + $rootScope.ChiThuThap
            }).then(function successCallback(response) {
                $scope.DSMinhChung = response.data;
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        
    }

    $scope.LoadDMTieuChuan();
    $scope.RenderHeThongMa();

    $scope.Delete = function (Id) {
        
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/MinhChung/Del?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadMinhChung();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        if ($rootScope.ChiThuThap) {
            $('.except-thuthap').hide();
        }
    });
}]);