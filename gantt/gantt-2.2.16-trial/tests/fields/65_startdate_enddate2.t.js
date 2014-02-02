StartTest(function(t) {

    // test for ticket #814, field should match values using altFomats config

    var taskStore           = t.getTaskStore();

    var startDateField      = new Gnt.field.StartDate({
        task                : taskStore.getById(117),
        taskStore           : taskStore,
        adjustMilestones    : true,
        fieldLabel          : 'Start Date',
        renderTo            : Ext.getBody()
    });

    var endDateField      = new Gnt.field.EndDate({
        task                : taskStore.getById(117),
        taskStore           : taskStore,
        adjustMilestones    : true,
        fieldLabel          : 'End Date',
        renderTo            : Ext.getBody()
    });

    t.is(startDateField.getVisibleValue(), new Date(2010, 1, 3), 'Initial start date value is correct');
    t.is(endDateField.getVisibleValue(), new Date(2010, 1, 10), 'Initial end date value is correct');

    t.chain(
        function (next) {
            t.diag("Type 2/3/2010 to start date");
            startDateField.getFocusEl().dom.value = '';
            t.type(startDateField, '2/3/2010', function () {
                startDateField.beforeBlur();
                t.is(startDateField.getVisibleValue(), new Date(2010, 1, 3), 'Start date value is correct');
                next();
            });
        },
        function (next) {
            t.diag("Type 2/10/2010 to end date");
            endDateField.getFocusEl().dom.value = '';
            t.type(endDateField, '2/10/2010', function () {
                endDateField.beforeBlur();
                t.is(endDateField.getVisibleValue(), new Date(2010, 1, 10), 'End date value is correct');
                next();
            });
        }
    );
});
