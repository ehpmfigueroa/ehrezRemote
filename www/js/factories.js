angular.module('bookmarksApp.factories', [])

.factory('Bookmarks', function() {
  return {
    all: function() {
      var bookmarkString = window.localStorage['bookmarks'];
      if(bookmarkString) {
        return angular.fromJson(bookmarkString);
      }
      return [];
    },
    save: function(bookmarks) {
      window.localStorage['bookmarks'] = angular.toJson(bookmarks);
    },
    newBookmark: function() {
      return {
        id: 0,
        description: "",
        workstationName: "",
        url: ""
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveBookmark']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveBookmark'] = index;
    }
  }
})

.factory('SecurePin', function() {
  return {
    isNewPinRequired: function() {
      var securePinString = window.localStorage['securePin'];
      if (securePinString) {
        return false;
      }
      return true;
    },
    checkPin: function(pin) {
      var securePinString = window.localStorage['securePin'];
      if(securePinString) {
        var securePin = angular.fromJson(securePinString);
        if (pin == securePin) {
          return true;
        }
        return false;
      }
      return false;
    },
    setNewPin: function(newPin) {
      if (newPin && newPin.length > 3) {
        window.localStorage['securePin'] = angular.toJson(newPin);
        return true;
      }
      return false;
    }
  }
})