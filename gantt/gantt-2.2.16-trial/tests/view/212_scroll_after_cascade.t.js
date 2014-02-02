describe('After cascade, scroll should not be messed up', function(t) {
    
    t.expectGlobals('App', 'MyApp', 'MyTaskModel');

    t.chain(

        { waitFor : 'RowsVisible' },

        { drag : '.sch-gantt-task-bar', by : [200, 0] },

        function() {
            var gantt = t.cq1('ganttpanel');
            var cols = gantt.lockedGrid.headerCt.getGridColumns();

            Ext.each(cols, function(c, i) {
                t.is(Ext.fly(t.getCell(gantt.lockedGrid, 0, i)).getWidth(), c.getWidth(), i + ': cell width ok');
            });
        }
    )
})
