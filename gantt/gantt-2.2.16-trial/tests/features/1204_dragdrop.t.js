StartTest(function (t) {

    var dragFn = function (record, start, duration, e) {
        var argsAreCorrect  = arguments[0] instanceof Gnt.model.Task &&
            arguments[1] instanceof Date &&
            typeof arguments[2] === 'number' &&
            arguments[3] instanceof Ext.EventObjectImpl
            
        if (!argsAreCorrect) t.fail('Correct `dndValidatorFn` function arguments');

        if (record == task1 && start > new Date(2010, 1, 5)) {
            return false;
        }
        return true;
    };

    var g = t.getGantt2({
        startDate      : new Date(2010, 1, 1),
        dndValidatorFn : dragFn,
        taskStore      : new Gnt.data.TaskStore({
            proxy : 'memory',
            root  : {
                children : [
                    {
                        Id          : 1,
                        Cls         : 'task1',
                        StartDate   : new Date(2010, 1, 1),
                        Duration    : 3,
                        leaf        : true
                    },
                    {
                        Id          : 2,
                        Cls         : 'task2',
                        StartDate   : new Date(2009, 11, 1),
                        Duration    : 100,
                        leaf        : true
                    }
                ]
            }
        })
    });

    g.render(Ext.getBody());

    var task1       = g.taskStore.getById(1);
    var task2       = g.taskStore.getById(2);
    
    var tickWidth   = g.timeAxisViewModel.getTickWidth()

    t.it('Should be possible to drag a regular task', function (t) {
        t.chain(
            { waitFor : 'rowsVisible', args : g },
    
            { drag : '.task1', by : [ tickWidth, 0 ] },
    
            function (next) {
                t.is(task1.getStartDate(), new Date(2010, 1, 2), 'Task dragged properly');
                next();
            }
        )
    })

    
    t.it('Should be possible to block the drag with `dndValidatorFn`', function (t) {
        t.chain(
            { drag : '.task1', by : [ tickWidth * 10, 0 ] },
    
            function (next) {
                t.is(task1.getStartDate(), new Date(2010, 1, 2), 'Task drag blocked by dndValidatorFn');
                next();
            }
        )
    })
    
    
    t.it('Should be possible to drag a task that starts/ends outside of the view', function (t) {
        t.chain(
            // dragging a task that starts and ends outside of the current view
            { drag : '.task2', offset : [ 10, 5 ], by : [ tickWidth, 0 ] },
    
            function (next) {
                t.is(task2.getStartDate(), new Date(2009, 11, 2), 'Task dragged properly');
                next();
            },
            
            { drag : '.task2', offset : [ 2 * tickWidth, 5 ], by : [ -tickWidth, 0 ] },
    
            function (next) {
                t.is(task2.getStartDate(), new Date(2009, 11, 1), 'Task dragged properly');
                next();
            }
        )
    })
})    
