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