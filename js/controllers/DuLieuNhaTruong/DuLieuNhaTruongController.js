angular.module('WebApiApp').controller('DuLieuNhaTruongController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    NamHoc = window.localStorage.getItem('NamHoc');
    NamHocBD = parseInt(NamHoc.split('-')[0]);
    NamHocKT = parseInt(NamHoc.split('-')[1]);

    UPDATEROWSTYLE = function (sheetName, rowsToBold, cssKey, cssValue) {
        let colsToBold = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

        for (let i = 0; i < colsToBold.length; i++)
            for (let j = 0; j < rowsToBold.length; j++)
                $scope['table' + sheetName]
                    .setStyle(colsToBold[i] + rowsToBold[j],
                        cssKey, cssValue)
    }
    SUMCOL = function (instance, rowStart, columnId) {
        var total = 0;
        for (var j = rowStart; j < instance.options.data.length; j++) {
            if (Number(instance.records[j][columnId].innerHTML)) {
                total += Number(instance.records[j][columnId].innerHTML);
            }
        }
        return total;
    }

    fixColsWidth = '200px'
    genesisColumn = [
        {
            title: 'STT',
            width: '50px',
        },
        {
            title: 'Số liệu',
            width: fixColsWidth,
            align: 'left',
            wordWrap: true
        },
        {
            title: 'Năm học ' + (NamHocBD - 4) + '-' + (NamHocKT - 4),
            width: fixColsWidth,
        },
        {
            title: 'Năm học ' + (NamHocBD - 3) + '-' + (NamHocKT - 3),
            width: fixColsWidth,
        },
        {
            title: 'Năm học ' + (NamHocBD - 2) + '-' + (NamHocKT - 2),
            width: fixColsWidth,
        },
        {
            title: 'Năm học ' + (NamHocBD - 1) + '-' + (NamHocKT - 1),
            width: fixColsWidth,
        },
        {
            title: 'Năm học ' + NamHocBD + '-' + NamHocKT,
            width: fixColsWidth,
        },
    ]
    toolbars = [
        {
            type: 'i',
            content: 'undo',
            onclick: function () {
                table.undo();
            }
        },
        {
            type: 'i',
            content: 'redo',
            onclick: function () {
                table.redo();
            }
        },
        {
            type: 'i',
            content: 'save',
            onclick: function () {
                table.download();
            }
        },
        {
            type: 'i',
            content: 'format_align_left',
            k: 'text-align',
            v: 'left'
        },
        {
            type: 'i',
            content: 'format_align_center',
            k: 'text-align',
            v: 'center'
        },
        {
            type: 'i',
            content: 'format_align_right',
            k: 'text-align',
            v: 'right'
        },
        {
            type: 'i',
            content: 'format_bold',
            k: 'font-weight',
            v: 'bold'
        },
        {
            type: 'color',
            content: 'format_color_text',
            k: 'color'
        },
        {
            type: 'color',
            content: 'format_color_fill',
            k: 'background-color'
        },
    ]

    $scope.GetData = function (TaiTDDG, loaiSL, sheetName, minDimensions, footers, genesisColumn, genesisData, fn) {
        $('#' + sheetName).empty();

        $http({
            method: 'GET',
            url: 'api/DuLieuNhaTruong/GetData?IdDonVi=' + $rootScope.CurDonVi.Id
                + '&IdKeHoachTDG=' + $rootScope.KeHoachTDG.Id
                + '&TaiTDDG=' + TaiTDDG + '&Loai=' + loaiSL
                + '&NamHoc=' + NamHoc
        }).then(function successCallback(response) {

            $scope[sheetName] = response.data;
            if (!$scope[sheetName])
                $scope[sheetName] = {
                    HTML: ""
                }

            if (genesisColumn.length > 0 || genesisData.length > 0)
                $scope['table' + sheetName] = jspreadsheet(document.getElementById(sheetName), {
                    columns: response.data ? JSON.parse($scope[sheetName].CacCot) : genesisColumn,
                    data: response.data ? JSON.parse($scope[sheetName].DuLieu) : genesisData,
                    minDimensions: minDimensions,
                    columnDrag: true,
                    footers: footers,
                    toolbar: toolbars,
                });

            if (fn)
                fn();

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    };

    $scope.Save = async function (loaiSL, sheetName, TaiTDDG) {
        
        let dataTableConfig = [];
        let dataRows = [];
        let HTML = '';

        if ($scope[sheetName])
            HTML = $scope[sheetName].HTML;

        if ($scope['table' + sheetName]) {
            dataTableConfig = await $scope['table' + sheetName].getConfig();
            dataRows = await $scope['table' + sheetName].getData();
            HTML = $('#' + sheetName).find('.jexcel_content').html();
        }

        $http({
            method: 'POST',
            url: 'api/DuLieuNhaTruong/SaveData',
            data: {
                IdDonVi: $rootScope.CurDonVi.Id,
                IdKeHoachTDG: $rootScope.KeHoachTDG.Id,
                TaiTDDG: TaiTDDG,
                Loai: loaiSL,
                DuLieu: JSON.stringify(dataRows),
                CacCot: JSON.stringify(dataTableConfig.columns),
                HTML: HTML//document.getElementById(sheetName).innerHTML
            }
        }).then(function successCallback(response) {

            $scope[sheetName] = response.data;

            toastr.success('Lưu dữ liệu thành công!', 'Thông báo');

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình lưu dữ liệu!', 'Thông báo');
        });
    }

}]);

