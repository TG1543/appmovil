angular.module('starter.equipments', ['ngResource','starter.localStorages'])
    .factory('Equipment', function (CONST,$resource,LocalStorage) {
        return $resource(CONST.URL + '/api/equipments/:equipment_id',null,{
            toggle_state:  {url: CONST.URL + '/api/equipments/:equipment_id/toggle_state',method: "PATCH", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            update:  {method: "PATCH", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            create:  {method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            query:  {method: "GET", isArray: true, headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            get:    {method: "GET", headers: {'Authorization': LocalStorage.getObject('user').auth_token}}
        });
    });