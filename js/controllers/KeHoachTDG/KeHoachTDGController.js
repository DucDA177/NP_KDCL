angular.module('WebApiApp').controller('KeHoachTDGController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {


    $scope.Del = function (item) {
        if (item.TrangThai == 'DTH') {
            toastr.error('Không thể xóa kế hoạch đang diễn ra', 'Thông báo');
            return;
        }
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/KeHoachTDG/Del?Id=' + item.Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadKeHoachTDG();
            }, function errorCallback(response) {
                //$scope.itemError = response.data;
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    $scope.DoiTrangThai = function (item, TrangThai) {
        if (TrangThai == 'DTH') {
            let checkExistDTH = $scope.KeHoachTDG.filter(x => x.TrangThai == 'DTH').length > 0;
            if (checkExistDTH) {
                toastr.error('Không được phép tiến hành nhiều kế hoạch tự đánh giá cùng lúc', 'Thông báo');
                return;
            }
            //let curDate = new Date();
            let curYear = localStorage.getItem('NamHoc').split('-'); //curDate.getFullYear();
            if (curYear[0] < item.NamHocBD || curYear[1] > item.NamHocKT) {
                toastr.error('Năm học hiện tại không thuộc giai đoạn ' + item.NamHocBD + ' - ' + item.NamHocKT, 'Thông báo');
                return;
            }
            //if (curDate < new Date(item.NgayBD) || curDate > new Date(item.NgayKT)) {
            //    toastr.error('Thời điểm hiện tại không nằm trong thời gian kế hoạch diễn ra', 'Thông báo');
            //    return;
            //}
            $cookies.put('IdKeHoachTDG', item.Id);
            $rootScope.KeHoachTDG = item;
        }
        item.TrangThai = TrangThai

        $http({
            method: 'POST',
            url: 'api/KeHoachTDG/Save?isTrangThaiChange=true',
            data: item
        }).then(function successCallback(response) {
            item = response.data;
            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
            $rootScope.LoadKeHoachTDG();

        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
        });
    }
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

            $scope.KeHoachTDG = response.data.ListOut;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    //$rootScope.LoadKeHoachTDG = function () {

    //    $http({
    //        method: 'GET',
    //        url: 'api/KeHoachTDG/GetAll?IdDonVi=' + $rootScope.CurDonVi.Id
    //    }).then(function successCallback(response) {

    //        $scope.KeHoachTDG = response.data;

    //    }, function errorCallback(response) {
    //        toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
    //    });
    //}

    $rootScope.LoadKeHoachTDG();
    $scope.onCancelKeHoachTDG = function () {
        $scope.filterKeHoachTDG = {
            GetAll: true,
            IdTruong: $rootScope.CurDonVi.Id
        };
        $rootScope.LoadKeHoachTDG();
        $('.filter-select').val(null).trigger("change.select2");
    };
    $scope.onSearchKeHoachTDG = function () {
        $rootScope.LoadKeHoachTDG();
    };

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
                return item?.TrangThai == "DTH" && (item?.ChuyenKeHoach == null || item?.ChuyenKeHoach == false) && item?.IdKeHoachDGN==null
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