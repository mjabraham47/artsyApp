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

    var cardTypes;
    $scope.addCards;
    $scope.holdTheCards = [];
    $scope.likedCards = [];

    var ref = new Firebase("https://swipe-artsy.firebaseio.com");
    var seeds = new Firebase("https://swipe-artsy.firebaseio.com/seeds");
    var authData = ref.getAuth();

//three way binding for user's images array
    var fb_images = new Firebase('https://swipe-artsy.firebaseio.com/' + authData.facebook.id.toString() + '/images');
    var image_path = authData.facebook.id.toString() + '/images';
    var image_sync = $firebase(fb_images);
    var images_array = image_sync.$asArray();
    $scope.cards = images_array;

//get artist whenever a new card is loaded
    $scope.cards.on('value', function(cards) {
        cards.forEach(function(card) {
          $http.get('http://localhost:3000/artist/' + card.id, function(err, name) {
            card.$set({artist_name : name});
          })
        });
      })

//three way binding for user's favorites
    var fb_faves = new Firebase('https://swipe-artsy.firebaseio.com/' + authData.facebook.id.toString() + '/favorites');
    var faves_sync = $firebase(fb_faves);
    var faves_array = faves_sync.$asArray();
    $scope.faves = faves_array;

//set paths for firebase data stores
    var liked_path = authData.facebook.id.toString() + '/favorites';
    var seeds_path = authData.facebook.id.toString() + '/seeds';
    var users_location = 'htts://swipe-artsy.firebaseio.com/' + authData.facebook.id.toString();

    //wait for firebase to load images, if there are none add seeds
    images_array.$loaded(function() {
      if ( $scope.cards.length === 0 ) {
        console.log('seeds do not exist');
        seeds.once('value', function(data) {
          data.forEach(function(child) {
            $scope.cards.$add(child.val());
          });
        });
      } else {
        console.log('seeds exist');
      }
   });

// swipe left doesn't do anything anymore
    $scope.cardSwipedLeft = function(card) {
      console.log('Cards:', $scope.cards.length)
    }

//swipe right - add card to user's favorites array and look up similar works
    $scope.cardSwipedRight = function(card) {
      $scope.faves.$add(card);
      console.log('faves', $scope.faves);
//call server to get similar artworks and add to users' images
        $http.get('http://localhost:3000/related/' + authData.facebook.id +'/' + card.id)
            .then(function(data){
                console.log('related', data.data._embedded);
            });
        console.log('Cards:', $scope.cards.length)
    }
//remove card from users' images array when swiped
    $scope.cardDestroyed = function(card) {
      $scope.cards.$remove(card);
    }



})
