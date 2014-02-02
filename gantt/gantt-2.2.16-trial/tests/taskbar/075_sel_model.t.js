StartTest(function(t) {
    
    var g = t.getGantt({    
        width               : 500,
        lockedGridConfig    : { width : 100},
        viewConfig          : { forceFit : true },
        renderTo            : Ext.getBody(),
        multiSelect         : true
    });

    t.chain(
        { waitFor : 'rowsVisible', args : g },

        function(next) {
            t.selectorNotExists('.x-grid-row-selected', 'No rows selected initially');
            next();
        },

        { action : 'click', target : '.sch-gantt-task-bar' },

        function(next) {
            var row = Ext.select('.sch-gantt-task-bar').first().up('tr');
            t.hasCls(row, 'x-grid-row-selected', 'Row selected after clicking task bar');
            t.selectorExists('.x-grid-inner-locked .x-grid-row-selected', 'Row should also be selected in locked section');
            next();
        },

        { action : 'click', options : { ctrlKey : true } },

        function(next) {
            var row = Ext.select('.sch-gantt-task-bar').first().up('tr');
            t.selectorNotExists('.x-grid-row-selected', 'No rows selected after clicking task again');
        }
    );
});    
