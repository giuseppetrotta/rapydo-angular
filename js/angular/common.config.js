angular.module('web').config(hotkeysConfig);
angular.module('web').config(formlyConfig);

function hotkeysConfig(hotkeysProvider) {
  //Disable ngRoute integration to prevent listening for $routeChangeSuccess events
  hotkeysProvider.useNgRoute = false;
}

angular.module('web').run(function(formlyValidationMessages) {
  formlyValidationMessages.addStringMessage('required', 'This field is required');
});

function formlyConfig(formlyConfigProvider) {
  formlyConfigProvider.extras.errorExistsAndShouldBeVisibleExpression = function($viewValue, $modelValue, scope) {
    return (scope.fc.$invalid && scope.form.$submitted);
  };

  formlyConfigProvider.setWrapper({
    name: 'validation',
    template: '<formly-transclude></formly-transclude>'+
              '<div ng-messages="fc.$error" ng-if="form.$submitted || options.formControl.$touched" class="error-messages">'+
              '  <div ng-message="{{ ::name }}" ng-repeat="(name, message) in ::options.validation.messages" class="message">{{ message(fc.$viewValue, fc.$modelValue, this)}}</div>'+
              '</div>',
    types: ['input', 'textarea', 'checkbox', 'radio', 'select'] // and soon, 'multiCheckbox'
  });

  formlyConfigProvider.setType({
    name: 'autocomplete',
    extends: 'input',
    template: `
              <input 
                type="text" 
                autocomplete="off" 
                ng-model="model[options.key]" 
                ng-model-options="{ getterSetter: true }"
                uib-typeahead="item as item[to.select_label] for item in ctrl.querySearch(options.key, $viewValue)"
                typeahead-select-on-blur=true
                typeahead-show-hint=true
                class="form-control">
              `,
    wrapper: ['bootstrapLabel', 'bootstrapHasError']

  });

formlyConfigProvider.setType({
    name: 'multiInput',
    extends: 'input',
    template: `
              <div class="input-group" ng-repeat="item in model[options.key] track by $index">
                <input type="text" class="form-control" ng-model="model[options.key][$index]"></input>
                <a ng-if="$index == 0" class="input-group-addon" uib-tooltip="Cannot remove the first element">x</a>
                <a ng-if="$index > 0" class="input-group-addon" uib-tooltip="Remove this element" ng-click="model[options.key].splice($index, 1)">x</a>
              </div>
              <div class="text-right">
                <button type="button" class="btn btn-success btn-sm" ng-click="model[options.key].push('+"''"+')">Add new element</button>
              </div>
              `,
    wrapper: ['bootstrapLabel', 'bootstrapHasError']

  });


formlyConfigProvider.setType({
    name: 'multiAutocomplete',
    extends: 'input',
        template: `
                  <chips ng-model="model[options.key]">
                     <chip-tmpl>
                       <div class="default-chip" uib-tooltip="{{chip[to['select_label']]}}">
                          {{chip[to['select_id']]}}
                          <span class="glyphicon glyphicon-remove" remove-chip></span>
                       </div>
                     </chip-tmpl>
                     <input 
                        type="text" 
                        autocomplete="off" 
                        ng-model-control ng-model="typeaheadmodel"
                        ng-model-options="{ getterSetter: true }"
                        uib-typeahead="item as item[to['select_label']] for item in ctrl.querySearch(options.key, $viewValue)"
                        typeahead-select-on-blur=true
                        typeahead-show-hint=true
                        class="form-control">
                  </chips>
                  `,

    wrapper: ['bootstrapLabel', 'bootstrapHasError']

  });


    var unique = 1;
    formlyConfigProvider.setType({
      name: 'repeatSection',
      template: ` 
                <label ng-click="addNew()" class="control-label">
                  {{to.label}}
                </label>
                <div class="panel panel-default" ng-repeat="element in model[options.key]" ng-init="fields = copyFields(to.fields)">
                  <div class="panel-body">
                    <formly-form fields="fields"
                                 model="element"
                                 form="form">
                    </formly-form>
                    <div class="text-right">
                      <i class="material-icons palette-Red-500 text" uib-tooltip="Remove this group of elements" ng-click="model[options.key].splice($index, 1)">delete</i>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <label ng-click="addNew()" class="control-label">
                    <a class="btn btn-default">
                      Add new
                    </a>
                  </label>
                </div>
                `,

      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        
        $scope.copyFields = copyFields;
        
        
        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var newsection = {};
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }
        
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
  });


formlyConfigProvider.setType({
    name: 'datepicker',
    extends: 'input',
    template: `
              <p class="input-group">
                <input
                  type="text"
                  id="{{::id}}"
                  name="{{::id}}"
                  ng-model="model[options.key]"
                  class="form-control"
                  ng-click="datepicker.open($event)"
                  uib-datepicker-popup="{{to.datepickerOptions.format}}"
                  datetimepicker-neutral-timezone
                  is-open="datepicker.opened"
                  datepicker-options="to.datepickerOptions" />
                <span class="input-group-btn">
                  <button type="button" class="btn btn-default" ng-click="datepicker.open($event)" ng-disabled="to.disabled">
                    <i class="glyphicon glyphicon-calendar"></i>
                  </button>
                </span>
              </p>
              `,
    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    defaultOptions: {
      templateOptions: {
        datepickerOptions: {
          initDate: new Date(),
          format: 'dd/MM/yyyy'
        }
      }
    },
    controller: ['$scope', function ($scope) {
      $scope.datepicker = {};

      $scope.datepicker.opened = false;

      $scope.datepicker.open = function ($event) {
        $scope.datepicker.opened = !$scope.datepicker.opened;
      };
    }]
  });




}
