/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$(document).ready(function () {
    $("#btn-login").click(function (evento) {
        var username = document.getElementById("login-username").value;
        var pass = document.getElementById("login-password").value;
        var rememberMe = document.getElementById("login-remember").value;
        if (rememberMe === "on") {
            rememberMe = "true";
        } else {
            rememberMe = "false";
        }
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            var path = "; path=/";
            document.cookie = cname + "=" + cvalue + "; " + expires + path;
        }
        var full = location.hostname+(location.port ? ':'+location.port: '');
        var json = {username: username, password: pass, tenantID: document.domain, levelAccess:"user"};

        $.ajax({
            type: "POST",
            url: "http://"+full+"/user.services/webresources/auth/login",
//          crossDomain: true,
            dataType: 'json',
            data: JSON.stringify(json),
            contentType: "application/json"
        }).done(_.bind(function (data) {
            console.log(data);
            setCookie("token", data, 1);
            window.location.href = '/wishlist.web/wishListIntegratorCart.html';
        }, this)).error(_.bind(function (data) {
            console.log("data");
            alert('Usuario no autenticado : ' + data["responseText"]);
        }, this));
    });

});
