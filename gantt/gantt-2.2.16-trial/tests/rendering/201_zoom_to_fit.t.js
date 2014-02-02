StartTest(function(t) {
    var start   = new Date(2010, 0, 1),
        end     = Sch.util.Date.add(start, Sch.util.Date.MONTH, 7);

    var taskStore = Ext.create("Gnt.data.TaskStore", {
        proxy       : {
            type: 'memory',
            reader: {
                type: 'json'
            },
            data : [
                { 
                    "StartDate" : "2010-01-04",
                    "EndDate" : "2010-01-18",
                    "Id" : 1,
                    "leaf" : true,
                    "Name" : "Task 1",
                    "ParentId" : null
                },
                { 
                    "StartDate" : "2010-02-04",
                    "EndDate" : "2010-02-18",
                    "Id" : 2,
                    "leaf" : true,
                    "Name" : "Task 2",
                    "ParentId" : null
                },
                { 
                    "StartDate" : "2010-03-18",
                    "Id" : 3,
                    "leaf" : true,
                    "Name" : "Task 3",
                    "ParentId" : null
                },
                { 
                    "StartDate" : "2010-06-04",
                    "EndDate" : "2010-07-18",
                    "Id" : 4,
                    "leaf" : true,
                    "Name" : "Task 4",
                    "ParentId" : null
                }
            ]
        },
        root: {
            loaded: true,
            expanded: true
        }
    });
    taskStore.load();

    var gantt = t.getGantt({
        renderTo : Ext.getBody(),
        taskStore : taskStore,
        startDate : start,
        endDate : end
    });

    t.waitForEventsToRender(gantt, function () {
        gantt.zoomToFit();

        var panelWidth    = gantt.getSchedulingView().getWidth(),
            timeAxisWidth = gantt.getSchedulingView().headerCt.items.items[0].getWidth();

        t.isLessOrEqual(timeAxisWidth, panelWidth, "Time axis fitted to panel's width");
    });
});   
