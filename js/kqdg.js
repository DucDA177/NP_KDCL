var WebApiApp = angular.module("WebApiApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngCookies"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
WebApiApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
WebApiApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

WebApiApp.factory('$settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var $settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    return $settings;
}]);

/* Setup App Main Controller */
WebApiApp.controller('AppController', ['$scope', '$rootScope', '$cookies', function ($scope, $rootScope, $cookies) {
    $scope.$on('$viewContentLoaded', function () {
      
    });
}]);

WebApiApp.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); 
    });
}]);

/* Setup Layout Part - Sidebar */
WebApiApp.controller('SidebarController', ['$state', '$scope', function ($state, $scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
WebApiApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
WebApiApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
WebApiApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    });


}]);

/* Setup Rounting For All Pages */
WebApiApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    // Redirect any unmatched url
    //$locationProvider.html5Mode(true);
    //if ($cookies.get('username') == null) {
    $urlRouterProvider.otherwise("/auth");
    //}
    //else {
    //    $urlRouterProvider.otherwise("dashboard");
    //}

    $stateProvider
        // Dashboard
        .state('/auth', {
            url: "/auth",
            templateUrl: "views-client/Account/login.html",
            data: { pageTitle: '  PHẦN MỀM KIỂM ĐỊNH CHẤT LƯỢNG GIÁO DỤC' },
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'WebApiApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/pages/css/login-5.min.css',
                            '../assets/global/plugins/ladda/ladda-themeless.min.css',
                            '../assets/global/scripts/app.min.js',
                            'js/controllers/LoginController.js',
                        ]
                    });
                }]

            }
        })
        .state('/access_token', {
            url: "/access_token={accessToken}&token_type={tokenType}&expires_in={expiresIn}",
            templateUrl: "views-client/Account/login.html",
            data: { pageTitle: '  PHẦN MỀM KIỂM ĐỊNH CHẤT LƯỢNG GIÁO DỤC' },
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'WebApiApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/pages/css/login-5.min.css',
                            '../assets/global/plugins/ladda/ladda-themeless.min.css',
                            '../assets/global/scripts/app.min.js',
                            'js/controllers/LoginController.js',
                        ]
                    });
                }]

            }
        })


}]);

/* Init global $settings and run the app */
WebApiApp.run(["$rootScope", "$settings", "$state", function ($rootScope, $settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = $settings; // state to be accessed from view

}]);



