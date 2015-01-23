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
    var cardTypes;
    var usedCards = [];
        //     {  title: 'So much grass #hippster'},
    //     {  title: 'Way too much Sand, right?'},
    //     {  title: 'Beautiful sky from wherever'},
    // ];
    
    $scope.cards = [];

    $http.get('http://localhost:3000/artworks')
        .success(function(data){
            cardTypes = data._embedded.artworks
            for(var i = 0; i < cardTypes.length; i++) {
                $scope.addCard();
            }
        })

    $scope.addCard = function() {
        var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        newCard.id = Math.random();
        console.log(newCard)
        $scope.cards.push(angular.extend({}, newCard));
    }

    $scope.cardSwipedLeft = function(index) {
        console.log('Left swipe');
    }
 
    $scope.cardSwipedRight = function(index) {
        console.log('Right swipe');
        console.log($scope.cards[index].id)
    $http.get('http://localhost:3000/related/' +$scope.cards[index].id)
        .success(function(data){
                console.log(data)
            })

    }
 
    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
        console.log('Card removed');
    }

    // $http.get("http://localhost:3000", function(err,data) {
    //     console.log(err, data);
    // });




})