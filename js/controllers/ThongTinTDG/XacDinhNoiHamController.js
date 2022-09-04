angular.module('WebApiApp').controller('XacDinhNoiHamController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.config = {
        height: '400px',
        toolbar: [
            ['Source'],
            ['Print', 'Preview'],
            ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'],
            ['NumberedList', 'BulletedList', 'Blockquote'],
            ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
            ['Link', 'Unlink'],
            ['Undo', 'Redo'],
            ['Find', 'Replace'],
            ['Bold', 'Italic', 'Underline', 'Strike'],
            ['Table', 'HorizontalRule', 'SpecialChar']
        ],
        removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
    }

    $scope.Paging = {
        "idTieuChuan": '0',
        "idTieuChi": "0",
        "heThongMa": ''
    };
    $scope.DataIn = {
        NoiHam: '',
        IdDonVi: $rootScope.CurDonVi.Id,
        IdKeHoachTDG: $rootScope.KeHoachTDG.Id,
        IdTieuChi: $scope.Paging.idTieuChi
    }
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
                $scope.Paging.idTieuChi = ''
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

            $rootScope.LoadNoiHam();
        } else {
            $scope.Paging.idTieuChi = null;
            $scope.DataIn.NoiHam = ''
        }

    }
    $scope.LoadDMTieuChuan();

    $rootScope.LoadNoiHam = function () {

        $http({
            method: 'GET',
            url: 'api/DanhGiaTieuChi/GetDGTC?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                + '&IdTieuChuan=' + $scope.Paging.idTieuChuan
        }).then(function successCallback(response) {
            $scope.checkDGTC = response.data.filter(x => x.tchi.Id == $scope.Paging.idTieuChi)[0]
            $scope.DataIn.NoiHam = $scope.checkDGTC.dgtc?.NoiHam;

            $scope.checkDGTC.tchi.ChiBaoA = JSON.parse($scope.checkDGTC.tchi.ChiBaoA);
            $scope.checkDGTC.tchi.ChiBaoB = JSON.parse($scope.checkDGTC.tchi.ChiBaoB);
            $scope.checkDGTC.tchi.ChiBaoC = JSON.parse($scope.checkDGTC.tchi.ChiBaoC);

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });

    }

    $scope.SaveNoiHam = function () {
        $scope.DataIn.IdTieuChi = $scope.Paging.idTieuChi
        $http({
            method: 'POST',
            url: 'api/DanhGiaTieuChi/SaveNoiHam',
            data: $scope.DataIn
        }).then(function successCallback(response) {

            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
            $rootScope.LoadNoiHam();

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.ExportPhieuNoiHam = function () {
        $scope.DataNoiHam = {
            TieuChuan: $scope.DSTieuChuan[0],
            TieuChi: $scope.DsTieuChi[0],
            NoiHam: $scope.DataIn.NoiHam
        }

        $scope.openModal($scope.DataNoiHam, 'InPhieuNoiHam')
    }

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

        if (!$scope.DataIn.NoiHam) {
            $scope.DataIn.NoiHam = $('#hiddenTemplateNoiHam').html();
        }
    });

}]);