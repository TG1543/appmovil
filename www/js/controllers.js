angular.module('starter.controllers', 
['starter.localStorages','starter.bluetooth','starter.sessions',
 'starter.users','starter.projects','starter.experiments',
 'starter.iterations','starter.equipments','starter.parameters'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, Session, LocalStorage) {
  var user =  LocalStorage.getObject('user')
  if (typeof user.auth_token === 'undefined'){
    $scope.li_hide = "ng-hide"
    $scope.lo_hide = ""
  }else{
    $scope.lo_hide = "ng-hide"
    $scope.li_hide = ""
  }
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.logout = function() {
    console.log(user)
    Session.logout({session_id: user.auth_token})
    LocalStorage.remove('user')
    $state.go('app.login');
    window.location.reload();
  };
})
//LoginCtrlStart
.controller('LoginCtrl', function($scope, $location, $state, $ionicPopup, Session, LocalStorage) {
  $state.go($state.current, {}, {reload: true});
  var user =  LocalStorage.getObject('user')
  if (typeof user.auth_token !== 'undefined'){
    $state.go('app.projects' );
  }
  // A confirm dialog
  $scope.showAlert = function(_title,message) {
   var alertPopup = $ionicPopup.alert({
     title: _title,
     template: message
   });
 };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var promise = Session.save($scope.loginData).$promise;
    promise.then(function(data) { 
      console.log(data)
      LocalStorage.setObject('user',data)
      $scope.showAlert("Bienvenido", data.name)
      $state.go('app.projects');
      window.location.reload();
    }).catch(function(data){
      LocalStorage.setObject('sessionErrors',data)
      $scope.showAlert("Error",data.data.errors)
    })
  };
})
//BluetoothStart
.controller('BluetoothCtrl', function($scope, $state, $ionicPopup, $timeout, LocalStorage, Bluetooth, Equipment) {
  // A confirm dialog
  $scope.showAlert = function(_title,message) {
   var alertPopup = $ionicPopup.alert({
     title: _title,
     template: message
   });
 };

 $scope.doRefresh = function(){
    Bluetooth.list().then(function(data) { 
      $scope.devices = data
    }).catch(function(data){
      $scope.showAlert("Error","No hay dispositivos emparejados")
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });  
 };

  Bluetooth.list().then(function(data) { 
    $scope.devices = data
  }).catch(function(data){
    $scope.showAlert("Error","No hay dispositivos emparejados")
  })
  
  $scope.add = function(device) {
    console.log(device)
    var equipment = {};
    equipment.name = device.name
    equipment.serial_number = device.address
    Equipment.create(equipment).$promise.then(function(data) { 
      $scope.showAlert("Información","Se creó el dispositivo correctamente")
    }).catch(function(data){
       var errors = ""
      if (data.data != null){
        for (var key in data.data.errors) {
          errors += (key +": " + data.data.errors[key] + "; ")
        }
      }
      if (errors == "") errors = "El equipo ya está agregado"
      $scope.showAlert("Error",errors)
    })
  };

  $scope.connect = function(address) {
    Bluetooth.connect(address).then(function(data) { 
      console.log("entro:" + address)
     console.log(data)
    }).catch(function(data){
      console.log("fallo: " + address)
      console.log(data)
    })
  };

  $scope.write = function() {
    Bluetooth.write('aaaa').then(function(data) {
      console.log("enviado:")
      console.log(data)
    }).catch(function(data){
      console.log("no enviado:")
      console.log(data)
    })
  }

  $scope.read = function() {
    Bluetooth.available().then(function(data) {
      console.log(data)
      if (data == 0){
        $scope.showAlert("Error","No hay datos para leer")
      }else{
        console.log("leere datos")
      }
    }).catch(function(data){
      console.log("Fallo lectura de datos: ")
      console.log(data)
    })
  }


})
//ProjectsCtrlStart
.controller('ProjectsCtrl', function($scope, $state, $ionicModal, $ionicPopup, LocalStorage,User, Project) {
  // A confirm dialog
  $scope.showAlert = function(_title,message) {
   var alertPopup = $ionicPopup.alert({
     title: _title,
     template: message
   });
 };

 $scope.doRefresh = function(){
    Project.query().$promise.then(function(data) { 
      $scope.projects = data
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });  
 };

  $scope.projectData = {};

  $ionicModal.fromTemplateUrl('templates/projectForm.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_create = modal;
  });

  $scope.closeForm = function() {
    $scope.modal_create.hide();
  };

  $scope.openForm = function() {
    $scope.users = User.project_leaders()
    $scope.modal_create.show();
  };

  $scope.sendForm = function() {
    //$scope.projectData.user_id = $scope.projectData.user_id.id
    console.log($scope.projectData)
    var promise = Project.create($scope.projectData).$promise;
    promise.then(function(data) { 
      console.log(data)
      $scope.showAlert("Información", "Se creó el proyecto: " + data.name)
      $scope.modal_create.hide();
      $scope.projectData = {}
    }).catch(function(data){
      var errors = ""
      if (data.data != null){
        for (var key in data.data.errors) {
          errors += (key +": " + data.data.errors[key] + "; ")
        }
      }
      if (errors == "") errors = "No se pudo crear el proyecto."
      $scope.showAlert("Error",errors)
    })
  };

  $state.go($state.current, {}, {reload: true});
  Project.query().$promise.then(function(data) { 
    $scope.projects = data
  }).catch(function(data){
    console.log(data)
    $state.go('app.login');
  })
})
//ProjectCtrlStart
.controller('ProjectCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicPopup, LocalStorage, User, Project, Experiment) {
  // A confirm dialog
  $scope.showAlert = function(_title,message) {
   var alertPopup = $ionicPopup.alert({
     title: _title,
     template: message
   });
 };

 $scope.doRefresh = function(){
    Project.get({project_id: $stateParams.project_id}).$promise.then(function(data) { 
      $scope.projectData = data
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
 };

  $scope.projectData = {};

  $ionicModal.fromTemplateUrl('templates/projectForm.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_edit = modal;
  });

  $scope.closeForm = function() {
    $scope.modal_edit.hide();
  };

  $scope.openForm = function() {
    $scope.users = User.project_leaders()
    $scope.modal_edit.show();
  };

  $scope.sendForm = function() {
    console.log($scope.projectData)
    var promise = Project.update({project_id: $scope.projectData.id},$scope.projectData).$promise;
    promise.then(function(data) { 
      console.log(data)
      $scope.showAlert("Información", "Se actualizó el proyecto: " + data.name)
      $scope.modal_edit.hide();
      $scope.projectData = {}
    }).catch(function(data){
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo crear el proyecto."
      $scope.showAlert("Error",errors)
    })
  };

  $scope.cancel = function() {
    $scope.projectData.state_id = 2
    var promise = Project.update({project_id: $scope.projectData.id},$scope.projectData).$promise;
    promise.then(function(data) { 
      console.log(data)
      $scope.showAlert("Información", "Se ha cancelado el proyecto: " + data.name)
      $scope.modal_edit.hide();
    }).catch(function(data){
      console.log()
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo cancelar el proyecto."
      $scope.showAlert("Error",errors)
    })
  };

  $scope.finish = function() {
    $scope.projectData.state_id = 3
    var promise = Project.update({project_id: $scope.projectData.id},$scope.projectData).$promise;
    promise.then(function(data) { 
      console.log(data)
      $scope.showAlert("Información", "Se ha finalizado el proyecto: " + data.name)
      $scope.modal_edit.hide();
    }).catch(function(data){
      console.log()
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo finalizar el proyecto."
      $scope.showAlert("Error",errors)
    })
  };
  //experimentData
  $scope.experimentData = {}

  $ionicModal.fromTemplateUrl('templates/experimentForm.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_create_experiment = modal;
  });

  $scope.closeFormCreateExperiment = function() {
    $scope.modal_create_experiment.hide();
  };

  $scope.openFormCreateExperiment = function(project_id) {
    $scope.experimentData.project_id = project_id
    $scope.modal_create_experiment.show();
  };

  $scope.sendFormCreateExperiment = function() {
    console.log($scope.experimentData)
    var promise = Experiment.create($scope.experimentData).$promise;
    promise.then(function(data) { 
      console.log(data)
      $scope.showAlert("Información", "Se creó el experimento: " + data.description)
      $scope.modal_create_experiment.hide();
      $scope.experimentData = {}
    }).catch(function(data){
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo crear el experimento."
      $scope.showAlert("Error",errors)
    })
  };
  
  
  $scope.projectData = Project.get({project_id: $stateParams.project_id});
})
//ExperimentCtrlStart
.controller('ExperimentCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicPopup, LocalStorage, User, Experiment, Iteration) {
  // A confirm dialog
  $scope.showAlert = function(_title,message) {
   var alertPopup = $ionicPopup.alert({
     title: _title,
     template: message
   });
 };

$scope.showPop = function(){
  var myPopup = $ionicPopup.show({
  template: 'Escoge el resultado del experimento',
  title: '¿Estás seguro?',
  scope: $scope,
  buttons: [
  {   
    text: 'Atrás',
    type: 'button-stable',
  },
  {
    text: '<i class="icon ion-thumbsdown"></i>',
    type: 'button-assertive',
    onTap: function(e) {  
      $scope.finish(2)
    }
  },
  {
    text: '<i class="icon ion-thumbsup"></i>',
    type: 'button-balanced',
    onTap: function(e) { 
      $scope.finish(1)
    }
  }]
});
myPopup.then(function(userinput) {
  if(userinput){
    console.log('returned data'+ userinput)
  }
});
}

$scope.addIteration = function(){
  $scope.data = {}
  var myPopup = $ionicPopup.show({
  template: '<input type="date" displayFormat="DD/MM/YYYY" ng-model="data.date" required>',
  title: 'Iteración',
  scope: $scope,
  buttons: [
  {   
    text: 'Atrás',
    type: 'button-stable',
  },
  {
    text: 'Crear',
    type: 'button-balanced',
    onTap: function(e) {
      $scope.iterationData = {}
      $scope.iterationData.experiment_id = $stateParams.experiment_id
      $scope.iterationData.started_at = $scope.data.date
      console.log($scope.iterationData)
      var promise = Iteration.create($scope.iterationData).$promise;
      promise.then(function(data) { 
        $scope.showAlert("Información", "Se agregó correctamente la iteración. ")
        $scope.iterationData = {}
      }).catch(function(data){
        var errors = ""
        if (data.data != null){
          if (typeof data.data.errors === 'string'){
            errors = data.data.errors
          }else{
            for (var key in data.data.errors) {
              errors += (key +": " + data.data.errors[key] + "; ")
            }
          }
        }
        if (errors == "") errors = "No se creó la iteración. "
        $scope.showAlert("Error",errors)
      })
    }
  }]
});
}



//experimentData
  $scope.experimentData = {}

  $scope.doRefresh = function(){
    Experiment.get({experiment_id: $stateParams.experiment_id}).$promise.then(function(data) { 
      $scope.experimentData = data
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $ionicModal.fromTemplateUrl('templates/experimentForm2.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_edit = modal;
  });

  $scope.closeForm = function() {
    $scope.modal_edit.hide();
  };

  $scope.openForm = function() {
    console.log($scope.experimentData)
    $scope.modal_edit.show();
  };

  $scope.sendForm = function() {
    console.log($scope.experimentData)
    var promise = Experiment.update({experiment_id: $scope.experimentData.id},$scope.experimentData).$promise;
    promise.then(function(data) { 
      console.log(data)
      $scope.showAlert("Información", "Se actualizó el experimento: " + data.description)
      $scope.modal_edit.hide();
      $scope.experimentData = {}
    }).catch(function(data){
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo crear el experimento."
      $scope.showAlert("Error",errors)
    })
  };

    $scope.cancel = function() {
    $scope.experimentData.state_id = 2
    var promise = Experiment.update({experiment_id: $scope.experimentData.id},$scope.experimentData).$promise;
    promise.then(function(data) { 
      console.log(data)
      $scope.showAlert("Información", "Se ha cancelado el experimento: " + data.description)
      $scope.modal_edit.hide();
    }).catch(function(data){
      console.log()
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo cancelar el experimento."
      $scope.showAlert("Error",errors)
    })
  };

  $scope.finish = function(result_id) {
    $scope.experimentData.state_id = 3
    $scope.experimentData.result_id = result_id
    var promise = Experiment.update({experiment_id: $scope.experimentData.id},$scope.experimentData).$promise;
    promise.then(function(data) { 
      console.log(data)
      $scope.showAlert("Información", "Se ha finalizado el experimento: " + data.description)
      $scope.modal_edit.hide();
    }).catch(function(data){
      console.log()
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo finalizar el experimento."
      $scope.showAlert("Error",errors)
    })
  };

  $scope.experimentData = Experiment.get({experiment_id: $stateParams.experiment_id});
})
//EquipmentCtrlStart
.controller('EquipmentCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicPopup, LocalStorage, User, Equipment) {
   $scope.doRefresh = function(){
     Equipment.query().$promise.then(function(data) { 
       $scope.equipments = data
     }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
   });
  };

  $scope.showAlert = function(_title,message) {
   var alertPopup = $ionicPopup.alert({
     title: _title,
     template: message
   });
 };

  $ionicModal.fromTemplateUrl('templates/equipmentForm.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_edit = modal;
  });

  $scope.closeForm = function() {
    $scope.modal_edit.hide();
  };

  $scope.openForm = function(equipment_id ) {
    $scope.equipment = Equipment.get({equipment_id: equipment_id});
    $scope.modal_edit.show();
  };

  $scope.sendForm = function() {
    var promise = Equipment.update({equipment_id: $scope.equipment.id},$scope.equipment).$promise;
    promise.then(function(data) { 
      $scope.showAlert("Información", "Se actualizó el equipo: " + data.name)
      $scope.modal_edit.hide();
      $scope.equipment = {}
    }).catch(function(data){
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo actualizar el equipo."
      $scope.showAlert("Error",errors)
    })
  };

  $scope.toogle_state = function(equipment_id) {
    var promise = Equipment.toggle_state({equipment_id: equipment_id},$scope.equipment).$promise;
    promise.then(function(data) { 
      $scope.showAlert("Información", "Se cambió el estado del equipo: " + data.name)
    }).catch(function(data){
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo actualizar el equipo."
      $scope.showAlert("Error",errors)
    })
  };


  
  $scope.equipments =  Equipment.query();
})