angular.module('WebApiApp').controller('SLSoLopHocController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.show = true;
    $scope.loaiSL = 'SLSoLopHoc';
    $scope.sheetName = 'SheetSoLopHoc';
    $scope.minDimensions = [7, 5];
    $scope.footers = [['', 'Tổng cộng', '=SUMCOL(TABLE(),0, 2)', '=SUMCOL(TABLE(),0, 3)',
        '=SUMCOL(TABLE(),0, 4)', '=SUMCOL(TABLE(),0, 5)', '=SUMCOL(TABLE(),0, 6)']];

    $scope.genesisColumn = angular.copy(genesisColumn);
    $scope.genesisData = [['1', 'Khối lớp...'], ['2', 'Khối lớp...'], ['3', 'Khối lớp...']];
    $scope.genesisColumn[1].title = 'Số lớp học'

    $scope.GetData('', $scope.loaiSL, $scope.sheetName, $scope.minDimensions, $scope.footers,
        $scope.genesisColumn, $scope.genesisData);

}]);

angular.module('WebApiApp').controller('SLCoCauCongTrinhController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.show = false;
    $scope.loaiSL = 'SLCoCauCongTrinh';
    $scope.sheetName = 'SheetCoCauCongTrinh';
    $scope.minDimensions = [];
    $scope.footers = [];
    $scope.genesisColumn = angular.copy(genesisColumn);

    $scope.genesisData = [
        ['I', 'Phòng học, phòng học bộ môn và khối phục vụ học tập'],
        ['1', 'Phòng học'],
        ['a', 'Phòng kiên cố'],
        ['b', 'Phòng bán kiên cố'],
        ['c', 'Phòng tạm'],
        ['2', 'Phòng học bộ môn'],
        ['a', 'Phòng kiên cố'],
        ['b', 'Phòng bán kiên cố'],
        ['c', 'Phòng tạm'],
        ['3', 'Khối phục vụ học tập'],
        ['a', 'Phòng kiên cố'],
        ['b', 'Phòng bán kiên cố'],
        ['c', 'Phòng tạm'],
        ['II', 'Khối phòng hành chính - quản trị'],
        ['1', 'Phòng kiên cố'],
        ['2', 'Phòng bán kiên cố'],
        ['3', 'Phòng tạm'],
        ['III', 'Thư viện'],
        ['IV', 'Các công trình, khối phòng chức năng khác'],
        ['', 'Tổng cộng']
    ];

    $scope.updateSettings = function () {
        let rowsToBold = [1, 2, 6, 10, 14, 18, 19, 20]
        UPDATEROWSTYLE($scope.sheetName, rowsToBold, 'font-weight', 'bold')
    }

    //$scope.GetData('', $scope.loaiSL, $scope.sheetName, $scope.minDimensions, $scope.footers,
    //    $scope.genesisColumn, $scope.genesisData, $scope.updateSettings);



}]);

