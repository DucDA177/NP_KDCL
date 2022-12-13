angular.module('WebApiApp').controller('GuiBaoCaoController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    //Load kế hoạch tự đnahs giá
    $scope.ServiceLoadKeHoachTDG = function (data) {
        return $http.post("api/KeHoachTDG/FilterKeHoachTDG", data)
    }
    $scope.filterKeHoachTDG = {
        GetAll: true,
        //ChuyenKeHoach: true,
        IdTruong: $rootScope.CurDonVi.Id
    };
    $rootScope.LoadKeHoachTDG = function () {
        $scope.ServiceLoadKeHoachTDG($scope.filterKeHoachTDG).then(function successCallback(response) {

            $scope.KeHoachTDG = response.data.ListOut.filter(x => x.TrangThai == 'DTH');

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    
    $rootScope.LoadKeHoachTDG();
  
    //End Load Kế hoạch tự đánh giá

    $scope.ChuyenKeHoachTDG = function (KeHoach, TypeCapNhat) {
        if (TypeCapNhat == "CHUYEN") {
            if (!confirm("Bạn có chắc chắn hoàn thành kế hoạch và chuyển cho sở?")) {
                return;
            }
            KeHoach.ChuyenKeHoach = true;
        }
        if (TypeCapNhat == "THUHOI") {
            if (!confirm("Bạn có chắc chắn muốn thu hồi kế hoạch?")) {
                return;
            }
            KeHoach.ChuyenKeHoach = false;
        }
        $http({
            method: 'POST',
            url: 'api/KeHoachTDG/Save?isTrangThaiChange=false',
            data: KeHoach
        }).then(function successCallback(response) {
            toastr.success('Cập nhật thành công !', 'Thông báo');
            $rootScope.LoadKeHoachTDG();
        }, function errorCallback(response) {
            $scope.itemError = response.data;
            if ($scope.itemError.ModelState)
                toastr.error('Có lỗi xảy ra trong quá trình cập nhật !', 'Thông báo');
            else
                toastr.error('Có lỗi xảy ra! ' + $scope.itemError.Message, 'Thông báo');
        });
    }

    $scope.CheckView = function (item, type) {
        switch (type) {
            case "CHUYEN":
                return item?.TrangThai == "DTH" && (item?.ChuyenKeHoach == null || item?.ChuyenKeHoach == false) && item?.IdKeHoachDGN == null
                break;
            case "THUHOI":
                return item?.TrangThai == "DTH" && item?.ChuyenKeHoach == true && item?.IdKeHoachDGN == null
                break;
            case "DELETE":
                return item?.TrangThai != "DTH" && item?.IdKeHoachDGN == null
                break;
            case "EDIT":
                return item?.IdKeHoachDGN == null
                break;
            default:
                break;
        }
    }

    $scope.ConfirmAction = function (typeUpdate) {
        switch (typeUpdate) {
            case "CHUYEN":
                if (!confirm("Bạn có chắc chắn muốn chuyển kế hoạch lên cho sở?")) {
                    return;
                }
                break;
            case "THUHOI":
                if (!confirm("Bạn có chắc chắn muốn thu hồi kế hoạch?")) {
                    return;
                }
                break;
        }
        return true
    }
    $scope.UpdateTrangThaiKH = function (item, typeUpdate) {
        if (!$scope.ConfirmAction(typeUpdate)) {
            return
        }
        switch (typeUpdate) {
            case "CHUYEN":
                item.ChuyenKeHoach = true
                break;
            case "THUHOI":
                item.ChuyenKeHoach = false
                break;

        }
        $http({
            method: 'POST',
            url: 'api/KeHoachTDG/ChuyenKeHoach',
            data: item
        }).then(function successCallback(response) {
            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
            $rootScope.LoadKeHoachTDG();
        }, function errorCallback(response) {
            $scope.itemError = response.data;
            if ($scope.itemError.ModelState)
                toastr.error('Có lỗi xảy ra trong quá trình cập nhật dữ liệu !', 'Thông báo');
            else
                toastr.error('Có lỗi xảy ra! ' + $scope.itemError.Message, 'Thông báo');
        });

    }
}]);