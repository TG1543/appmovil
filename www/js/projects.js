angular.module('starter.projects', ['ngResource','starter.localStorages'])
    .factory('Project', function (CONST,$resource,LocalStorage) {
        return $resource(CONST.URL + '/api/projects/:project_id',null,{
                update:  {method: "PATCH", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
                create:  {method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
                query:  {method: "GET", isArray: true, headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
                get:    {method: "GET", headers: {'Authorization': LocalStorage.getObject('user').auth_token}}
                });
    });