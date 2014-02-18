Ext.ns('App');

Ext.Loader.setConfig({
    enabled        : true,
    disableCaching : true,
    paths          : {
        'Gnt'   : '../../js/Gnt',
        'Sch'   : '../../../ExtScheduler2.x/js/Sch',
        'MyApp' : './js'
    }
});

Ext.require([
    'MyApp.DemoGanttPanel'
]);

Ext.onReady(function () {
    App.Gantt.init();

    Ext.QuickTips.init();
});

App.Gantt = {

    // Initialize application
    init : function (serverCfg) {
        this.gantt = this.createGantt();

        var vp = Ext.create("Ext.Viewport", {
            layout : 'fit',
            items  : this.gantt
        });
    },

    createGantt : function () {

        Ext.define('MyTaskModel', {
            extend   : 'Gnt.model.Task',

            // A field in the dataset that will be added as a CSS class to each rendered task element
            clsField : 'TaskType',
            fields   : [
                { name : 'TaskType', type : 'string' },
                { name : 'Color', type : 'string'}
            ]
        });

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            model       : 'MyTaskModel',
            rootVisible : false,
            proxy       : {
                type : 'memory'
            },
            root        : {
                expanded : false
            }
        });

        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        });

        var resourceStore = Ext.create('Gnt.data.ResourceStore', {
            model : 'Gnt.model.Resource'
        });

        var assignmentStore = Ext.create('Gnt.data.AssignmentStore', {
            // Must pass a reference to resource store
            resourceStore : resourceStore
        });

        Ext.Ajax.request({
            url     : 'data/data.js',
            success : function (response) {
                var data = Ext.decode(response.responseText);

                dependencyStore.loadData(data.dependencies);
                assignmentStore.loadData(data.assignments);
                resourceStore.loadData(data.resources);
                taskStore.proxy.data = data.tasks;
                taskStore.load();
            }
        });

        var g = Ext.create("MyApp.DemoGanttPanel", {
            allowParentTaskMove : false,

            region          : 'center',
            rowHeight       : 26,
            selModel        : new Ext.selection.TreeModel({
                ignoreRightMouseSelection : false,
                mode                      : 'MULTI'
            }),
            taskStore       : taskStore,
            dependencyStore : dependencyStore,
            assignmentStore : assignmentStore,
            resourceStore   : resourceStore,

            //snapToIncrement : true,    // Uncomment this line to get snapping behavior for resizing/dragging.
            columnLines     : false,

            startDate : new Date(2010, 0, 11),
            endDate   : Sch.util.Date.add(new Date(2010, 0, 4), Sch.util.Date.WEEK, 20),

            viewPreset : 'weekAndDayLetter'
        });

        g.on({
            dependencydblclick : function (ga, rec) {
                var from = taskStore.getNodeById(rec.get('From')).get('Name'),
                    to = taskStore.getNodeById(rec.get('To')).get('Name');

                Ext.Msg.alert('Hey', Ext.String.format('You clicked the link between "{0}" and "{1}"', from, to));
            },
            timeheaderdblclick : function (col, start, end) {
                Ext.Msg.alert('Hey', 'You click header cell : ' + Ext.Date.format(start, 'Y-m-d') + ' - ' + Ext.Date.format(end, 'Y-m-d'));
            }
        });

        return g;
    }
};

