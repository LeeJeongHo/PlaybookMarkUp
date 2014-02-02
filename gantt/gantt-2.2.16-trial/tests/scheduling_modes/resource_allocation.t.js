StartTest(function(t) {

    //======================================================================================================================================================================================================================================================
    t.diag('Setup');

    var dataSet             = t.getSampleDataSet1();

    var taskStore           = dataSet.taskStore;
    var resourceStore       = dataSet.resourceStore;

    var task1               = taskStore.getById(1);
    var resource1           = resourceStore.getById('Res1');
    var assignment1         = task1.getAssignmentFor(resource1);

    t.isDeeply(
        resource1.getAllocationInfo({
            startDate               : new Date(2011, 6, 1, 3, 0),
            endDate                 : new Date(2011, 6, 4, 21, 0),
            includeAllIntervals     : true
        }),
        [
            {
                startDate           : new Date(2011, 6, 1, 3, 0),
                endDate             : new Date(2011, 6, 1, 8, 0),

                totalAllocation     : 0,
                assignments         : [],
                assignmentsHash     : {},
                inResourceCalendar  : false,
                inTasksCalendar     : false,
                inTask              : 0
            },
            {
                startDate           : new Date(2011, 6, 1, 8, 0),
                endDate             : new Date(2011, 6, 1, 12, 0),

                totalAllocation     : 100,
                assignments         : [ assignment1 ],
                assignmentsHash     : { 1 : assignment1 },
                inResourceCalendar  : true,
                inTasksCalendar     : true,
                inTask              : 1
            },
            {
                startDate           : new Date(2011, 6, 1, 12, 0),
                endDate             : new Date(2011, 6, 1, 13, 0),

                totalAllocation     : 0,
                assignments         : [],
                assignmentsHash     : {},
                inResourceCalendar  : false,
                inTasksCalendar     : false,
                inTask              : 1
            },
            {
                startDate           : new Date(2011, 6, 1, 13, 0),
                endDate             : new Date(2011, 6, 1, 17, 0),

                totalAllocation     : 100,
                assignments         : [ assignment1 ],
                assignmentsHash     : { 1 : assignment1 },
                inResourceCalendar  : true,
                inTasksCalendar     : true,
                inTask              : 1
            },
            {
                startDate           : new Date(2011, 6, 1, 17, 0),
                endDate             : new Date(2011, 6, 4, 8, 0),

                totalAllocation     : 0,
                assignments         : [],
                assignmentsHash     : {},
                inResourceCalendar  : false,
                inTasksCalendar     : false,
                inTask              : 1
            },
            {
                startDate           : new Date(2011, 6, 4, 8, 0),
                endDate             : new Date(2011, 6, 4, 12, 0),

                totalAllocation     : 100,
                assignments         : [ assignment1 ],
                assignmentsHash     : { 1 : assignment1 },
                inResourceCalendar  : true,
                inTasksCalendar     : true,
                inTask              : 1
            },
            {
                startDate           : new Date(2011, 6, 4, 12, 0),
                endDate             : new Date(2011, 6, 4, 13, 0),

                totalAllocation     : 0,
                assignments         : [],
                assignmentsHash     : {},
                inResourceCalendar  : false,
                inTasksCalendar     : false,
                inTask              : 1
            },
            {
                startDate           : new Date(2011, 6, 4, 13, 0),
                endDate             : new Date(2011, 6, 4, 17, 0),

                totalAllocation     : 100,
                assignments         : [ assignment1 ],
                assignmentsHash     : { 1 : assignment1 },
                inResourceCalendar  : true,
                inTasksCalendar     : true,
                inTask              : 1
            },
            {
                startDate           : new Date(2011, 6, 4, 17, 0),
                endDate             : new Date(2011, 6, 4, 21, 0),

                totalAllocation     : 0,
                assignments         : [],
                assignmentsHash     : {},
                inResourceCalendar  : false,
                inTasksCalendar     : false,
                inTask              : 0
            }
        ],
        'Correct allocation information for Resource1 - with all intervals'
    );

    t.isDeeply(
        // total allocation w/o intervals out of resource availability
        resource1.getAllocationInfo({
            startDate               : new Date(2011, 6, 1, 3, 0),
            endDate                 : new Date(2011, 6, 4, 21, 0),
            includeAllIntervals     : false
        }),
        [
            {
                startDate       : new Date(2011, 6, 1, 8, 0),
                endDate         : new Date(2011, 6, 1, 12, 0),

                totalAllocation : 100,
                assignments     : [ assignment1 ],
                assignmentsHash : { 1 : assignment1 },
                inResourceCalendar  : true,
                inTasksCalendar     : true,
                inTask              : 1
            },
            {
                startDate       : new Date(2011, 6, 1, 13, 0),
                endDate         : new Date(2011, 6, 1, 17, 0),

                totalAllocation : 100,
                assignments     : [ assignment1 ],
                assignmentsHash : { 1 : assignment1 },
                inResourceCalendar  : true,
                inTasksCalendar     : true,
                inTask              : 1
            },
            {
                startDate       : new Date(2011, 6, 4, 8, 0),
                endDate         : new Date(2011, 6, 4, 12, 0),

                totalAllocation : 100,
                assignments     : [ assignment1 ],
                assignmentsHash : { 1 : assignment1 },
                inResourceCalendar  : true,
                inTasksCalendar     : true,
                inTask              : 1
            },
            {
                startDate       : new Date(2011, 6, 4, 13, 0),
                endDate         : new Date(2011, 6, 4, 17, 0),

                totalAllocation : 100,
                assignments     : [ assignment1 ],
                assignmentsHash : { 1 : assignment1 },
                inResourceCalendar  : true,
                inTasksCalendar     : true,
                inTask              : 1
            }
        ],
        'Correct allocation information for Resource1 - w/o any empty intervals'
    );




})
