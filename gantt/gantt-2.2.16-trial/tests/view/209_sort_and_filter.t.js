StartTest(function(t) {

    var g = t.getGantt({
        renderTo        : Ext.getBody()
    });

    t.waitForRowsVisible(g, function() {
        g.taskStore.getRootNode().firstChild.set({
            leaf : true,
            Name : 'XYZ'
        });

        g.taskStore.filterTreeBy(function(node) {
            return node.data.Name === 'XYZ';
        })

        t.is(g.taskStore.nodeStore.getCount(), 1, 'Should find one record after filtering');

        g.taskStore.sort('Name');

        t.is(g.taskStore.nodeStore.getCount(), 1, 'Should find one record after filtering + sorting');
        
        t.is(g.taskStore.nodeStore.getAt(0).data.Name, 'XYZ', 'and this record passes the filtering condition');
    });
})
