StartTest(function (t) {
    t.diag('Testing the instant update feature which is enabled by default')

    var cellEditing = new Sch.plugin.TreeCellEditing({ clicksToEdit : 1 });

    var gantt = t.getGantt({
        height    : 200,
        renderTo  : Ext.getBody(),
        // Having this flag set to true caused scroll issue previously
        // http://www.bryntum.com/forum/viewtopic.php?f=9&t=3903&sid=4d93cb492b549664adc5b5239e194927
        cascadeChanges : true,

        plugins   : cellEditing,
        taskStore : new Gnt.data.TaskStore({
            root : {
                children : [
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1, Id : 1 },
                    { leaf : true, StartDate : new Date(2010, 1, 1), Duration : 1, Id : 2 }
                ]
            }
        }),
        dependencyStore : new Gnt.data.DependencyStore({
            data : [
                { From : 2, To : 1 }
            ]
        }),
        columns   : [
            {
                xtype : 'treecolumn'
            },
            {
                xtype : 'durationcolumn',
                tdCls : 'dur'
            }
        ]
    });
    
    t.firesOk(gantt.normalGrid.view, {
        itemupdate      : 2,
        refresh         : 0
    });
    t.willFireNTimes(gantt.taskStore, 'cascade', 1);
    
    t.it('Click and wait for editor', function (t) {
        t.chain(
            { waitFor : 'rowsVisible', args : gantt },
            { click   : '.x-grid-row:last-child .dur' },
            { waitFor : 'selectorAtCursor', args : 'input' }
        );
    });

    t.it('Click spinner up ', function (t) {
        t.chain(
            function (next) {
                var ed = cellEditing.getActiveEditor();

                t.isntCalled("setPosition", ed);
                t.isntCalled("realign", ed);
                t.wontFire(ed, 'move');
                next();
            },

            { click : '.x-form-spinner-up' },

            { waitFor : 100 }
        );
    });

    t.it('Hit enter to finalize edit, which should not cause a scroll change', function (t) {
        var scroll;

        t.chain(
            function (next) {
                scroll = gantt.lockedGrid.view.el.dom.scrollTop;
                next()
            },

            { click : '.x-grid-cell-editor' },

            { type : '[ENTER]' },

            { waitFor : 100 },

            function (next) {
                t.is(gantt.lockedGrid.view.el.dom.scrollTop, scroll, 'Scroll should not be reset')
            }
        )
    });
});
