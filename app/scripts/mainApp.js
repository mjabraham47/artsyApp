'use strict';
var app = angular.module('ArtsyApp.controllers', ['ionic', 'ionic.contrib.ui.tinderCards', 'firebase', 'underscore'])
.controller('AppCtrl', function($scope, $timeout) {
  // Form data for the login modal
  var ref = new Firebase("https://swipe-artsy.firebaseio.com");
  ref.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  });



})
