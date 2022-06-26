angular.module('WebApiApp').controller('XetDuyetTDGCapDuoiController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $rootScope.IdTieuChuan = 0;
    $scope.IdQuyDinh = 0;
    $scope.IdDonVi = 0;
    $scope.IdKeHoachTDG = 0;
    //Xử lý load danh mục tiêu chuẩn
    $scope.LoadDMTieuChuan = function () {
        if (!$scope.IdQuyDinh) {
            $rootScope.IdTieuChuan = 0;
            $scope.DGTC = [];
            $rootScope.DsTieuChuan = []
            return;
        }
        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChuan/LoadTieuChuanByDonVi?IdQuyDinh=' + $scope.IdQuyDinh
                + '&IdDonVi=' + $scope.IdDonVi
        }).then(function successCallback(response) {
            $rootScope.DsTieuChuan = response.data;
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
    };

    $scope.LoadDonViCapDuoi = function () {
        
        $http({
            method: 'GET',
            url: 'api/DanhGiaTieuChi/LoadKHTDGCapDuoi?IdDonViCapTren=' + $rootScope.CurDonVi.Id
                + '&NamHoc=' + localStorage.getItem('NamHoc').toString()
        }).then(function successCallback(response) {
            $scope.TDGDonVi = response.data;
            if ($scope.TDGDonVi.length > 0) {
                $scope.IdDonVi = $scope.TDGDonVi[0].dv.Id;
                $scope.IdKeHoachTDG = $scope.TDGDonVi[0].tdg?.Id;
                $scope.IdQuyDinh = $scope.TDGDonVi[0].tdg?.IdQuyDinhTC;
                $scope.LoadDMTieuChuan();
            }
            

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();

    $scope.OnChangeDonVi = function () {
        let selectedTDGDV = $scope.TDGDonVi.filter(t => t.dv.Id == $scope.IdDonVi)[0];
        $scope.IdKeHoachTDG = selectedTDGDV.tdg?.Id;
        $scope.IdQuyDinh = selectedTDGDV.tdg?.IdQuyDinhTC;
        $scope.LoadDMTieuChuan();
    }

    // Xử lý load danh mục đánh giá tiêu chí
    $rootScope.LoadDGTC = function () {
        $http({
            method: 'GET',
            url: 'api/DanhGiaTieuChi/GetDGTC?IdDonVi=' + $scope.IdDonVi
                + '&IdKeHoachTDG=' + $scope.IdKeHoachTDG
                + '&IdTieuChuan=' + $rootScope.IdTieuChuan
        }).then(function successCallback(response) {

            $scope.DGTC = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    
}]);