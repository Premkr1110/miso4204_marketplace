define(['component/_shoppingCartMasterComponent'], function (_ShoppingCartMasterComponent) {
    App.Component.ShoppingCartMasterComponent = _ShoppingCartMasterComponent.extend({
        postInit: function () {

        }, addItems: function (params) {
            var list = this.shoppingCartItemComponent.getRecords();
            for (var idx in params) {
                var productId = params[idx].id;
                var model = _.findWhere(list, {productshoppingcartitemId: productId});
                if (model) {
                    model.quantity++;
                    this.shoppingCartItemComponent.updateRecord(model);
                } else {
					this.shoppingCartItemComponent.addRecords({productshoppingcartitemId: productId, quantity: 1, name: params[idx].name, unitPrice:params[idx].price});
                }
            }
        }
    });
    return App.Component.ShoppingCartMasterComponent;
});