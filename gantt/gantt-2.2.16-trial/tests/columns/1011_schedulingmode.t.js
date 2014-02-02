StartTest(function(t) {
    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        taskStore   : new Gnt.data.TaskStore({
            root : {
                children : [
                    { leaf : true },
                    { leaf : true, SchedulingMode : 'FixedDuration' },
                    { leaf : true, SchedulingMode : 'EffortDriven' },
                    { leaf : true, SchedulingMode : 'DynamicAssignment' },
                    { leaf : true, SchedulingMode : 'Manual' },
                    { leaf : true, SchedulingMode : 'Normal' }
                ]
            }
        }),
        columns : [
            {
                xtype : 'treecolumn'
            },
            {
                xtype : 'schedulingmodecolumn'
            }
        ]
    });

    t.chain(
        { waitFor : 'rowsVisible', args : g},

        function (next){
            var locked = g.lockedGrid;

            t.matchGridCellContent(locked, 0, 1, 'Normal', 'Default: Normal');
            t.matchGridCellContent(locked, 1, 1, 'Fixed duration', 'Fixed duration');
            t.matchGridCellContent(locked, 2, 1, 'Effort driven', 'Effort driven');
            t.matchGridCellContent(locked, 3, 1, 'Dynamic assignment', 'Dynamic assignment');
            t.matchGridCellContent(locked, 4, 1, 'Manual', 'Manual');
            t.matchGridCellContent(locked, 5, 1, 'Normal', 'Normal');
        }
    )
});
