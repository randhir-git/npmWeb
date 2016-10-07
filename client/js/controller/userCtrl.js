//var app1 = angular.module('IndexApp', ['ngRoute']);
console.log('--------------------user Controller---------------');
angular.module('myApp').controller('loginController',
    ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
        $scope.loginForm = {};
        $scope.loginForm.username = "randhir";
        $scope.loginForm.password = "randhir";
        $scope.login = function () {
            // initial values
            $scope.error = false;
            $scope.disabled = true;
            
            // call login from service
            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                    // handle success
                    .then(function () {
                $location.path('/home');
                $scope.disabled = false;
                $scope.loginForm = {};
            })
                    // handle error
                    .catch(function () {
                $scope.error = true;
                $scope.errorMessage = "Invalid username and/or password";
                $scope.disabled = false;
                $scope.loginForm = {};
            });

        };

    }]);

angular.module('myApp').controller('topheaderController',
    ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
        $scope.user = {};
        //debugger;
        try {
            AuthService.getdetails().then(function (response) {
                $scope.user = response.data;
                
            });
        }
    catch (e) { console.log('data-ng-exception 2 : ' + e.message); }
        
        $scope.logout = function () {
            
            // call logout from service
            //debugger;
            AuthService.logout()
                    .then(function () {
                $location.path('/login');
            });

        };
    }]);

angular.module('myApp').controller('registerController',
    ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
        $scope.register = function () {
            console.log($scope.registerForm);
            $scope.pagetitle = 'regisgterController';
            // initial values
            $scope.error = false;
            $scope.disabled = true;
            
            
            debugger;
            //call register from service
            //AuthService.register($scope.registerForm)//.username, $scope.registerForm.fullname, $scope.registerForm.email, $scope.registerForm.password)
            AuthService.register($scope.registerForm.username, $scope.registerForm.fullname, $scope.registerForm.email, $scope.registerForm.password)
                    // handle success
                    .then(function () {
                $location.path('/login');
                $scope.disabled = true;
                $scope.registerForm = {};
            })
                    // handle error
                    .catch(function () {
                $scope.error = true;
                $scope.errorMessage = "Something went wrong!";
                $scope.disabled = false;
                $scope.registerForm = {};
            });

        };

       


    }]);


///Update Profile Code
//myApp.directive('fileModel', ['$parse', function ($parse) {
//        return {
//            restrict: 'A',
//            link: function (scope, element, attrs) {
//                var model = $parse(attrs.fileModel);
//                var modelSetter = model.assign;

//                element.bind('change', function () {
//                    scope.$apply(function () {
//                        modelSetter(scope, element[0].files[0]);
//                    });
//                });
//            }
//        };
//    }]);
angular.module('myApp').service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function (data, uploadUrl) {
            
            var fd = new FormData();
            for (var key in data) {
                fd.append(key, data[key]);

            }
            
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })

            .success(function () {
                console.log('filUpload success');
            })

            .error(function () {
                console.log('filUpload error');
            });
        }
    }]);
//angular.module('myApp').controller('updateprofilecontroller',
//    angular.module('myApp', ['ngRoute', 'angularUtils.directives.dirPagination']).controller('updateprofilecontroller',
myApp.controller('updateprofilecontroller',
    ['$scope', '$location', '$http','AuthService',
    function ($scope, $location, $http, AuthService) {
        $scope.user = {};
        //debugger;
        try {
            AuthService.getdetails().then(function (response) {
                $scope.user = response.data;
            });
        }
    catch (e) { }
        
        //====================================Update Profile==========================
        $scope.update = function () {
            $scope.pagetitle = 'updateprofilecontroller';
            // initial values
            $scope.error = false;
            $scope.disabled = true;
            //call updateprofile from service
            console.log($scope.user);
            debugger;
            
            //var fd = new FormData();
            //for (var key in $scope.user) {
            //    fd.append(key, $scope.user[key]);
            //}
            //// send a post request to the server
            //$http.post('/user/updateprofile', fd, {
            //    transformRequest: angular.identity,
            //    headers: { 'Content-Type': undefined }
            //})
            ////$http.put('/user/updateprofile', user)
            //// handle success
            //.success(function (data, status) {
            //    if (status === 200 && data.status) {
            //        console.log('success');
            //    } else {
            //        console.log(' else  success ');
            //    }
            //})
            //// handle error
            //.error(function (data) {
            //    console.log(' error :> ' + data);
            //});
            AuthService.updateprofile($scope.user)//.username, $scope.registerForm.fullname, $scope.registerForm.email, $scope.registerForm.password)
                    // handle success
                    .then(function (response) {
                console.log('sucess Edit Profile');
                $scope.disabled = false;
            })
                    // handle error
                    .catch(function (err) {
                console.log('Catch Edit Profile' + err);
                $scope.error = true;
                $scope.errorMessage = "Something went wrong!";
                $scope.disabled = false;
                
            });
            $('#myModal').modal('hide');
        };
        //====================================Update Profile==========================
        
    

    }]);


