'use strict';
app
.directive('noScroll', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            $element.on('touchmove', function(e) {
                e.preventDefault();
            });
        }
    };
})
.controller('FavesCtrl', function($scope, $http, $firebase) {

    var authData = ref.getAuth();
    var ref = new Firebase('https://swipe-artsy.firebaseio.com/' + authData.facebook.id.toString() + '/favorites');


//three way binding for user's favorites

    var faves_sync = $firebase(ref);
    var faves_array = faves_sync.$asArray();
    faves_array.$loaded(function() {
        $scope.faves = faves_array;
    });

})
