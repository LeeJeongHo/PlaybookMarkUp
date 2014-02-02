StartTest(function (t) {
    var assignmentStore = new Gnt.data.AssignmentStore({
        model: 'Gnt.model.Assignment',

        data: [
            { Id: 'a1', ResourceId: 'r1', TaskId : 1 },
            { Id: 'a2', ResourceId: 'r2', TaskId : 2 },
            { Id: 'a3', ResourceId: 'r3', TaskId : 3, Units : 50 }
        ]
    });

    var resourceStore = new Sch.data.ResourceStore({
    });

    var nbrResourceLoads = 0;

    var grid = new Gnt.widget.AssignmentGrid({
        margin          : 10,
        width           : 300,
        renderTo        : Ext.getBody(),
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore,

        loadResources   : function() {
            nbrResourceLoads++;
            Gnt.widget.AssignmentGrid.prototype.loadResources.apply(this, arguments);
        }
    });

    var selModel = grid.getSelectionModel();

    t.chain(
        function(next) {
            resourceStore.loadData([
                { Id: 'r1', Name: 'Mike' },
                { Id: 'r2', Name: 'Linda' },
                { Id: 'r3', Name: 'Don' },
                { Id: 'r4', Name: 'Karen' },
                { Id: 'r5', Name: 'Doug' },
                { Id: 'r6', Name: 'Peter' }
            ]);

            next();
        },

        { waitFor : 'rowsVisible', args : 'assignmentgrid' },

        function(next) {
            grid.loadTaskAssignments(3);
            t.is(selModel.getCount(), 1, 'Should find one row selected');
            t.is(selModel.selected.first().getResourceId(), 'r3', 'Should find "r3" selected');
            t.matchGridCellContent(grid, 0, 2, '50', 'Should find 50 percent in the Units cell');
            t.is(grid.store.first(), selModel.selected.first(), 'Should find store sorted with assigned resources on top');

            grid.cellEditing.startEditByPosition({ row : 0, column : 2});

            next();
        },

        { waitFor : 100 },

        function(next) {
            var editor = grid.cellEditing.getActiveEditor();
            editor.setValue(0);
            editor.completeEdit();
            next();
        },

        { waitFor : 100 },

        function(next) {
            t.is(selModel.getCount(), 0, 'Should not see resource assigned if setting Units to 0');
            t.is(grid.store.first().getUnits(), 0, 'Should see store updated with value');

            grid.saveTaskAssignments();
            t.is(assignmentStore.getCount(), 2, 'Should find assignment store having only 2 items');
            t.is(assignmentStore.find('ResourceId', 'r3'), -1, 'Should not find any assignment for resource "r3"');

            var nbrLoads = nbrResourceLoads;

            grid.destroy();

            resourceStore.loadData([
                { Id: 'Foo', Name: 'Bar' }
            ]);

            t.is(nbrResourceLoads, nbrLoads, 'Grid should not react to resource store changes after it is destroyed');
        }
    );
})
