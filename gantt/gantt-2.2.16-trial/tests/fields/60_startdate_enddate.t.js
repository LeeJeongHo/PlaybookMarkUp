StartTest(function(t) {

    var taskStore           = t.getTaskStore();

    var milestone           = new Gnt.model.Task({
        StartDate       : new Date(2013, 1, 26),
        EndDate         : new Date(2013, 1, 26),
        Duration        : 0
    });

    var notMilestone        = new Gnt.model.Task({
        StartDate       : new Date(2013, 1, 26),
        EndDate         : new Date(2013, 1, 28)
    });

    var startDateField      = new Gnt.field.StartDate({
        task                : milestone,
        taskStore           : taskStore,
        adjustMilestones    : true,
        format              : 'Y-m-d',
        fieldLabel          : 'Start Date',
        renderTo            : Ext.getBody()
    });

    var endDateField      = new Gnt.field.EndDate({
        task                : milestone,
        taskStore           : taskStore,
        adjustMilestones    : true,
        format              : 'Y-m-d',
        fieldLabel          : 'End Date',
        renderTo            : Ext.getBody()
    });

    var checkMilestoneDates = function (field, visibleDate, internalDate) {
        var visibleDateStr  = Ext.Date.format(visibleDate, 'Y-m-d');
        var internalDateStr = Ext.Date.format(internalDate, 'Y-m-d');
        var label           = field.fieldLabel || '';

        t.is(field.getValue(), internalDate, label+' getValue() returns '+internalDateStr);
        t.is(field.getRawValue(), visibleDateStr, label+' getRawValue() returns '+visibleDateStr);
        t.is(field.task.getStartDate(), internalDate, label+' task.getStartDate() returns '+internalDateStr);
        t.is(field.task.getEndDate(), internalDate, label+' task.getEndDate() returns '+internalDateStr);
    };

    var checkNotMilestoneDates = function (field, visibleDate, internalDate, oppositeDate) {
        var visibleDateStr  = Ext.Date.format(visibleDate, 'Y-m-d');
        var internalDateStr = Ext.Date.format(internalDate, 'Y-m-d');
        var oppositeDateStr = Ext.Date.format(oppositeDate, 'Y-m-d');
        var label           = field.fieldLabel || '';

        t.is(field.getValue(), internalDate, label+' getValue() returns '+internalDateStr);
        t.is(field.getRawValue(), visibleDateStr, label+' getRawValue() returns '+visibleDateStr);
        if (field instanceof Gnt.field.StartDate) {
            t.is(field.task.getStartDate(), internalDate, label+' task.getStartDate() returns '+internalDateStr);
            t.is(field.task.getEndDate(), oppositeDate, label+' task.getEndDate() returns '+oppositeDateStr);
        } else {
            t.is(field.task.getEndDate(), internalDate, label+' task.getEndDate() returns '+internalDateStr);
            t.is(field.task.getStartDate(), oppositeDate, label+' task.getStartDate() returns '+oppositeDateStr);
        }
    };

    t.diag('Milestone task tests');

    t.chain(
        {
            action      : 'click',
            target      : function () { return startDateField.el.down('.x-form-date-trigger'); }
        },
        {
            action      : 'click',
            target      : function () { return startDateField.picker.el.down('td[title="February 07, 2013"]'); }
        },
        function (next) {
            t.diag('Picked 2013-02-07 as Start Date');
            checkMilestoneDates(startDateField, new Date(2013, 1, 7),  new Date(2013, 1, 8));
            t.diag('Check if End Date received the same values');
            checkMilestoneDates(endDateField, new Date(2013, 1, 7),  new Date(2013, 1, 8));

            next();
        },
        {
            action      : 'click',
            target      : function () { return endDateField.el.down('.x-form-date-trigger'); }
        },
        {
            action      : 'click',
            target      : function () { return endDateField.picker.el.down('td[title="February 03, 2013"]'); }
        },
        function (next) {
            t.diag('Picked 2013-02-03 (enter end date before start date)');
            checkMilestoneDates(startDateField, new Date(2013, 1, 7),  new Date(2013, 1, 8));
            checkMilestoneDates(endDateField, new Date(2013, 1, 3),  new Date(2013, 1, 8));
            t.notOk(endDateField.isValid(), 'End Date became invalid.');

            next();
        },
        {
            action      : 'click',
            target      : function () { return endDateField.el.down('.x-form-date-trigger'); }
        },
        function (next) {
            t.diag('Ensure that invalid date didn`t affect real data');
            t.is(endDateField.picker.getValue(), new Date(2013, 1, 3), 'Picker shows invalid date 2013-02-03');
            checkMilestoneDates(startDateField, new Date(2013, 1, 7),  new Date(2013, 1, 8));
            checkMilestoneDates(endDateField, new Date(2013, 1, 3),  new Date(2013, 1, 8));

            next();
        },
        {
            action      : 'click',
            target      : function () { return endDateField.picker.el.down('td[title="February 12, 2013"]'); }
        },
        function (next) {
            t.diag('Picked 2013-02-12');
            checkNotMilestoneDates(startDateField, new Date(2013, 1, 8),  new Date(2013, 1, 8), new Date(2013, 1, 13));
            checkNotMilestoneDates(endDateField, new Date(2013, 1, 12),  new Date(2013, 1, 13), new Date(2013, 1, 8));
            t.ok(endDateField.isValid(), 'End Date is valid again.');

            next();
        }
    );
});
