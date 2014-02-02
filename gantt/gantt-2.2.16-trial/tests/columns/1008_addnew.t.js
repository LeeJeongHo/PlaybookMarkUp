StartTest(function(t) {
    
    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        columns : [
            {
                xtype : 'treecolumn',
                dataIndex : 'Id'
            },
            {
                xtype : 'addnewcolumn'
            }
        ]
    });

    t.chain(
        { waitFor : 'rowsVisible', args : g},

        { click : '>> addnewcolumn' },

        // "startEdit" delays focus of the field on 10ms
        'waitFor(50)',
        
        { type : 'Dur' },

        function (next){
            t.is(t.cq1('#addNewEditorComboList').getNodes().length, 1, 'Should only find 1 item in list after filtering');
            t.notOk(t.cq1('durationcolumn'), 'Should not find duration column in gantt chart initially')

            t.willFireNTimes(g.lockedGrid.view, 'refresh', 1)

            next();
        },

        { click : '>> #addNewEditorComboList' },

        function (next){
            t.ok(t.cq1('ganttpanel durationcolumn'), 'Should find duration column in gantt chart after selecting it');
            t.is(g.lockedGrid.headerCt.items.last(), t.cq1('addnewcolumn'), 'Add new column should still be the last one');
        }
    )
});
