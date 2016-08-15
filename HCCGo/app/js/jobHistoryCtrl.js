
jobHistoryModule = angular.module('HccGoApp.jobHistoryCtrl', ['ngRoute' ]);

jobHistoryModule.service('jobService', function() {

  var job = null;

  return {
    getJob: function() {
      var temp = job;
      job = null;
      return temp;
    },
    setJob: function(value) {
      job = value;
    }
  };

}).controller('jobHistoryCtrl', ['$scope', '$log', '$timeout', 'connectionService', '$routeParams', '$location', '$q', 'preferencesManager', 'jobService', function($scope, $log, $timeout, connectionService, $routeParams, $location, $q, preferencesManager, jobService) {

  const storage = require('electron-json-storage');

  $scope.params = $routeParams;
  
  var jsonFile;
  storage.get('jobHistory', function(error, data){
    if (error) {
        $log.debug(error);
    }

    $scope.jobs = data.jobs;
	jsonFile = data;
  });

  $scope.cancel = function() {
    $location.path("cluster/" + $scope.params.clusterId);
  }

  $scope.loadDefault = function() {

    $location.path("cluster/" + $scope.params.clusterId + "/jobSubmission");

  }

  $scope.loadJob = function(job) {

    jobService.setJob(job);
    $location.path("cluster/" + $scope.params.clusterId + "/jobSubmission");

  }

  $scope.deleteJob = function(job) {
    bootbox.confirm({
      message: "Are you sure you want to delete this job?",
      callback: function(result) {
        if(result) {
          // remove panel
          $("#panel"+job.id).fadeOut(500, function() {
            $(this).css({"visibility":"hidden",display:'block'}).slideUp();
          });
          // remove from angular binding and reset ids
          $scope.jobs.splice(job.id,1);
          for (var i = 0; i < $scope.jobs.length; i++) {
            $scope.jobs[i].id = i;
          }
          // remove entry from json file
		  jsonFile.jobs = $scope.jobs;
		  storage.set('jobHistory', jsonFile, function(error) {
		    if(error){
			  $log.debug(error);
			}
		  });
        }
      }
    });
  }


}]);
