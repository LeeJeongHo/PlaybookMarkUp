StartTest(function(t) {

    // #882: Checks for correct calculation of width of the last resource line segment after zooming
    // #908: Checks that 0th and last limit lines have left and right points equal to total view time span points coordinates

    var calendar    = t.getBusinessTimeCalendar({
        calendarId  : "custom",
        data        : [
            {
                Date            : new Date(2010, 1, 11),
                IsWorkingDay    : true,
                Availability    : [ "08:00-12:00" ]
            },
            {
                Date            : new Date(2010, 1, 12),
                IsWorkingDay    : true,
                Availability    : [ "08:00-09:00" ]
            }
        ]
    });

    var resourceStore   = t.getResourceStore({
        data: [
            { Id: "r1", Name: "Mike", CalendarId: "custom" },
            { Id: "r2", Name: "Linda" },
            { Id: "r3", Name: "Don" }
        ]
    });

    var assignmentStore = t.getAssignmentStore({
        data: [
            { Id: "a1", ResourceId: "r1", TaskId : 117, Units : 50 }
        ]
    });

    var dependencyStore = t.getDependencyStore();

    var taskStore = t.getTaskStore({
        cascadeChanges  : false,
        resourceStore   : resourceStore,
        assignmentStore : assignmentStore,
        dependencyStore : dependencyStore,
        DATA            : [
            {
                leaf            : true,
                Id              : 117,
                StartDate       : "2010-02-03T00:00:00",
                Name            : "New task 1",
                Duration        : 6,
                SchedulingMode  : "FixedDuration"
            }
        ]
    });

    var histogram = new Gnt.panel.ResourceHistogram({
        taskStore           : taskStore,
        resourceStore       : resourceStore,
        assignmentStore     : assignmentStore,
        startDate           : new Date(2010, 1, 1),
        endDate             : new Date(2010, 1, 22),
        rowHeight           : 50,
        scaleMin            : 0,
        scaleMax            : 8,
        scaleStep           : 5,
        scaleLabelStep      : 5,
        width               : 800,
        height              : 400,
        renderTo            : Ext.getBody()
    });

    var view = histogram.getView().normalView;

    var data = histogram.allocationData.r1;

    t.waitForEvent(view, "viewready", function () {

        histogram.zoomToSpan({
            start       : histogram.getStart(),
            end         : new Date(2010, 1, 16)
        }, {
            adjustStart : 0,
            adjustEnd   : 0
        });

        var lines = view.prepareLimitLines(histogram, data.maxBars);

        t.is(lines.length, 4, "4 lines");

        t.ok(lines[3].width > 0, "width of last is greater than zero");

        t.is(lines[0].left, 0, "Start of 0th segment is histogram time span start");
        t.is(lines[3].left + lines[3].width, histogram.getSchedulingView().getXFromDate(histogram.getEnd(), true), "End of 3rd segment is histogram time span end");
    });

});
