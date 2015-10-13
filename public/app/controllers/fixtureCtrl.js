angular.module('fixtureCtrl', ['fixtureService', 'userService', 'authService', 'fixtureAttendService']) 	

.controller('fixtureController', [ "$scope","Fixture", "FixtureAttend", "Auth", "$location", "$route", "$modal", "$log", 
	function($scope, Fixture,  FixtureAttend, Auth, $location, $route, $modal, $log) {

	// var vm = this;


	    // set a processing variable to show loading things
	$scope.processing = true;

	// grab all the fixtures at page load
	Fixture.all().success(function(data) {
      // when all the fixtures come back, remove the processing variable
		$scope.processing = false;
      // bind the fixtures that come back to vm.fixtures
     	$scope.fixtures = data;

    });

   Auth.getUser().then(function (data) {

     		$scope.user = data.data

	});




    


        // function to delete a user
	$scope.deleteFixture = function(id) { 

		$scope.processing = true;
	  	// accepts the user id as a parameter
		Fixture.delete(id).success(function(data) {
		// get all users to update the table
		// you can also set up your api
		// to return the list of users with the delete call 
			Fixture.all().success(function(data) { 

				$scope.processing = false; 
				$scope.fixtures = data;
			});
		}); 



	};	


	$scope.getAttend = function(id) {

		FixtureAttend.getAttendance(id).success(function(data) {

			$scope.attData = data;
			console.log($scope.attData);
		})
	}

	

	$scope.removeAttend = function(id) {

		 FixtureAttend.removeAttendance(id).success(function(data) {

		 	$scope.message = data.message;
		 	console.log(data.message);

		 	FixtureAttend.getAttendance(id).success(function(data) {

		 		$scope.attData = data;
		 		console.log(data);
		 		console.log($scope.user);


		 	});

		 
		});

		 $route.reload();


	};



	$scope.addAttend = function(id) {

		 FixtureAttend.addAttendance(id).success(function(data) {

		 	$scope.message = data.message;
		 	console.log(data.message);

		 	FixtureAttend.getAttendance(id).success(function(data) {

		 		$scope.attData = data;
		 		console.log(data);
		 		console.log($scope.user);	
		 	});


		 });

		 $route.reload();


	};



  $scope.open_submit = function () {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'modalSubmitFixture.html',
      controller: 'modalSubmitFixture',	
      scope: $scope,
     
      
    });

    modalInstance.result.then(function () {
    	$route.reload();
    }, 	function() {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

   $scope.open_edit = function () {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'modalEditFixture.html',
      controller: 'modalEditFixture',
      scope: $scope,
    	
    });

    modalInstance.result.then(function () {
    	$route.reload();
    }, 	function() {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };



}])

.controller("modalSubmitFixture", ["$scope","Fixture", "$location", "$timeout", "$modalInstance", "$route",
function($scope,Fixture, $location, $timeout, $modalInstance, $route) {

	// var vm = this;
	$scope.message = "Fixture created";
	

    $scope.ok = function () { 
      $modalInstance.close($scope.message);  

    };

   $scope.cancel = function () {
      $modalInstance.dismiss('cancel');

    };

    $scope.addFixture = function() {

    	$scope.processing = true;

    	$scope.message =  '';


       	Fixture.create($scope.fixtureData).success(function(data) {

				$scope.processing = false;

				// clear the form

				$scope.fixtureData = {};

				$scope.message = data.message;

			});
    
      };




}])


.controller("fixtureCreateController", ["Fixture", "$location", "$timeout", function(Fixture, $location, $timeout) {

	var vm = this;

	// variable to hide/show elements of view
	// differentiates between create and edit pages

	vm.type = 'create' ;

	// function to create user


	vm.saveFixture = function() {

		vm.processing = true;


		// clear the message

		vm.message =  '';

		// use the userCreate function in the user Service

		Fixture.create(vm.fixtureData)
			.success(function(data) {

				vm.processing = false;

				// clear the form

				vm.fixtureData = {};

				vm.message = data.message;



			});

		$timeout(function(){
            
                   $location.path('/availability')
              
            		}, 1000);

		

		};		

}])


.controller("fixtureEditController", ["Fixture", "$routeParams", function(Fixture, $routeParams) {

	var vm = this;

	// variable to hide/show elemnts of the view
	// differentiates between create and edit pages


	vm.type = 'edit';

	

	// console.log(vm.date)

	// get the user data for the user you want to edit 
	// $routeParams is the way we grab data from the URL

	Fixture.get($routeParams.fixture_id)
		.success(function(data) {

			vm.fixtureData = data;

			vm.fixtureData.date = new Date(vm.fixtureData.date);  //need to re-instantiate dob as date object

		});

	//function to save user


	vm.saveFixture =  function() {

		vm.processing = true;

		vm.message = '';


		// call the fixtureService function to update

		Fixture.update($routeParams.fixture_id, vm.fixtureData)

			.success(function(data) {

				vm.processing = false;


				//clear the form

				vm.fixtureData = {};

				//bind the message from our API to vm.message

				vm.message = data.message;

			});

		}

}])






