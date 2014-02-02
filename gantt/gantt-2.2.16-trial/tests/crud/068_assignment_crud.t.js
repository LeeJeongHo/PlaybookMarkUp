StartTest(function (t) {

    var resourceStore = Ext.create("Gnt.data.ResourceStore", {
        model : 'Gnt.model.Resource',
        data : [
            {"Id" : 1, "Name" : "Mats" },
            {"Id" : 2, "Name" : "Nickolay" },
            {"Id" : 3, "Name" : "Goran" },
            {"Id" : 4, "Name" : "Jakub" }
        ]
    });

    var assignmentStore = Ext.create("Gnt.data.AssignmentStore", {
        autoLoad : true,
        autoSync : true,
        resourceStore : resourceStore,
        proxy : {
            method: 'GET',
            type : 'ajax',
            actionMethods : { read : 'GET', destroy: 'POST', create: 'POST' },
            api: {
                read : 'data/crud/assignment-read.js',
                create : 'data/crud/assignment-create.js',
                destroy : 'data/crud/assignment-delete.js'
            },
            reader : {
                type : 'json'
            },
            writer : {
                type : 'json'
            }
        }
    });

    var cellEditing = Ext.create('Sch.plugin.TreeCellEditing', {
        clicksToEdit: 1
    });

    var gantt = t.getGantt({
        renderTo            : Ext.getBody(),
        
        resourceStore       : resourceStore,
        assignmentStore     : assignmentStore,
        
        plugins             : cellEditing,
        
        columns             : [
            {
                xtype       : 'treecolumn',
                header      : 'Tasks',
                dataIndex   : 'Id',
                width       : 100
            },
            {
                xtype       : 'resourceassignmentcolumn',
                header      : 'Assigned Resources',
                
                width       : 100,
                tdCls       : 'editor'
            }
        ]
    });

    t.chain(
        { waitFor : 'storesToLoad', args : assignmentStore },

        { waitFor : 'rowsVisible', args : gantt },
        
//        { action : 'click', target : '.editor div'},
//        { waitFor : 'componentVisible', args : 'assignmentgrid' },
        
        // instead of 2 lines above we force manual expand of the assignment field
        // forced expand
        function (next) {
            cellEditing.startEdit(gantt.taskStore.getRootNode().firstChild, 1)
            
            t.waitFor(function() { return cellEditing.getActiveEditor() }, next);
        },
        
        function (next) {
            // force expand with manual method call (is required for FF when running
            // in automation)
            // just clicking on the grid cell doesn't work because of something
            // related to focus..
            cellEditing.getActiveEditor().field.expand()
            
            next()
        },
        // eof forced expand

        { click : 'assignmentgrid => .x-grid-cell:nth-child(3)' },

        { waitForSelectorAtCursor : 'input' },

        { type : '100[TAB]', target : function () { return cellEditing.getActiveColumn().field.getPicker().cellEditing.getActiveEditor() } },
        
        { waitFor : 'CQVisible', args : 'numberfield' },

        { type : '80[ENTER]', target : function () { return cellEditing.getActiveColumn().field.getPicker().cellEditing.getActiveEditor() } },

        { 
            waitForEvent    : [ assignmentStore, 'write' ],
            trigger         : { click : '>> assignmentgrid button' }
        },

        function(next) {
            t.is(assignmentStore.getCount(), 2, '2 records in assignment store');
            t.ok(assignmentStore.getById(1), 'Record with Id 1 found');
            t.is(assignmentStore.getById(1).getUnits(), 100, '100 percent found');
            t.is(assignmentStore.getById(2).getUnits(), 80, '80 percent found');

            next();
        },
        
        // forced expand
        function (next) {
            cellEditing.startEdit(gantt.taskStore.getRootNode().firstChild, 1)
            
            t.waitFor(function() { return cellEditing.getActiveEditor() }, next);
        },
        
        function (next) {
            // force expand with manual method call (is required for FF when running
            // in automation)
            // just clicking on the grid cell doesn't work because of something
            // related to focus..
            cellEditing.getActiveEditor().field.expand()
            
            next()
        },
        // eof forced expand
        

        { waitFor : 'compositeQuery', args : 'assignmentgrid => td.x-grid-cell:nth-child(3)' },
        
        // 2 clicks to uncheck selected rows
        { action : 'click', target : 'assignmentgrid => .x-grid-row:nth-child(1) .x-grid-row-checker' },
        { action : 'click', target : 'assignmentgrid => .x-grid-row:nth-child(2) .x-grid-row-checker' },
        
        { 
            waitForEvent    : [ assignmentStore, 'write' ],
            trigger         : { click : '>> assignmentgrid button' }
        },

        function(next) {
            t.is(assignmentStore.getCount(), 0, 'Records removed');
            next();
        },

        // forced expand
        function (next) {
            cellEditing.startEdit(gantt.taskStore.getRootNode().firstChild, 1)
            
            t.waitFor(function() { return cellEditing.getActiveEditor() }, next);
        },
        
        function (next) {
            // force expand with manual method call (is required for FF when running
            // in automation)
            // just clicking on the grid cell doesn't work because of something
            // related to focus..
            cellEditing.getActiveEditor().field.expand()
            
            next()
        },
        // eof forced expand

        function(next) {
            t.selectorNotExists('.x-grid-row-selected .x-grid-row-checker', 'No rows selected');
            next();
        },

        { click : '>> assignmentgrid button[text=Cancel]' },

        function(next) {
            t.selectorNotExists('.x-grid-row-selected .x-grid-row-checker', 'No rows selected');
            t.elementIsNotVisible(t.cq1('assignmentfield').getEl(), 'No assignment field visible after Cancel click');
        }
    );
})
