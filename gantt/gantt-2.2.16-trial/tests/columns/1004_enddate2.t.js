StartTest(function(t) {

    //======================================================================================================================================================================================================================================================
    t.diag('Setup');

    var editing = Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit: 1 });

    var g = t.getGantt({
        startDate   : new Date(2010, 1, 1),
        endDate     : new Date(2010, 2, 1),
        renderTo    : Ext.getBody(),
        plugins     : editing
    });

    var taskStore    = g.taskStore,
        firstTask    = t.getFirstLeafTask(taskStore),
        lockedGrid   = g.lockedGrid;

    firstTask.setStartEndDate(new Date(2010, 1, 2), new Date(2010, 1, 4));

    t.waitForEventsToRender(g, function () {

        var endDateHeader       = lockedGrid.down('enddatecolumn'),
            endDateColIndex     = lockedGrid.headerCt.items.indexOf(endDateHeader),
            startDateColIndex   = lockedGrid.headerCt.items.indexOf(lockedGrid.down('startdatecolumn'));

        var view        = lockedGrid.getView();
        var rowIndex    = view.store.indexOf(firstTask);

        t.chain(
            // wait until the changes from `firstTask.setStartEndDate(new Date(2010, 1, 2), new Date(2010, 1, 3));`
            // will be fully applied (processes is buffered)
            { waitFor   : 500 },

            { action  : 'click', target  : function () { return view.getCellByPosition({ row : rowIndex, column : endDateColIndex }) } },

            { waitFor : 'selectorAtCursor', args : '.x-form-field' },

            // Should become a milestone
            function(next){
                editing.getActiveEditor().field.setVisibleValue(new Date(2010, 1, 2));

                editing.completeEdit();

                t.is(firstTask.getEndDate(), new Date(2010, 1, 3), 'Setting end date = start date should bump it 1 day');
                t.is(firstTask.getDuration(), 1, 'Setting end date = start date should mean a 1 day duration');
                t.ok(!firstTask.isMilestone(), 'Task not converted into a milestone if end is set to start date');

                t.is(view.getCellByPosition({ row : rowIndex, column : startDateColIndex }).child('.x-grid-cell-inner').dom.innerHTML,
                     view.getCellByPosition({ row : rowIndex, column : endDateColIndex }).child('.x-grid-cell-inner').dom.innerHTML,
                     'Both start and end date cells should be the same');

                t.matchGridCellContent(lockedGrid, rowIndex, endDateColIndex, Ext.Date.format(new Date(2010, 1, 2), endDateHeader.format), 'End date rendered correctly');

                next();
            }
        )
    })
});
