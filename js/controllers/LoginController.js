var WebApiApp = angular.module('WebApiApp', ['']);
WebApiApp.controller('LoginController', ['$rootScope', '$scope', '$http', '$cookies', '$settings', 'loginAppFactory', function ($rootScope, $scope, $http, $cookies, $settings, loginAppFactory) {

    try {
        $scope.auth = JSON.parse(readUserConfig())
        if (!$scope.auth.remember) $scope.auth.password = ''
    } catch { }
    $scope.ListNamHoc = [];
    let NamHocIfNull = (new Date().getFullYear() - 1) + '-' + (new Date().getFullYear())
    $scope.NamHoc = localStorage.getItem('NamHoc') ? localStorage.getItem('NamHoc') : NamHocIfNull;
    $scope.Module = localStorage.getItem('Module') ? localStorage.getItem('Module') : 'TDG';

    var generateNamHoc = function () {
        $scope.ListNamHoc.push(NamHocIfNull);
        let curYear = new Date().getFullYear();
        for (let i = curYear - 1; i >= curYear - 20; i--) {
            let NamHoc = (i - 1) + '-' + i
            $scope.ListNamHoc.push(NamHoc)
        }
    }

    $scope.LoadListNamHoc = function () {

        $http({
            method: 'GET',
            url: 'api/KeHoachTDG/LoadListNamHoc'
        }).then(function successCallback(response) {
            if (response.data && response.data.length > 0)
                $scope.ListNamHoc = response.data;
            else
                generateNamHoc();
        }, function errorCallback(response) {
            generateNamHoc();
        });

    }();


    $scope.fnLogin = function (obj) {
        $scope.show = 1;
        if ($scope.auth == null) {
            toastr.error('Chưa nhập tên đăng nhập hoặc mật khẩu !', 'Đăng nhập');
            $scope.show = 0;
            return;
        }
        if ($scope.auth.username == null || $scope.auth.password == null) {
            toastr.error('Chưa nhập tên đăng nhập hoặc mật khẩu !', 'Đăng nhập');
            $scope.show = 0;
            return;
        }

        var data = "grant_type=password&username=" + $scope.auth.username + "&password=" + $scope.auth.password;
        $scope.loading = 'loading ...';
        $http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .success(function (response) {

                $cookies.put('username', response.userName);

                $cookies.put('token_type', response.token_type);
                $cookies.put('token', response.access_token);

                localStorage.setItem('NamHoc', $scope.NamHoc);
                localStorage.setItem('Module', $scope.Module);

                toastr.success('Đăng nhập thành công !', 'Đăng nhập');
                window.location.assign('/home.html');

            }).error(function (err, status) {

                $scope.loading = "Đăng nhập";
                toastr.error('Sai tên đăng nhập hoặc mật khẩu !', 'Đăng nhập');
                $scope.show = 0;


            });

    };
    $scope.authenExProvider = function (provider) {
        $scope.show = 1;
        $http({
            method: 'GET',
            url: 'api/Account/ExternalLogins?returnUrl=%2Flogin.html&generateState=true',
        }).then(function successCallback(response) {
            $scope.show = 0;
            let url = response.data.filter(q => q.Name === provider)[0].Url;
            window.location.href = url;
        }, function errorCallback(response) {
            toastr.error('Lỗi! ' + response.data.Message);
            $scope.show = 0;
        });

    }
    $scope.RequestPasswordReset = function () {
        if (!$scope.auth.username) {
            toastr.error('Vui lòng điền tên tài khoản cần đặt lại mật khẩu vào phần Tên đăng nhập', 'Thông báo');
            return;
        }
        if (confirm('Bạn có chắc chắn yêu cầu đặt lại mật khẩu cho tài khoản ' + $scope.auth.username))
            $http({
                method: 'POST',
                url: '/api/ThongBao/YeuCauDoiMatKhau',
                data: { NguoiGui: $scope.auth.username }
            }).then(function successCallback(response) {
                toastr.success('Đã gửi yêu cầu đặt lại mật khẩu cho tải khoản ' + $scope.auth.username, 'Thông báo');
            }, function errorCallback(response) {
                toastr.error('Lỗi! ' + response.data.Message);
            });
    }
    $scope.CheckLocationHash = function () {
        
        if (location.hash) {
            if (window.location.href.indexOf("access_token=") > -1) {
                if (location.hash.split('access_token=')) {
                    $scope.accessToken = location.hash.split('access_token=')[1].split('&')[0];
                    if ($scope.accessToken) {
                        loginAppFactory.CheckRegistration()
                            .success(function (response) {
                                if (!response.HasRegistered) {
                                    toastr.error('Tài khoản ' + response.Email + ' của bạn chưa được đăng ký. Vui lòng liên hệ quản trị viên !', 'Đăng nhập');
                                    return;
                                }
                                $cookies.put('username', response.UserName);

                                $cookies.put('token_type', response.AccessToken?.token_type);
                                $cookies.put('token', response.AccessToken?.access_token);

                                localStorage.setItem('NamHoc', $scope.NamHoc);
                                localStorage.setItem('Module', $scope.Module);

                                toastr.success('Đăng nhập thành công !', 'Đăng nhập');
                                window.location.assign('/home.html');

                            }).error(function (err, status) {

                                $scope.loading = "Đăng nhập";
                                toastr.error('Có lỗi trong quá trình đăng nhập !', 'Đăng nhập');
                                $scope.show = 0;


                            });
                    }
                }
                return;
            }

        }
        const urlParams = new URLSearchParams(window.location.search);
        let oidc_access_token = urlParams.get('access_token_oidc');
        let userName = urlParams.get('userName');

        if (oidc_access_token && userName) {
            oidc_access_token = atob(oidc_access_token);
            userName = atob(userName);

            $cookies.put('token_type', 'Bearer');
            $cookies.put('token', oidc_access_token);

            $cookies.put('username', userName);

            localStorage.setItem('NamHoc', $scope.NamHoc);
            localStorage.setItem('Module', $scope.Module);

            toastr.success('Đăng nhập thành công !', 'Đăng nhập');
            window.location.assign('/home.html');
        }

        $scope.authenExProvider('OpenIdConnect');
    }
    $scope.$on('$viewContentLoaded', function () {

        App.initAjax();
        //App.init();
        // set default layout mode
        $rootScope.$settings.layout.pageContentWhite = true;
        $rootScope.$settings.layout.pageBodySolid = false;
        $rootScope.$settings.layout.pageSidebarClosed = true;
        // Simple GET request example:

        $('.login-bg').backstretch([
            "../assets/pages/img/login/bg1.jpg",
            "../assets/pages/img/login/bg2.jpg",
            "../assets/pages/img/login/bg3.jpg"
            // "../assets/BackGround.jpg"
        ], {
            fade: 1000,
            duration: 8000
        }
        );
        $scope.loading = "Đăng nhập";
        $scope.CheckLocationHash();
    });
}]);
WebApiApp.factory('loginAppFactory', function ($q, $http) {
    var fac = {};
    fac.CheckRegistration = function () {
        var deferred = $q.defer();
        var request = {
            method: 'get',
            url: 'api/Account/UserInfo',
            header: {
                'Content-Type': 'application/json'
            }
        }
        return $http(request)
    }
    return fac;
})
