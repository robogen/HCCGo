appSettings = angular.module('HccGoApp.appSettings', ['ngRoute' ]);

appSettings.controller('appSettings', ['$route', '$scope', '$routeParams', '$location', '$log', 'preferencesManager', 'connectionService',
   function($route,$scope,$routeParams,$location,$log,preferencesManager,connectionService) {
   // This controller intended purely to manage navigation bar
   // No code beyond navigational controls should be used here
   const storage = require('electron-json-storage');
   
   $scope.params = $routeParams;
   
   // Nav to jobHistory
   $scope.jobHistory = function() {
      $location.path("cluster/" + $scope.params.clusterId + "/jobHistory");
   }
   
}]);
