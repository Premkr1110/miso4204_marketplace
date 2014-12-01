/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['component/listComponent', 'component/toolbarComponent','component/productComponent'], function(listCp, toolbarCP) {
    App.Component.Bill = App.Component.BasicComponent.extend({
        initialize: function(options) {
            this.componentId = App.Utils.randomInteger();
            this.name = "Purchase Bill";

            if(options.addressList){
                this.addressList = options.addressList;
            }
            
            if(options.creditCardList){
                this.creditCard = options.creditCardList;
            }
            if(options.purchaseIntegrator){
                this.purchaseIntegrator = options.purchaseIntegrator;
            }
            
            var date = new Date();
            $('#purchaseDate').val(date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear());
            
            this.toolbar();
            this.loadData();
        },
        
        loadData: function(){
            $('#sendName').val(this.addressList.get("contactName"));
            $('#sendAddress').val(this.addressList.get("address"));
            $('#sendCity').val(this.addressList.get("city"));
            $('#sendCountry').val(this.addressList.get("country"));
            
            $('#payMode').val(this.creditCard.get("accountType"));
            $('#payNumber').val(this.creditCard.get("cardNumber"));
            $('#branch').val(this.creditCard.get("branch"));
            $('#payPoints').val(this.creditCard.get("a"));
			
			var token = getCookie("token");
            $.ajax({
                url: '/shoppingcart.services/webresources/master/shopping_carts/',
				headers: { 'X_REST_USER': token },
                type: 'GET',
                //data: JSON.stringify(purchaseMaster),
                contentType: 'application/json'
            }).done(_.bind(function(data) {
                this.productList(data.listshoppingCartItem);
            }, this)).error(_.bind(function(data) {
                console.log("error "+data);
            }, this));
        },
        
        toolbar: function(){
            this.toolbarComponent = new toolbarCP({componentId: "toolbar", name: "Confirm and Pay"});
            this.toolbarComponent.initialize({componentId: "toolbar", name: "Confirm and Pay"});
			this.toolbarComponent.toolbarController.setElement('#toolbar');
            this.loadToolbar();
        },
        loadToolbar: function() {
            this.toolbarComponent.addMenu({
                name: 'actions',
                displayName: 'Actions',
                show: true
            });

            this.toolbarComponent.addButton({
                name: 'pay',
                displayName: 'Pay',
                icon: '',
				show: true
            },
			this.pay,
			this);
        
            this.toolbarComponent.addButton({
                name: 'cancel',
                displayName: 'Cancel',
				icon: '',
				show: true
            },this.cancel,
			this);
            
        },
        productList: function(productList){
            this.listComponent = new listCp({componentId: this.componentId});
			this.listComponent.addColumn('name', 'Name');
			this.listComponent.addColumn('description', 'Description');
			this.listComponent.addColumn('price', 'Price');
            this.listComponent.addColumn('totalValue', 'Total Value');
			this.listComponent.changeElement('#list');
			this.listComponent.enableMultipleSelection(false);
			
            var products = new App.Model.ProductList;
            var total = 0;

            // Carga el listado de los productos a guardar y 
            // Calcula el valor y la cantidad totales de productos
			for (var i in productList) {
				var item = {
					price: productList[i].unitPrice,
					name: productList[i].name,
					description: productList[i].name,
					totalValue: (productList[i].quantity * productList[i].unitPrice)
				};
				products.add(item);
				total += (productList[i].quantity * productList[i].unitPrice);
			}
			
			this.listComponent.setData({data: products, pagination: false});
			this.listComponent.render();
            
            $('#totalPay').val(total);
            
            this.render();
        },
        cancel: function(){
            document.location.href="/purchase.web";
        },
        pay: function(){
            var v_productList = []; //this.purchaseIntegrator.productsShoppingCart.records;
            
            var products = new Array();

            var v_totalCarrito = 0;
            var v_totalItem = 0;
            
            // Carga el listado de los productos a guardar y 
            // Calcula el valor y la cantidad totales de productos
            for (var property in v_productList) {
                if (v_productList.hasOwnProperty(property)) {
                    products.push({
                        unitPrice :v_productList[property].unitPrice,  
                        quantity :v_productList[property].quantity,  
                        name :v_productList[property].name,
                        productId:v_productList[property].productshoppingcartitemId
                    });
                    v_totalItem += (v_productList[property].quantity * 1);
                    v_totalCarrito += (v_productList[property].quantity * v_productList[property].unitPrice);
                }
            }
            
            // Obtenci{on de Fecha
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
                if(dd<10){
                dd='0'+dd;
            } 
            if(mm < 10){
                mm='0'+mm;
            } 
            var today = dd+'/'+mm+'/'+yyyy;
            
            // Definicion de la compra
            var purchase = {
                //id: '',
                name:'purchase',
                purchaseDate:today,
                totalValue: v_totalCarrito,
                totalItems: v_totalItem,
                points:0,
                buyerId:0,
                addressId: this.addressList.id
            };
            
            var purchaseMaster = {
                id: 0, // EL ID ES calculado automaticamente
                purchaseEntity: {
                    id: purchase.id,
                    name:  purchase.name,
                    purchaseDate: purchase.purchaseDate,
                    totalValue: purchase.totalValue,
                    totalItems:purchase.totalItems,
                    points:purchase.points,
                    buyerId:purchase.buyerId,
                    addressId:purchase.addressId
                },
                createpurchaseItem: JSON.parse(JSON.stringify(products)),
                createpayment:[{
                        value:purchase.totalValue,
                        tokenBank:'',
                        name:'payment',
                        creditcardId:this.creditCard.id,
                        paymentmodeId:''
                }]
            };
             
			 var token = getCookie("token");
            $.ajax({
                url: '/purchase.services/webresources/master/purchases/',
				headers: { 'X_REST_USER': token },
                type: 'POST',
                data: JSON.stringify(purchaseMaster),
                contentType: 'application/json'
            }).done(_.bind(function(data) {
                console.log("_bind"); //callback(data);
                alert('COMPRA GUARDADA!!');    // Continuar con ciclo de compra
                document.location.href="/purchase.web";
            }, this)).error(_.bind(function(data) {
                console.log("callback error"); //callback(data);
                alert('ERROR REALIZANDO LA COMPRA - INTENTE MAS TARDE'); // Continuar con ciclo de compra
                document.location.href="/purchase.web";
            }, this));
        },
        render: function(parent){
			this.toolbarComponent.render();
			this.listComponent.render();
            $('#main'+parent).append($('#bill').show());
        }
    });
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
			c=c.trim();
            while (c.charAt(0) === ' ')
                c = c.substring(1);
            if (c.indexOf(name) !== -1)
                return c.substring(name.length, c.length);
        }
        return "";
    }
    return App.Component.Bill;
});

