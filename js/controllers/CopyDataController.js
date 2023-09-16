angular.module('WebApiApp').controller('CopyDataController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$stateParams', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $stateParams) {
    $scope.Paging = {
        "IdDonViGoc": 0,
        "IdKHTDGGoc": 0,
        "IdDonViChuyen": 0,
        "IdKHTDGChuyen": 0
    };
    $scope.LoadAllDonVi();

    $scope.progress = 0;
    $scope.CopyData = function () {
        if (!$scope.Paging.IdDonViGoc) {
            toastr.error('Chưa chọn đơn vị gốc!', 'Thông báo');
            return;
        }
        if (!$scope.Paging.IdKHTDGGoc) {
            toastr.error('Chưa chọn kế hoạch TĐG đơn vị gốc!', 'Thông báo');
            return;
        }
        if (!$scope.Paging.IdDonViChuyen) {
            toastr.error('Chưa chọn đơn vị được chuyển!', 'Thông báo');
            return;
        }
        if (!$scope.Paging.IdKHTDGChuyen) {
            toastr.error('Chưa chọn kế hoạch TĐG đơn vị được chuyển!', 'Thông báo');
            return;
        }
        if (confirm('Bạn có chắc chắn muốn sao chép dữ liệu?')) {
            $scope.progress = 1;
            $scope.Handleprog = setInterval(function () {
                if ($scope.progress < 99) {
                    $scope.progress++;
                    $scope.$apply();
                }

            }, 1000);

            $http({
                method: 'GET',
                url: '/api/Base/CopyData',
                params: {
                    "from": $scope.Paging.IdKHTDGGoc,
                    "to": $scope.Paging.IdKHTDGChuyen,
                }
            }).then(function successCallback(response) {

                bootbox.alert("<b>Sao chép dữ liệu thành công: </b>"
                    + response.data + " bản ghi</b> </br>"
                );
                clearInterval($scope.Handleprog);
                $scope.progress = 100;
                $scope.Paging = {
                    "IdDonViGoc": 0,
                    "IdKHTDGGoc": 0,
                    "IdDonViChuyen": 0,
                    "IdKHTDGChuyen": 0
                };
                $scope.KHDVG = [];
                $scope.KHDVC = [];

            }, function errorCallback(response) {
                toastr.error('Có lỗi xảy ra!', 'Thông báo');
                clearInterval($scope.Handleprog);
                $scope.progress = 0;
            });
        }
    }
    $scope.CopyDataMinhChung = function () {
        if (!$scope.Paging.IdDonViGoc) {
            toastr.error('Chưa chọn đơn vị gốc!', 'Thông báo');
            return;
        }
        if (!$scope.Paging.IdKHTDGGoc) {
            toastr.error('Chưa chọn kế hoạch TĐG đơn vị gốc!', 'Thông báo');
            return;
        }
        if (!$scope.Paging.IdDonViChuyen) {
            toastr.error('Chưa chọn đơn vị được chuyển!', 'Thông báo');
            return;
        }
        if (!$scope.Paging.IdKHTDGChuyen) {
            toastr.error('Chưa chọn kế hoạch TĐG đơn vị được chuyển!', 'Thông báo');
            return;
        }
        if (confirm('Bạn có chắc chắn muốn sao chép toàn bộ dữ liệu minh chứng?')) {
            $scope.progress = 1;
            $scope.Handleprog = setInterval(function () {
                if ($scope.progress < 99) {
                    $scope.progress++;
                    $scope.$apply();
                }

            }, 1000);

            $http({
                method: 'GET',
                url: '/api/Base/CopyDataMinhChung',
                params: {
                    "from": $scope.Paging.IdKHTDGGoc,
                    "to": $scope.Paging.IdKHTDGChuyen,
                }
            }).then(function successCallback(response) {

                bootbox.alert("<b>Sao chép dữ liệu minh chứng thành công: </b>"
                    + response.data + " bản ghi</b> </br>"
                );
                clearInterval($scope.Handleprog);
                $scope.progress = 100;
                $scope.Paging = {
                    "IdDonViGoc": 0,
                    "IdKHTDGGoc": 0,
                    "IdDonViChuyen": 0,
                    "IdKHTDGChuyen": 0
                };
                $scope.KHDVG = [];
                $scope.KHDVC = [];

            }, function errorCallback(response) {
                toastr.error('Có lỗi xảy ra!', 'Thông báo');
                clearInterval($scope.Handleprog);
                $scope.progress = 0;
            });
        }
    }
    $scope.XuLySaiLinkMinhChung = function () {
        
        if (!$scope.Paging.IdKHTDGChuyen) {
            toastr.error('Chưa chọn kế hoạch TĐG đơn vị được chuyển!', 'Thông báo');
            return;
        }
        if (confirm('Bạn có chắc chắn xử lý sai link minh chứng với kế hoạch TĐG này?')) {
            $scope.progress = 1;
            $scope.Handleprog = setInterval(function () {
                if ($scope.progress < 99) {
                    $scope.progress++;
                    $scope.$apply();
                }

            }, 1000);

            $http({
                method: 'GET',
                url: '/api/Base/XuLySaiLinkMinhChung',
                params: {
                    "to": $scope.Paging.IdKHTDGChuyen,
                }
            }).then(function successCallback(response) {

                bootbox.alert("<b>Xử dữ liệu thành công: </b>"
                    + response.data + " bản ghi</b> </br>"
                );
                clearInterval($scope.Handleprog);
                $scope.progress = 100;
                $scope.Paging = {
                    "IdDonViGoc": 0,
                    "IdKHTDGGoc": 0,
                    "IdDonViChuyen": 0,
                    "IdKHTDGChuyen": 0
                };
                $scope.KHDVG = [];
                $scope.KHDVC = [];

            }, function errorCallback(response) {
                toastr.error('Có lỗi xảy ra!', 'Thông báo');
                clearInterval($scope.Handleprog);
                $scope.progress = 0;
            });
        }
    }

    $scope.LoadKHTDG = function (IdDonVi, isDVG) {
        if (isDVG)
            $scope.Paging.IdKHTDGGoc = 0;
        else
            $scope.Paging.IdKHTDGChuyen = 0;

        $http({
            method: "GET",
            url: "/api/KeHoachTDG/GetAll?IdDonVi=" + IdDonVi,
        }).then(
            function successCallback(response) {
                if (isDVG)
                    $scope.KHDVG = response.data;
                else
                    $scope.KHDVC = response.data;
            },
            function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            }
        );
    }
   
}]);