//ChartCtrlStart
.controller('ChartCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicPopup, LocalStorage, User, Experiment, Iteration) {
   $scope.doRefresh = function(){
    // Experiment.assigned_experiments().$promise.then(function(data) { 
    //   $scope.researchers = data
    // }).finally(function() {
    //   $scope.$broadcast('scroll.refreshComplete');
    // });
  };
  $scope.getChart = function(_id) {
    var chartObject = {};
     chartObject.ide = _id
     chartObject.type = "LineChart";

    chartObject.data = {
        "cols": [
            { id: "t", label: "Topping", type: "string" },
            { id: "s", type: "number" },
            { id: "s", type: "number" }
        ], 
        "rows": [
            {
                c: [
                    { v: 1 },
                    { v: 3 },
                    { v: 5 },
                ]
                
            },
            {
                c: [
                    { v: "Olives" },
                    { v: 31 }
                ]
            },
            {
                c: [
                    { v: "Zucchini" },
                    { v: 1 }
                ]
            },
            {
                c: [
                    { v: "Pepperoni" },
                    { v: 2 },
                ]
            }
        ]
        
    };
    chartObject.options = {
        'title': 'Super graficas' + _id
    };
    return chartObject
  };

  
  
   
    $scope.v1 = [$scope.getChart(1),$scope.getChart(2)]
    console.log($scope.v1)
})

