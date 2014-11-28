/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['component/addressComponent', 'component/creditCardComponent', 'component/billComponent'], function(adressCp, creditCardCp, billCp) {
    App.Component.PurchaseIntegrator = App.Component.BasicComponent.extend({
        initialize: function() {
            this.componentId = App.Utils.randomInteger();
            this.name = "PurchaseIntegrator";

            this.setupAdressComponent();
        },
                      
        setupAdressComponent: function() {
            
            this.addressComponent = new adressCp();
            this.addressComponent.initialize();
            this.addressComponent.clearGlobalActions();
            this.addressComponent.clearRecordActions();
            this.addressComponent.addGlobalAction({
                name: 'cancel',
                icon: '',
                displayName: 'Cancel',
                show: true
            }, this.cancel, this);
            this.addressComponent.addRecordAction({
                name: 'seleccionar',
                icon: '',
                displayName: 'Seleccionar',
                show: true
            },
            _.bind(function(evt){ this.selectAddress(evt); }, this), this);
            this.addressComponent.render('main');
            $('.breadcrumb').html('');
            $('.breadcrumb').append('<li class="active">Shopping Address</li>');            
        },
        
        selectAddress: function(obj) {
            var selectedId = obj.id;
            this.selectedAddress = this.searchAddressById(selectedId);            
            this.setupCreditCardComponent();            
        },
        
        searchAddressById: function(id){
            var addresses = this.addressComponent.listComponent.listController.model.attributes.data;
            for(var i = 0, l = addresses.length; i<l; i++){
                if(addresses[i].id === id){
                    return addresses[i];
                }
            }
        },
        
        setupCreditCardComponent: function() {
            this.creditCardComponent = new creditCardCp();
            this.creditCardComponent.initialize();            
            this.creditCardComponent.clearGlobalActions();
            this.creditCardComponent.clearRecordActions();            
            this.creditCardComponent.addGlobalAction({
                name: 'cancel',
                icon: '',
                displayName: 'Cancel',
                show: true
            }, this.cancel, this);
            this.creditCardComponent.addRecordAction({
                name: 'seleccionar',
                icon: '',
                displayName: 'Seleccionar',
                show: true
            },
            _.bind(function(evt){ this.selectCreditCard(evt); }, this), this);
            $('#main').html('');
            this.creditCardComponent.render('main');
            $('.breadcrumb').html('');
            $('.breadcrumb').append('<li>Shopping Address</li>');
            $('.breadcrumb').append('<li class="active">Credit Card</li>');
        },
        
        selectCreditCard: function(obj) {
            var selectedId = obj.id;
            this.selectedPayment = this.searchCreditCardById(selectedId);  
            this.initBillTemplate();
        },
        
        searchCreditCardById: function(id){
            var creditCard = this.creditCardComponent.listComponent.listController.model.attributes.data;
            for(var i = 0, l = creditCard.length; i<l; i++){
                if(creditCard[i].id === id){
                    return creditCard[i];
                }
            }
        },
                
        initBillTemplate: function(){
                        
            $('#main').html('');
            this.billComponent = new billCp();
            this.billComponent.initialize({addressList:this.selectedAddress, creditCardList:this.selectedPayment, purchaseIntegrator:this});
            $('.breadcrumb').html('');
            //this.billComponent.render('main');
            $('.breadcrumb').append('<li>Shopping Address</li>');
            $('.breadcrumb').append('<li>Credit Card</li>');
            $('.breadcrumb').append('<li class="active">Confirm and Pay</li>');
        },
        
        pay: function(){
            
            
            var v_productList = this.purchaseIntegrator.productsShoppingCart.records;
            
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
                addressId: this.purchaseIntegrator.selectedAddress.id
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
                        creditcardId:this.purchaseIntegrator.selectedPayment.id,
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
        
        cancel: function(){
            document.location.href="/purchase.web";
        },
        
        loadButtonsByName: function(param){
            $.each(param, function(key, value){
                value.toolbar.addButton({
                    name: value.name,
                    icon: '',
                    displayName: value.displayName,
                    show: true
                }, value.callback, value.that);
            });
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
    return App.Component.PurchaseIntegrator;
});