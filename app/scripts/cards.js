'use strict'
app
.directive('noScroll', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            $element.on('touchmove', function(e) {
                e.preventDefault();
            });
        }
    }
})
.controller('CardsCtrl', function($scope, $http) {
    var cardTypes = [
        {  title: 'So much grass #hippster'},
        {  title: 'Way too much Sand, right?'},
        {  title: 'Beautiful sky from wherever'},
    ];
 
    $scope.cards = [];
 
    $scope.addCard = function(i) {
        var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        newCard.id = Math.random();
        $scope.cards.push(angular.extend({}, newCard));
    }
 
    for(var i = 0; i < 3; i++) $scope.addCard();
 
    $scope.cardSwipedLeft = function(index) {
        console.log('Left swipe');
    }
 
    $scope.cardSwipedRight = function(index) {
        console.log('Right swipe');
    }
 
    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
        console.log('Card removed');
    }

    // $http.get("http://localhost:3000", function(err,data) {
    //     console.log(err, data);
    // });
    $http.get('http://localhost:3000')
    .success(function(data){
        $scope.something = data;
        console.log(data)
    })



})