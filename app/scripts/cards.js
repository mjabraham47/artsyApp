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
.controller('CardsCtrl', function($scope, $http, $firebase) {

    var seeds = new Firebase('https://swipe-artsy.firebaseio.com/seeds');
    var sync = $firebase(seeds);
    //var matches = $firebase(images);
    //$scope.cards = sync.$asArray();
    //$scope.matches = sync.$asArray();
    $scope.addCards;

    var cardTypes;
    $scope.holdTheCards = [];
    var likedCards = [];

    var ref = new Firebase("https://swipe-artsy.firebaseio.com");
    var authData = ref.getAuth();
    console.log(authData);

    seeds.on('value', function(data) {
      $scope.cards = data.val();
    });

    $http.get('http://localhost:3000/artworks')
        .then(function(data){
            return data.data
        }).then(function(data){
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
        if($scope.cards.length < 3) {
        $http.get('http://localhost:3000/artworks/more')
        .then(function(data){
            return data.data
        }).then(function(data){
            cardTypes = data._embedded.artworks;
            for(var i = 0; i < cardTypes.length; i++) {
                $scope.addCards();
            }
        })
      }
      console.log('Cards:', $scope.cards.length)
    }


    $scope.cardSwipedRight = function(index) {
        likedCards.push($scope.cards[index].id);
        $http.get('http://localhost:3000/related/' + authData.facebook.id +'/' +$scope.cards[index].id)
            .then(function(data){
                return data.data
            }).then(function(data){
                $scope.holdTheCards = data;
                $scope.cards = $scope.holdTheCards._embedded.artworks.concat($scope.cards)
                console.log($scope.cards);
            })
        console.log('Cards:', $scope.cards.length)
    }

    $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
    }




})
