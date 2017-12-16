var app = angular.module("myApp", ['myApp.directives']);

app.controller('MainCtrl', function($scope) {
	$scope.uploadFinished = function(e, data) {
		console.log('We just finished uploading.');
	};
	$scope.uploading = function(e, data) {
		var progress = parseInt(data.loaded / data.total * 100, 10);
        console.log(progress + '%');
	};
});