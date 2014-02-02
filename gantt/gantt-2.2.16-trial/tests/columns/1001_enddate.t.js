StartTest(function(t) {

    //======================================================================================================================================================================================================================================================
    t.diag('Setup');

    var editing = Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit: 1 });

    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        plugins     : editing
    });


    t.waitForEventsToRender(g, function () {

        var taskStore    = g.taskStore,
            firstTask    = taskStore.getRootNode().childNodes[0],
            lockedGrid   = g.lockedGrid;

        firstTask.set('leaf', true);
        firstTask.commit();

        var endDate         = firstTask.getEndDate();
        var startDate       = firstTask.getStartDate();

        var endDateHeader       = lockedGrid.down('enddatecolumn'),
            endDateColIndex     = lockedGrid.headerCt.items.indexOf(endDateHeader),
            startDateColIndex   = lockedGrid.headerCt.items.indexOf(lockedGrid.down('startdatecolumn'));

        t.matchGridCellContent(lockedGrid, 0, endDateColIndex, Ext.Date.format(new Date(endDate - 1), endDateHeader.format), 'End date rendered correctly');

        var view        = lockedGrid.getView();

        var cell        = view.getCellByPosition({ row : 0, column : startDateColIndex });

        t.chain(
            {
                action  : 'click',
                target  : cell
            },
            function (next) {
                t.waitForElementNotTop(cell, next)
            },
            {
                action  : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 0, column : endDateColIndex });
                }
            },
            function (next) {
                t.is(startDate, firstTask.get('StartDate'), 'StartDate was not changed when just clicking and blurring the editor');
                t.ok(!firstTask.dirty, 'Task is not dirty');

                next()
            },
            {
                action  : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 0, column : endDateColIndex + 1 });
                }
            },
            function (next) {
                t.ok(!firstTask.dirty, 'EndDate was not changed when just clicking and blurring the editor');
                next();
            },
            {
                action  : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 0, column : endDateColIndex });
                }
            },

            { waitFor : 100 },

            function(next){
                var expected = Ext.Date.add(endDate, Ext.Date.DAY, 1);

                editing.getActiveEditor().field.setVisibleValue(expected);
                expected    = editing.getActiveEditor().getValue();

                editing.completeEdit();

                t.is(firstTask.getEndDate(), expected, 'EndDate was bumped one day');

                // Setting start/end to null, should not cause any issues while editing
                firstTask.setStartDate(null);
                firstTask.setDuration(null);
                firstTask.setEndDate(null);
                next();
            },

            {
                action  : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 0, column : endDateColIndex });
                }
            },

            { waitFor : 100 },

            function (next) {
                editing.getActiveEditor().field.setVisibleValue(new Date(2010, 1, 1));   // Picking 'inclusive' date, adjusting under the hood +1 day
                editing.completeEdit();
                t.is(firstTask.getEndDate(), new Date(2010, 1, 2), 'EndDate was set ok from null');

                // Commit all, now click all date cells, which should not change any data
                taskStore.nodeStore.commitChanges();
                t.wontFire(taskStore, 'update');
                next();
            },
            {
                action : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 0, column : endDateColIndex });
                }
            },
            {
                action : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 1, column : endDateColIndex });
                }
            },
            {
                action : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 2, column : endDateColIndex });
                }
            },
            {
                action : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 3, column : endDateColIndex });
                }
            },
            {
                action : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 4, column : endDateColIndex });
                }
            },
            {
                action : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 5, column : endDateColIndex });
                }
            },
            {
                action : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 6, column : endDateColIndex });
                }
            },
            {
                action : 'click',
                target  : function () {
                    return view.getCellByPosition({ row : 7, column : endDateColIndex });
                }
            }
        )
    })
});
