StartTest(function (t) {
    var ts = t.getTaskStore({
        resourceStore : t.getResourceStore()
    });

    var field = new Gnt.widget.AssignmentField({
        margin          : 10,
        renderTo        : Ext.getBody(),
        allowDecimals   : false,
        gridConfig      : {
            cls : 'foo'
        }
    });
    var task = ts.getRootNode().firstChild;
    task.assign(ts.getResourceStore().first());

    field.setTask(task);

    var grid;

    t.chain(
        { click     : field },

        { waitFor : 'CQVisible', args : 'assignmentgrid' },

        // Wait for the assignment data to be loaded, should happen as you trigger the picker to show
        { waitFor : function() { return field.picker.store.findBy(function(as) { return as.data.Units > 0; }) >= 0; } },

        function (next) {
            grid = field.picker;

            t.is(field.getValue(), 'Mike [100%]', 'Correct initial value');

            t.ok(grid.hasCls('foo'), 'Should be able to configure the grid via gridConfig');

            var unitColIndex = grid.headerCt.items.indexOf(grid.headerCt.down('assignmentunitscolumn'));

            t.click(t.getCell(grid, 0, unitColIndex), next);
        },

        { waitFor : 'SelectorAtCursor', args : 'input' },

        function (next) {
            t.waitForComponentNotVisible(t.cq1('editor'), next)
            t.click([0,0], Ext.emptyFn);
        },

        { click : field },

        { waitFor : 'CQVisible', args : 'assignmentgrid' },

        function (next, result) {
            grid = result[0];
            var unitColIndex = grid.headerCt.items.indexOf(grid.headerCt.down('assignmentunitscolumn'));

            t.click(t.getCell(grid, 0, unitColIndex), next);
        },


        { waitFor : 'CQVisible', args : 'numberfield' },

        { action : 'click' },

        function (next) {
            t.ok(grid.isVisible(), 'Grid still visible after clicking number cell');
            next();
        },

        { moveCursorTo : '>>assignmentunitscolumn' },

        { click : 'assignmentunitscolumn => .x-column-header-trigger' },

        { click : '.x-menu-item' },

        function (next) {
            t.ok(grid.isVisible(), 'Grid still visible after clicking number cell');
            next()
        },

        { click : '>>grid button' },

        function (next) {
            t.notOk(grid.isVisible(), 'Grid not visible after clicking button');
        }
    );
})
