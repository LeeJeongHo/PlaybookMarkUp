StartTest(function (t) {

    // Test to check if combobox filters by entered text properly after saveAssignments() call
    // Bug #778

    var resourceStore   = t.getResourceStore();

    var assignmentStore = t.getAssignmentStore({
        resourceStore   : resourceStore
    });

    var taskStore = t.getTaskStore({
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore
    });

    var grid = new Gnt.widget.AssignmentEditGrid({
        margin                  : 10,
        width                   : 300,
        renderTo                : Ext.getBody(),
        resourceStore           : resourceStore,
        assignmentStore         : assignmentStore
    });

    grid.loadTaskAssignments(115);

    t.chain(
        { waitFor : 'rowsVisible', args : 'assignmenteditgrid' },

        function(next) {
            grid.insertAssignment({ ResourceId: 'r1', Units: '20' });

            next();
        },

        { waitFor : 'componentVisible', args: ['combobox'] },

        function(next) {
            var editor = grid.cellEditing.getActiveEditor();
            editor.field.inputEl.dom.value = '';
            t.type(editor.field.inputEl.dom, 'Linda', next);
        },

        { waitFor : 'selector', args : '.x-boundlist-item:contains(Linda)' },

        function(next) {
            var editor = grid.cellEditing.getActiveEditor();
            var picker = editor.field.getPicker().el;
            t.ok(picker.down('.x-boundlist-item:nodeValue(Linda)'), '`Linda` record found');
            t.ok(picker.down('.x-boundlist-item:only-child'), 'And it`s the only record in picker');
            editor.completeEdit();

            next();
        },

        function(next) {
            t.diag('Call saveTaskAssignments() to apply changes to assignmentGrid');
            grid.saveTaskAssignments();

            next();
        },

        function(next) {
            grid.insertAssignment({ ResourceId: 'r1', Units: '20' });

            next();
        },

        { waitFor : 'componentVisible', args: ['combobox'] },

        function(next) {
            var editor = grid.cellEditing.getActiveEditor();
            editor.field.inputEl.dom.value = '';
            t.type(editor.field.inputEl.dom, 'Karen', next);
        },

        { waitFor : 300 },

        function(next) {
            var editor = grid.cellEditing.getActiveEditor();
            var picker = editor.field.getPicker().el;
            t.ok(picker.down('.x-boundlist-item:nodeValue(Karen)'), '`Karen` record found');
            t.ok(picker.down('.x-boundlist-item:only-child'), 'And it`s the only record in picker');
            editor.completeEdit();

            next();
        }
    );
});
