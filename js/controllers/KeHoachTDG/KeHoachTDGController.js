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
    
    $rootScope.LoadKeHoachTDG = function () {

        $http({
            method: 'GET',
            url: 'api/KeHoachTDG/GetAll?IdDonVi=' + $rootScope.CurDonVi.Id
        }).then(function successCallback(response) {

            $scope.KeHoachTDG = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $rootScope.LoadKeHoachTDG();
}]);