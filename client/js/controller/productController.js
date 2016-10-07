

myApp.factory("dataFactory", function ($http, $q) {
    return {
        getcompanylist: function () {
            var deferred = $q.defer();
            $http.get('/company/getAll')
                 .success(deferred.resolve)
                .error(deferred.resolve)
            return deferred.promise;
        },//---------------------------------------------------------------
        insertcompany: function (data) {
            var deferred = $q.defer();
            $http.post('/company/add', { data: data })
                .success(deferred.resolve)
      .error(deferred.resolve);
            return deferred.promise;
        },
        removeComapny: function (id) {
            console.log('removeCompany :==> ' + id);
            var deferred = $q.defer();
            $http.delete('/company/remove/' + id)
                .success(deferred.resolve)
      .error(deferred.resolve);
            return deferred.promise;
        },
        getcompanyById: function (id) {
            var deferred = $q.defer();
            $http.get('/company/getbyid/' + id)
                  .success(deferred.resolve)
        .error(deferred.resolve);
            return deferred.promise;
        },//---------------------------------------------------------------
        updateCompany: function (company) {
            var deferred = $q.defer();
            $http.put('/company/update/' + company._id, company)
                  .success(deferred.resolve)
        .error(deferred.resolve);
            return deferred.promise;
        },
        //============================================================================================================================
        getProductlist: function () {
            var deferred = $q.defer();
            $http.get('/product/getAll', { data: {} })
                .success(deferred.resolve)
      .error(deferred.resolve);
            return deferred.promise;
        },//---------------------------------------------------------------
        getcompanyProductlist: function (cid, pageno) {
            var deferred = $q.defer();
            $http.get('/products/' + cid, { data: {} })
                .success(deferred.resolve)
      .error(deferred.resolve);
            return deferred.promise;
        },//---------------------------------------------------------------
        getproductbyid: function (id) {
            var deferred = $q.defer();
            $http.get('/product/getbyid/' + id)
                  .success(deferred.resolve)
        .error(deferred.resolve);
            return deferred.promise;
        },//---------------------------------------------------------------
        getproductsincompany: function () {
            var deferred = $q.defer();
            $http.get('/product/getProductInCompany')
                  .success(deferred.resolve)
        .error(deferred.resolve);
            return deferred.promise;
        },//---------------------------------------------------------------
        insertproduct: function (data) {
            var fd = new FormData();
            for (var key in data) {
                fd.append(key, data[key]);

            }
            
            var deferred = $q.defer();
            $http.post('/product/add', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .success(deferred.resolve)
      .error(deferred.resolve);
            return deferred.promise;
        },
        updateProduct: function (data) {
            var fd = new FormData();
            for (var key in data) {
                fd.append(key, data[key]);

            }
            var deferred = $q.defer();
            $http.put('/product/update/' + data._id, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .success(deferred.resolve)
      .error(deferred.resolve);
            return deferred.promise;
        },
        removeProduct: function (product) {
            var deferred = $q.defer();
            $http.delete('/product/remove/' + product._id)
                .success(deferred.resolve)
      .error(deferred.resolve);
            return deferred.promise;
        },
        
        
        removeProductImage: function (product) {
            var deferred = $q.defer();
            $http.delete('/productsImage/' + product._id, product)
                .success(deferred.resolve)
      .error(deferred.resolve);
            return deferred.promise;
        },
      //  updateHobby: function (user) {
      //      var deferred = $q.defer();
      //      $http.put('/userhobby/' + user._id, user)
      //          .success(deferred.resolve)
      //.error(deferred.resolve);
      //      return deferred.promise;
      //  },
    };
});

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

myApp.controller('companyController', ['$scope', '$http', '$location', 'dataFactory', function ($scope, $http, $location, dataFactory) {
        $scope.company = {};
        $scope.dataList = {};
        $scope.productInCompany = {};
        
        var getproductsincompany = function () {
            
            dataFactory.getproductsincompany().then(function (data) {
                $scope.productInCompany = data;
                
            });
        }
        getproductsincompany();
        
        var getcompany = function () {
            try {
                dataFactory.getcompanylist().then(function (data) {
                    
                    $scope.dataList = data;
                    
                    $scope.company = "";
                });

            }
    catch (e) { console.log('data-ng-exception 2 : ' + e.message); }
        }
        getcompany();
        

        // Save New User -----------------------------------------------------------------
        $scope.save = function () {
            console.log($scope.company.name);
            if ($scope.company._id === undefined) {
                
                console.log('insert' + $scope.company);
                dataFactory.insertcompany($scope.company).then(function (data) {
                    console.log('insert :==>> data ' + data);
                    getcompany();
                    //$scope.userList.push(data);// Successfull code
                    $('#myModal').modal('hide');

                });
            }
            else { //------------------------user Update
                console.log('update' + $scope.company);
                dataFactory.updateCompany($scope.company).then(function (data) {
                    console.log('update :==>> data ' + data);
                    getcompany();
                    //$scope.userList.push(data);// Successfull code
                    $('#myModal').modal('hide');
                    $scope.company = "";

                });
            }
        }
        $scope.delete = function (id) {
            if (confirm('Do you want to delete record permanently ?')) {
                dataFactory.removeComapny(id).then(function (data) {
                    console.log('delete :==>> data ' + data);
                    getcompany();
                });
            }
        }
        $scope.edit = function (id) {
            dataFactory.getcompanyById(id).then(function (data) {
                console.log('delete :==>> data ' + data);
                $scope.company = data;
                $('#myModal').modal('show');
            });
        }
        $scope.closepopup = function () {
            console.log('popup close');
            $scope.company = "";
        }
        
        $scope.getproducts = function (id) {
            $location.search('cid', id);
            $location.path('/products');
        }
        
        $scope.getProductsCount = function (companyid) {
            debugger;
            var productCount = 0;
            try {
                
                for (var i = 0; i < $scope.productInCompany.length; i++) {
                    if ($scope.productInCompany[i]._id === companyid) {
                        productCount = $scope.productInCompany[i].count;
                        break;
                    }
                }
            }
            catch (e) { 
            
            }
            return productCount>0?productCount:'N/A';
        }
    }]);
myApp.controller('productController', ['$scope', '$http', '$location', 'dataFactory', function ($scope, $http, $location, dataFactory) {
        $scope.product = {};
        $scope.dataList = {};
        $scope.companies = {};
        $scope.pageSize = 5;
        $scope.currentPage = 1;
        
        var getproducts = function () {
            try {
                
                if ($location.search().hasOwnProperty('cid')) {
                    console.log('company-id :>>: ' + $location.search()['cid']);
                    var companyid = $location.search()['cid'];
                    
                    dataFactory.getcompanyProductlist(companyid).then(function (data) {
                        if (data !== undefined && data !== null) {
                            
                            $scope.dataList = data;
                        }
                       
                    });
                }
                else {
                    dataFactory.getProductlist().then(function (data) {
                        if (data !== undefined && data !== null) {
                            debugger;
                            $scope.datalist = data;
                        }
                       
                    });
                }
                $scope.product = "";
            }
        catch (e) { console.log('data-ng-exception 2 : ' + e.message); }
        }
        getproducts();
        //----------------------------------------------------------------Get Companies for Dropdownlist
        try {
            
            dataFactory.getcompanylist().then(function (data) {
                
                $scope.companies = data;
                
                console.log('company data :> ' + $scope.companies);
            });
        }
    catch (e) {
            console.log('company data data-ng-exception 2 : ' + e.message);
        }
        //-------------------------------------------------------------------------
        $scope.getcompanyName = function (cid) {
            debugger;
            if ($scope.companies !== undefined) {
                for (var i = 0; i < $scope.companies.length ; i++) {
                    if ($scope.companies[i]._id === cid) {
                        return $scope.companies[i].name;
                    }
                }
            }
        }
        //Save New User -----------------------------------------------------------------
        $scope.save = function () {
            debugger;
            console.log($scope.product);
            if ($scope.product._id === undefined) {
                dataFactory.insertproduct($scope.product).then(function (data) {
                    console.log('insert :==>> data ' + data);
                    getproducts();
                    //$scope.userList.push(data);// Successfull code
                    $('#myModal').modal('hide');
                });
            }
            else { //------------------------user Update
                dataFactory.updateProduct($scope.product).then(function (data) {
                    console.log('update :==>> data ' + data);
                    getproducts();
                    //$scope.userList.push(data);// Successfull code
                    $('#myModal').modal('hide');
                });
            }
        }
        $scope.delete = function (_prodcut) {
            if (confirm('Are you sure you want to delete?')) {
                debugger;
                dataFactory.removeProduct(_prodcut).then(function (data) {
                    console.log('delete :==>> data ' + data);
                    //var imgname = product.image;
                    getproducts();
                });
            }
        }
        
        $scope.edit = function (_prodcut) {
            $scope.prodcut
            dataFactory.getproductbyid(_prodcut._id).then(function (data) {
                console.log('delete :==>> data ' + data);
                $scope.product = data;
                $('#myModal').modal('show');
            });
        }
        $scope.closepopup = function () {
            console.log('popup close');
            $scope.product = "";
        }
        $scope.getproducts = function (id) {
            $location.path('/company/' + id + '/products');
        }
        $scope.paging = function (pageno) {
            console.log('pageno :> ' + pageno);
            $location.search('page', pageno);
            // $location.path('/products');
            getproducts(pageno);
        }
        
        $scope.sort = function (keyname) {
            console.log('sort keyname ::>> ' + keyname);
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
    }]);


//..............
//db.company.update({ name: 'Adidas' }, { $push: { products: [{ id: 2, name: 'producttwo', picture: 'picturetwo', price: 200 }] } })