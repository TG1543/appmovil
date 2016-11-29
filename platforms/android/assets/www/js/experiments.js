angular.module('starter.experiments', ['ngResource','starter.localStorages'])
    .factory('Experiment', function (CONST,$resource,LocalStorage) {
        return $resource(CONST.URL + '/api/experiments/:experiment_id',null,{
            assigned_experiments:  {url: CONST.URL + '/api/experiments/assigned_experiments',method: "GET", isArray: true, headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            add_user_to_experiment:  {url: CONST.URL + '/api/experiments/:id/add_user_to_experiment', method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            remove_user_to_experiment:  {url: CONST.URL + '/api/experiments/:id/remove_user_to_experiment', method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            update:  {method: "PATCH", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            create:  {method: "POST", headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            query:  {method: "GET", isArray: true, headers: {'Authorization': LocalStorage.getObject('user').auth_token}},
            get:    {method: "GET", headers: {'Authorization': LocalStorage.getObject('user').auth_token}}
            });
    });