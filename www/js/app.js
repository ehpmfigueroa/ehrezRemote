// Bookmarks App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bookmarksApp', ['ionic', 'ngCordova', 'bookmarksApp.factories', 'bookmarksApp.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    ionic.Platform.fullScreen();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl: "templates/about.html"
        }
      }
    })
    .state('app.bookmarks', {
      url: "/bookmarks",
      views: {
        'menuContent' :{
          templateUrl: "templates/bookmarks.html",
          controller: 'BookmarksCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/bookmarks/:bookmarkId",
      views: {
        'menuContent' :{
          templateUrl: "templates/bookmark.html",
          controller: 'BookmarkCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/bookmarks');
});

