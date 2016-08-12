preferencesModule = angular.module('PreferencesManager', [])

preferencesModule.factory('preferencesManager',['$log', '$q', function($log, $q) {
  var clustersDefer;
  
  const storage = require('electron-json-storage');
  const fs = require('fs');
  const path = require('path');

  var getClusters = function() {
    var returnDefer = $q.defer();
    storage.get('clusters', function(error, data) {
      if (error) {
         $log.debug(error);
         returnDefer.reject(error);
      }

      returnDefer.resolve(data);

    });
    return returnDefer.promise;
  }
  
  var setClusters = function(clusters) {
    
  }
  
  var addCluster = function(cluster) {
    
  }
  
  return {
    getClusters: getClusters,
    setClusters: setClusters,
    addCluster: addCluster
  }
}]);
  
