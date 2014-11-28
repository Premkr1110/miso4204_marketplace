define(['component/_shoppingCartMasterComponent'], function (_ShoppingCartMasterComponent) {
    App.Component.ShoppingCartMasterComponent = _ShoppingCartMasterComponent.extend({
        postInit: function () {
            //console.log("hola");
            //this.masterComponent.clearGlobalActions();
            //this.masterComponent.addGlobalAction({
            //    name: 'checkout',
            //    icon: 'glyphicon-shopping-cart',
            //    displayName: 'Checkout',
            //    show: true
            //},
            //this.buy,
            //       this);
            //this.shoppingCartItemComponent.setGlobalActionsVisible(false);
            //this.shoppingCartItemComponent.disableEdit();
            //this.hideChilds();
            //this.masterComponent.listComponent.removeColumn('name');
            //this.masterComponent.listComponent.removeColumn('buyerId');
            //this.masterComponent.listComponent.removeColumn('action');
            //console.log(Object.getOwnPropertyNames(this.masterComponent));
            //console.log(Object.getOwnPropertyNames());
            // this.masterComponent.listComponent.addColumn('quantity', 'Quantity');
            //this.masterComponent.listComponent.addColumn('unitPrice', 'Unit Price');
            //this.masterComponent.listComponent.addColumn('name', 'Name');
            //this.masterComponent.listComponent.addColumn('productshoppingcartitemId', 'Productshoppingcartitem Id');
            //Escribir en este servicio las instrucciones que desea ejecutar al inicializar el componente
            //console.log(this.tabs);
            //this.masterComponent.create();
            //console.log(Object.getOwnPropertyNames(this.masterComponent.componentController));
            //this.masterComponent.componentController.currentModel = new this.masterComponent.componentController.modelClass({componentId: this.masterComponent.componentController.componentId});
            //this.masterComponent.componentController.$el.html(this.masterComponent.componentController.editTemplate({shoppingCart: this.masterComponent.componentController.currentModel, componentId: this.masterComponent.componentController.componentId, showEdit: this.masterComponent.componentController.showEdit, showDelete: this.masterComponent.componentController.showDelete

            // , buyer: this.masterComponent.componentController.buyerComponent

            // }));
            //Backbone.trigger(this.masterComponent.componentController.componentId + '-' + 'post-shoppingCart-create', {view: this.masterComponent.componentController});
            //console.log("postInit completado");
        }, buy: function () {
            // this.masterComponent.componentController.currentModel = new this.masterComponent.componentController.modelClass({componentId: this.masterComponent.componentController.componentId});
            //this.masterComponent.componentController.$el.html(this.masterComponent.componentController.editTemplate({shoppingCart: this.masterComponent.componentController.currentModel, componentId: this.masterComponent.componentController.componentId, showEdit: this.masterComponent.componentController.showEdit, showDelete: this.masterComponent.componentController.showDelete

//                , buyer: this.masterComponent.componentController.buyerComponent

            //           }));
            //Backbone.trigger(this.masterComponent.componentController.componentId + '-' + 'post-shoppingCart-create', {view: this.masterComponent.componentController});
            //this.tabs.render(this.tabsElement);

            //this.shoppingCartItemComponent.clearCache();
            //this.shoppingCartItemComponent.setRecords(this.model.get('listshoppingCartItem'));
            //this.shoppingCartItemComponent.render(this.tabs.getTabHtmlId('shoppingCartItem'));
            // console.log("buy completado");
            // this.masterComponent.componentController.modelClass = new this.masterComponent.componentController.modelClass({componentId: this.masterComponent.componentController.componentId});
            //this.masterComponent.componentController._renderEdit();
            //this.masterComponent.save();
        }, addItems: function (params) {
            var list = this.shoppingCartItemComponent.getRecords();
            for (var idx in params) {
                var productId = params[idx].productId;
                var model = _.findWhere(list, {productshoppingcartitemId: productId});
                if (model) {
                    model.quantity++;
                    this.shoppingCartItemComponent.updateRecord(model);
                } else {
                    this.shoppingCartItemComponent.addRecords({productshoppingcartitemId: productId, quantity: 1, name: 'prueba', unitPrice:'100'});
                }
            }
        },saveLuck: function(params) {
            this.shoppingCartItemComponent.save();
         }
    });
    return App.Component.ShoppingCartMasterComponent;
});