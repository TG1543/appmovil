angular.module('starter.sessions', ['ngResource'])
    .factory('Session', function (CONST,$resource) {
        return $resource(CONST.URL + '/api/sessions/:session_id',null,{ 
                login:  {method: "POST" },
                logout: {url: CONST.URL + '/api/sessions/:session_id', method: "DELETE"  }
                })
    });