/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['component/_CRUDComponent'], function (CRUDCp) {

	App.Component.ContainerComponent = App.Component.BasicComponent.extend({
		initialize: function (options) {
			var self = this;
			var cookies;
			Backbone.on('iframe-load', function () {
				cookies = self.parseCookies();
				if (cookies['token']) {
					$('#userName').text('Logout');
					$('#loginButton').attr('onclick', "redirectFrame('/user.web/logout.html');return false;");
				}else {
					$('#userName').text('Login');
					$('#loginButton').attr('onclick', "redirectFrame('/user.web/login.html');return false;");
				}
			});
		},
		parseCookies: function () {
			var cookies = {};
			if (document.cookie.trim() === '') {
				return {};
			}
			var cookiesArray = document.cookie.split(';');
			for (var iCookie in cookiesArray) {
				var name = cookiesArray[iCookie].split(/=(.*)/)[0].trim();
				cookies[name] = {};
				var attributes = cookiesArray[iCookie].split(/=(.*)/)[1].split(':');
				if (attributes) {
					for (var iAttr in attributes) {
						cookies[name][attributes[iAttr].split('=')[0]] = attributes[iAttr].split('=')[1];
					}
				}
			}
			return cookies;
		}
	});

	return App.Component.ContainerComponent;
});