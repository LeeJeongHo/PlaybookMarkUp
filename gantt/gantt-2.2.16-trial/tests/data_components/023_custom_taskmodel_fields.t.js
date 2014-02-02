StartTest(function (t) {
    t.expectGlobals('MyTask', 'TaskNoBaseline', 'TaskBaselineImplicit');

    Ext.define('MyTask', {
        extend: 'Gnt.model.Task',
        nameField : 'MyName',
        startDateField : 'MyStartDate',
        endDateField : 'MyEndDate',
        percentDoneField : 'Foo',
        baselineStartDateField : 'baseStart',
        baselineEndDateField : 'baseEnd',
        baselinePercentDoneField : 'basePercent',
        clsField : 'fooCls',
        fields: [
            // Should be ok for implementor to define their own fields with 'our' default names.
            {name : 'StartDate', type : 'bool'},
            {name : 'EndDate', type : 'bool'},

            {name : 'MyStartDate', type : 'date', dateFormat : 'Y-m-d'},
            {name : 'MyEndDate', type : 'date', dateFormat : 'Y-m-d'},
            {name : 'baseStart', type : 'date', dateFormat : 'Y-m-d'},
            {name : 'baseEnd', type : 'date', dateFormat : 'Y-m-d'},
            'basePercent',
            'MyName',
            'Foo',
            'fooCls'
        ]
    });
    var taskStore = Ext.create('Gnt.data.TaskStore', {
       proxy: {
            type: 'memory',
            reader: {
                type: 'json'
            },

            data: [ { "leaf": true, "Id": 1, "MyStartDate": "2010-01-01", "MyEndDate": "2010-01-11", "baseStart": "2010-11-01", "baseEnd": "2010-11-11","MyName" : 'Bar', 'Foo' : 20, 'fooCls' : "test", basePercent : 100}]
        },

        root: {
            Id          : 'Root',
            loaded      : true,
            expanded    : true
        },
        model: 'MyTask'
    });
    taskStore.load();

    var task = taskStore.getRootNode().firstChild;

    t.isDateEqual(task.getStartDate(), new Date(2010,0,1), "Read start date ok");
    t.isDateEqual(task.getEndDate(), new Date(2010,0,11), "Read end date ok");

    t.is(task.getPercentDone(), 20, "getPercentDone works ok");
    t.is(task.getName(), "Bar", "getName works ok");
    t.is(task.getCls(), "test", "getCls works ok");
    
    t.is(task.getBaselineStartDate(), new Date(2010,10,1), "getBaselineStartDate works ok");
    t.is(task.getBaselineEndDate(), new Date(2010,10,11), "getBaselineEndDate works ok");
    t.is(task.getBaselinePercentDone(), 100, "getBaselinePercentDone works ok");

    t.ok(task.fields.getByKey('StartDate'), 'StartDate found in event Model fields');
    t.ok(task.fields.getByKey('EndDate'), 'EndDate found in event Model fields');
    
    Ext.define('TaskNoBaseline', {
        extend: 'Gnt.model.Task',
        fields: [
            {name : 'asf' }
        ]
    });
    task = new TaskNoBaseline({ asf : 'qwerty' });

    t.is(task.get('asf'), 'qwerty', 'Read new field ok');

    Ext.define('TaskBaselineImplicit', {
        extend: 'Gnt.model.Task',
        baselineStartDateField : 'BaselineStartDate',
        baselineEndDateField : 'BaselineEndDate',
        baselinePercentDoneField : 'BaselinePercentDone'
    });
    task = new TaskBaselineImplicit({ BaselineStartDate : new Date(2010, 1, 1), BaselinePercentDone : 11, BaselineEndDate : new Date(2011, 1, 1) });
    t.ok(task.fields.getByKey('BaselineStartDate'), 'BaselineEndDate found in event Model fields');
    t.ok(task.fields.getByKey('BaselineEndDate'), 'BaselineEndDate found in event Model fields');
    t.ok(task.fields.getByKey('BaselinePercentDone'), 'BaselinePercentDone found in event Model fields');
    t.is(task.getBaselineStartDate(), new Date(2010, 1, 1), 'getBaselineStartDate works ok');
    t.is(task.getBaselineEndDate(), new Date(2011, 1, 1), 'getBaselineEndDate works ok');
    t.is(task.getBaselinePercentDone(), 11, 'getBaselinePercentDone works ok');
})    
