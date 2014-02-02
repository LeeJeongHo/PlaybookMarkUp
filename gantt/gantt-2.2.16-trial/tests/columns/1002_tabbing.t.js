StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setup')
    
    var editing = Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit: 2 });

    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        plugins     : editing,
        columns     : [
            { xtype : 'treecolumn', dataIndex : 'Name', field : {} },
            { xtype : 'startdatecolumn' },
            { xtype : 'enddatecolumn' },
            { xtype : 'durationcolumn' },

            // The addRowOnTab feature should work also when tabbing out of the last visible column if there are hidden columns after it
            { xtype : 'enddatecolumn', hidden : true }
        ]
    });
    
    var taskStore       = g.taskStore,
        firstTask       = taskStore.getRootNode().childNodes[0],
        lockedGrid      = g.lockedGrid,
        pos             = { row : 1, column : 1 };
    
    var storeCount      = lockedGrid.view.store.getCount();

    function getCell() {
        return lockedGrid.getView().getCellByPosition(pos);
    }
    
    t.chain(
        { waitFor : 'waitForEventsToRender', args : g },
        
        { doubleclick : getCell },
    
        { waitFor : 'selectorAtCursor', args : 'input' },
        
        function (next) {
            pos.column++;
            next();
        },

        { doubleclick : getCell },

        { waitFor : 'selectorAtCursor', args : 'input' },

        function (next) {
            pos = { row : storeCount-1, column : 3 };
            next();
        },

        { doubleclick : getCell },
        
        { waitFor : 'SelectorAtCursor', args : '.x-form-field' },

        { type : '[TAB]', target : function() { return editing.getActiveEditor().field.inputEl; }},

        { waitFor : 100 },

        function (next) {
            t.is(lockedGrid.view.store.getCount(), storeCount + 1, '1 new model was added after tabbing out of last cell');
            t.is(lockedGrid.view.getNodes().length, storeCount + 1, '1 new row was rendered after tabbing out of last cell');
            
            t.waitFor(100, next)
        },
        
        function (next) {
            // when running in automation, in IE10 editor is sometimes closed after tabbing on previous step
            // this happens sporadically and in IE10 only(!), very hard to debug (seems to only manifest itself in automation)
            // so just resuming the editing
            if (Ext.isIE10 && !editing.getActiveEditor()) {
                pos = { row : storeCount, column : 0 };
                t.doubleClick(getCell(), function () {
                    t.waitForSelectorAtCursor('.x-form-field', next)
                })
            } else
                next()
        },

        { type : '[TAB]', target : function() { return editing.getActiveEditor().field.inputEl; }},

        function (next) {
            t.is(g.getTaskStore().getNewRecords().length, 1, 'Should find only 1 new model');
        }
    );
});
