angular.module('WebApiApp').controller("ModalDMDonViHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    // console.log($scope.item)
    $scope.type = $scope.$resolve.type;
    if ($scope.item) {
        try { $scope.item.ThongTinKhac = JSON.parse($scope.item.ThongTinKhac) } catch { }

        $scope.LoadProvin('0', '0', '0');
        $scope.LoadProvin($scope.item.IDTinh, $scope.item.IDHuyen, $scope.item.IDXa);
        //console.log($scope.item)
    }
    else {
        $scope.LoadProvin('0', '0', '0');
        $scope.item = {
            FInUse: true,
            ThongTinKhac: {}
        }
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }


    $scope.SaveModal = function () {
        $scope.item.ThongTinKhac = JSON.stringify($scope.item.ThongTinKhac)

        $http({
            method: 'POST',
            url: 'api/DonVi/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMDonVi", {});
            $rootScope.LoadDMDonVi();
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.SaveAndNew = function () {
        $scope.item.ThongTinKhac = JSON.stringify($scope.item.ThongTinKhac)

        $http({
            method: 'POST',
            url: 'api/DonVi/Save',
            data: $scope.item
        }).then(function successCallback(response) {

            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            $rootScope.LoadDMDonVi();
            $scope.item = '';
            $scope.itemError = "";
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.ValidMaDv = function () {

        $http({
            method: 'GET',
            url: 'api/DonVi/ValidMaDV?MaDV=' + $scope.item.MaDonVi,
        }).then(function successCallback(response) {
            if (response.data == null || response.data == [] || response.data == '' || response.data == undefined)
                toastr.success('Có thể sử dụng mã này!', 'Thông báo');
            else {
                toastr.error('Mã này đã sử dụng!', 'Thông báo');
                $scope.item.MaDonVi = ''
            }
        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }

    $scope.LoadLoaiTruong = function () {

        $http({
            method: 'GET',
            url: 'api/DonVi/LoadLoaiTruong',
        }).then(function successCallback(response) {
            $scope.LoaiTruong = response.data;

        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }

    $scope.ValidOnlyCode = function (FCode) {
        if (typeof $scope.item == 'undefined') {
            $scope.item = {};

        }
        $http({
            method: 'GET',
            url: '/api/CheckValidPosition/' + FCode,
        }).then(function successCallback(response) {

            if (response.data != 'undefined') {
                $scope.item = response.data;
                toastr.warning('Mã này đã tồn tại !', 'Thông báo');
            }
            else {

                $scope.item.Id = 0;
                $scope.item.FName = null;
                $scope.item.FDescription = null;
                toastr.success('Có thể sử dụng mã này !', 'Thông báo');
            }
        }, function errorCallback(response) {
        });
    }
    if ($scope.item != null) $scope.read = true;
    else {
        $scope.item = {};
        $scope.read = false;
    }
    $scope.LoadLoaiTruong();

    $scope.LoadAllDonVi();
});

angular.module('WebApiApp').controller("ModalDMChungHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;
    if ($scope.item == null || $scope.item == undefined || $scope.item == '') {
        $scope.item = {
            FInUse: true,
            Maloai: $scope.check.Ma,
            IdCha: $scope.check.Id
        }
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }


    $scope.SaveModal = function () {

        $http({
            method: 'POST',
            url: 'api/DMChung/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMChung", {});
            $rootScope.LoadDMChung();
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.SaveAndNew = function () {


        $http({
            method: 'POST',
            url: 'api/DMChung/Save',
            data: $scope.item
        }).then(function successCallback(response) {

            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMChung", {});
            $rootScope.LoadDMChung();
            $scope.item = {
                FInUse: true,
                Maloai: $scope.check.Ma,
                IdCha: $scope.check.Id
            }
            document.getElementById("Ma").focus();
            $scope.itemError = "";
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.ValidMa = function () {

        $http({
            method: 'GET',
            url: 'api/DMChung/ValidMa?Ma=' + $scope.item.Ma + '&IdCha=' + $scope.item.IdCha,
        }).then(function successCallback(response) {
            if (response.data == null || response.data == [] || response.data == '' || response.data == undefined)
                toastr.success('Có thể sử dụng mã này!', 'Thông báo');
            else {
                toastr.error('Mã này đã sử dụng!', 'Thông báo');
                $scope.item.Ma = ''
            }
        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }
    $(document).keyup(function (e) {
        if (e.which == 13) {
            $scope.SaveAndNew();
        }
    });
});
angular.module('WebApiApp').controller("ModalDMChaHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;
    if ($scope.item == null || $scope.item == undefined || $scope.item == '') {
        $scope.item = {
            FInUse: true
        }
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }


    $scope.SaveModal = function () {

        $http({
            method: 'POST',
            url: 'api/DMChung/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMChung", {});
            $rootScope.LoadDMCha();
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.SaveAndNew = function () {


        $http({
            method: 'POST',
            url: 'api/DMChung/Save',
            data: $scope.item
        }).then(function successCallback(response) {

            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadDMChung", {});
            $rootScope.LoadDMCha();
            $scope.item = {
                FInUse: true
            }
            $scope.itemError = "";
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.ValidMa = function () {

        $http({
            method: 'GET',
            url: 'api/DMChung/ValidMa?Ma=' + $scope.item.Ma + '&IdCha=' + $scope.item.IdCha,
        }).then(function successCallback(response) {
            if (response.data == null || response.data == [] || response.data == '' || response.data == undefined)
                toastr.success('Có thể sử dụng mã này!', 'Thông báo');
            else {
                toastr.error('Mã này đã sử dụng!', 'Thông báo');
                $scope.item.Ma = ''
            }
        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }

});
angular.module('WebApiApp').controller("ModalHoSoDonViHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.LoadProvin('0', '0', '0')

    if ($scope.item == null || $scope.item == undefined || $scope.item == '') {
        $scope.item = {
            FInUse: true,
            Loai: $scope.$resolve.check,
            Matinh: '30'
        }
        $scope.LoadProvin("0", "0", "0");
        $scope.LoadProvin($scope.DefaultArea, "0", "0");
    }
    else {
        if ($scope.item.Ngaysinh)
            $scope.item.Ngaysinh = new Date($scope.item.Ngaysinh);
        if ($scope.item.Ngaycap)
            $scope.item.Ngaycap = new Date($scope.item.Ngaycap);
        if ($scope.item.Ngayhethan)
            $scope.item.Ngayhethan = new Date($scope.item.Ngayhethan);
        $scope.LoadProvin("0", "0", "0");
        $scope.LoadProvin($scope.item.Matinh, $scope.item.Mahuyen, '0');
    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.Save = function (isNew) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        $http({
            method: "POST",
            url: 'api/HoSoDonVi/Save',
            data: $scope.item,
        }).then(
            function successCallback(response) {
                toastr.success("Lưu dữ liệu thành công!", "Thông báo");
                $scope.item = response.data;
                if (isNew == 1) {
                    $scope.item = {
                        FInUse: true,
                        Loai: $scope.$resolve.check,
                        Matinh: '30'
                    }
                } else $scope.cancelModal();

                $rootScope.LoadDonVi();
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.Validate = function () {
        if (!$scope.item.Hovaten) return "Họ và tên bắt buộc nhập!";
        if (!$scope.item.Matinh) return "Tỉnh/ Thành phố bắt buộc chọn!";
        if (!$scope.item.Mahuyen) return "Quận/ Huyện bắt buộc chọn!";
        if (!$scope.item.Maxa) return "Xã/ Phường bắt buộc chọn!";
        try {
            $scope.item.Ngaysinh = ConvertToDate($scope.item.Ngaysinh);
            $scope.item.Ngaycap = ConvertToDate($scope.item.Ngaycap);
            $scope.item.Ngayhethan = ConvertToDate($scope.item.Ngayhethan);
        } catch { }
        return 1;
    };

});
angular.module('WebApiApp').controller("ModalDMCacThanhVienHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $timeout) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    if (!$scope.item) {
        $scope.item = {
            IdDonvi: $scope.check,
            Gioitinh: 'Nam'
        }
    }
    else {
        if ($scope.item.Ngaysinh)
            $scope.item.Ngaysinh = new Date($scope.item.Ngaysinh);
        $scope.item.Hovaten = $scope.item.Hodem + ' ' + $scope.item.Ten;
    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.Save = function (isNew) {
        if ($scope.Validate() != 1) {
            var str = $scope.Validate();
            toastr.error(str, "Thông báo");
            return;
        }
        if ($scope.item.Ngaysinh instanceof Date)
            $scope.item.Ngaysinh = ConvertToDate($scope.item.Ngaysinh);
        $http({
            method: "POST",
            url: 'api/DMCacThanhVien/Save',
            data: $scope.item,
        }).then(
            function successCallback(response) {
                toastr.success("Lưu dữ liệu thành công!", "Thông báo");
                $scope.item = response.data;
                $rootScope.Load();
                $scope.cancelModal();
                if (isNew == 1)
                    $scope.openModal('', 'DMCacThanhVien', $scope.check)
                try {
                    $rootScope.SelectedDoiTuong.push($scope.item)
                } catch { }
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.Validate = function () {
        if (!$scope.item.Hovaten) return "Họ và tên bắt buộc nhập!";
        if (!$scope.item.Chucvu) return "Chức vụ bắt buộc nhập!";
        if (!$scope.item.Vitri) return "Vị trí làm việc bắt buộc nhập!";
        $scope.item.Hodem = $scope.item.Hovaten.split(" ").slice(0, -1).join(" ");
        $scope.item.Ten = $scope.item.Hovaten.split(" ").slice(-1).join(" ");
        return 1;
    };

});
angular.module('WebApiApp').controller("ModalThongBaoHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    if ($scope.item == null || $scope.item == undefined || $scope.item == '') {
        $scope.item = {
            FInUse: true,
            NguoiGui: $rootScope.user.HoTen
        }
    } else {
        if ($scope.item.DonViNhan != null && $scope.item.DonViNhan != '') $scope.CacDonVi = JSON.parse($scope.item.DonViNhan)
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    $scope.LoadDMDonVi = function () {

        $http({
            method: 'GET',
            url: 'api/DonVi/LoadAllDonVi'
        }).then(function successCallback(response) {

            $scope.ListDonVi = response.data.filter(t => t.Id != $rootScope.CurDonVi.Id);

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    $scope.LoadDMDonVi();

    $scope.SaveModal = function () {
        $scope.item.DonViNhan = JSON.stringify($scope.CacDonVi)
        $http({
            method: 'POST',
            url: 'api/ThongBao/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadThongBao", {});
            $rootScope.LoadThongBao();
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }
    $scope.SaveAndNew = function () {
        $scope.item.DonViNhan = JSON.stringify($scope.CacDonVi)

        $http({
            method: 'POST',
            url: 'api/ThongBao/Save',
            data: $scope.item
        }).then(function successCallback(response) {

            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            //$rootScope.$emit("LoadThongBao", {});
            $rootScope.LoadThongBao();
            $scope.item = {
                FInUse: true,
                NguoiGui: $rootScope.user.HoTen
            }
            $scope.itemError = "";
            $scope.LoadDMDonVi();
        }, function errorCallback(response) {
            $scope.itemError = response.data;

            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }


});
angular.module('WebApiApp').controller("ModalConfigHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.itemUser = $scope.$resolve.item;
    $scope.item = {};
    if ($scope.itemUser.GhiChu) {
        $scope.item = JSON.parse($scope.itemUser.GhiChu)
        if ($scope.item.LoaiHoSo != undefined && $scope.item.LoaiHoSo.length == 20)
            $scope.checkAll = true;
    }
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.onCheckAll = function () {
        $scope.item.LoaiHoSo = []
        if ($scope.checkAll) {
            angular.forEach($scope.LoaiHoSo, function (value, key) {
                $scope.item.LoaiHoSo.push(value.Ma)
            });
        }

    }
    $scope.SaveModal = function () {
        if (!$scope.item.CanBo) {
            toastr.error('Tên cán bộ quản lý bắt buộc nhập', 'Thông báo');
            return;
        }
        $scope.itemUser.GhiChu = JSON.stringify($scope.item);
        $http({
            method: 'POST',
            url: '/api/UserProfiles',
            data: $scope.itemUser
        }).then(function successCallback(response) {
            toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
            //$scope.itemUser.Config = $scope.item;
            $scope.cancelModal();
        }, function errorCallback(response) {
            //$scope.itemUserError = response.data;
            toastr.error('Có lỗi trong quá trình lưu dữ liệu !', 'Thông báo');
        });
    }


});

angular.module("WebApiApp").controller("ModalViewPDFHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $(document).contextmenu(function () { return false; });
    url = $scope.check;
    var thePdf = null;
    var scale = 1;
    pdfjsLib.getDocument(url).promise.then(function (pdf) {

        thePdf = pdf;
        viewer = document.getElementById('pdf-viewer');
        for (page = 1; page <= pdf.numPages; page++) {
            canvas = document.createElement('canvas');
            canvas.className = 'pdf-page-canvas';
            viewer.appendChild(canvas);
            renderPage(page, canvas);
        }
    });
    function renderPage(pageNumber, canvas) {
        thePdf.getPage(pageNumber).then(function (page) {
            viewport = page.getViewport(scale);
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport });
        });
    }
    // console.log($scope.item)

});
angular.module("WebApiApp").controller("ModalChonOCungHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;

    $scope.OnSubFolder = function (parFolder) {
        if ($scope.check == 'backup')
            $scope.item.Folder = parFolder;
        if ($scope.check == 'restore_bak') {
            if (!parFolder.includes('.bak')) {
                toastr.error("Không phải định dạng tệp tin cơ sở dữ liệu<.bak>. Vui lòng kiểm tra lại!", "Thông báo");
                return;
            }
            $scope.item.LinkDatabase = parFolder;
        }

        if ($scope.check == 'restore_datancc')
            $scope.item.LinkDataNCC = parFolder;

        $scope.cancelModal();
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };

    $scope.OnSelectDisk = function (parFolder, close) {
        if ($scope.ServerPath.includes(parFolder)) {
            if (confirm('Ổ cứng ' + parFolder
                + ' chứa dữ liệu gốc. Việc sao lưu nên được thực hiện ở ổ cứng khác. Bạn có chắc chắn tiếp tục?'))
                $scope.LoadSubFolders(parFolder)
        }
        else $scope.LoadSubFolders(parFolder)

        if (close) $scope.OnSubFolder(parFolder)
    }
    $scope.LoadAllDrives = function () {

        $http({
            method: "GET",
            url: "api/BackupRestore/GetAllDrives",
        }).then(
            function successCallback(response) {
                $scope.AllDrives = response.data.ls;
                console.log($scope.AllDrives)
                $scope.ServerPath = response.data.server;
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.LoadAllDrives();

    $scope.LoadSubFolders = function (parFolder) {

        $http({
            method: "GET",
            url: "api/BackupRestore/GetSubFolders",
            params: {
                "parFolder": parFolder
            }
        }).then(
            function successCallback(response) {

                $scope.CurFolder = parFolder;
                $scope.SubFolders = response.data;


            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.GoBack = function () {
        $http({
            method: "GET",
            url: "api/BackupRestore/GetParentFolders?subFolder=" + $scope.CurFolder,
        }).then(
            function successCallback(response) {
                $scope.LoadSubFolders(response.data.FullPath)
            },
            function errorCallback(response) {
                //console.log(response)
                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    }
    $scope.NewFolder = function () {
        bootbox.prompt("Nhập tên thư mục mới", function (result) {
            if (!result)
                return;
            else
                $http({
                    method: "GET",
                    url: "api/BackupRestore/CreateFolder",
                    params: {
                        path: $scope.CurFolder + '/' + result
                    }
                }).then(
                    function successCallback(response) {
                        toastr.success("Tạo mới thư mục thành công", "Thông báo");
                        $scope.LoadSubFolders($scope.CurFolder)
                        return;
                    },
                    function errorCallback(response) {
                        //console.log(response)
                        toastr.error("Lỗi " + response.data.Message, "Thông báo");
                    }
                );
        });


    }
});
angular.module("WebApiApp").controller("ModalDeleteBakHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $scope.ListBakChecked = []
    $scope.Check = false;

    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListBak, function (value, key) {
            value.Check = $scope.Check;
            $scope.OnCheck(value)
        });

    }
    $scope.OnCheck = function (item) {
        let check = $scope.ListBakChecked.filter(t => t.Id != item.Id)

        if (item.Check && check.length == $scope.ListBakChecked.length) {
            $scope.ListBakChecked.push(item)
        }
        if (!item.Check && check.length != $scope.ListBakChecked.length) {
            $scope.ListBakChecked = check
        }

    }
    $scope.LoadAllBak = function () {

        $http({
            method: "GET",
            url: "api/BackupRestore/LoadAllBak",
        }).then(
            function successCallback(response) {
                $scope.ListBak = response.data
            },
            function errorCallback(response) {

                toastr.error("Lỗi " + response.data.Message, "Thông báo");
            }
        );
    };
    $scope.LoadAllBak();

    $scope.DeleteBak = function () {
        if ($scope.ListBakChecked.length == 0) {
            toastr.error("Không có bản ghi nào được chọn!", "Thông báo");
            return;
        }
        if (confirm('Bạn có chắc chắn thực hiện thao tác này?'))
            $http({
                method: "POST",
                url: "api/BackupRestore/DeleteBak",
                data: $scope.ListBakChecked
            }).then(
                function successCallback(response) {
                    toastr.success("Xóa dữ liệu thành công!", "Thông báo");
                    $scope.LoadAllBak();
                    $rootScope.LoadLogBackup();
                },
                function errorCallback(response) {

                    toastr.error("Lỗi " + response.data.Message, "Thông báo");
                }
            );
    };
});
angular.module("WebApiApp").controller("ModalRestoreHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    $scope.dtb = true; $scope.hsncc = true;
    if (!$scope.item.LinkDatabase) $scope.dtb = false;
    if (!$scope.item.LinkDataNCC) $scope.hsncc = false;
    $scope.progress = 0;

    $scope.Restore = function () {

        if (!$scope.dtb && !$scope.hsncc) {
            toastr.error('Chọn ít nhất một loại dữ liệu để phục hồi!', 'Thông báo');
            return;
        }
        $scope.progress = 1;
        $scope.Handleprog = setInterval(function () {
            if ($scope.progress < 99) {
                $scope.progress++;
                $scope.$apply();
            }

        }, 2000);

        $http({
            method: 'POST',
            url: '/api/BackupRestore/Restore',
            data: {
                "bk": $scope.item,
                "dtb": $scope.dtb,
                "hsncc": $scope.hsncc
            }
        }).then(function successCallback(response) {

            //bootbox.alert(
            //    "<b>Kết quả phục hồi dữ liệu: </b> </br>" +
            //    //"<b> - Cơ sở dữ liệu : " + response.data.LinkDatabase + "</b> </br>" +
            //    //"<b> - Hồ sơ NCC : " + response.data.LinkDataNCC + "</b> </br>" +
            //    "<b> Bao gồm : " + response.data.fileCopy + " tệp được khôi phục </b> </br>"
            //);
            clearInterval($scope.Handleprog);
            $scope.progress = 100;
            toastr.success('Phục hồi dữ liệu thành công!', 'Thông báo');
        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra! ' + response.data.Message, 'Thông báo');
            clearInterval($scope.Handleprog);
            $scope.progress = 0;
        });
    }

});
angular.module("WebApiApp").controller("ModalRestoreLogHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };

    $scope.LoadRestoreLog = function () {


        $http({
            method: 'GET',
            url: '/api/BackupRestore/LoadRestoreLog',
        }).then(function successCallback(response) {
            $scope.ListRsLog = response.data;
        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra!', 'Thông báo');

        });
    }
    $scope.LoadRestoreLog();
});
angular.module("WebApiApp").controller("ModalSetBackupConfigHandlerController", function ($rootScope, $scope, $http, $uibModalInstance, $localStorage) {
    $scope.item = $scope.$resolve.item;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss("close");
    };
    if ($rootScope.CurDonVi.TTGui == '1') {
        $scope.item.dtb = false;
        $("#dtb").attr('disabled', 'disabled');
    }

    $scope.LoadConfig = function () {
        $http({
            method: "GET",
            url: "/api/BackupRestore/LoadConfig",
        }).then(
            function successCallback(response) {


                $rootScope.LoadConfig();

                if (response.data) {
                    $scope.item = response.data;
                    $scope.item.time = new Date();
                    $scope.item.time.setHours($scope.item.hour);
                    $scope.item.time.setMinutes($scope.item.min);

                }

            },
            function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            }
        );
    }
    $scope.LoadConfig();

    $scope.Save = function () {

        if (!$scope.item.Folder) {
            toastr.error('Chưa chọn đường dẫn lưu!', 'Thông báo');
            return;
        }
        if (!$scope.item.dtb && !$scope.item.hsncc) {
            toastr.error('Chọn ít nhất một loại sao lưu!', 'Thông báo');
            return;
        }
        if (!$scope.item.time) {
            toastr.error('Chưa chọn thời gian sao lưu tự động trong ngày!', 'Thông báo');
            return;
        }
        $scope.item.hour = $scope.item.time.getHours();
        $scope.item.min = $scope.item.time.getMinutes();
        $scope.item.isActive = true;

        $http({
            method: 'POST',
            url: '/api/BackupRestore/SetTimeBackup',
            data: $scope.item
        }).then(function successCallback(response) {
            toastr.success('Đã thiết lập lịch tự động sao lưu lúc ' + $scope.item.hour
                + ' giờ ' + $scope.item.min + ' phút hàng ngày', 'Thông báo');

            $scope.LoadConfig();

        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra!', 'Thông báo');

        });
    }
    $scope.CancelJob = function () {
        // $scope.item.isActive = false;
        $http({
            method: 'GET',
            url: '/api/BackupRestore/CancelTimeBackup',
        }).then(function successCallback(response) {
            toastr.success('Đã hủy lịch tự động sao lưu lúc ' + $scope.item.hour
                + ' giờ ' + $scope.item.min + ' phút hàng ngày', 'Thông báo');

            $scope.LoadConfig();

        }, function errorCallback(response) {
            toastr.error('Có lỗi xảy ra!', 'Thông báo');

        });
    }

});


//Thêm danh mục tiêu chuẩn
angular.module('WebApiApp').controller("ModalDMTieuChuanHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;
    $scope.type = $scope.$resolve.type;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    if (!$scope.item) {
        $scope.item = {
            "FInUse": true,
            "IdQuyDinh": $rootScope.IdQuyDinh
        }
    }

    // Load lên STT
    $scope.LoadSTT = function () {
        if (!$scope.item.STT)
            $http({
                method: "GET",
                url: "api/DanhMucTieuChuan/LaySTT?IdQuyDinh=" + $rootScope.IdQuyDinh
            }).then(function successCallback(response) {
                $scope.item.STT = response.data;
                $scope.item.ThuTu = response.data;
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
    }
    $scope.LoadSTT();

    // Lưu dữ liệu
    $scope.Save = function (isNew) {

        $http({
            method: "POST",
            url: "api/DanhMucTieuChuan/LuuDanhMucTieuChuan",
            data: $scope.item,
        }).then(function successCallback(response) {
            toastr.success('Lưu dữ liệu thành công!', 'Thông báo');
            $scope.item = response.data;
            $scope.itemError = ''
            $rootScope.LoadDMTieuChuan();
            $scope.cancelModal()
            if (isNew)
                $scope.openModalSmall('', 'DMTieuChuan');

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.warning('Có lỗi trong quá trình lưu dữ liệu hoặc chưa điền các trường bắt buộc!', 'Thông báo');
        });
    }


});


//Thêm danh mục tiêu chí
angular.module('WebApiApp').controller("ModalDMTieuChiHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;
    $scope.type = $scope.$resolve.type;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    if (!$scope.item) {
        $scope.item = {
            "FInUse": true,
            "IdTieuChuan": $rootScope.IdTieuChuan
        }
    }

    // Load lên STT
    $scope.LoadSTT = function () {
        if (!$scope.item.STT)
            $http({
                method: "GET",
                url: "api/DanhMucTieuChi/LaySTT?IdTieuChuan=" + $rootScope.IdTieuChuan
            }).then(function successCallback(response) {
                $scope.item.STT = response.data;
                $scope.item.ThuTu = response.data;
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
    }
    $scope.LoadSTT();


    // Lưu dữ liệu
    $scope.Save = function (isNew) {

        $http({
            method: "POST",
            url: "api/DanhMucTieuChi/LuuDanhMucTieuChi",
            data: $scope.item,
        }).then(function successCallback(response) {
            toastr.success('Lưu dữ liệu thành công!', 'Thông báo');
            $scope.item = response.data;
            $scope.itemError = ''
            $rootScope.LoadDMTieuChi();
            $scope.cancelModal()
            if (isNew)
                $scope.openModal('', 'DMTieuChi');

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.warning('Có lỗi trong quá trình lưu dữ liệu hoặc chưa điền đầy đủ nội dung bắt buộc!', 'Thông báo');
        });
    }
});

//Kế hoạch tự đánh giá
angular.module('WebApiApp').controller("ModalKeHoachTDGHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    if (!$scope.item)
        $scope.item = {
            IdDonVi: $rootScope.CurDonVi.Id,
            FInUse: true,
            TrangThai: 'CTH'
        }
    else {
        $scope.item.NgayBD = new Date($scope.item.NgayBD)
        $scope.item.NgayKT = new Date($scope.item.NgayKT)
    }
    $scope.SaveModal = function (isNew) {

        if ($scope.item.NgayBD >= $scope.item.NgayKT) {
            toastr.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc !', 'Thông báo');
            return;
        }
        if ($scope.item.NamHocBD >= $scope.item.NamHocKT) {
            toastr.error('Nửa đầu năm học phải nhỏ hơn nửa sau năm học !', 'Thông báo');
            return;
        }

        if ($scope.item.NgayBD && $scope.item.NgayKT)
            if ($scope.item.NgayBD.getFullYear() < $scope.item.NamHocBD
                || $scope.item.NgayBD.getFullYear() > $scope.item.NamHocKT
                || $scope.item.NgayKT.getFullYear() < $scope.item.NamHocBD
                || $scope.item.NgayKT.getFullYear() > $scope.item.NamHocKT) {
                toastr.error('Ngày bắt đầu và ngày kết thúc phải thuộc năm học đã nhập !', 'Thông báo');
                return;
            }

        $http({
            method: 'POST',
            url: 'api/KeHoachTDG/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
            $rootScope.LoadKeHoachTDG();
            $scope.cancelModal();
            if (isNew)
                $scope.openModal('', 'KeHoachTDG')

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            if ($scope.itemError.ModelState)
                toastr.error('Có lỗi xảy ra hoặc bạn chưa điền đầy đủ các trường bắt buộc !', 'Thông báo');
            else
                toastr.error('Có lỗi xảy ra! ' + $scope.itemError.Message, 'Thông báo');
        });

    }

    // Load danh mục trong bảng tblDanhmuc
    $scope.LoadDanhMuc('QuyDinh', 'QUYDINH', '', '', '');

});

//Hội đồng
angular.module('WebApiApp').controller("ModalHoiDongHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    if (!$scope.item)
        $scope.item = {
            IdDonVi: $rootScope.CurDonVi.Id,
            IdKeHoachTDG: $rootScope.KeHoachTDG.Id,
            FInUse: true,
        }

    $scope.SaveModal = function (isNew) {

        $http({
            method: 'POST',
            url: 'api/HoiDong/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
            $rootScope.LoadHoiDong();
            $scope.cancelModal();
            if (isNew)
                $scope.openModal('', 'HoiDong')

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.error('Có lỗi xảy ra hoặc bạn chưa điền đầy đủ các trường bắt buộc !', 'Thông báo');

        });

    }

    // Load danh mục trong bảng tblDanhmuc
    $scope.LoadDanhMuc('NhiemVu', 'NHIEMVU');
    $scope.LoadDanhMuc('ChucVu', 'CHUCVU');

    $scope.LoadUser = function () {

        $http({
            method: 'GET',
            url: 'api/UserProfile/GetUsers?pageNumber=1&pageSize=9999&searchKey=&maDV=' + $rootScope.CurDonVi.Id
        }).then(function successCallback(response) {
            $scope.ListUsers = response.data.dt;
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();
});

// Thiết lập tiêu chuẩn, tiêu chí cho từng user
angular.module('WebApiApp').controller("ModalPhanQuyenTCHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.itemGroup = $scope.$resolve.item;
    $scope.MenuArr = [];
    $rootScope.IdQuyDinh = 0;
    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.SaveModal = function () {
        $scope.MenuArr = [];
        $scope.MenuDrop.filter(x => x.LoaiDuLieu == 2 && x.IsCheck == true).forEach(t => {
            $scope.MenuArr.push(t.Id);
        });

        $scope.$resolve.item.TieuChi = JSON.stringify($scope.MenuArr);

        $http({
            method: 'POST',
            url: '/api/UserProfiles/',
            data: $scope.$resolve.item
        }).then(function successCallback(response) {
            toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemRoleError = response.data;
            $scope.LoadError($scope.itemRoleError.ModelState);
        });

    }

    // Hàm click chọn
    $scope.OnCheck = function (item) {
        if (item.IsCheck == true) {
            // Nếu là tích chọn
            if (item.LoaiDuLieu == 1) {
                // Nếu là dữ liệu cha, khi click => chọn tất cả dữ liệu con
                item.IsCheck = true;
                $scope.MenuDrop.filter(x => x.LoaiDuLieu == 2 && x.IdChiTieuCha == item.Id).forEach(t => {
                    t.IsCheck = true;
                });
            } else {
                // Nếu là dữ liệu con => click cho dữ liệu cha
                item.IsCheck = true;
                $scope.MenuDrop.filter(x => x.LoaiDuLieu == 1 && x.Id == item.IdChiTieuCha).forEach(t => {
                    t.IsCheck = true;
                });
            }
        } else {
            // nếu là tích bỏ
            if (item.LoaiDuLieu == 1) {
                // Nếu là dữ liệu cha, khi click => hủy bỏ chọn tất cả dữ liệu con
                item.IsCheck = false;
                $scope.MenuDrop.filter(x => x.LoaiDuLieu == 2 && x.IdChiTieuCha == item.Id).forEach(t => {
                    t.IsCheck = false;
                });
            } else {
                // Nếu là dữ liệu con => chỉ hủy bỏ dữ liệu con
                item.IsCheck = false;

                if ($scope.MenuDrop.filter(x => x.LoaiDuLieu == 2 && x.IdChiTieuCha == item.IdChiTieuCha && x.IsCheck == true).length == 0) {
                    $scope.MenuDrop.filter(x => x.LoaiDuLieu == 1 && x.Id == item.IdChiTieuCha).forEach(t => {
                        t.IsCheck = false;
                    });
                }
            }
        }
    }

    // Hàm tích chọn tất cả
    $scope.CheckAll = function (itemAll) {
        if (itemAll.Check == true) {
            $scope.MenuDrop.forEach(x => {
                x.IsCheck = true;
            });
        } else {
            $scope.MenuDrop.forEach(x => {
                x.IsCheck = false;
            });
        }
    }

    $scope.Gr_Menu = {
        CodeGroup: '',
        MenuArr: []
    }

    $scope.GetAllMenuDrop = function () {
        $http({
            method: 'GET',
            url: '/api/UserProfile/LoadTieuChuanTieuChi?idQuyDinh=' + $rootScope.IdQuyDinh
                + '&userId=' + $scope.$resolve.item.Id
        }).then(function successCallback(response) {
            $scope.MenuDrop = response.data;
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });
    }

    $scope.AfterGetQuyDinh = function () {
        if ($scope.QuyDinh.length > 0) {
            if ($rootScope.KeHoachTDG)
                $rootScope.IdQuyDinh = $rootScope.KeHoachTDG.IdQuyDinhTC;
            else
                $rootScope.IdQuyDinh = $scope.QuyDinh[0].Id;
            $scope.GetAllMenuDrop();
        }
    }

    // Load danh mục trong bảng tblDanhmuc
    $scope.LoadDanhMuc('QuyDinh', 'QUYDINH', '', '', '', $scope.AfterGetQuyDinh);
});

//Thiết lập minh chứng và gợi ý
angular.module('WebApiApp').controller("ModalMinhChungHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.hideBtn = $scope.check;

    $scope.NoiDungChiSo = '';

    if (!$scope.item) {
        $scope.item = {
            "IdTieuChi": 0,
            "HeThongMa": '',
            "IdDonVi": $rootScope.CurDonVi.Id,
            "IdKeHoachTDG": $rootScope.KeHoachTDG.Id,
            "ChiSo": 'A'
        }
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.RenderNoiDungChiSo = function () {
        let dsTieuChi = $scope.DsTieuChi.filter(t => t.Id == $scope.item.IdTieuChi);
        if (dsTieuChi.length > 0) {
            $scope.NoiDungChiSo = dsTieuChi[0]['YeuCau' + $scope.item.ChiSo]
        }
        else {
            if ($scope.DsTieuChi.length > 0)
                $scope.NoiDungChiSo = $scope.DsTieuChi[0]['YeuCau' + $scope.item.ChiSo]
            else
                $scope.NoiDungChiSo = ''
        }

    }

    $scope.LoadDMTieuChuan = function () {
        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChuan/LoadTCTCByUser'
        }).then(function successCallback(response) {
            $scope.DSTCTC = response.data;
            $scope.DSTieuChuan = $scope.DSTCTC.map(t => t.tchuan);

            if ($scope.DSTieuChuan.length > 0) {
                $scope.IdTieuChuan = $scope.DSTieuChuan[0].Id;
                $scope.LoadTieuChi();
            }
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.LoadTieuChi = function () {

        $scope.DsTieuChi = $scope.DSTCTC
            .filter(x => x.tchuan.Id == $scope.IdTieuChuan)
            .map(t => t.tchi)[0];

        if ($scope.DsTieuChi.length > 0 && !$scope.item.IdTieuChi) {
            $scope.item.IdTieuChi = $scope.DsTieuChi[0].Id;
        }
        $scope.renderHeThongMa();
        $scope.renderMa();
        $scope.RenderNoiDungChiSo();

    }


    $scope.renderHeThongMa = function () {
        $http({
            method: 'GET',
            url: 'api/MinhChung/LoadHeThongMa'
        }).then(function successCallback(response) {
            $scope.DSHeThongMa = response.data;
            if ($scope.DSHeThongMa.length > 0) {
                $scope.item.HeThongMa = $scope.DSHeThongMa[0];
                $scope.renderMa();
            }
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.renderMa = function () {
        
        if ($scope.item.Id)
            return;
        // Load lên số minh chứng trước khi gen mã
        if ($scope.item.IdTieuChi && $scope.item.HeThongMa) {
            $http({
                method: 'GET',
                url: 'api/MinhChung/LoadDSMinhChung?IdDonVi=' + $rootScope.CurDonVi.Id
                    + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                    + '&idTieuChi=' + $scope.item.IdTieuChi
                    + '&heThongMa=' + $scope.item.HeThongMa
                    + '&ChiThuThap=' + $rootScope.ChiThuThap
            }).then(function successCallback(response) {
                
                if (response.data.length > 0) {
                    let latestMa = response.data[response.data.length - 1].Ma;
                    $scope.item.SoMinhChung = parseInt(latestMa.split('-')[2]) + 1;
                }
                else
                    $scope.item.SoMinhChung = 1;

                if ($scope.item.SoMinhChung) {
                    // Nếu có id tiêu chí thì tiếp tục gen mã
                    if ($scope.item.IdTieuChi && $scope.IdTieuChuan) {

                        var thuTuTieuChuan = $scope.DSTieuChuan.filter(x => x.Id == $scope.IdTieuChuan)[0].ThuTu;
                        var thuTuTieuChi = $scope.DsTieuChi.filter(x => x.Id == $scope.item.IdTieuChi)[0].ThuTu;

                        $scope.item.Ma = $scope.item.HeThongMa + "-" + thuTuTieuChuan + "." + thuTuTieuChi + "-" + $scope.item.SoMinhChung.toString().padStart(2, "0");
                    } else {
                        $scope.item.Ma = "";
                    }
                } else {
                    $scope.item.Ma = "";
                }
            }, function errorCallback(response) {
                toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
            });
        } else {
            $scope.item.Ma = "";
        }
    }

    // Lưu dữ liệu
    $scope.Save = function (isNew) {
        if ($scope.ListFileUpLoad.length == 0) {
            $scope.item.HasFile = false;
            $scope.item.DuongDanFile = null;
        }

        $http({
            method: "POST",
            url: "api/MinhChung/LuuMinhChung",
            data: $scope.item,
        }).then(function successCallback(response) {
            toastr.success('Lưu dữ liệu thành công!', 'Thông báo');
            $scope.item = response.data;
            $scope.uploadFiles($scope.item.Id, isNew)
            $scope.itemError = ''


        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.warning('Có lỗi trong quá trình lưu dữ liệu hoặc chưa điền các trường bắt buộc!', 'Thông báo');
        });
    }


    $scope.LoadDMTieuChuan();
    
    $scope.LoadFileUpload = function () {
        //debugger
        if ($scope.item.Id)
            $http({
                method: "GET",
                url:
                    "api/MinhChung/LoadFileMinhChung?IdMinhChung=" + $scope.item.Id,
            }).then(
                function successCallback(response) {
                    $scope.ListFileUpLoad = response.data;
                },
                function errorCallback(response) {
                    toastr.error("Có lỗi trong quá trình tải dữ liệu !", "Thông báo");
                }
            );
        else $scope.ListFileUpLoad = [];
    }();

    var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        angular.forEach($files, function (value, key) {

            if (value.size >= 1073741824) {
                toastr.error(
                    "Tệp tin " +
                    value.name +
                    " có dung lượng quá lớn nên không thể tải lên!",
                    "Thông báo"
                );
            } else {
                formdata.append(key, value, value.name);
                var o = {
                    FName: value.name,
                    key: key,
                    filename: value.path,
                    isSaved: false,
                };
                $scope.ListFileUpLoad.push(o);
                $scope.$apply();
            }
        });
    };
    $scope.RemoveFile = function (index, link, key) {

        if (key != null)
            formdata.delete(key);

        $scope.ListFileUpLoad.splice(index, 1);
        if (link)
            $http({
                method: "GET",
                url: "api/Files/DeleteFile?link=" + link,
            })
                .success(function (response) { })
                .error(function (response) {
                    toastr.error("Có lỗi trong quá trình xóa tệp đính kèm!", "Thông báo");
                });
    };

    $scope.uploadFiles = function (IdMinhChung, isNew) {

        var request = {
            method: "POST",
            url: "api/MinhChung/UploadFileMinhChung?IdMinhChung=" + IdMinhChung,
            data: formdata,
            headers: {
                "Content-Type": undefined,
            },
        };
        $http(request)
            .success(function (d) {
                $scope.ListFileUpLoad = [];
                formdata = new FormData();

                $rootScope.LoadMinhChung();
                $scope.cancelModal()
                if (isNew)
                    $scope.openModal('', 'MinhChung');

            })
            .error(function () {
                toastr.error(
                    "Có lỗi trong quá trình tải lên tệp đính kèm!",
                    "Thông báo"
                );
            });
    };



});

//Gợi ý và phân công minh chứng
angular.module('WebApiApp').controller("ModalPhanCongMinhChungHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.ListTab = [
        {
            Code: 'A', Name: 'Mức 1', Id: 'tab_1'
        },
        {
            Code: 'B', Name: 'Mức 2', Id: 'tab_2'
        },
        {
            Code: 'C', Name: 'Mức 3', Id: 'tab_3'
        }
    ]

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.ListTrangThai = [
        {
            Code: '',
            Name: '---Chọn---'
        },
        {
            Code: 'HT',
            Name: 'Hoàn tất'
        },
        {
            Code: 'DTT',
            Name: 'Đang thu thập'
        },
        {
            Code: 'TL',
            Name: 'Thất lạc'
        }
    ]

    $scope.LoadDMTieuChuan = function () {
        $http({
            method: 'GET',
            url: 'api/DanhMucTieuChuan/LoadTCTCByUser'
        }).then(function successCallback(response) {
            $scope.DSTCTC = response.data;
            $scope.DSTieuChuan = $scope.DSTCTC.map(t => t.tchuan);

            if ($scope.DSTieuChuan.length > 0) {
                $scope.IdTieuChuan = $scope.DSTieuChuan[0].Id;
                $scope.LoadTieuChi();
            }
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();

    $scope.LoadTieuChi = function () {

        $scope.DsTieuChi = $scope.DSTCTC
            .filter(x => x.tchuan.Id == $scope.IdTieuChuan)
            .map(t => t.tchi)[0];

        if ($scope.DsTieuChi.length > 0) {
            $scope.IdTieuChi = $scope.DsTieuChi[0].Id;
            $rootScope.LoadPCMC();

        }

    }

    $rootScope.LoadPCMC = function () {

        if (!$scope.IdTieuChi) {
            $scope.PCMC = [];
            return;
        }

        $http({
            method: 'GET',
            url: 'api/PhanCongMinhChung/GetPCMC?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                + '&IdTieuChi=' + $scope.IdTieuChi
                + '&ChiThuThap=' + $rootScope.ChiThuThap
        }).then(function successCallback(response) {

            $scope.PCMC = response.data.map(function (t) {
                if (t.pcmc) {
                    if (t.pcmc.TuNgay)
                        t.pcmc.TuNgay = new Date(t.pcmc.TuNgay)
                    if (t.pcmc.DenNgay)
                        t.pcmc.DenNgay = new Date(t.pcmc.DenNgay)
                    if (t.pcmc.NguoiLuuGiu)
                        t.pcmc.NguoiLuuGiu = JSON.parse(t.pcmc.NguoiLuuGiu)
                    if (t.pcmc.NguoiThuThap)
                        t.pcmc.NguoiThuThap = JSON.parse(t.pcmc.NguoiThuThap)
                }
                return t;
            });
            $scope.LoadUserByTieuChi();

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.LoadUserByTieuChi = function () {

        if (!$scope.IdTieuChi) {
            $scope.Users = [];
            return;
        }

        $http({
            method: 'GET',
            url: 'api/PhanCongMinhChung/LoadUserByTieuChi?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                + '&IdTieuChi=' + $scope.IdTieuChi
        }).then(function successCallback(response) {

            $scope.Users = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $scope.Save = function () {
        let data = [];
        angular.forEach($scope.PCMC, function (t, key) {

            if (t.pcmc) {
                t.pcmc.IdDonVi = $rootScope.CurDonVi.Id
                t.pcmc.IdKeHoachTDG = $rootScope.KeHoachTDG.Id
                t.pcmc.IdTieuChi = $scope.IdTieuChi
                t.pcmc.IdMinhChung = t.mc.Id
                t.pcmc.Muc = t.mc.ChiSo == 'A' ? 1 : t.mc.ChiSo == 'B' ? 2 : 3
                t.pcmc.NguoiLuuGiu = JSON.stringify(t.pcmc.NguoiLuuGiu)
                t.pcmc.NguoiThuThap = JSON.stringify(t.pcmc.NguoiThuThap)
                data.push(t.pcmc);
            }

        });

        if (data.length == 0)
            return;

        $http({
            method: 'POST',
            url: 'api/PhanCongMinhChung/Save',
            data: data
        }).then(function successCallback(response) {

            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
            $scope.cancelModal();

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.error('Có lỗi xảy ra hoặc bạn chưa điền đầy đủ các trường bắt buộc !', 'Thông báo');

        });

    }

    $scope.Delete = function (Id) {

        if (confirm('Bạn có chắc chắn muốn phân công lại minh chứng này ?'))
            $http({
                method: 'GET',
                url: 'api/PhanCongMinhChung/Del?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadPCMC();
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        if ($rootScope.ChiThuThap) {
            $("td :input").not(".include-thuthap").attr("disabled", true);
        }
    });
});

//Đánh giá tiêu chí
angular.module('WebApiApp').controller("ModalDanhGiaTieuChiHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.config = {
        height: '300px',
        toolbar: [
            ['Source'],
            ['Print', 'Preview'],
            ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'],
            ['NumberedList', 'BulletedList', 'Blockquote'],
            ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
            ['Link', 'Unlink'],
            ['Undo', 'Redo'],
            ['Spellchecker', 'Scayt'],
            ['Find', 'Replace'],
            ['FontSize'],
            ['Bold', 'Italic', 'Underline', 'Strike'],
            ['Table', 'HorizontalRule', 'SpecialChar'],
            ["InsertMinhChung", "SetReadOnly"]
        ],
        removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar',
        extraPlugins: 'insert-minhchung,set-readonly',
        readOnly: $rootScope.checkCapTren,
    }

    $scope.ListTabMuc = [
        {
            Code: 'A', Name: 'Mức 1', Id: '1', Model: 'MoTaA'
        },
        {
            Code: 'B', Name: 'Mức 2', Id: '2', Model: 'MoTaB'
        },
        {
            Code: 'C', Name: 'Mức 3', Id: '3', Model: 'MoTaC'
        }
    ]

    $scope.cancelModal = function () {
        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }
        $uibModalInstance.dismiss('close');
    }

    if ($rootScope.DsTieuChuan && $rootScope.IdTieuChuan) {
        if ($rootScope.DsTieuChuan[0].tchuan)
            $scope.TieuChuan = $rootScope.DsTieuChuan.filter(q => q.tchuan.Id == $rootScope.IdTieuChuan)[0].tchuan.NoiDung;
        else
            $scope.TieuChuan = $rootScope.DsTieuChuan.filter(q => q.Id == $rootScope.IdTieuChuan)[0].NoiDung;
    }


    // Lưu dữ liệu
    $scope.Save = function () {
        if (!$scope.item.dgtc.MoTaA || !$scope.item.dgtc.MoTaB || !$scope.item.dgtc.MoTaC) {
            toastr.warning('Vui lòng điền đầy đủ nội dung bắt buộc!', 'Thông báo');
            return;
        }
        if (!$scope.item.dgtc.Id) {
            $scope.item.dgtc.IdDonVi = $rootScope.CurDonVi.Id;
            $scope.item.dgtc.IdKeHoachTDG = $rootScope.KeHoachTDG.Id;
            $scope.item.dgtc.IdTieuChi = $scope.item.tchi.Id;

        }

        $http({
            method: "POST",
            url: "api/DanhGiaTieuChi/Save",
            data: $scope.item.dgtc,
        }).then(function successCallback(response) {
            toastr.success('Lưu dữ liệu thành công!', 'Thông báo');
            $rootScope.LoadDGTC();
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.warning('Có lỗi trong quá trình lưu dữ liệu hoặc chưa điền đầy đủ nội dung bắt buộc!', 'Thông báo');
        });
    }

    $scope.LoadMinhChung = function () {

        $scope.DSMinhChung = JSON.parse(localStorage.getItem('DSMinhChung'));

    }();

    $scope.OnClickMinhChung = function (item, type) {
        if (item.check) {
            if (type == 'A')
                $scope.item.dgtc.MoTaA += item.Ma
            if (type == 'B')
                $scope.item.dgtc.MoTaB += item.Ma
            if (type == 'C')
                $scope.item.dgtc.MoTaC += item.Ma
        }
    }

    $scope.LoadUserByTieuChi = function () {
        $scope.UserInNhom = JSON.parse(localStorage.getItem('UserInNhom'));
    }();

});

//Xem file minh chứng
angular.module('WebApiApp').controller("ModalFileMinhChungHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.LoadFileUpload = function () {
        
            $http({
                method: "GET",
                url:
                    "api/MinhChung/LoadFileMinhChung?IdMinhChung=" + $scope.item.Id,
            }).then(
                function successCallback(response) {
                    $scope.ListFileUpLoad = response.data;
                },
                function errorCallback(response) {
                    toastr.error("Có lỗi trong quá trình tải dữ liệu !", "Thông báo");
                }
            );
        
    }();

});