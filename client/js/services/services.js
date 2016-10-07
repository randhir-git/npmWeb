//angular.module('myApp').factory('AuthService',
myApp.factory('AuthService',
  ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {
        
        // create user variable
        var user = null;
        
        // return available functions for use in the controllers
        return ({
            isLoggedIn: isLoggedIn,
            getUserStatus: getUserStatus,
            login: login,
            logout: logout,
            register: register,
            getdetails : getdetails,
            updateprofile : updateprofile
        });
        
        function isLoggedIn() {
            if (user) {
                return true;
            } else {
                return false;
            }
        }
        
        function getUserStatus() {
            return $http.get('/user/status')
      // handle success
      .success(function (data) {
                if (data.status) {
                    user = true;
                } else {
                    user = false;
                }
            })
      // handle error
      .error(function (data) {
                user = false;
            });
        }
        
        function login(username, password) {
            
            // create a new instance of deferred
            var deferred = $q.defer();
            
            // send a post request to the server
            $http.post('/user/login',
        { username: username, password: password })
        // handle success
        .success(function (data, status) {
                if (status === 200 && data.status) {
                    user = true;
                    deferred.resolve();
                } else {
                    user = false;
                    deferred.reject();
                }
            })
        // handle error
        .error(function (data) {
                user = false;
                deferred.reject();
            });
            
            // return promise object
            return deferred.promise;

        }
        
        function logout() {
            
            // create a new instance of deferred
            var deferred = $q.defer();
            
            // send a get request to the server
            $http.get('/user/logout')
        // handle success
        .success(function (data) {
                user = false;
                deferred.resolve();
            })
        // handle error
        .error(function (data) {
                user = false;
                deferred.reject();
            });
            
            // return promise object
            return deferred.promise;

        }
        
        function register(username, fullname, email, password) {
            
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            console.log(username + '  ====  ' + fullname + '  ====  ' + email + '  ====  ' + password);
            debugger;
            $http.post('/user/register ',
            { username: username, fullname: fullname, email: email, password: password })
            // handle success
            .success(function (data, status) {
                if (status === 200 && data.status) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            // handle error
            .error(function (data) {
                deferred.reject();
            });
            
            // return promise object
            return deferred.promise;

        }
        
        //Update Profile
        
        function updateprofile(user) {
            debugger;
            // create a new instance of deferred
            var fd = new FormData();
            for (var key in user) {
                fd.append(key, user[key]);
            }
            


            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/user/updateprofile',  fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            //$http.put('/user/updateprofile', user)
            // handle success
            .success(function (data, status) {
                if (status === 200 && data.status) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            // handle error
            .error(function (data) {
                deferred.reject();
            });
            
            // return promise object
            return deferred.promise;

        }
        
        function getdetails() {
            return $http.get('/user/getdetails')
      // handle success
      .success(function (data) {
                return data;
            })
      // handle error
      .error(function (data) {
                return data;
            });
        }

    }]);