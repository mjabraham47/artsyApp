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
    var cardTypes;
    $scope.addCards;
    $scope.holdTheCards = [];
    $scope.likedCards = [];
    $scope.cards = [];

    var ref = new Firebase("https://swipe-artsy.firebaseio.com");
    var authData = ref.getAuth();
    console.log(authData);


    seeds.on('value', function(data) {
        var kamilla =  data;
        kamilla.forEach(function(child) {
            $scope.cards.push(child.val());
        })
    });


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
        $scope.likedCards.push($scope.cards[index].id);
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



})
