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
    $scope.cards = [];
    $scope.viewedCards = [];


    $http.get('http://localhost:3000/artworks')
        .success(function(data){
            cardTypes = data._embedded.artworks;
            for(var i = 0; i < cardTypes.length; i++) {
                $scope.addCards();
            }
        })

    $scope.addCards = function() {
        var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        $scope.cards.push(angular.extend({}, newCard));
    }

    $scope.cardSwipedLeft = function(index) {
        console.log('Left swipe');
        $scope.viewedCards.push($scope.cards[index])
        console.log($scope.viewedCards);
            // for (var i=0; i<$scope.cards.length; i++) {
            // for (var j=0; j<$scope.viewedCards.length; j++){
            //     if ($scope.cards[i] === $scope.viewedCards[j]) {
            //         $scope.cards.splice(i,1)
            //     }
            // }
        // }
    }

 
    $scope.cardSwipedRight = function(index) {
    console.log('Right swipe');
    $scope.viewedCards.push($scope.cards[index]);
    $http.get('http://localhost:3000/related/' +$scope.cards[index].id)
        .success(function(data){
            console.log(data)
            console.log("TEST index: ", index);
            console.log("VIEWED: ", $scope.viewedCards);
            for (var i=0; i<data._embedded.artworks.length; i++){
                $scope.cards.push(data._embedded.artworks[i])
            }
            // for (var i=0; i<$scope.cards.length; i++) {
            // if (JSON.stringify($scope.cards[i]) === JSON.stringify($scope.viewedCards[index])) {
            //     console.log(JSON.stringify($scope.cards[i]) === JSON.stringify($scope.viewedCards[index]))
            //     $scope.cards.splice(i,1)
            //     console.log('spliced')
            //     }        
        // }
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