//AssignedExperimentsCtrlStart
.controller('AssignedExperimentsCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicPopup, LocalStorage, User, Experiment, Iteration) {
   $scope.doRefresh = function(){
    Experiment.assigned_experiments().$promise.then(function(data) { 
      $scope.researchers = data
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  
  $scope.experiments = Experiment.assigned_experiments();
})

//ResearchersCtrlStart
.controller('ResearchersCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicPopup, LocalStorage, User, Experiment, Iteration) {
  // A confirm dialog
  $scope.showAlert = function(_title,message) {
   var alertPopup = $ionicPopup.alert({
     title: _title,
     template: message
   });
 };
//researcherData
  $scope.researcherData = {}

  $scope.doRefresh = function(){
    User.users_by_experiment({experiment_id: $stateParams.experiment_id}).$promise.then(function(data) { 
      $scope.researchers = data
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

   $ionicModal.fromTemplateUrl('templates/researcherForm.html', {
     scope: $scope
   }).then(function(modal) {
     $scope.modal_add = modal;
   });

   $scope.closeForm = function() {
     $scope.modal_add.hide();
   };

   $scope.openForm = function() {
     $scope.users = User.researchers()
     $scope.modal_add.show();
   };

  $scope.sendForm = function() {
    console.log($scope.researcherData)
    var promise = Experiment.add_user_to_experiment({id: $stateParams.experiment_id},$scope.researcherData).$promise;
    promise.then(function(data) { 
      $scope.showAlert("Información", "Se agregó correctamente al usuario. ")
      $scope.modal_add.hide();
      $scope.researcherData = {}
    }).catch(function(data){
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo agregar el usuario. "
      $scope.showAlert("Error",errors)
    })
  };

  $scope.removeUser = function(user_id) {
    $scope.researcherData.user_id = user_id
    console.log( $scope.researcherData)
     var promise = Experiment.remove_user_to_experiment({id: $stateParams.experiment_id}, $scope.researcherData).$promise;
     promise.then(function(data) { 
      $scope.showAlert("Información", "Se removió correctamente al usuario. ")
      $scope.modal_add.hide();
      $scope.researcherData = {}
    }).catch(function(data){
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo remover al usuario. "
      $scope.showAlert("Error",errors)
    })
  };

  $scope.addIteration2 = function(date){
    
  }


  $scope.researchers = User.users_by_experiment({experiment_id: $stateParams.experiment_id})
})
//IterationCtrlStart
.controller('IterationCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicPopup, LocalStorage, User, Experiment, Iteration, Parameter, Equipment, Bluetooth) {
  // A confirm dialog
  $scope.showAlert = function(_title,message) {
   var alertPopup = $ionicPopup.alert({
     title: _title,
     template: message
   });
 };

  $scope.addComment = function(){
    $scope.data = {}
    var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.comment" required>',
    title: 'Comentario',
    scope: $scope,
    buttons: [
    {   
      text: 'Atrás',
      type: 'button-stable',
    },
    {
      text: 'Crear',
      type: 'button-balanced',
      onTap: function(e) {
        $scope.binnacleData = {}
        $scope.binnacleData.iteration_id = $stateParams.iteration_id
        $scope.binnacleData.binnacle = {}
        $scope.binnacleData.binnacle.iteration_id = $stateParams.iteration_id
        $scope.binnacleData.binnacle.comment = $scope.data.comment
        console.log($scope.binnacleData)
        var promise = Iteration.add_comment($scope.binnacleData).$promise;
        promise.then(function(data) { 
          $scope.showAlert("Información", "Se agregó correctamente el comentario. ")
          $scope.binnacleData = {}
        }).catch(function(data){
          var errors = ""
          if (data.data != null){
            if (typeof data.data.errors === 'string'){
              errors = data.data.errors
            }else{
              for (var key in data.data.errors) {
                errors += (key +": " + data.data.errors[key] + "; ")
              }
            }
          }
          if (errors == "") errors = "No se agregó el comentario. "
          $scope.showAlert("Error",errors)
        })
      }
    }]
    });
  }

  $scope.finish = function() {
    $scope.iterationData.state_id = 3
    $scope.iterationData.ended_at = new Date()
    var promise = Iteration.update({iteration_id: $stateParams.iteration_id},$scope.iterationData).$promise;
    promise.then(function(data) { 
      $scope.showAlert("Información", "Se ha finalizado la iteración. ")
    }).catch(function(data){
      console.log()
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo finalizar la iteración."
      $scope.showAlert("Error",errors)
    })
  }

  $scope.cancel = function() {
    $scope.iterationData.state_id = 2
    $scope.iterationData.ended_at = new Date()
    var promise = Iteration.update({iteration_id: $stateParams.iteration_id},$scope.iterationData).$promise;
    promise.then(function(data) { 
      $scope.showAlert("Información", "Se ha cancelado la iteración. ")
    }).catch(function(data){
      console.log()
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo cancelar la iteración."
      $scope.showAlert("Error",errors)
    })
  }


//ParametersData

  $ionicModal.fromTemplateUrl('templates/parameterForm.html', {
     scope: $scope
  }).then(function(modal) {
     $scope.modal_parameter = modal;
  });

  $scope.closeForm = function() {
     $scope.modal_parameter.hide();
  };

  $scope.openForm = function() {
     $scope.data = {}
     $scope.data.iteration_id = $stateParams.iteration_id
     $scope.parameters = Parameter.query($scope.data)

     $scope.modal_parameter.show();
  };

  $scope.sendForm = function() {
    console.log($scope.parameters)
    $scope.data = {}
    $scope.data.iteration_id = $stateParams.iteration_id
    $scope.data.values = {}
    for (key = 0; key < 4;++key){
      $scope.data.values[key] = {}
      $scope.data.values[key].parameter_id = $scope.parameters[key].id
      $scope.data.values[key].quantity = $scope.parameters[key].quantity
    } 
    console.log($scope.data)

    var promise = Iteration.add_values_to_equipment({},$scope.data).$promise;
    promise.then(function(data) { 
      $scope.showAlert("Información", "Se editó correctamente los parámetros. ")
      $scope.modal_parameter.hide();
       $scope.researcherData = {}
    }).catch(function(data){
      console.log(data)
       var errors = ""
       if (data.data != null){
         if (typeof data.data.errors === 'string'){
           errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se pudo editar la configuración. "
      $scope.showAlert("Error",errors)
    })
  };

//(Un)AssignEquipment

$scope.unassignEquipment = function() {
    var promise = Iteration.unassign_equipment({iteration_id: $stateParams.iteration_id},{}).$promise;
    promise.then(function(data) { 
      $scope.showAlert("Información", "Se desasignó el equipo.")
    }).catch(function(data){
      console.log()
      var errors = ""
      if (data.data != null){
        if (typeof data.data.errors === 'string'){
          errors = data.data.errors
        }else{
          for (var key in data.data.errors) {
            errors += (key +": " + data.data.errors[key] + "; ")
          }
        }
      }
      if (errors == "") errors = "No se logró desasignar el equipo."
      $scope.showAlert("Error",errors)
    })
  }

  $scope.assignEquipment = function(){
    $scope.data = {}
    $scope.equipments = Equipment.query()
    var myPopup = $ionicPopup.show({
      template: '<div class="text-center"><select ng-model="data.id" required> <option ng-repeat="equipment in equipments" value="{{equipment.id}}">{{equipment.name}}</option> </select></div>',
      title: 'Iteración',
      scope: $scope,
      buttons: [
      {   
        text: 'Atrás',
        type: 'button-stable',
      },
      {
        text: 'Asignar',
        type: 'button-balanced',
        onTap: function(e) {
          console.log($scope.data)
          $scope.data1 = {}
          $scope.data1.equipment = {}
          $scope.data1.equipment.equipment_id = $scope.data.id
          var promise = Iteration.assign_equipment({iteration_id: $stateParams.iteration_id},$scope.data1).$promise;
          promise.then(function(data) { 
             $scope.showAlert("Información", "Se asignó correctamente el equipo.")
             $scope.data = {}
          }).catch(function(data){
            var errors = ""
            if (data.data != null){
              if (typeof data.data.errors === 'string'){
                errors = data.data.errors
              }else{
                for (var key in data.data.errors) {
                  errors += (key +": " + data.data.errors[key] + "; ")
                }
              }
            }
            if (errors == "") errors = "No se asignó correctamente el equipo."
            $scope.showAlert("Error",errors)
          })
        }
      }]
    });
  }

//setup equipment

$scope.setupEquipment = function(){
    var myPopup = $ionicPopup.show({
      template: '¿Quiere continuar?',
      title: 'Configurar equipo',
      scope: $scope,
      buttons: [
      {   
        text: 'Atrás',
        type: 'button-stable',
      },
      {
        text: 'Configurar',
        type: 'button-balanced',
        onTap: function(e) {
          Bluetooth.isEnabled().then(function(data) { 
            address = $scope.iterationData.equipment.serial_number
            Bluetooth.connect(address).then(function(data) { 
              Bluetooth.write('i').then(function(data) {})            
              console.log("for")
              for (var i = 0; i < 50000; ++i){for (var j = 0; j < 10000; ++j){}}
              console.log("for_end")
              Bluetooth.available().then(function(data){
                console.log(data)
                if (data != 0){
                  Bluetooth.read().then(function(data){
                    console.log(data) 
                    if (data == 'i'){
                      var iteration = {}
                      iteration.iteration_id = $stateParams.iteration_id
                      Parameter.query(iteration).$promise.then(function(data) {
                        var parameters = data
                        console.log(parameters)
                        Bluetooth.write([parameters[0].quantity,
                                         parameters[1].quantity,
                                         parameters[2].quantity,
                                         parameters[3].quantity]).then(function(data){ //voltage //time of each chart  //number of chart //time of work
                                               console.log("escribio")
                                         })
                        for (var i = 0; i < 50000; ++i){for (var j = 0; j < 10000; ++j){}}
                        Bluetooth.available().then(function(data){
                          console.log(data)
                          if (data != 0){
                            Bluetooth.read().then(function(data){
                              console.log(data) 
                              if (data == 'f'){$scope.showAlert("Información", "Se configuró el dispositivo correctamente")}
                            })
                          }
                          Bluetooth.disconnect()
                        })
                      })
                    }
                  })
                }else{
                  $scope.showAlert("Información", "No se ha configurado el equipo")
                  Bluetooth.disconnect()
                }
              })
            }).catch(function(data){
              $scope.showAlert("Información", "No se pudo conectar con el equipo. Revise que haya sido emparejado previamente en el celular.")
            })
          }).catch(function(data){
            $scope.showAlert("Información", "Por favor encienda el bluetooth para continuar.")
          })
        }
      }]
    });
  }

//iterationData
  $scope.iterationData = {}

  $scope.doRefresh = function(){
    Iteration.get({iteration_id: $stateParams.iteration_id}).$promise.then(function(data) { 
      $scope.iterationData = data
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  
  $scope.iterationData = Iteration.get({iteration_id: $stateParams.iteration_id});  
});