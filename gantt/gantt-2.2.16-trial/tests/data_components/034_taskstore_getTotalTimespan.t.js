StartTest(function(t) {
    var getTaskStore    = function (children) {
        return new Gnt.data.TaskStore({
            proxy       : {
                type    : 'memory',
                reader  : {
                    type    : 'json'
                }
            },

            root        : {
                expanded    : false,
                children    : children || []
            }
        })
    }

    t.it('Should handle null inputs #1', function(t) {
        var taskStore   = getTaskStore()
        var span        = taskStore.getTotalTimeSpan();

        t.isDateEqual(span.start, null, 'Got null as start date from empty task store');
        t.isDateEqual(span.end, null, 'Got null as end date from empty task store');

        taskStore.getRootNode().appendChild(new taskStore.model({
            leaf            : true
        }));

        span = taskStore.getTotalTimeSpan();

        t.isDateEqual(span.start, null, 'Got null as start date from task store with task missing start/end');
        t.isDateEqual(span.end, null, 'Got null as end date from task store with task missing start/end');
    })

    t.it('Should handle null start date', function(t) {
        var taskStore = getTaskStore([
            {
                Id          : 1,
                leaf        : true,
                EndDate     : new Date(2011, 6, 1)
            }
        ])

        var span = taskStore.getTotalTimeSpan();

        t.is(span.start, null, 'Got correct start date from task store with single task with only end date');
        t.is(span.end, null, 'Got correct end date from task store with single task with only end date');
    });

    t.it('Should handle null end date', function(t) {

        var taskStore = getTaskStore([
            {
                Id          : 1,
                leaf        : true,
                StartDate   : new Date(2011, 6, 1)
            }
        ])

        var span = taskStore.getTotalTimeSpan();

        t.isDateEqual(span.start, new Date(2011, 6, 1), 'Got correct start date from task store with single task with only start date');
        t.is(span.end, new Date(2011, 6, 2), 'Got correct end date (startdate + 1) from task store with single task with only start date');
    });

    t.it('Should handle regular input data', function(t) {
        var dependencyStore = t.getDependencyStore();

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            dependencyStore: dependencyStore,

            proxy       : {
                type    : 'memory',
                reader  : {
                    type    : 'json'
                }
            },

            root        : {
                expanded    : false,

                children    : [
                    {
                        Id          : 11,
                        leaf        : true,
                        StartDate   : null,
                        EndDate     : null
                    },
                    {
                        Id          : 1,
                        leaf        : true,
                        StartDate   : new Date(2011, 6, 1),
                        EndDate     : new Date(2011, 6, 5)
                    },
                    {
                        Id          : 123,

                        StartDate   : new Date(2011, 6, 15),
                        EndDate     : new Date(2011, 6, 23),

                        children    : [
                            {
                                Id          : 2,
                                leaf        : true,
                                StartDate   : new Date(2011, 6, 16),
                                EndDate     : new Date(2011, 6, 20)
                            },
                            {
                                Id          : 3,
                                leaf        : true,
                                StartDate   : new Date(2011, 6, 18),
                                EndDate     : new Date(2011, 6, 22)
                            }
                        ]
                    },
                    {
                        Id          : 4,
                        leaf        : true,
                        StartDate   : new Date(2011, 6, 25),
                        EndDate     : new Date(2011, 6, 28)
                    },
                    {
                        Id          : 5,
                        leaf        : true,
                        StartDate   : new Date(2011, 6, 28),
                        EndDate     : new Date(2011, 6, 28)
                    }
                ]
            }
        });

        var span = taskStore.getTotalTimeSpan();

        t.isDateEqual(span.start, new Date(2011, 6, 1), 'Correct span start date');
        t.isDateEqual(span.end, new Date(2011, 6, 28), 'Correct span end date');

        var tasks = taskStore.getEventsInTimeSpan(new Date(2011, 6, 1), new Date(2011, 6, 30));
        t.is(tasks.length, 6, "getEventsInTimeSpan ok");

        // Task store load should not remove data from dependency store
        // ----------------------------------
        dependencyStore.first().set({ From : 1, To : 4 });

        taskStore.load();

        t.is(dependencyStore.getRemovedRecords().length, 0, 'Dependency not removed from dependency store after task store load');
    })

    t.it('Should handle null start date', function(t) {

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            proxy       : {
                type    : 'memory',
                reader  : {
                    type    : 'json'
                }
            },

            root        : {
                expanded    : false,
                children    : [
                    {
                        Id          : 1,
                        leaf        : true,
                        StartDate   : new Date(2011, 6, 11),
                        EndDate     : new Date(2011, 6, 15)
                    },
                    {
                        Id          : 2,
                        leaf        : true,
                        StartDate   : new Date(2011, 6, 12),
                        EndDate     : new Date(2011, 6, 16)
                    },{
                        Id          : 3,
                        leaf        : true,
                        StartDate   : null,
                        EndDate     : new Date(2011, 6, 17)
                    }
                ]
            }
        });

        var span = taskStore.getTotalTimeSpan();

        t.isDateEqual(span.start, new Date(2011, 6, 11), 'Got correct start date from task store with single task with only start date');
        t.isDateEqual(span.end, new Date(2011, 6, 16), 'Got correct end date from task store with single task with only start date');
    });
})
