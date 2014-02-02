StartTest(function (t) {

    var syncCalls = 0;

    var body = Ext.getBody();

    var resourceStore   = t.getResourceStore({
        autoSync    : true,
        sync        : function () {}
    });

    var assignmentStore = t.getAssignmentStore({
        resourceStore   : resourceStore,
        autoSync        : true,
        sync            : function () {}
    });

    var taskStore = t.getTaskStore({
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore
    });

    var gantt = t.getGantt({
        renderTo        : body,
        taskStore       : taskStore,
        columns : [
            {
                xtype       : 'treecolumn',
                header      : 'Tasks',
                dataIndex   : 'Id',
                width       : 100
            },
            {
                width   : 200,
                xtype   : 'resourceassignmentcolumn'
            }
        ]
    });

    var grid = new Gnt.widget.AssignmentEditGrid({
        margin                  : 10,
        width                   : 300,
        renderTo                : body,
        resourceStore           : resourceStore,
        assignmentStore         : assignmentStore,
        defaultAssignedUnits    : 50,

        loadResources   : function() {
            Gnt.widget.AssignmentEditGrid.prototype.loadResources.apply(this, arguments);
        }
    });


    grid.loadTaskAssignments(115);

    t.chain(
        { waitFor : 'rowsVisible', args : gantt },
        { waitFor : 'rowsVisible', args : grid },

        function(next) {
            grid.cellEditing.startEditByPosition({ row : 0, column : 1 });

            next();
        },

        { waitFor : 500 },

        function(next) {
            t.diag('Set units field to 30% at assignment grid');
            var editor = grid.cellEditing.getActiveEditor();
            editor.setValue(30);
            editor.completeEdit();

            next();
        },

        { waitFor : 500 },

        function(next) {
            t.diag('Call saveTaskAssignments() to apply changes to assignmentGrid');
            grid.saveTaskAssignments();

            next();
        },

        { waitFor : 500 },

        function(next) {
            t.diag('Check if gantt panel displays correct value');

            t.matchGridCellContent(gantt.lockedGrid, 3, 1, 'Don [30%]', 'Don is assigned to 30%');

            next();
        },

        function(next) {
            t.diag('Check if gantt panel displays correct value');

            grid.insertAssignment({ ResourceId: 'r1', Units: '20' });

            next();
        },

        { waitFor : 'componentVisible', args: ['combobox'] },

        function(next) {
            var editor = grid.cellEditing.getActiveEditor();
            editor.completeEdit();

            next();
        },

        function(next) {
            t.diag('Call saveTaskAssignments() to apply changes to assignmentGrid');
            grid.saveTaskAssignments();

            next();
        },

        { waitFor : 500 },

        function(next) {
            t.diag('Check if gantt panel displays correct value');

            t.matchGridCellContent(gantt.lockedGrid, 3, 1, 'Don [30%], Mike [20%]', 'Don is assigned to 30% and Mike to 20%');

            next();
        },

        /* check new resources adding */

        function(next) {
            t.diag('Add resource newresource1 assignment');
            grid.insertAssignment();
            t.waitForComponentVisible('combobox', next);
        },

        { waitFor : 500 },

        { action : 'type', target : grid.cellEditing.field, text : '<img id=QwErTy>newresource1[ENTER]' },

        { waitFor : 'componentVisible', args : 'messagebox' },

        function (next) {
            t.notOk(document.getElementById('QwErTy'), 'Message box escapes HTML characters');
            next();
        },

        { action : 'click', target : function () { return body.down('.x-message-box .x-btn:contains(Yes)'); } },

        { waitFor : 100 },

        function(next) {
            t.notOk(document.getElementById('QwErTy'), 'Grid escapes HTML characters');

            t.diag('Add resource newresource2 assignment');
            grid.insertAssignment();
            t.waitForComponentVisible('combobox', next);
        },

        { waitFor : 500 },

        { action : 'type', target : grid.cellEditing.field, text : 'newresource2[ENTER]' },

        { action : 'click', target : body },

        { waitFor : 'componentVisible', args : 'messagebox' },

        { action : 'click', target : function () { return body.down('.x-message-box .x-btn:contains(Yes)'); } },

        { waitFor : 100 },

        function(next) {
            grid.saveTaskAssignments();

            t.diag('Check if resources were stored');

            var found = resourceStore.queryBy(function (resource) {
                return resource.getName() == '<img id=QwErTy>newresource1';
            });

            t.ok(found.getCount(), '<img id=QwErTy>newresource1 found');

            found = resourceStore.queryBy(function (resource) {
                return resource.getName() == 'newresource2';
            });

            t.ok(found.getCount(), 'newresource2 found');

            next();
        },

        /* check how resource & assignment store changes reflect on combobox & grid stores */

        function(next) {
            t.diag('Check how resource & assignment store changes reflect on combobox & grid stores');

            resourceStore.insert(0, { Name : 'someresource' });
            next();
        },

        // needs to be bigger than `refreshTimeout` of the Gnt.widget.AssignmentEditGrid
        { waitFor : 200 },

        function(next) {
            var found = grid.resourceComboStore.queryBy(function (resource) {
                return resource.getName() == 'someresource';
            });

            t.ok(found.getCount(), 'resource adding reflected on resource combo store');

            found = resourceStore.queryBy(function (resource) {
                return resource.getName() == 'someresource';
            });

            resourceStore.remove(found.first());

            next();
        },

        { waitFor : 200 },

        function(next) {
            var found = grid.resourceComboStore.queryBy(function (resource) {
                return resource.getName() == 'someresource';
            });

            t.notOk(found.getCount(), 'resource deleting reflected on resource combo store');

            next();
        },

        function(next) {
            assignmentStore.insert(0, { TaskId : grid.taskId, ResourceId : 'r5', Units : 10 });
            next();
        },

        { waitFor : 200 },

        function(next) {
            var found = grid.store.queryBy(function (assignment) {
                return assignment.getResourceId() == 'r5';
            });

            t.ok(found.getCount(), 'resource adding reflected on grid store');

            found = assignmentStore.queryBy(function (assignment) {
                return assignment.getResourceId() == 'r5';
            });

            assignmentStore.remove(found.first());

            next();
        },

        { waitFor : 100 },

        function(next) {
            var found = grid.store.queryBy(function (assignment) {
                return assignment.getResourceId() == 'r5';
            });

            t.notOk(found.getCount(), 'resource deleting reflected on grid store');

            next();
        },

        // #955: after adding of 2 records grid.saveTaskAssignments() call must invoke sync() only once
        function(next) {
            grid.store.add({ TaskId : grid.taskId, ResourceId : 'r5', Units : 10 }, { TaskId : grid.taskId, ResourceId : 'r6', Units : 10 });

            assignmentStore.sync = function () { syncCalls++; };

            grid.saveTaskAssignments();

            next();
        },

        { waitFor : 100 },

        function(next) {
            t.is(syncCalls, 1, 'sync called proper number of times')
        }
    );
});
