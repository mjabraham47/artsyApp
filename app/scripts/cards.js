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
    var image_path = authData.facebook.id.toString() + '/images';

    seeds.on('value', function(data) {
        var kamilla =  data;
        kamilla.forEach(function(child) {
            $scope.cards.push(child.val());
        })
    });

    $scope.cardSwipedLeft = function(index) {
        if($scope.cards.length < 50) {
          ref.child(image_path).orderByKey().limitToFirst(10).on('value', function(data) {
            data.forEach(function(card) {
              $scope.cards.push(card.val());
            });
          });
        }
      console.log('Cards:', $scope.cards.length)
    }


    $scope.cardSwipedRight = function(index) {
        $scope.likedCards.push($scope.cards[index].id);
        if($scope.cards.length < 50) {
          ref.child(image_path).orderByKey().limitToFirst(10).on('value', function(data) {
            data.forEach(function(card) {
              $scope.cards.push(card.val());
              var delete_path = image_path + card.key().toString();
              ref.child(delete_path).remove();
            });
          });
        }


        $http.get('http://localhost:3000/related/' + authData.facebook.id +'/' +$scope.cards[index].id)
            .then(function(data){
                console.log(data);
            });
            // .then(function(data){
            //     $scope.holdTheCards = data;
            //     $scope.cards = $scope.holdTheCards._embedded.artworks.concat($scope.cards)
            //     console.log($scope.cards);
            // })
        console.log('Cards:', $scope.cards.length)
    }

    $scope.cardDestroyed = function(index) {
      $scope.cards.splice(index,1);
    }



})