angular.module('WebApiApp').controller('SLCanBoController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.show = false;
    $scope.loaiSL = 'SLCanBo';
    $scope.sheetName = 'SheetCanBo';
    $scope.minDimensions = [];
    $scope.footers = [];
    $scope.genesisColumn = angular.copy(genesisColumn);

    $scope.genesisData = [
        ['1', 'Tổng số giáo viên'],
        ['2', 'Tỷ lệ giáo viên/ lớp'],
        ['3', 'Tỷ lệ giáo viên/ học sinh'],
        ['4', 'Tổng số giáo viên dạy giỏi cấp huyện hoặc tương đương trở lên (nếu có)'],
        ['5', 'Tổng số giáo viên dạy giỏi cấp tỉnh trở lên (nếu có)']
    ];

    //$scope.GetData('', $scope.loaiSL, $scope.sheetName, $scope.minDimensions, $scope.footers,
    //    $scope.genesisColumn, $scope.genesisData);



}]);

angular.module('WebApiApp').controller('SLHocSinhController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.show = false;
    $scope.loaiSL = 'SLHocSinh';
    $scope.sheetName = 'SheetHocSinh';
    $scope.minDimensions = [];
    $scope.footers = [];
    $scope.genesisColumn = angular.copy(genesisColumn);

    $scope.genesisData = [
        ['1', 'Tổng số học sinh'],
        ['', '-Nữ'],
        ['', '-Dân tộc thiểu số'],
        ['', 'Khối lớp...'],
        ['', 'Khối lớp...'],
        ['', 'Khối lớp...'],
        ['2', 'Tổng số tuyển mới'],
        ['3', 'Học 2 buổi/ ngày'],
        ['4', 'Bán trú'],
        ['5', 'Nội trú'],
        ['6', 'Bình quân số học sinh/ lớp'],
        ['7', 'Số lượng và tỷ lệ % đi học đúng độ tuổi'],
        ['8', 'Tổng số học sinh giỏi cấp huyện/ tỉnh(nếu có)'],
        ['9', 'Tổng số học sinh giỏi quốc gia(nếu có)'],
        ['10', 'Tổng số học sinh thuộc đối tượng chính sách'],
        ['11', 'Tổng số học sinh(trẻ em) có hoàn cảnh đặc biệt'],
        ['12', 'Các số liệu khác (nếu có)']
    ];


    //$scope.GetData('', $scope.loaiSL, $scope.sheetName, $scope.minDimensions, $scope.footers,
    //    $scope.genesisColumn, $scope.genesisData);
}]);

angular.module('WebApiApp').controller('SLKQGiaoDucController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.show = false;
    $scope.loaiSL = 'SLKQGiaoDuc';
    $scope.sheetName = 'SheetKQGiaoDuc';
    $scope.minDimensions = [];
    $scope.footers = [];
    $scope.genesisColumn = angular.copy(genesisColumn);

    $scope.genesisData = [
        ['1', 'Tỷ lệ học sinh xếp loại giỏi'],
        ['2', 'Tỷ lệ học sinh xếp loại khá'],
        ['3', 'Tỷ lệ học sinh xếp loại trung bình'],
        ['4', 'Tỷ lệ học sinh xếp loại yếu kém'],
        ['5', 'Tỷ lệ học sinh xếp loại hạnh kiểm tốt'],
        ['6', 'Tỷ lệ học sinh xếp loại hạnh kiểm khá'],
        ['7', 'Tỷ lệ học sinh xếp loại hạnh kiểm trung bình']
    ];


    //$scope.GetData('', $scope.loaiSL, $scope.sheetName, $scope.minDimensions, $scope.footers,
    //    $scope.genesisColumn, $scope.genesisData);



}]);

