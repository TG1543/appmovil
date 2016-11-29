angular.module('starter.users', ['ngResource'])
    .factory('User', function (CONST,$resource, LocalStorage) {
        return $resource(CONST.URL + '/api/users/:user_id',null,{ 
                project_leaders:  {url: CONST.URL + '/api/users/project_leaders/', method: "GET", isArray: true, headers: {'Authorization': LocalStorage.getObject('user').auth_token}  },
                users_by_experiment:  {url: CONST.URL + '/api/users/users_by_experiment/:experiment_id', method: "GET", isArray: true, headers: {'Authorization': LocalStorage.getObject('user').auth_token}  },
                researchers:  {url: CONST.URL + '/api/users/researchers', method: "GET", isArray: true, headers: {'Authorization': LocalStorage.getObject('user').auth_token}  }    ,
                update:  {method: "PATCH", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
                create:  {method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
                query:  {method: "GET", isArray: true, headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
                get:    {method: "GET", headers: {'Authorization': LocalStorage.getObject('user').auth_token}}
         })
    });