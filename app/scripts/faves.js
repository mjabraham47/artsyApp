'use strict';
app
// .directive('noScroll', function() {
//     return {
//         restrict: 'A',
//         link: function($scope, $element, $attr) {
//             $element.on('touchmove', function(e) {
//                 e.preventDefault();
//             });
//         }
//     };
// })
.controller('FavesCtrl', function($scope, $http, $firebase) {

    var chill = new Firebase("https://swipe-artsy.firebaseio.com");
    var authData = chill.getAuth();
    var ref = new Firebase('https://swipe-artsy.firebaseio.com/' + authData.facebook.id.toString() + '/favorites');

//three way binding for user's favorites

    var faves_sync = $firebase(ref);
    var faves_array = faves_sync.$asArray();
        $scope.faves = faves_array;
    faves_array.$loaded(function() {
        console.log("faves done loading");
        console.log($scope.faves);
    })
})
