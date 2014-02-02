StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setup');
    
    var editing = Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit: 1 });

    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        columns : [
            { xtype : 'treecolumn', width : 40 },
            {
                xtype       : 'startdatecolumn',
                format      : 'M d/Y G:i',
                width       : 110
            },
            {
                xtype       : 'startdatecolumn',
                format      : 'Y-m-d',
                width       : 110
            }
        ],
        plugins     : editing,
        startDate   : new Date(2010, 1, 1),
        endDate     : new Date(2010, 2, 1),
        taskStore   : t.getTaskStore({
            DATA    : [
                {
                    "leaf": true,
                    "Id": 117,
                    "Name": "New task 1",
                    "StartDate": new Date(2010, 1, 1, 8),
                    "Duration": 0
                }, 
                {
                    "leaf": true,
                    "Id": 118,
                    "Name": "New task 2",
                    "StartDate": new Date(2010, 1, 10),
                    "Duration": 0
                }
            ]
        })
    });


    var taskStore    = g.taskStore,
        firstTask    = taskStore.getRootNode().childNodes[ 0 ],
        secondTask   = taskStore.getRootNode().childNodes[ 1 ],
        lockedGrid   = g.lockedGrid;

    var startDate       = firstTask.getStartDate();
    var startCol        = lockedGrid.headerCt.items.getAt(1);
    var startColWithHrs = lockedGrid.headerCt.items.getAt(2);
    
    var view        = lockedGrid.getView();
    
    t.chain(
        {
            waitFor     : 'EventsToRender',
            args        : g
        },
        'waitFor(100)',
        {
            action  : 'click',
            target  : function () { return view.getCellByPosition({ row : 0, column : 1 }) }
        },
        {
            waitFor : 'selectorAtCursor',
            args    : '.x-form-field'
        },

        function (next) {
            editing.getActiveEditor().setValue(new Date(2010, 1, 2, 8));
            editing.completeEdit();
            
            t.is(firstTask.getStartDate(), new Date(2010, 1, 2, 8), 'StartDate moved one day');

            firstTask.setStartEndDate(null, null);
            firstTask.setDuration(null);
            
            var innerCell = view.getCellByPosition({ row : 0, column : 1 }).down('.x-grid-cell-inner');

            t.is(Ext.String.trim(innerCell.dom.innerHTML.replace('&nbsp;', '')), '', 'Cell rendered empty if start date is null');
            
            next();
        },

        {
            action  : 'click',
            target  : function() { return view.getCellByPosition({ row : 0, column : 2 }); }
        },

        function (next) {
            editing.getActiveEditor().setValue(new Date(2010, 1, 2));
            editing.completeEdit();

            t.is(firstTask.getEndDate(), null, 'EndDate intact (null) after start date edit');

            t.is(firstTask.getStartDate(), new Date(2010, 1, 2), 'StartDate intact after edit, with null EndDate');

            t.contentLike(view.getCellByPosition({ row : 0, column : 2 }), '2010-02-02', 'StartDate rendered ok');
            
            next()
        },

        {
            action  : 'click',
            // activating editing of column with time
            target  : function() { return view.getCellByPosition({ row : view.store.indexOf(secondTask), column : 1 }); }
        },
        {
            waitFor : 'selectorAtCursor',
            args    : '.x-form-field'
        },
        
        function (next) {
            // setting a date value with non-zero time portion
            editing.getActiveEditor().setValue(new Date(2010, 1, 12, 8));
            editing.completeEdit();

            // the value should not be messed up by column editor
            t.is(secondTask.getStartDate(), new Date(2010, 1, 12, 8), 'StartDate was updated to 2012/02/12 08:00 correctly');
        }
    )
});
