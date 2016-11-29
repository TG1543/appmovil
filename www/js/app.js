// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','starter.controllers','googlechart'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }   
  });
})
.constant("CONST", {
        //"URL": "http://localhost:3000",
        //"URL": "http://192.168.0.6:3000",
        "URL": "https://nsequera-tg.herokuapp.com/",
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
  url: "/login",
  views: {
      'menuContent': {
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/equipment',
    views: {
      'menuContent': {
        templateUrl: 'templates/equipments.html',
        controller: 'EquipmentCtrl'
      }
    }
  })

  .state('app.bluetooth', {
    url: "/bluetooth",
    views: {
        'menuContent': {
            templateUrl: "templates/bluetooth.html",
            controller: 'BluetoothCtrl'
        }
      }
    })

  .state('app.projects', {
    url: "/projects",
    views: {
        'menuContent': {
            templateUrl: "templates/projects.html",
            controller: 'ProjectsCtrl'
        }
      }
    })

  .state('app.project', {
    url: "/projects/:project_id",
    views: {
        'menuContent': {
          templateUrl: "templates/project.html",
          controller: 'ProjectCtrl'
        }
      }
    })
    
    .state('app.experiment', {
    url: "/experiments/:experiment_id",
    views: {
        'menuContent': {
          templateUrl: "templates/experiment.html",
          controller: 'ExperimentCtrl'
        }
      }
    })

    .state('app.assigned_experiments', {
    url: "/assigned_experiments",
    views: {
        'menuContent': {
          templateUrl: "templates/assigned_experiments.html",
          controller: 'AssignedExperimentsCtrl'
        }
      }
    })

    .state('app.researchers', {
    url: "/researchers/:experiment_id",
    views: {
        'menuContent': {
          templateUrl: "templates/researchers.html",
          controller: 'ResearchersCtrl'
        }
      }
    })
    
    .state('app.iteration', {
    url: "/iterations/:iteration_id",
    views: {
        'menuContent': {
          templateUrl: "templates/iteration.html",
          controller: 'IterationCtrl'
        }
      }
    });

  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/projects');
});
