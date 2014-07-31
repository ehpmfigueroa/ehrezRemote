angular.module('bookmarksApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {
    username: "pcruz",
    password: "zxc123ZXC"
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  },

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('BookmarksCtrl', function($scope, $timeout, $ionicModal, Bookmarks) {
  $scope.bookmarks = Bookmarks.all();

  $ionicModal.fromTemplateUrl('templates/new-bookmark.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.bookmarkModal = modal;
  });

  $scope.createBookmark = function(bookmark) {
    $scope.bookmarks.push({
      id: $scope.bookmarks.length + 1,
      description: bookmark.description,
      workstationName: bookmark.workstationName,
      url: bookmark.url
    });
    Bookmarks.save($scope.bookmarks);
    $scope.bookmarkModal.hide();
    bookmark = {
      id: 0,
      description: "",
      workstationName: "",
      url: ""
    };
  };

  $scope.newBookmark = function() {
    $scope.bookmark = {
      id: 0,
      description: "",
      workstationName: "",
      url: ""
    };
    $scope.bookmarkModal.show();
  };

  $scope.closeNewBookmark = function() {
    $scope.bookmarkModal.hide();
  };

  //$timeout(function() {
  //  if($scope.bookmarks.length == 0) {
  //    while(true) {
  //      //TODO: create new pin
  //      break;
  //    }
  //  }
  //});

})

.controller('BookmarkCtrl', function($scope, $stateParams, $http, $ionicLoading, Bookmarks, $ionicNavBarDelegate, $ionicPopup, $filter) {
  $scope.bookmarks = Bookmarks.all();
  $scope.bookmarks.forEach(function(bookmark) {
    if (bookmark.id == $stateParams.bookmarkId) {
      $scope.bookmark = bookmark;
    }
  });
  //for (var i = 0; i < $scope.bookmarks.length; i++) {
  //  var currentBookmark = $scope.bookmarks[i];
  //  if (currentBookmark.id === $stateParams.bookmarkId) {
  //    $scope.bookmark = $scope.bookmarks[i];
  //  }
  //}

  $scope.login = function() {
    $ionicLoading.show({
      template: 'Logging in...'
    });
    $http.get($scope.bookmark.url).success(function() {
      $ionicLoading.hide();
    }).error(function() {
      $ionicLoading.hide();
      $ionicLoading.show({
        template: 'Error! Could not log you in.',
        duration: 2000
      });
    });
  };

  $scope.delete = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Confirm Delete',
     template: 'Are you sure you want to delete this bookmark?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       i = $scope.bookmarks.indexOf($scope.bookmark);
       if(i != -1) {
         $scope.bookmarks.splice(i, 1);
         Bookmarks.save($scope.bookmarks);
       }
       $ionicNavBarDelegate.back();
     }
   });
 };

})