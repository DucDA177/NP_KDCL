angular.module('WebApiApp').controller('BaoCaoTDGController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {

    $scope.LoadAll = function () {
        $scope.LoadHoiDong = function () {

            $http({
                method: 'GET',
                url: 'api/HoiDong/GetAll?IdDonVi=' + $rootScope.CurDonVi.Id
                    + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
            }).then(function successCallback(response) {

                $scope.HoiDong = response.data;

            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }();

        $scope.LoadDLNhaTruong = function () {
            let cssToReplace = /jexcel jexcel_overflow/g;
            let cssReplace = "table table-from-db";
            $http({
                method: 'GET',
                url: 'api/BaoCao/GetDataDLNhaTruong?IdDonVi=' + $rootScope.CurDonVi.Id
                    + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
            }).then(function successCallback(response) {

                $scope.DLNhaTruong = response.data;
                $scope.DMVietTat = $scope.DLNhaTruong
                    .filter(t => t.Loai == 'DMVietTat')[0]?.HTML
                    .replace(cssToReplace, cssReplace);

                $scope.SLSoLopHoc = $scope.DLNhaTruong
                    .filter(t => t.Loai == 'SLSoLopHoc')[0]?.HTML
                    .replace(cssToReplace, cssReplace);

                $scope.SLCoCauCongTrinh = $scope.DLNhaTruong
                    .filter(t => t.Loai == 'SLCoCauCongTrinh')[0]?.HTML
                    .replace(cssToReplace, cssReplace);

                $scope.DLTaiThoiDiemDG = $scope.DLNhaTruong
                    .filter(t => t.Loai == 'DLTaiThoiDiemDG')[0]?.HTML
                    .replace(cssToReplace, cssReplace);

                $scope.SLCanBo = $scope.DLNhaTruong
                    .filter(t => t.Loai == 'SLCanBo')[0]?.HTML
                    .replace(cssToReplace, cssReplace);

                $scope.SLHocSinh = $scope.DLNhaTruong
                    .filter(t => t.Loai == 'SLHocSinh')[0]?.HTML
                    .replace(cssToReplace, cssReplace);

                $scope.SLKQGiaoDuc = $scope.DLNhaTruong
                    .filter(t => t.Loai == 'SLKQGiaoDuc')[0]?.HTML
                    .replace(cssToReplace, cssReplace);

                $scope.DatVanDe = $scope.DLNhaTruong
                    .filter(t => t.Loai == 'DatVanDe')[0]?.HTML;

                $scope.KetLuan = $scope.DLNhaTruong
                    .filter(t => t.Loai == 'KetLuan')[0]?.HTML;

            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }();

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

        $scope.LoadThongTinDonVi = function () {
            $http({
                method: 'GET',
                url: 'api/BaoCao/GetThongTinDonVi?IdDonVi=' + $rootScope.CurDonVi.Id
            }).then(function successCallback(response) {

                $scope.TTDonVi = response.data;
                $scope.TTDonVi.ThongTinKhac = $scope.TTDonVi.ThongTinKhac ? JSON.parse($scope.TTDonVi.ThongTinKhac) : [];

            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }();

        $scope.LoadBaoCaoTCTC = function () {
            $http({
                method: 'GET',
                url: 'api/BaoCao/LoadBaoCaoTCTC?IdDonVi=' + $rootScope.CurDonVi.Id
                    + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                    + '&IdQuyDinh=' + $rootScope.KeHoachTDG.IdQuyDinhTC
            }).then(function successCallback(response) {

                $scope.BaoCaoTCTC = response.data;

            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }();

        $scope.LoadPhuLucMinhChung = function () {
            $http({
                method: 'GET',
                url: 'api/BaoCao/LoadPhuLucMinhChung?IdDonVi=' + $rootScope.CurDonVi.Id
                    + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                    + '&RequiredFile=false'
            }).then(function successCallback(response) {

                $scope.PhuLucMC = response.data;

            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }();
    }


    if (window.location.href.includes('kqdg.html')) {
        let splitText = window.location.href.split('?');
        let MaDonVi = splitText[splitText.length - 1]
        $scope.LoadHoiDong = function () {

            $http({
                method: 'GET',
                url: 'api/KeHoachTDG/GetDonViVaKeHoachTDG?MaDonVi=' + MaDonVi
            }).then(function successCallback(response) {

                $rootScope.CurDonVi = response.data.dv;
                $rootScope.KeHoachTDG = response.data.kh;

                if ($rootScope.CurDonVi && $rootScope.KeHoachTDG)
                    $scope.LoadAll();

            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        }();
    }
    else {
        $scope.LoadAll();
    }
}]);