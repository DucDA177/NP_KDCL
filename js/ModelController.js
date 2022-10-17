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


    $scope.SaveModal = function (isNew) {
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

            if (isNew)
                $scope.openModal('', 'DMDonVi');

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

    $scope.LoadAllDonViGoc = function () {

        $http({
            method: 'GET',
            url: 'api/DonVi/GetAllDonViGoc',
        }).then(function successCallback(response) {
            $scope.DonViGoc = response.data;

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
    $scope.LoadAllDonViGoc();
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
    else {
        try {
            if ($scope.item.NhomLoai)
                $scope.item.NhomLoai = JSON.parse($scope.item.NhomLoai)
        }
        catch { }

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
        if ($scope.item.NhomLoai && $scope.item.NhomLoai.length > 0)
            $scope.item.NhomLoai = JSON.stringify($scope.item.NhomLoai)
        else
            $scope.item.NhomLoai = null;

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
            "IdTieuChuan": $rootScope.IdTieuChuan,
            "ChiBaoA": [],
            "ChiBaoB": [],
            "ChiBaoC": []
        }
    }
    else {
        try {
            if ($scope.item.ChiBaoA)
                $scope.item.ChiBaoA = JSON.parse($scope.item.ChiBaoA);
            if ($scope.item.ChiBaoB)
                $scope.item.ChiBaoB = JSON.parse($scope.item.ChiBaoB);
            if ($scope.item.ChiBaoC)
                $scope.item.ChiBaoC = JSON.parse($scope.item.ChiBaoC);
        } catch { }
    }

    $scope.DelChiBao = function (item, type) {
        $scope.item[type] = $scope.item[type].filter(t => t.STT != item.STT);
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
        $scope.item.ChiBaoA = JSON.stringify($scope.item.ChiBaoA);
        $scope.item.ChiBaoB = JSON.stringify($scope.item.ChiBaoB);
        $scope.item.ChiBaoC = JSON.stringify($scope.item.ChiBaoC);

        $http({
            method: "POST",
            url: "api/DanhMucTieuChi/LuuDanhMucTieuChi",
            data: $scope.item,
        }).then(function successCallback(response) {
            toastr.success('Lưu dữ liệu thành công!', 'Thông báo');
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

//Thêm chỉ báo cho tiêu chí
angular.module('WebApiApp').controller("ModalChiBaoHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item.CurrentChiBao;
    $scope.ArrayChiBao = $scope.$resolve.item.ArrayChiBao;
    $scope.check = $scope.$resolve.check;
    $scope.type = $scope.$resolve.type;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    if (!$scope.ArrayChiBao)
        $scope.ArrayChiBao = [];

    // Lưu dữ liệu
    $scope.Save = function (isNew) {
        
        if ($scope.check == 'AddNew') {
            if (!$scope.item.STT) {
                toastr.warning('Số thứ tự alphabet chỉ báo bắt buộc nhập!', 'Thông báo');
                return;
            }
            if (!$scope.item.NoiDung) {
                toastr.warning('Nội dung chỉ báo bắt buộc nhập!', 'Thông báo');
                return;
            }

            let checkExist = $scope.ArrayChiBao.filter(x => x.STT == $scope.item.STT)
            if (checkExist.length > 0) {
                toastr.warning('Chỉ báo ' + $scope.item.STT + ' đã tồn tại!', 'Thông báo');
                return;
            }

            $scope.ArrayChiBao.push($scope.item);
        }

        $scope.cancelModal();
        if (isNew == 1)
            $scope.openModalSmall(
                {
                    CurrentChiBao: null,
                    ArrayChiBao: $scope.ArrayChiBao
                }, 'ChiBao','AddNew');
    }
});

//Kế hoạch tự đánh giá
angular.module('WebApiApp').controller("ModalKeHoachTDGHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.NguonLucDB = $scope.item.NguonLuc;
    $scope.IdQuyDinhDB = $scope.item.IdQuyDinhTC;

    if (!$scope.item)
        $scope.item = {
            Id: 0,
            IdDonVi: $rootScope.CurDonVi.Id,
            IdQuyDinhTC: 0,
            FInUse: true,
            TrangThai: 'CTH',
            MucDich: '',
            PhamVi: '',
            CongCu: '',
            TapHuanNghiepVu: '',
            NguonLuc:'',
            ThueChuyenGia: '',
            ThoiGianHoatDong: '',
        }
    else {
        $scope.item.NgayBD = new Date($scope.item.NgayBD)
        $scope.item.NgayKT = new Date($scope.item.NgayKT)
    }

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
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
            ['Find', 'Replace'],
            ['Bold', 'Italic', 'Underline', 'Strike'],
            ['Table', 'HorizontalRule', 'SpecialChar'],
            ["InsertMinhChung", "SetReadOnly"]
        ],
        removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar',
    }

    $scope.LoadTemplate = function () {
        setTimeout(function () {

            if (!$scope.item.MucDich)
                $scope.item.MucDich = $('#TemplateMucDich').html();
            if (!$scope.item.PhamVi)
                $scope.item.PhamVi = $('#TemplatePhamVi').html();
            if (!$scope.item.CongCu)
                $scope.item.CongCu = $('#TemplateCongCu').html();
            if (!$scope.item.TapHuanNghiepVu)
                $scope.item.TapHuanNghiepVu = $('#TemplateTapHuanNghiepVu').html();
            if (!$scope.item.ThueChuyenGia)
                $scope.item.ThueChuyenGia = $('#TemplateThueChuyenGia').html();
            if (!$scope.item.ThoiGianHoatDong)
                $scope.item.ThoiGianHoatDong = $('#TemplateThoiGianHoatDong').html();

            $scope.item.NguonLuc = $('#TemplateNguonLuc').html();
            if ($scope.item.IdQuyDinhTC == $scope.IdQuyDinhDB && $scope.NguonLucDB)
                $scope.item.NguonLuc = $scope.NguonLucDB

            $scope.$apply();

        }, 500)

    };

   

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

    $scope.LoadListTCTC = function () {

        $http({
            method: 'GET',
            url: 'api/NhomCongTac/LoadTieuChuanTieuChi?idNhom=0&idQuyDinh=' + $scope.item.IdQuyDinhTC
                + '&idKeHoachTDG=' + $scope.item.Id
        }).then(function successCallback(response) {

            $scope.ListTCTC = response.data.filter(x => x.LoaiDuLieu == 2);
            $scope.LoadTemplate();
        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    };

    $scope.LoadListTCTC();

    // Load danh mục trong bảng tblDanhmuc
    $scope.LoadDanhMuc('QuyDinh', 'QUYDINH', '', '', '');

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $scope.LoadTemplate();
    });

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


//Thiết lập minh chứng và gợi ý
angular.module('WebApiApp').controller("ModalMinhChungHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    //$scope.hideBtn = $scope.check;

    $scope.NoiDungChiSo = '';

    if (!$scope.item) {
        $scope.item = {
            "IdTieuChi": $scope.check.idTieuChi != 0 ? $scope.check.idTieuChi : 0,
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
            $scope.SelectedTieuChi = dsTieuChi[0];
        }
        else {
            if ($scope.DsTieuChi.length > 0) {
                $scope.SelectedTieuChi = $scope.DsTieuChi[0];
            }
            else {
                $scope.NoiDungChiSo = '';
                return;
            }
                
        }

        let ChiBaoString = $scope.SelectedTieuChi['ChiBao' + $scope.item.ChiSo]
        if (ChiBaoString) {
            let ChiBaoJSON = JSON.parse(ChiBaoString);

            $scope.NoiDungChiSo = ChiBaoJSON.map(x => x.STT + ') ' + (x.GoiY ? x.GoiY : '') ).join("</br>")

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
                if ($scope.check.idTieuChuan != "0")
                    $scope.IdTieuChuan = $scope.check.idTieuChuan;

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

        if ($scope.DsTieuChi.length > 0) {
            $scope.item.IdTieuChi = $scope.DsTieuChi[0].Id;

        }

        if ($scope.check.idTieuChi)
            $scope.item.IdTieuChi = $scope.check.idTieuChi;

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
                if ($scope.check.heThongMa != '0')
                    $scope.item.HeThongMa = $scope.check.heThongMa

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
                    + '&idTieuChuan=0'
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
                    if ($scope.item.IdTieuChi && $scope.item.IdTieuChi !== '0' && $scope.IdTieuChuan) {
                        
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
                $scope.cancelModal();
                if (isNew)
                    $scope.openModal('', 'MinhChung', {
                        idTieuChuan: $scope.IdTieuChuan,
                        idTieuChi: $scope.item.IdTieuChi,
                        heThongMa: $scope.item.HeThongMa
                    });

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
                if ($scope.check.idTieuChuan)
                    $scope.IdTieuChuan = $scope.check.idTieuChuan;
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

            if ($scope.check.idTieuChi)
                $scope.IdTieuChi = $scope.check.idTieuChi;

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

    try {
        if ($scope.item.tchi.ChiBaoA)
            $scope.item.tchi.ChiBaoA = JSON.parse($scope.item.tchi.ChiBaoA).map(x => x.STT).sort()
        if ($scope.item.tchi.ChiBaoB)
            $scope.item.tchi.ChiBaoB = JSON.parse($scope.item.tchi.ChiBaoB).map(x => x.STT).sort()
        if ($scope.item.tchi.ChiBaoC)
            $scope.item.tchi.ChiBaoC = JSON.parse($scope.item.tchi.ChiBaoC).map(x => x.STT).sort()
    }
    catch {}

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
            ['Find', 'Replace'],
            ['Bold', 'Italic', 'Underline', 'Strike'],
            ['Table', 'HorizontalRule', 'SpecialChar'],
            ["InsertMinhChung", "SetReadOnly"]
        ],
        removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar',
        extraPlugins: $rootScope.checkCapTren ? 'set-readonly' : 'insert-minhchung,set-readonly',
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

    setTimeout(function () {

        if (!$scope.item.dgtc.KQChiBao)
            $scope.item.dgtc.KQChiBao = $('#TemplateDanhGiaChiBao').html();
        $scope.$apply();

    }, 1000)

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

//In phiếu đánh giá tiêu chí
angular.module('WebApiApp').controller("ModalInPhieuDanhGiaHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    $scope.LoadBaoCaoTCTC = function () {
        $http({
            method: 'GET',
            url: 'api/BaoCao/LoadBaoCaoTCTC?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                + '&IdQuyDinh=' + $rootScope.KeHoachTDG.IdQuyDinhTC
        }).then(function successCallback(response) {

            $scope.BaoCaoTCTC = response.data;
            let checkbctchuan = $scope.BaoCaoTCTC.filter(t => t.Id == $scope.item.tchi.IdTieuChuan);
            if (checkbctchuan.length > 0) {
                $scope.BCTieuChuan = checkbctchuan[0]
                let checkbctchi = $scope.BCTieuChuan.ListTieuChi.filter(t => t.Id == $scope.item.tchi.Id);
                if (checkbctchi.length > 0)
                    $scope.BCTieuChi = checkbctchi[0]
            }

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();

});

//In phiếu nội hàm
angular.module('WebApiApp').controller("ModalInPhieuNoiHamHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    try {
        $scope.item.TieuChi.ChiBaoA = JSON.parse($scope.item.TieuChi.ChiBaoA)
        $scope.item.TieuChi.ChiBaoB = JSON.parse($scope.item.TieuChi.ChiBaoB)
        $scope.item.TieuChi.ChiBaoC = JSON.parse($scope.item.TieuChi.ChiBaoC)
    }
    catch { }

    console.log($scope.item)
});

//In kế hoạch tự đánh giá
angular.module('WebApiApp').controller("ModalInKeHoachTDGHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.type = $scope.$resolve.type;
    $scope.check = $scope.$resolve.check;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    $scope.LoadHoiDong = function () {

        $http({
            method: 'GET',
            url: 'api/HoiDong/GetAll?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
        }).then(function successCallback(response) {

            $scope.HoiDong = response.data;
            $scope.ThuKyHD = response.data.filter(x => x.hd.ThuKy);

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();

    $scope.ListTVNhom = [];

    $scope.LoadAllThanhVienNhiemVu = function () {

        $http({
            method: 'GET',
            url: 'api/NhomCongTac/GetAllThanhVienNhiemVu?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
        }).then(function successCallback(response) {

            $scope.ListTVNhom = response.data

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();

    $scope.LoadTieuChiCacNhom = function () {

        $http({
            method: 'GET',
            url: 'api/NhomCongTac/GetTieuChiCacNhom?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
        }).then(function successCallback(response) {

            $scope.ListTieuChiNhom = response.data

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

        const table = document.getElementById('tableTVNhom');

        let headerCell = null;

        for (let row of table.rows) {
            const firstCell = row.cells[0];

            if (headerCell === null || firstCell.innerText !== headerCell.innerText) {
                headerCell = firstCell;
            } else {
                headerCell.rowSpan++;
                firstCell.remove();
            }
        }

    });
});

//Generate link báo cáo
angular.module('WebApiApp').controller("ModalGenerateLinkBaoCaoHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    let originUrl = window.location.protocol + '//' + window.location.host + '/kqdg.html?'
    $scope.link = originUrl + $rootScope.CurDonVi.MaDonVi

    $scope.generateQR = function (text) {
        console.log(text)
        $('#qrlinkbaocao').empty();
        const qrcode = new QRCode(document.getElementById('qrlinkbaocao'), {
            text: text,
            width: 300,
            height: 300,
            colorDark: '#000',
            colorLight: '#fff',
            correctLevel: QRCode.CorrectLevel.H
        });
    };
    setTimeout(function () {
        $scope.generateQR($scope.link);
    }, 500)


});

//Thư viện tài liệu
angular.module('WebApiApp').controller("ModalThuVienTaiLieuHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;
    $scope.type = $scope.$resolve.type;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }
    if (!$scope.item) {
        $scope.item = {
            "FInUse": true
        }
    }
    else {
        try {
            if ($scope.item.DonVi)
                $scope.item.DonVi = JSON.parse($scope.item.DonVi)
        }
        catch { }

    }

    $scope.LoadAllDonVi = function () {

        $http({
            method: 'GET',
            url: 'api/DonVi/LoadAllDonVi',
        }).then(function successCallback(response) {
            $scope.ListDonVi = response.data.filter(x => x.Id != $rootScope.CurDonVi.Id);

        }, function errorCallback(response) {
            //$scope.itemError = response.data;
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }();

    // Lưu dữ liệu
    $scope.Save = function (isNew) {
        if ($scope.item.DonVi && $scope.item.DonVi.length > 0)
            $scope.item.DonVi = JSON.stringify($scope.item.DonVi)
        else
            $scope.item.DonVi = null;

        var formData = new FormData();
        var file = document.querySelector('#file');

        formData.append("file", file.files[0]);
        formData.append("tblThuVienTaiLieu", JSON.stringify($scope.item));

        $http({
            method: "POST",
            url: "api/ThuVienTaiLieu/Save",
            data: formData,
            headers: {
                "Content-Type": undefined,
            }
        }).then(function successCallback(response) {
            toastr.success('Lưu dữ liệu thành công!', 'Thông báo');
            $scope.item = response.data;
            $scope.itemError = ''
            $rootScope.LoadTaiLieu();
            $scope.cancelModal()
            if (isNew)
                $scope.openModal('', 'ThuVienTaiLieu');

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.warning('Có lỗi trong quá trình lưu dữ liệu hoặc chưa điền các trường bắt buộc!', 'Thông báo');
        });
    }


});

//Nhóm công tác
angular.module('WebApiApp').controller("ModalNhomCongTacHandlerController", function ($rootScope, $scope, $http, $uibModalInstance) {
    $scope.item = $scope.$resolve.item;
    $scope.check = $scope.$resolve.check;
    $scope.type = $scope.$resolve.type;

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('close');
    }

    // Region thành viên
    $scope.ListThanhVien = [];
    if (!$scope.item) {
        $scope.item = {
            Id: 0,
            FInUse: true,
            IdDonvi: $rootScope.CurDonVi.Id,
            IdKeHoachTDG: $rootScope.KeHoachTDG.Id
        }
    }
    $scope.ListCV = [
        {
            Code: 1, Name: 'Trưởng nhóm'
        },
        {
            Code: 2, Name: 'Thành viên'
        }
    ]
    $scope.TvBanDau = {
        IdNhom: $scope.item.Id,
        IdHoiDong: '',
        IdChucVu: '',
        FInUse: true
    }

    $scope.LoadThanhVienNhom = function () {
        $http({
            method: 'GET',
            url: 'api/NhomCongTac/GetThanhVien?IdNhom=' + $scope.item.Id
        }).then(function successCallback(response) {

            $scope.ListThanhVien = response.data.map(function (x) {
                x.isSaved = true;
                return x;
            });

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }();

    $scope.EditThanhVien = function (tv) {
        tv.isSaved = false;
    }

    $scope.SaveThanhVien = function (tv) {
        if (!tv.IdHoiDong) {
            toastr.warning('Họ tên thành viên bắt buộc nhập', 'Thông báo');
            return;
        }

        let checkExist = $scope.ListThanhVien.filter(x => x.IdHoiDong == tv.IdHoiDong);
        if (checkExist.length > 0) {
            if (checkExist[0].isSaved) {
                toastr.warning('Thành viên này đã tồn tại trong danh sách. Vui lòng nhập lại!', 'Thông báo');
                return;
            }
            else {
                checkExist[0].IdHoiDong = tv.IdHoiDong;
                checkExist[0].IdChucVu = tv.IdChucVu;
                checkExist[0].isSaved = true;
                return;
            }
        }

        tv.isSaved = true;
        $scope.ListThanhVien.push(tv);
        $scope.TvBanDau = {
            IdNhom: $scope.item.Id,
            IdHoiDong: '',
            IdChucVu: '',
            FInUse: true
        }
    }

    $scope.DelThanhVien = function (tv) {

        $scope.ListThanhVien = $scope.ListThanhVien.filter(x => x != tv);
    }
    //End region thành viên



    //Region phân quyền
    $scope.MenuArr = [];
    $rootScope.IdQuyDinh = 0;

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
            url: '/api/NhomCongTac/LoadTieuChuanTieuChi?idQuyDinh=' + $rootScope.IdQuyDinh
                + '&idNhom=' + $scope.item.Id
                + '&idKeHoachTDG=' + $rootScope.KeHoachTDG.Id
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

    // End region phân quyền



    $scope.Save = function (isNew) {
        $http({
            method: 'POST',
            url: 'api/NhomCongTac/Save',
            data: {
                tblNhomCongTac: $scope.item,
                thanhVienNhoms: $scope.ListThanhVien,
                listTieuChi: $scope.MenuDrop.filter(x => x.LoaiDuLieu == 2 && x.IsCheck == true).map(t => t.Id)
            }
        }).then(function successCallback(response) {
            $scope.item = response.data;
            $scope.itemError = "";
            toastr.success('Lưu dữ liệu thành công !', 'Thông báo');
            $rootScope.LoadNhomCongTac();
            $scope.cancelModal();
            if (isNew)
                $scope.openModal('', 'NhomCongTac')

        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.error('Có lỗi xảy ra hoặc bạn chưa điền đầy đủ các trường bắt buộc !', 'Thông báo');

        });
    }

});

// Thiết lập tiêu chuẩn, tiêu chí cho từng nhóm
angular.module('WebApiApp').controller("ModalPhanQuyenTCHandlerController", function ($rootScope, $scope, $http) {
    $scope.item = $scope.$resolve.item;
    $scope.MenuArr = [];
    $rootScope.IdQuyDinh = 0;

    $scope.SaveModal = function () {

        let data = {
            IdDonVi: $rootScope.CurDonVi.Id,
            IdKeHoachTDG: $rootScope.KeHoachTDG.Id,
            IdNhom: $scope.item.Id,
            ListIdTieuChi: $scope.MenuDrop.filter(x => x.LoaiDuLieu == 2 && x.IsCheck == true).map(t => t.Id)
        };

        $http({
            method: 'POST',
            url: '/api/DanhMucTieuChi/SavePhanCongTC',
            data: data
        }).then(function successCallback(response) {
            toastr.success('Cập nhật dữ liệu thành công !', 'Thông báo');
            $scope.cancelModal();
        }, function errorCallback(response) {
            $scope.itemRoleError = response.data;
            $scope.LoadError($scope.itemRoleError.ModelState);
        });

    }

});