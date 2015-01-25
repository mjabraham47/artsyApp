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


    //var sync = $firebase(seeds);
    //var matches = $firebase(images);
    //$scope.cards = sync.$asArray();
    //$scope.matches = sync.$asArray();
    var cardTypes;
    $scope.addCards;
    $scope.holdTheCards = [];
    $scope.likedCards = [];
    $scope.cards = [];

    var ref = new Firebase("https://swipe-artsy.firebaseio.com");
    var seeds = new Firebase("https://swipe-artsy.firebaseio.com/seeds");
    var authData = ref.getAuth();
    var image_path = authData.facebook.id.toString() + '/images';
    var liked_path = authData.facebook.id.toString() + '/favorites';
    var seeds_path = authData.facebook.id.toString() + '/seeds';

    //check if seeds exists if not copy
    var users_location = 'htts://swipe-artsy.firebaseio.com/' + authData.facebook.id.toString();


    // var userRef = new Firebase(users_location);
    // ref.child(seeds_path).remove(function(){
    //   console.log('seeds removed');
    // });
    ref.child(image_path).once('value', function(snapshot) {
      if ( snapshot.val() === null ) {
        console.log('seeds do not exist');
        seeds.once('value', function(data) {
          data.forEach(function(child) {
            //ref.child(seeds_path).push(child.val());
            $scope.cards.push(child.val());

          });
          ref.child(image_path).push(data.val());
          console.log($scope.cards);
        });
      } else {
        console.log('seeds exist');
        ref.child(image_path).on('value', function(data) {
          data.forEach(function(child) {
            $scope.cards.push(child.val());
          })
        })
      }
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
        var liked_add = angular.copy($scope.cards[index]);
        ref.child(liked_path).push(liked_add);
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
