'use strict';

app
		.controller('PlaylistsCtrl', function($scope, $ionicSwipeCardDelegate) {
  var cardTypes = [{
    title: 'Swipe down to clear the card'
  }, {
    title: 'Where is this?'
  }, {
    title: 'What kind of grass is this?'
  }, {
    title: 'What beach is this?'
  }, {
    title: 'What kind of clouds are these?'
  }];

  $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

  $scope.cardSwiped = function(index) {
    $scope.addCard();
  };

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

   $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  };

    $scope.goAway = function() {
    var card = $ionicSwipeCardDelegate.getSwipeableCard($scope);
    card.swipe();
  };
});