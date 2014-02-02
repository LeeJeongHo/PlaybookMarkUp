StartTest({
    overrideSetTimeout : false
},function(t) {

    var plug = new Gnt.plugin.Printable({ autoPrintAndClose : false });

    var g = t.getGantt({
        viewPreset          : 'weekAndDayLetter',
        highlightWeekends   : true,
        showTodayLine       : true,
        renderTo            : Ext.getBody(),
        viewConfig          : { forceFit : true },
        plugins             : plug,
        columns             : [
            { xtype : 'treecolumn' },
            { xtype : 'startdatecolumn' },
            { xtype : 'durationcolumn', hidden : true }
        ],
        dependencyStore     : t.getDependencyStore({
            data : [
                { From : 1, To : 2, Type : 2},
                { From : 2, To : 3, Type : 2}
            ]
        }),
        taskStore           : new Gnt.data.TaskStore({
            root : {
                children :  [
                    { leaf : true, Id : 1, StartDate : new Date(2010, 1, 3), EndDate : new Date(2010, 1, 5) },
                    { leaf : true, Id : 2, StartDate : new Date(2010, 1, 5), EndDate : new Date(2010, 1, 7) },
                    { leaf : true, Id : 3, StartDate : new Date(2010, 1, 11), EndDate : new Date(2010, 1, 11) }
                ]
            }
        }),
        lockedGridConfig : {
            width: 300,
            collapsible : true
        }
    });

    t.chain(
        { waitFor : 'rowsVisible', args : g },
        { waitFor : 100 },

        function(next) {
            g.getSchedulingView(0).highlightCriticalPaths();
            g.lockedGrid.collapse();
            g.print();
            var win = plug.printWindow;
            var bodyHtml = win.document.body.innerHTML;
            win.close();
            t.like(bodyHtml, 'sch-timeline', 'Found rendered column line');
            t.like(bodyHtml, 'sch-zone', 'Found rendered zone');
            t.like(bodyHtml, 'sch-gantt-critical-chain', 'Found highlighted view class');
            t.like(bodyHtml, 'sch-gantt-task-highlighted', 'Found highlighted task');
            t.like(bodyHtml, 'sch-dependency-selected', 'Found highlighted task');
            t.unlike(bodyHtml, 'sch-print-lockedheader', 'Locked grid not added to print');
            next();
        },

        { action : 'done'}
    );
});
