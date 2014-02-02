StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setup');
    t.expectGlobals('dep');

    Ext.define('dep', {
        extend : 'Gnt.model.Dependency',
        typeField : 'FooType',
        fromField : 'FooFrom',

        fields : ['FooType', 'FooFrom']
    });
    
    var depEditor = new Gnt.plugin.DependencyEditor({
        triggerEvent : 'dependencyclick',
        showLag     : true
    })
    
    var g = t.getGantt({
        renderTo : Ext.getBody(),
        forceFit : true,
        plugins : depEditor,
        dependencyStore : t.getDependencyStore({
            model : 'dep',
            data: [
                { "FooFrom": 117, "To": 115, "Id": 30, "FooType": 2 }, 
                { "FooFrom": 118, "To": 115, "Id": 31, "FooType": 2 }, 
                { "FooFrom": 115, "To": 116, "Id": 32, "FooType": 2 }, 
                { "FooFrom": 121, "To": 120, "Id": 33, "FooType": 2 }
            ]
        })
    });

    t.waitForTasksAndDependenciesToRender(g, function() {
        var store = g.taskStore,
            root = store.getRootNode(),
            depEl = t.getFirstDependencyEl(g);
        
        t.click(depEl, function() {
            t.ok(depEditor.isVisible(), 'Dependency editor visible after double click');
            var newType =  (depEditor.typeField.getValue()+1) % 4;
            depEditor.typeField.setValue(newType);

            depEditor.getForm().updateRecord(depEditor.dependencyRecord);
            t.is(depEditor.dependencyRecord.getType(), newType, 'Type changed ok');
            t.is(depEditor.dependencyRecord.get('FooType'), newType, 'Type changed ok');

            t.click(g.normalGrid.headerCt.el.getXY(), function() {
                // Collapse animation
                t.waitFor(500, function() {
                    t.notOk(depEditor.isVisible(), 'Dependency editor not visible after hide');
                })
            });
        });
    });
});    
