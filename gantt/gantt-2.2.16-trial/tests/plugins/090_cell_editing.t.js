StartTest(function(t) {

    //======================================================================================================================================================================================================================================================
    t.diag('Setup')
    var ed = Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit: 1 });

    var g = t.getGantt({
        viewPreset      : 'weekAndDayLetter',
        renderTo        : Ext.getBody(),
        plugins         : ed,
        columns         : [
            {
                xtype       : 'namecolumn',
                width       : 100,
                editor      : {}
            },
            {
                xtype : 'durationcolumn'
            }
        ]
    });

    var editor = g.lockedGrid.headerCt.getHeaderAtIndex(0).getEditor();

    var editorElXY, record;

    t.chain(
        { waitFor : 'EventsToRender', args : g },

        { action : 'click', target : '.x-grid-row:nth-child(2) .x-grid-cell' },

        { waitFor : 'ComponentVisible', args : editor },

        function (next) {
            record      = g.taskStore.getRootNode().firstChild.firstChild;

            editorElXY  = editor.el.getXY();

            // Make sure the editor is visible
            t.elementIsTopElement(editor.el, true, 'Editor visible after cell click');

            // Now we call refreshSize() which eventually flushes layouts
            g.lockedGrid.getView().refreshSize();

            next();
        },

        { waitFor : 500 },

        function (next) {
            t.elementIsAt(editor.el.dom, editorElXY, 'Editor kept its position after layouts flushing');

            editor.setValue('foo');

            ed.completeEdit();

            t.is(record.get('Name'), 'foo', 'Could edit name and update value');

            g.setReadOnly(true);

            next();
        },

        { action : 'click', target : '.x-grid-row:nth-child(2) .x-grid-cell' },
        { waitFor : 500 },

        function () {
            t.elementIsNotVisible(editor.el, 'Editor is not displayed. ReadOnly working for locked grid.');
        }
    );
})
