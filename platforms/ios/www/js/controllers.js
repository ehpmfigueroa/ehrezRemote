angular.module('bookmarksApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, SecurePin, $cordovaPinDialog) {

  var pin1 = "";
  var pin2 = "";
  var canCancelNewPin = false;

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/welcome.html', {
    scope: $scope,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.changePin = function() {
    $cordovaPinDialog.prompt(" ", pinDialogCallback, "Enter your current Security PIN");
  };

  $scope.newPin = function() {
    canCancelNewPin = false;
    createPin();
  };

  ionic.Platform.ready(function(device) {
   if (SecurePin.isNewPinRequired()) {
      $scope.modal.show();
    }
  });

  function createPin() {
    $cordovaPinDialog.prompt("Create a new PIN of your choosing (min 4).", newPinDialogCallback, "New PIN");
  }

  function newPinDialogCallback(results) {
    if (results && results.buttonIndex == 1 && results.input1 && results.input1.length > 3) {
      pin1 = results.input1;
      $cordovaPinDialog.prompt("Please re-enter the PIN.", retypePinDialogCallback, "PIN Verification");
    } else {
      if (canCancelNewPin == false) {
        createPin();
      }
    }
  }

  function retypePinDialogCallback(results) {
    if (results && results.buttonIndex == 1 && results.input1 && results.input1.length > 3) {
      pin2 = results.input1;
      setPin();
    } else {
      if (canCancelNewPin == false) {
        createPin();
      }
    }
  }

  function pinDialogCallback(results) {
    if (results && results.buttonIndex == 1 && results.input1 && results.input1.length > 3) {
      if (SecurePin.checkPin(results.input1)) {
        canCancelNewPin = true;
        createPin();
      } else {
        $ionicLoading.show({
            template: 'Invalid Security PIN',
            duration: 2000,
            showDelay: 100
          });
      }
    }
  }

  function setPin() {
     if (pin1 == pin2 && SecurePin.setNewPin(pin1) && SecurePin.isNewPinRequired() == false) {
        $ionicLoading.show({
          template: 'New pin set!',
          duration: 2000
        });
        $scope.modal.hide();
        return;
     }
     $ionicLoading.show({
        template: 'Error: PINs do not match. Please try again.',
        duration: 3000
      });
     createPin();
  }

})

.controller('BookmarksCtrl', function($scope, $timeout, $ionicModal, Bookmarks, $ionicLoading) {
  bypassQRCode = false;
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
    if (bypassQRCode)
    {
      $scope.bookmark = {
          id: 0,
          description: "",
          workstationName: "",
          url: ""
        };
        $scope.bookmarkModal.show();
        return;
    }
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        if (result.cancelled) {
          $ionicModal.fromTemplate('').show().then(function() {
            $ionicLoading.show({
              template: 'Cancelled...',
              duration: 1000
            });
          });
          return;
        }
        arr = result.text.split("WorkstationName=");
        if (arr.length != 2) {
          $ionicLoading.show({
            template: 'Error: Invalid QR Code detected.',
            duration: 2000
          });
          return;
        }
        workstationName = arr[1];
        if (workstationName.length < 1) {
          $ionicLoading.show({
            template: 'Error: Invalid QR Code detected.',
            duration: 2000
          });
          return;
        }
        $scope.bookmark = {
          id: 0,
          description: "",
          workstationName: workstationName,
          url: result.text
        };
        $scope.bookmarkModal.show();
      },
      function (error) {
        alert("Scanning failed: " + error);
      }
    );
  };

  $scope.closeNewBookmark = function() {
    $scope.bookmarkModal.hide();
  };

})

.controller('BookmarkCtrl', function($scope, $stateParams, $http, $ionicLoading, Bookmarks, $ionicNavBarDelegate, $ionicPopup, $cordovaPinDialog, SecurePin) {
  $scope.bookmarks = Bookmarks.all();
  $scope.bookmarks.forEach(function(bookmark) {
    if (bookmark.id == $stateParams.bookmarkId) {
      $scope.bookmark = bookmark;
    }
  });

  function pinDialogCallback(results) {
    if (results && results.buttonIndex == 1 && results.input1 && results.input1.length > 3) {
      if (SecurePin.checkPin(results.input1)) {
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
      } else {
        $ionicLoading.show({
            template: 'Invalid Security PIN',
            duration: 2000
          });
      }
    }
  }

  $scope.login = function() {
    if ($scope.bookmark.url.length < 1) {
      $ionicLoading.show({
        template: 'Error! Please delete this bookmark and add it again.',
        duration: 2000
      });
      return;
    }
    $cordovaPinDialog.prompt(" ", pinDialogCallback, "Enter your Security PIN");
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
