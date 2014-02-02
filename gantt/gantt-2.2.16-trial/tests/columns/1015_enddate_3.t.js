StartTest(function(t) {

    var editing = Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit: 1 });

    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        plugins     : editing,
        columns : [
            { xtype : 'treecolumn' },
            { xtype : 'enddatecolumn' }
        ]
    });

    g.taskStore.getRootNode().removeAll();
    g.taskStore.getRootNode().appendChild({
        StartDate : new Date(2010, 1, 1),
        EndDate : new Date(2010, 1, 5),
        leaf : true
    });

    g.taskStore.getRootNode().appendChild({
        StartDate : new Date(2010, 1, 1),
        EndDate : new Date(2010, 1, 15),
        leaf : true
    });

    t.willFireNTimes(g.taskStore, 'update', 0);

    t.waitForEventsToRender(g, function () {
        var endDateCol = g.lockedGrid.headerCt.items.last();
        var first = g.taskStore.getRootNode().childNodes[0];
        var last = g.taskStore.getRootNode().childNodes[1];

        editing.startEdit(first, endDateCol);

        t.chain(
            { waitFor : 500 },

            function(next){
                editing.startEdit(last, endDateCol);
                next();
            },

            { waitFor : 500 }
        );
    })
});
