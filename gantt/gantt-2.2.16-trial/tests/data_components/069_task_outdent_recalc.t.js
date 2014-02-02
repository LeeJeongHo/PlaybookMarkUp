StartTest(function(t) {

    var taskStore = new Gnt.data.TaskStore({
        root        : {
            expanded : true,
            children : [{
                Id          : 1,
                PercentDone : 40,
                StartDate   : new Date(2010, 0, 18),
                Duration    : 11,
                expanded    : true,
                children    : [
                    {
                        Id          : 11,
                        leaf        : true,
                        PercentDone : 30,
                        StartDate   : new Date(2010, 0, 18),
                        Duration    : 8,
                        Effort      : 1
                    },
                    {
                        Id          : 12,
                        leaf        : true,
                        PercentDone : 0,
                        StartDate   : new Date(2010, 0, 28),
                        Duration    : 3,
                        Effort      : 1
                    }
                ]
            }]
        },
        cascadeDelay   : 0,
        proxy       : 'memory'
    });

    var task1   = taskStore.getById(1);
    var task11  = taskStore.getById(11);

    t.isApprox(task1.getPercentDone(), 21.8, 0.02, "Task 1 percent is correct");
    t.is(task1.getEffort(), 2, "Task 1 effort is correct");

    t.diag("Outdent Task 1");

    task11.outdent();

    t.is(task1.getPercentDone(), 0, "Task 1 percent has changed");
    t.is(task1.getEffort(), 1, "Task 1 effort has changed");

});
