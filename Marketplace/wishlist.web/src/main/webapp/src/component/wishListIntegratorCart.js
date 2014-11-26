define(['component/wishListMasterComponent', 'component/CompositeComponentShopping'], 
function (wishListMasterCp, shoppingCartCp) 
{
    App.Component.wishListIntegratorCart = App.Component.BasicComponent.extend(
    {
        initialize: function () 
        {
            var user = this.checkCookie();
            if (user){
                $.ajax({
                    async: false,
                    url: '/wishlistitem.services/webresources/wish_list_items/validate/' + user,
					headers: { 'X_REST_USER': user },
                    type: 'GET',
                    data: user,
                    contentType: 'application/json'
                }).done(_.bind(function(data) {
                    this.buyerId = data;
                }, this)).error(_.bind(function(data) {
                    //window.location = "/user.web/login.html";
                }, this));

                this.componentId = App.Utils.randomInteger();
                this.name = "WishListIntegratorCart";
                this.setupCompositeComponentShoopingComponent();
                this.setupWishListMasterComponent();               
            }


            

        },
        render: function (domElementId) {
            if (domElementId) {
                var rootElement = $("#" + domElementId);
                
                this.wishListMasterComponent.masterComponent.create();
                this.wishListMasterComponent.renderMaster('master');
                this.wishListMasterComponent.masterComponent.listComponent.display(false);
                this.wishListMasterComponent.whishListItemComponent.toolbarComponent.display(false);
                this.CompositeComponentShopping.render('main');
            }
        },
        getCookie: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)===' ') c = c.substring(1);
                if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
            }
            return "";            
        },
        setCookie: function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            var path = "; path=/";
            document.cookie = cname + "=" + cvalue + "; " + expires + path ;      
        },
        checkCookie: function() {
            var user = this.getCookie('token');
            if (user !== "") {
                return user;
            } else {
                alert('Debe iniciar sesion.');
                window.location = "/user.web/login.html";
            }
        },
        viewWishList: function (domElementId) {
            window.location = "wishListMaster.html";
        },
        setupCompositeComponentShoopingComponent: function () 
        {
            this.CompositeComponentShopping = new shoppingCartCp();
            this.CompositeComponentShopping.initialize();
            this.CompositeComponentShopping.cartMasterComponent.shoppingCartItemComponent.addRecordAction({
                name: 'addToWishList',
                icon: '',
                displayName: 'Add to Wish',
                show: true
            },
            this.buyOne, this);
        },
        setupWishListMasterComponent: function () 
        {
            this.wishListMasterComponent = new wishListMasterCp();
            this.wishListMasterComponent.initialize();
            this.wishListMasterComponent.masterComponent.clearGlobalActions();
            this.wishListMasterComponent.masterComponent.toolbarComponent.removeButton("Cart");
            this.wishListMasterComponent.whishListItemComponent.listComponent.hideAction("agregarCarrito");
            this.wishListMasterComponent.whishListItemComponent.setGlobalActionsVisible(false);
            this.wishListMasterComponent.whishListItemComponent.disableEdit();
            this.wishListMasterComponent.hideChilds();
        },
        buyOne: function (params) {
            var list = this.CompositeComponentShopping.cartMasterComponent.shoppingCartItemComponent.getRecords();
            var model = _.findWhere(list, {id: params.id});
            if (model) {
                this.wishListMasterComponent.addItems([{productId: model.productshoppingcartitemId}]);
            }
            if (this.wishListMasterComponent.whishListItemComponent.getRecords().length > 0)
            {
                this.wishListMasterComponent.masterComponent.componentController.saveGenModel({buyerId:this.buyerId});
                //this.wishListMasterComponent.masterComponent.save();
                this.wishListMasterComponent.whishListItemComponent.setRecords();
                this.wishListMasterComponent.whishListItemComponent.listComponent.render();
                alert('Producto adicionado al carrito exitosamente');
            }
            else
            {
                Backbone.trigger(this.wishListMasterComponent.masterComponent.componentId + '-error', {event: 'shoppingCart-master-save', view: this.wishListMasterComponent.masterComponent, message: 'Debes agregar al menos un producto a la lista'});
            }
        }
    });
    return App.Component.wishListIntegratorCart;
});