StartTest(function(t) {
    var resourceStore = t.getResourceStore({
            data : [
                { Id : 1, Name : 'Mike'},
                { Id : 2, Name : 'Kate'}
            ]
        }),
        assignmentStore = t.getAssignmentStore({
            resourceStore : resourceStore,
            data : [
                { ResourceId : 1, TaskId : 1, Units : 50 },
                { ResourceId : 1, TaskId : 2 },
                { ResourceId : 2, TaskId : 1, Units : 0 },
                { ResourceId : 2, TaskId : 3 }
            ]
        });

    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        resourceStore : resourceStore,
        assignmentStore : assignmentStore,
        taskStore   : new Gnt.data.TaskStore({
            root : {
                children : [
                    { Id : 1 },
                    { Id : 2 },
                    { Id : 3, leaf : true }
                ]
            }
        }),
        columns : [
            {
                xtype : 'treecolumn'
            },
            {
                xtype : 'resourceassignmentcolumn'
            }
        ]
    });

    t.chain(
        { waitFor : 'rowsVisible', args : g},

        function (next){
            var locked = g.lockedGrid;

            t.matchGridCellContent(locked, 0, 1, 'Mike [50%]', 'Mike is assigned to 50% #1');
            t.matchGridCellContent(locked, 1, 1, 'Mike', 'Mike is assigned to #2');

            t.matchGridCellContent(locked, 2, 1, 'Kate', 'Kate is assigned to #3');
            t.notOk(t.getCell(locked, 0, 1).dom.innerHTML.match('Kate'), 'Should not render a 0% assignment');
        }
    )
});
