var myApp = angular.module('myApp', ['ngRoute', 'angularUtils.directives.dirPagination']);

myApp.config(function ($routeProvider, $httpProvider, $locationProvider) {
    //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $routeProvider
    .when('/home', {
        templateUrl: 'views/partials/home.html',
        access: { restricted: true }
    })
    .when('/profile', {
        templateUrl: 'views/partials/profile.html',
        access: { restricted: true }
    })
    .when('/login', {
        templateUrl: 'views/partials/login.html',
        controller: 'loginController',
        access: { restricted: false }
    })
    .when('/logout', {
        controller: 'logoutController',
        access: { restricted: true }
    })
    .when('/register', {
        templateUrl: 'views/partials/register.html',
        controller: 'registerController',
        access: { restricted: true }
    })
    .when('/products', {
        templateUrl: 'views/partials/products.html',
        controller: 'productController',
        access: { restricted: true }
    })
    .when('/company', {
        templateUrl: 'views/partials/company.html',
        controller: 'companyController',
        access: { restricted: false }
    })
    .when('/two', {
        template: '<h1>This is page two!</h1>',
        access: { restricted: false }
    })

    .otherwise({
        redirectTo: '/login'
    });
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix = '!';
    
    //$locationProvider.html5Mode(true);
    //check browser support
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    //$locationProvider.hashPrefix = '!';
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
        AuthService.getUserStatus()
      .then(function () {
            if (next.access.restricted && !AuthService.isLoggedIn()) {
                $location.path('/login');
                $route.reload();
            }
        });
    });
});