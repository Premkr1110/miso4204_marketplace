/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['component/productComponent', 'component/toolbarComponent', 'component/_CRUDComponent' ], function(productCp, toolbarCP) {
    App.Component.Bill = App.Component.BasicComponent.extend({
        initialize: function(options) {
            this.componentId = App.Utils.randomInteger();
            this.name = "Purchase Bill";

            if(options.addressList){
                this.addressList = options.addressList;
            }
            
            if(options.creditCardList){
                this.creditCardList = options.creditCardList;
            }
            if(options.purchaseIntegrator){
                this.purchaseIntegrator = options.purchaseIntegrator;
            }
            
            var date = new Date();
            $('#purchaseDate').val(date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear());
            
            this.toolbar();
            this.productList();
            this.loadData();
        },
        
        loadData: function(){
            $('#sendName').val(this.addressList.attributes.contactName);
            $('#sendAddress').val(this.addressList.attributes.address);
            $('#sendCity').val(this.addressList.attributes.city);
            $('#sendCountry').val(this.addressList.attributes.country);
            
            $('#payMode').val(this.creditCardList.attributes.accountType);
            $('#payNumber').val(this.creditCardList.attributes.cardNumber);
            $('#branch').val(this.creditCardList.attributes.branch);
            $('#payPoints').val(this.creditCardList.attributes);
        },
        
        toolbar: function(){
            this.toolbarComponent = new toolbarCP({componentId: "toolbar", name: "Confirm and Pay"});
            this.toolbarComponent.initialize({componentId: "toolbar", name: "Confirm and Pay"});
            this.loadToolbar();            
        },
        
        
        loadToolbar: function() {
            this.toolbarComponent.addMenu({
                name: 'actions',
                displayName: 'Actions',
                show: true
            });

            this.toolbarComponent.addButton([{
                name: 'pay',
                displayName: 'Pay',
                icon: '',
				show: true
            },
			this.purchaseIntegrator.pay,
			this]);
        
            this.toolbarComponent.addButton([{
                name: 'cancel',
                displayName: 'Cancel',
				icon: '',
				show: true
            },this.purchaseIntegrator.cancel,
			this]);
        
            this.toolbarComponent.render();
            $('#toolbar').html(this.toolbarComponent.toolbarController.$el);            
        },
        
        productList: function(){
            this.productComponent = new productCp();
            this.productComponent.initialize();
            this.productComponent.listComponent.addColumn('totalValue', 'Total Value');
            this.productComponent.listComponent.removeColumn('categoryId');
            
            var v_productList = this.purchaseIntegrator.productsShoppingCart.records;
            
            var products = [];
            var v_totalCarrito = 0;

            // Carga el listado de los productos a guardar y 
            // Calcula el valor y la cantidad totales de productos
            for (var property in v_productList) {
                if (v_productList.hasOwnProperty(property)) {
                    products.push({
                        price :v_productList[property].unitPrice,  
                        name :v_productList[property].name,
                        description :v_productList[property].name,
                        totalValue : (v_productList[property].quantity * v_productList[property].unitPrice)
                    });
                    v_totalCarrito += (v_productList[property].quantity * v_productList[property].unitPrice);
                }
            }
            
            $('#totalPay').val(v_totalCarrito);
            
            this.productComponent.listComponent.setData(products);
            this.productComponent.toolbarComponent.display(false);
            this.productComponent.clearRecordActions();
            this.productComponent.render();
        },
        
        render: function(parent){
            this.productComponent.render('list');
            $('#'+parent).append($('#bill').show());
        }
    });
    
    return App.Component.Bill;
});