angular.module('WebApiApp').controller('DLTaiThoiDiemDGController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.show = true;
    $scope.loaiSL = 'DLTaiThoiDiemDG';
    $scope.sheetName = 'SheetDLTaiThoiDiemDG';
    $scope.minDimensions = [];
    $scope.footers = [['', 'Tổng cộng', '=SUMCOL(TABLE(),0, 2)', '=SUMCOL(TABLE(),0, 3)',
        '=SUMCOL(TABLE(),0, 4)', '=SUMCOL(TABLE(),0, 5)', '=SUMCOL(TABLE(),0, 6)', '=SUMCOL(TABLE(),0, 7)']];

    const colsWidth = '100px'
    $scope.genesisColumn = [
        {
            title: 'STT',
            width: '50px',
        },
        {
            title: 'Số liệu',
            width: '200px',
            align: 'left',
            wordWrap: true
        },
        {
            title: 'Tổng số',
            width: colsWidth,
            wordWrap: true
        },
        {
            title: 'Nữ',
            width: colsWidth,
            wordWrap: true
        },
        {
            title: 'Dân tộc',
            width: colsWidth,
            wordWrap: true
        },
        {
            title: 'Chưa đạt chuẩn',
            width: colsWidth,
            wordWrap: true
        },
        {
            title: 'Đạt chuẩn',
            width: colsWidth,
            wordWrap: true
        },
        {
            title: 'Trên chuẩn',
            width: colsWidth,
            wordWrap: true
        },
        {
            title: 'Ghi chú',
            width: '200px',
            align: 'left',
            wordWrap: true
        },
    ];

    $scope.genesisData = [
        ['1', 'Hiệu trưởng'],
        ['2', 'Phó hiệu trưởng'],
        ['3', 'Giáo viên'],
        ['4', 'Nhân viên']
    ];


    //$scope.GetData(true, $scope.loaiSL, $scope.sheetName, $scope.minDimensions, $scope.footers,
    //    $scope.genesisColumn, $scope.genesisData);



}]);

angular.module('WebApiApp').controller('DMVietTatController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.show = true;
    $scope.loaiSL = 'DMVietTat';
    $scope.sheetName = 'SheetDMVietTat';
    $scope.minDimensions = [2, 4];
    $scope.footers = [];

    $scope.genesisColumn = [
        {
            title: 'Chữ viết tắt',
            width: '500px',
            align: 'left',
            wordWrap: true
        },
        {
            title: 'Nội dung',
            width: '500px',
            align: 'left',
            wordWrap: true
        }

    ];

    $scope.genesisData = [
        ['BGH', 'Ban giám hiệu'],
        ['BCH', 'Ban chấp hành'],
        ['BGDĐT', 'Bộ Giáo dục đào tạo']
    ];


    //$scope.GetData(true, $scope.loaiSL, $scope.sheetName, $scope.minDimensions, $scope.footers,
    //    $scope.genesisColumn, $scope.genesisData);



}]);

angular.module('WebApiApp').controller('DatVanDeController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.loaiSL = 'DatVanDe';
    $scope.sheetName = 'SheetDatVanDe';

    /*$scope.GetData(true, $scope.loaiSL, $scope.sheetName, [], [], [], []);*/


}]);

angular.module('WebApiApp').controller('KetLuanController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.loaiSL = 'KetLuan';
    $scope.sheetName = 'SheetKetLuan';

    /*$scope.GetData(true, $scope.loaiSL, $scope.sheetName, [], [], [], []);*/
}]);