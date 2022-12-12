angular.module('WebApiApp').controller('DashboardController', function ($rootScope, $scope, $http, $timeout, $cookies) {
    $scope.Params = {
        IdDonVi : 0
    }

    $scope.LoadDonViCapDuoi = function () {

        $http({
            method: 'GET',
            url: 'api/DanhGiaTieuChi/LoadKHTDGCapDuoi?IdDonViCapTren=' + $rootScope.CurDonVi.Id
                + '&NamHoc=' + localStorage.getItem('NamHoc').toString()
        }).then(function successCallback(response) {
            
            $scope.TDGDonVi = response.data;
            if ($scope.TDGDonVi.length > 0) {
                $scope.Params.IdDonVi = $scope.TDGDonVi[0].dv.Id;
                $scope.IdKeHoachTDG = $scope.TDGDonVi[0].tdg?.Id;
                $scope.IdQuyDinh = $scope.TDGDonVi[0].tdg?.IdQuyDinhTC;
                $scope.LoadBieuDoTCTCDatMuc();
            }


        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    };

    

    $scope.OnChangeDonVi = function () {
        
        let selectedTDGDV = $scope.TDGDonVi.filter(t => t.dv.Id == $scope.Params.IdDonVi)[0];
        $scope.IdKeHoachTDG = selectedTDGDV.tdg?.Id;
        $scope.IdQuyDinh = selectedTDGDV.tdg?.IdQuyDinhTC;
        $scope.LoadBieuDoTCTCDatMuc();
    }

    $scope.LoadBieuDoTCTCDatMuc = function () {
        
        $http({
            method: 'GET',
            url: 'api/BaoCao/LoadBieuDoTCTCDatMuc?IdDonVi=' + $scope.Params.IdDonVi
                + '&IdKeHoachTDG=' + ($scope.IdKeHoachTDG || 0)
                + '&IdQuyDinh=' + ($scope.IdQuyDinh || 0)
        }).then(function successCallback(response) {
            
            $scope.generateChart(response.data);

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    };

    $scope.generateChart = function (data) {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create('chartdiv', am4charts.XYChart)
        chart.colors.step = 2;

        chart.legend = new am4charts.Legend()
        chart.legend.position = 'top'
        chart.legend.paddingBottom = 20
        chart.legend.labels.template.maxWidth = 95

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'category'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.location = 0;

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;

        function createSeries(value, name) {
            var series = chart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = 'category'
            series.name = name

            series.events.on("hidden", arrangeColumns);
            series.events.on("shown", arrangeColumns);

            var bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = 30;
            bullet.label.text = '{valueY}'
            bullet.label.fill = am4core.color('#ffffff')

            return series;
        }

        chart.data = data;


        createSeries('first', 'Đạt mức 1');
        createSeries('second', 'Đạt mức 2');
        createSeries('third', 'Đạt mức 3');

        function arrangeColumns() {

            var series = chart.series.getIndex(0);

            var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
            if (series.dataItems.length > 1) {
                var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
                var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
                var delta = ((x1 - x0) / chart.series.length) * w;
                if (am4core.isNumber(delta)) {
                    var middle = chart.series.length / 2;

                    var newIndex = 0;
                    chart.series.each(function (series) {
                        if (!series.isHidden && !series.isHiding) {
                            series.dummyData = newIndex;
                            newIndex++;
                        }
                        else {
                            series.dummyData = chart.series.indexOf(series);
                        }
                    })
                    var visibleCount = newIndex;
                    var newMiddle = visibleCount / 2;

                    chart.series.each(function (series) {
                        var trueIndex = chart.series.indexOf(series);
                        var newIndex = series.dummyData;

                        var dx = (newIndex - trueIndex + middle - newMiddle) * delta

                        series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                        series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                    })
                }
            }
        }
    }

    if ($rootScope.Module == "TDG") {
        if ($rootScope.checkCapTren)
            $scope.LoadDonViCapDuoi();
        else {
            $scope.Params.IdDonVi = $rootScope.CurDonVi.Id;
            $scope.IdKeHoachTDG = $rootScope.KeHoachTDG.Id;
            $scope.IdQuyDinh = $rootScope.KeHoachTDG.IdQuyDinhTC;
            $scope.LoadBieuDoTCTCDatMuc();
        }
    }
    

    $scope.generateQR = function (text) {
        $('#qrcode').empty();
        const qrcode = new QRCode(document.getElementById('qrcode'), {
            text: text,
            width: 128,
            height: 128,
            colorDark: '#000',
            colorLight: '#fff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
});
