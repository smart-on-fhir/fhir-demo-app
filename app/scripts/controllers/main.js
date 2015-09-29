'use strict';

angular.module('fhirDemoApp')
.controller('BeginCtrl', function ($scope, $location) {
  $location.path('/given/'+window.initialHash);
  $location.replace();
});

angular.module('fhirDemoApp')
.controller('MainCtrl', function ($scope, $routeParams) {
  var initialHash = $routeParams.initialHash;
  FHIR.oauth2.ready($routeParams, function(smart){
    var patient = smart.patient;
    var api = patient.api;
    
    function generateCall(resourceType) {
        return function(){return api.search({type:resourceType})};
    }
    
    var calls = {
      'Patient': function(){return patient.read()},
      'Condition': generateCall("Condition"),
      'Observation': generateCall("Observation"),
      'MedicationOrder': generateCall("MedicationOrder"),
      'MedicationDispense': generateCall("MedicationDispense"),
      'Procedure': generateCall("Procedure"),
      'Immunization': generateCall("Immunization"),
      'FamilyMemberHistory': generateCall("FamilyMemberHistory"),
      'AllergyIntolerance': generateCall("AllergyIntolerance"),
      'DocumentReference': generateCall("DocumentReference"),
      'ImagingStudy': generateCall("ImagingStudy"),
      'CarePlan': generateCall("CarePlan")
    };

    $scope.resourceUrl = function(){
      return 'http://www.hl7.org/implement/standards/fhir/'+$scope.resource.toLowerCase()+'.html';
    };

    Object.keys(calls).forEach(function(resource){
      var call = calls[resource];
      $scope[resource] = function(){
        $scope.resource = resource;
        $scope.fetchedData = null;
        call().done(function(r){
          var data = r.data || r;
          $scope.fetchedData = JSON.stringify(data, null, 2);
          $scope.$apply();
        });
      };
    });

    $scope.Patient();
    $scope.$apply();

  });

});
