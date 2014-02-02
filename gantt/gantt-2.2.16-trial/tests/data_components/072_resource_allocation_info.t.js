StartTest(function(t) {

    var resourceStore   = t.getResourceStore({
        data: [
            { Id: 'r1', Name: 'Mike' },
            { Id: 'r2', Name: 'Linda' }
        ]
    });

    var assignmentStore = t.getAssignmentStore({
        data: [
            { Id: 'a1', ResourceId: 'r1', TaskId : 1, Units : 50 },
            { Id: 'a2', ResourceId: 'r1', TaskId : 2, Units : 20 },
            { Id: 'a3', ResourceId: 'r2', TaskId : 1, Units : 30 },
        ]
    });

    var taskStore = t.getTaskStore({
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore,
        //cascadeChanges  : true,
        DATA            : [
            {
                Id              : 1,
                leaf            : true,
                StartDate       : new Date(2010, 0, 18),
                Duration        : 8
            },
            {
                Id              : 2,
                leaf            : true,
                StartDate       : new Date(2010, 0, 18),
                Duration        : 3
            }
        ]
    });

    var allocationInfo = resourceStore.getById('r1').getAllocationInfo({
        startDate   : taskStore.getTotalTimeSpan().start,
        endDate     : taskStore.getTotalTimeSpan().end
    });

    t.it('Check resource r1 allocation report', function (t) {
        t.is(allocationInfo.length, 8, 'Length is correct');

        t.is(allocationInfo[0].startDate, new Date(2010, 0, 18), '0: start date is correct');
        t.is(allocationInfo[0].endDate, new Date(2010, 0, 19), '0: end date is correct');
        t.is(allocationInfo[0].totalAllocation, 70, '0: allocation % is correct');

        t.is(allocationInfo[1].startDate, new Date(2010, 0, 19), '1: start date is correct');
        t.is(allocationInfo[1].endDate, new Date(2010, 0, 20), '1: end date is correct');
        t.is(allocationInfo[1].totalAllocation, 70, '1: allocation % is correct');

        t.is(allocationInfo[2].startDate, new Date(2010, 0, 20), '2: start date is correct');
        t.is(allocationInfo[2].endDate, new Date(2010, 0, 21), '2: end date is correct');
        t.is(allocationInfo[2].totalAllocation, 70, '2: allocation % is correct');

        t.is(allocationInfo[3].startDate, new Date(2010, 0, 21), '3: start date is correct');
        t.is(allocationInfo[3].endDate, new Date(2010, 0, 22), '3: end date is correct');
        t.is(allocationInfo[3].totalAllocation, 50, '3: allocation % is correct');

        t.is(allocationInfo[4].startDate, new Date(2010, 0, 22), '4: start date is correct');
        t.is(allocationInfo[4].endDate, new Date(2010, 0, 23), '4: end date is correct');
        t.is(allocationInfo[4].totalAllocation, 50, '4: allocation % is correct');

        t.is(allocationInfo[5].startDate, new Date(2010, 0, 25), '5: start date is correct');
        t.is(allocationInfo[5].endDate, new Date(2010, 0, 26), '5: end date is correct');
        t.is(allocationInfo[5].totalAllocation, 50, '5: allocation % is correct');

        t.is(allocationInfo[6].startDate, new Date(2010, 0, 26), '6: start date is correct');
        t.is(allocationInfo[6].endDate, new Date(2010, 0, 27), '6: end date is correct');
        t.is(allocationInfo[6].totalAllocation, 50, '6: allocation % is correct');

        t.is(allocationInfo[7].startDate, new Date(2010, 0, 27), '7: start date is correct');
        t.is(allocationInfo[7].endDate, new Date(2010, 0, 28), '7: end date is correct');
        t.is(allocationInfo[7].totalAllocation, 50, '7: allocation % is correct');
    });

    t.it('Check resource r2 allocation report', function (t) {
        allocationInfo = resourceStore.getById('r2').getAllocationInfo({
            startDate   : taskStore.getTotalTimeSpan().start,
            endDate     : taskStore.getTotalTimeSpan().end
        });

        t.is(allocationInfo.length, 8, 'Length is correct');

        t.is(allocationInfo[0].startDate, new Date(2010, 0, 18), '0: start date is correct');
        t.is(allocationInfo[0].endDate, new Date(2010, 0, 19), '0: end date is correct');
        t.is(allocationInfo[0].totalAllocation, 30, '0: allocation % is correct');

        t.is(allocationInfo[1].startDate, new Date(2010, 0, 19), '1: start date is correct');
        t.is(allocationInfo[1].endDate, new Date(2010, 0, 20), '1: end date is correct');
        t.is(allocationInfo[1].totalAllocation, 30, '1: allocation % is correct');

        t.is(allocationInfo[2].startDate, new Date(2010, 0, 20), '2: start date is correct');
        t.is(allocationInfo[2].endDate, new Date(2010, 0, 21), '2: end date is correct');
        t.is(allocationInfo[2].totalAllocation, 30, '2: allocation % is correct');

        t.is(allocationInfo[3].startDate, new Date(2010, 0, 21), '3: start date is correct');
        t.is(allocationInfo[3].endDate, new Date(2010, 0, 22), '3: end date is correct');
        t.is(allocationInfo[3].totalAllocation, 30, '3: allocation % is correct');

        t.is(allocationInfo[4].startDate, new Date(2010, 0, 22), '4: start date is correct');
        t.is(allocationInfo[4].endDate, new Date(2010, 0, 23), '4: end date is correct');
        t.is(allocationInfo[4].totalAllocation, 30, '4: allocation % is correct');

        t.is(allocationInfo[5].startDate, new Date(2010, 0, 25), '5: start date is correct');
        t.is(allocationInfo[5].endDate, new Date(2010, 0, 26), '5: end date is correct');
        t.is(allocationInfo[5].totalAllocation, 30, '5: allocation % is correct');

        t.is(allocationInfo[6].startDate, new Date(2010, 0, 26), '6: start date is correct');
        t.is(allocationInfo[6].endDate, new Date(2010, 0, 27), '6: end date is correct');
        t.is(allocationInfo[6].totalAllocation, 30, '6: allocation % is correct');

        t.is(allocationInfo[7].startDate, new Date(2010, 0, 27), '7: start date is correct');
        t.is(allocationInfo[7].endDate, new Date(2010, 0, 28), '7: end date is correct');
        t.is(allocationInfo[7].totalAllocation, 30, '7: allocation % is correct');
    });

});
