
clusterLandingModule = angular.module('HccGoApp.clusterLandingCtrl', ['ngRoute' ]);

clusterLandingModule.controller('clusterLandingCtrl', ['$scope', '$log', '$timeout', 'connectionService', '$routeParams', '$location', '$q', 'preferencesManager', 
                                function($scope, $log, $timeout, connectionService, $routeParams, $location, $q, preferencesManager) {

  $scope.params = $routeParams;
  var clusterInterface = null;
  var path = require('path');
  var jobHistory = path.join(__dirname, 'data/jobHistory.json');

  // Check if app data folder is there, if not, create one with default json file
  /*var filePath = filePathService.getFilePath();
  var dataPath = filePathService.getDataPath();
  
  var fs = require('fs');
  fs.exists(dataPath, function(exists) {
    if(!exists) {
        fs.mkdir(dataPath, function() {
          fs.exists(filePath, function(fileExists) {
            if(!fileExists)
              fs.createReadStream(jobHistory).pipe(fs.createWriteStream(filePath));
          });
        });
    }
  });*/

  // Generate empty graphs
  var homeUsageGauge = c3.generate({
    bindto: '#homeUsageGauge',
    data: {
      columns: [
        ['Loading', 0]
      ],
      type: 'gauge'
    },
    gauge: {
      units: 'Loading',
      label: {
        format: function(value, ratio) {
            return value.toFixed(2);
        }
      },
      max: 0,

    },
    color: {
      pattern: [ '#60B044', '#F6C600', '#F97600', '#FF0000' ],
      threshold: {
        values: [30, 60, 90, 100]
      }
    },
    size: {
      height: 180
    }

  });

  var workUsageGauge = c3.generate({
    bindto: '#workUsageGauge',
    data: {
      columns: [
        ['Loading', 0]
      ],
      type: 'gauge'
    },
    gauge: {
      units: 'Loading',
      label: {
        format: function(value, ratio) {
            return value.toFixed(2);
        }
      },
      max: 0,

    },
    color: {
      pattern: [ '#60B044', '#F6C600', '#F97600', '#FF0000' ],
      threshold: {
        values: [30, 60, 90, 100]
      }
    },
    size: {
      height: 180
    }

  });


  $scope.refreshCluster = function() {
    getClusterStats($scope.params.clusterId);
    
  }

  function getClusterStats(clusterId) {

    // Begin spinning the refresh image
    $(".mdi-action-autorenew").addClass("spinning-image");
    
    // Query the connection service for the cluster
    clusterInterface.getJobs().then(function(data) {
      // Process the data

      $scope.numRunning = data.numRunning;
      $scope.numIdle = data.numIdle;
      $scope.numError = data.numError;
      $scope.jobs = data.jobs;
      $(".mdi-action-autorenew").removeClass("spinning-image");

    }, function(error) {
      console.log("Error in CTRL: " + error);
    })

    clusterInterface.getStorageInfo().then(function(data) {


      var homeUsageGauge = c3.generate({
        bindto: '#homeUsageGauge',
        data: {
          columns: [
            ['Used', data[0].blocksUsed]
          ],
          type: 'gauge'
        },
        gauge: {
          units: 'Gigabytes',
          label: {
            format: function(value, ratio) {
                return value.toFixed(2);
            }
          },
          max: data[0].blocksQuota,

        },
        color: {
          pattern: [ '#60B044', '#F6C600', '#F97600', '#FF0000' ],
          threshold: {
            values: [30, 60, 90, 100]
          }
        },
        size: {
          height: 180
        }

      });

      var workUsageGauge = c3.generate({
        bindto: '#workUsageGauge',
        data: {
          columns: [
            ['Used', data[1].blocksUsed]
          ],
          type: 'gauge'
        },
        gauge: {
          units: 'Gigabytes',
          label: {
            format: function(value, ratio) {
                return value.toFixed(2);
            }
          },
          max: data[1].blocksLimit,

        },
        color: {
          pattern: [ '#60B044', '#F6C600', '#F97600', '#FF0000' ],
          threshold: {
            values: [30, 60, 90, 100]
          }
        },
        size: {
          height: 180
        }

      });

    });


  }
  
  preferencesManager.getClusters().then(function(clusters) {
    // Get the cluster type
    var clusterType = $.grep(clusters, function(e) {return e.label == $scope.params.clusterId})[0].type;

    switch (clusterType) {
      case "slurm":
        clusterInterface = new SlurmClusterInterface(connectionService, $q);
        break;
      case "condor":
        clusterInterface = new CondorClusterInterface(connectionService, $q);
        break;
    }

    getClusterStats($scope.params.clusterId);
    
    // Update the cluster every 15 seconds
    var refreshingPromise; 
    var isRefreshing = false;
    $scope.startRefreshing = function(){
      if(isRefreshing) return;
      isRefreshing = true;
      (function refreshEvery(){
        //Do refresh
        getClusterStats($scope.params.clusterId);
        //If async in then in callback do...
        refreshingPromise = $timeout(refreshEvery,15000)
      }());
    };
    $scope.$on('$destroy',function(){
      if(refreshingPromise) {
        $timeout.cancel(refreshingPromise);
      }
    });
    
    $scope.startRefreshing();
  })


}]);
