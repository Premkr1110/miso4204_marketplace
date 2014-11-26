define(['controller/selectionController', 'model/cacheModel', 'component/_CRUDComponent', 'controller/tabController', 'component/productComponent'],
 function(SelectionController, CacheModel, CRUDComponent, TabController, ProductComponent) {
    App.Component.CompositeComponent = App.Component.BasicComponent.extend({
        initialize: function() {
            this.componentId = App.Utils.randomInteger();
            this.name = "ProductScoreIntegration";
            this.productComponent = new ProductComponent();
            this.productComponent.initialize();
            this.setupProductScoreComponent();
        },
        render: function(domElementId){
            if (domElementId) {
                var rootElementId = $("#"+domElementId);
                this.productElement = this.componentId + "-product";
                this.tabsElement = this.componentId + "-tabs";

                rootElementId.html("<div id='" + this.productElement + "'></div>" + "<div id='" + this.tabsElement + "'></div>");
            }
            this.productComponent.render(this.productElement);
        },
        setupProductScoreComponent: function() {
            
            this.productComponent.addRecordAction({
                  name: 'productScore',
                  icon: '',
                  displayName: 'Ver calificaciones',
                 show: true
             },
             this.productScore,
             this);
        },
        productScore : function(){
            var items = this.productComponent.getSelectedRecords();
            document.location.href = "listScore.html";
        },
		getProductComponent: function(){
			return this.productComponent;
		}
    });

    return App.Component.CompositeComponent;
});
