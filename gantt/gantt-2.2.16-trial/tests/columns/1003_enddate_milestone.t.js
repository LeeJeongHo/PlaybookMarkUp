StartTest(function(t) {

    var task = new Gnt.model.Task({
        StartDate   : new Date(2012, 7, 31),
        EndDate     : new Date(2012, 7, 31),
        Duration    : 0,
        leaf        : true
    });

    var endCol = new Gnt.column.EndDate({
        format                  : 'Y-m-d',
        adjustMilestones        : true
    });
    t.is(endCol.renderer(task.getEndDate(), {}, task), '2012-08-30', 'Milestone end should be rendered -1 day')


    var startCol = new Gnt.column.StartDate({
        format                  : 'Y-m-d',
        adjustMilestones        : true
    });
    t.is(startCol.renderer(task.getStartDate(), {}, task), '2012-08-30', 'Milestone start should be rendered -1 day')


    // Now let`s test the editors, which also need to use the previous day while editing
    var editor = Ext.create('Sch.plugin.TreeCellEditing');

    var g = t.getGantt({
        startDate       : new Date(2010, 1, 1),
        endDate         : new Date(2010, 2, 1),

        renderTo : document.body,
        plugins : editor,
        columns : [
            { xtype : 'treecolumn' },
            startCol,
            endCol
        ]
    });

    g.taskStore.getRootNode().insertChild(0, task);

    t.chain(
        { waitFor : 'rowsVisible', args: g },

        function(next) {
            editor.startEdit(task, startCol);

            t.waitFor(
                function() {
                    return editor.getActiveEditor();
                },
                next
            );
        },

        function(next) {
            t.is(editor.getActiveEditor().field.getVisibleValue(), new Date(2012, 7, 30), '!Correct value found in date picker');

            editor.getActiveEditor().field.setVisibleValue(new Date(2012, 7, 20));
            editor.completeEdit();

            t.is(task.getStartDate(), new Date(2012, 7, 21), 'Should find start date updated after start edit');
            t.is(task.getEndDate(), new Date(2012, 7, 21), 'Should find end date updated after start edit');

            next()
        },

        // End date verification
        function(next) {
            editor.startEdit(task, endCol);

            t.waitFor(
                function() {
                    return editor.getActiveEditor();
                },
                next
            );
        },

        function(next) {
            t.is(editor.getActiveEditor().field.getVisibleValue(), new Date(2012, 7, 20), 'Correct value found in date picker');

            editor.getActiveEditor().field.setVisibleValue(new Date(2012, 7, 20));
            editor.completeEdit();

            next()
        },

        function(next) {
            t.is(task.getEndDate(), new Date(2012, 7, 21), 'Should find end date updated after end edit');

            task.setStartEndDate(new Date(2012, 7, 21), new Date(2012, 7, 21));
            editor.completeEdit();

            // If changing end date of a milestone, the start date should be refreshed too
            editor.startEdit(task, endCol);

            t.waitFor(
                function() {
                    return editor.getActiveEditor();
                },
                next
            );
        },

        function(next) {
            next()
        },

        { waitFor : 500 },

        function(next) {
            editor.getActiveEditor().field.setVisibleValue(new Date(2012, 7, 28));

            t.is(editor.getActiveEditor().field.getVisibleValue(), new Date(2012, 7, 28), 'Should find the correct value set in the editor');
            editor.getActiveEditor().completeEdit();
            next();
        },

        function (next) {
            t.matchGridCellContent(g.lockedGrid, 0, 1, "2012-08-21", 'Start date rendered correctly after updating milestone to regular task');
        }
    );
});
