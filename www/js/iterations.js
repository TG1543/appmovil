angular.module('starter.iterations', ['ngResource','starter.localStorages'])
    .factory('Iteration', function (CONST,$resource, LocalStorage) {
        return $resource(CONST.URL + '/api/iterations/:iteration_id',null,{
            unassign_equipment:  {url: CONST.URL + '/api/iterations/:iteration_id/unassign_equipment',method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            assign_equipment:  {url: CONST.URL + '/api/iterations/:iteration_id/assign_equipment',method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            add_values_to_equipment:  {url: CONST.URL + '/api/iterations/add_values_to_equipment',method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            add_comment:  {url: CONST.URL + '/api/iterations/add_comment',method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            update:  {method: "PATCH", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            create:  {method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            query:  {method: "GET", isArray: true, headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            get:    {method: "GET", headers: {'Authorization': LocalStorage.getObject('user').auth_token}}
            })
    });