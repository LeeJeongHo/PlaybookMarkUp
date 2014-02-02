describe('Dependency information should be set in taskStore at render time, even if dependencyStore is loaded before taskStore', function (t) {

    // Gantt (grid) view is listening to 'refresh' which happens to be fired before 'load' event
    // in which we populate the dependencies for each task. This must happen before view reacts, otherwise dependency columns
    // will not have access to the data in time.

    var g = t.getGantt({
        renderTo  : Ext.getBody(),
        taskStore : new Gnt.data.TaskStore({
            proxy : 'memory'
        }),
        dependencyStore : new Gnt.data.DependencyStore({
            data : [
                { From : 1, To : 2 }
            ]
        }),
        columns : [
            { xtype : 'namecolumn' },
            { xtype : 'predecessorcolumn', tdCls : 'predcol' }
        ]
    });

    g.taskStore.proxy.data = [
        { Id : 1, leaf : true },
        { Id : 2, leaf : true }
    ];

    g.taskStore.load();

    t.chain(
        { waitFor : 'selector', args : '.predcol:contains(1)' }
    )
})
