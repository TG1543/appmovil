angular.module('starter.parameters', ['ngResource','starter.localStorages'])
    .factory('Parameter', function (CONST,$resource,LocalStorage) {
        return $resource(CONST.URL + '/api/parameters/:parameter_id',null,{
            query:  {method: "GET", isArray: true, headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            });
    });