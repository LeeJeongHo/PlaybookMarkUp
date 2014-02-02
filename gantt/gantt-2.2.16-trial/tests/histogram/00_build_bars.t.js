StartTest(function(t) {

    // Checks for ResourceHistogram building data for bars and limit lines

    var resourceStore   = t.getResourceStore({
        data: [
            { Id: 'r1', Name: 'Mike' },
            { Id: 'r2', Name: 'Linda', CalendarId : 'custom' }
        ]
    });

    var calendar        = t.getBusinessTimeCalendar();

    var customCalendar  = t.getBusinessTimeCalendar({
        calendarId  : 'custom',
        data        : [
            {
                Date            : new Date(2013, 3, 4),
                Availability    : [ '09:00-13:00' ]
            }
        ]
    });

    var assignmentStore = t.getAssignmentStore({
        data: [
            { Id: 'a1', ResourceId: 'r1', TaskId : 1, Units : 50 },
            { Id: 'a2', ResourceId: 'r1', TaskId : 2 },
            { Id: 'a3', ResourceId: 'r2', TaskId : 3 },
            { Id: 'a4', ResourceId: 'r2', TaskId : 4 }
        ]
    });

    var dependencyStore = t.getDependencyStore();

    var taskStore = t.getTaskStore({
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore,
        dependencyStore : dependencyStore,
        calendar        : calendar,
        cascadeChanges  : true,
        DATA            : [
            {
                Id              : 1,
                leaf            : true,
                Name            : "Task1",
                StartDate       : new Date(2013, 3, 2, 8),
                Duration        : 4
            },
            {
                Id              : 2,
                leaf            : true,
                Name            : "Task2",
                StartDate       : new Date(2013, 3, 3, 8),
                Duration        : 2
            },
            {
                Id              : 3,
                leaf            : true,
                Name            : "Task3",
                StartDate       : new Date(2013, 3, 3, 8),
                Duration        : 6,
                SchedulingMode  : 'FixedDuration'
            },
            {
                Id              : 4,
                leaf            : true,
                Name            : "Task3",
                StartDate       : new Date(2013, 3, 5, 8),
                Duration        : 3
            }
        ]
    });

    var histogram = Ext.create('Gnt.panel.ResourceHistogram', {
        taskStore           : taskStore,
        resourceStore       : resourceStore,
        assignmentStore     : assignmentStore,
        startDate           : new Date(2013, 3, 1),
        endDate             : new Date(2013, 3, 12)
    });

    var data = histogram.allocationData.r1;

    t.diag('Check resource r1 data');

    t.diag('Check allocation bars array');

    t.ok(!!data, 'Allocation data is filled');

    t.is(data.bars.length, 3, '3 bars found');

    t.is(data.bars[0].startDate, taskStore.getById(1).get('StartDate'), '1st bar starts at "Task1" start date');
    t.is(data.bars[0].totalAllocation, 50, '1st bar allocation is 50%');

    t.is(data.bars[1].startDate, taskStore.getById(2).get('StartDate'), '2nd bar starts at "Task2" start date');
    t.is(data.bars[1].totalAllocation, 150, '2nd bar allocation is 150%');

    t.is(data.bars[2].startDate, taskStore.getById(2).get('EndDate'), '3rd bar starts at "Task2" end date');
    t.is(data.bars[2].totalAllocation, 50, '3rd bar allocation is 50%');

    t.diag('Check resource limits array');

    t.is(data.maxBars.length, 1, '1 solid line found');


    data = histogram.allocationData.r2;

    t.diag('Check resource r2 data');

    t.diag('Check allocation bars array');

    t.ok(!!data, 'Allocation data is filled');

    t.is(data.bars.length, 5, '5 bars found');

    t.is(data.bars[0].startDate, taskStore.getById(3).get('StartDate'), '1st bar starts at "Task3" start date');
    t.is(data.bars[0].totalAllocation, 100, '1st bar allocation is 100%');
    t.is(data.bars[0].allocationMS/3600000, 8, '1st bar allocation time is 8hrs');

    t.is(data.bars[1].startDate, new Date(2013, 3, 4, 9), '2nd bar starts when resource calendar for 4-Apr-2013 allows');
    t.is(data.bars[1].endDate, taskStore.getById(4).get('StartDate'), '2nd bar ends at "Task4" start date');
    t.is(data.bars[1].totalAllocation, 100, '2nd bar allocation is 100%');
    t.is(data.bars[1].allocationMS/3600000, 3, '2nd bar allocation time is 3hrs');

    t.is(data.bars[2].startDate, taskStore.getById(4).get('StartDate'), '2nd bar starts at "Task4" start date');
    t.is(data.bars[2].endDate, new Date(2013, 3, 6), '2nd bar ends at weekend start');
    t.is(data.bars[2].totalAllocation, 200, '2nd bar allocation is 200%');
    t.is(data.bars[2].allocationMS/3600000, 16, '2nd bar allocation time is 16hrs');

    t.is(data.bars[3].startDate, new Date(2013, 3, 8), '3rd bar starts right after weekend');
    t.is(data.bars[3].endDate, taskStore.getById(4).get('EndDate'), '3rd bar ends at "Task4" end date');
    t.is(data.bars[3].totalAllocation, 200, '3rd bar allocation is 200%');
    t.is(data.bars[3].allocationMS/3600000, 16, '3rd bar allocation time is 16hrs');

    t.is(data.bars[4].startDate, taskStore.getById(4).get('EndDate'), '4th bar starts at "Task4" end date');
    t.is(data.bars[4].endDate, taskStore.getById(3).get('EndDate'), '4th bar ends at "Task3" end date');
    t.is(data.bars[4].totalAllocation, 100, '4th bar allocation is 100%');
    t.is(data.bars[4].allocationMS/3600000, 8, '4th bar allocation time is 8hrs');

    t.diag('Check resource limits array');

    t.is(data.maxBars.length, 3, '3 lines found');

    t.is(data.maxBars[0].allocationMS/3600000, 8, '1st line allocation time is 8hrs');

    t.is(data.maxBars[1].startDate, new Date(2013, 3, 4, 9), '2nd line starts when resource calendar for 9-Apr-2013 allows');
    t.is(data.maxBars[1].allocationMS/3600000, 4, '2nd line allocation time is 4hrs');

    t.is(data.maxBars[2].startDate, new Date(2013, 3, 5, 8), '3rd line starts at 5-Apr-2013 working day start');
    t.is(data.maxBars[2].allocationMS/3600000, 8, '3rd line allocation time is 8hrs');
});
