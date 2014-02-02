Ext.onReady(function() {
    Ext.QuickTips.init();

    App.init();
});

TaskPriority = {
    Low : 0,
    Normal : 1,
    High : 2
};

App = {

    // Initialize application
    init: function () {
        Ext.define("TaskModel", {
            extend : "Gnt.model.Task",

            // Some custom field definitions
            fields : [
                { name: 'Id', type: 'int', useNull : true},
                { name: 'StartDate', type: 'date', dateFormat: 'MS' },
                { name: 'EndDate', type: 'date', dateFormat: 'MS' },
                { name: 'Priority', defaultValue : 1 },

                // Override some NodeInterface defaults
                { name: 'index', type : 'int', persist : true },
                { name: 'expanded', type: 'bool', defaultValue: true, persist: false}
            ]
        });

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            model: 'TaskModel',

            proxy       : {
                type : 'ajax',
                headers : { "Content-Type" : 'application/json' },
                api: {
                    read:       'webservices/Tasks.asmx/Get',
                    create:     'webservices/Tasks.asmx/Create',
                    destroy:    'webservices/Tasks.asmx/Delete',
                    update:     'webservices/Tasks.asmx/Update'
                },
                writer : {
                    type : 'json',
                    root : 'jsonData',
                    encode : false,
                    allowSingle : false
                },
                reader : {
                    type : 'json',
                    root: function (o) {
                        if (o.d) {
                            return o.d;
                        } else {
                            return o.children;
                        }
                    }
                }
            }
        });

        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            autoLoad : true,
            autoSync : true,
            proxy: {
                type : 'ajax',
                headers : { "Content-Type" : 'application/json' },
                method: 'GET',
                reader: {
                    root: 'd',
                    type : 'json'
                },
                writer : {
                    root: 'jsonData',
                    type : 'json',
                    encode : false,
                    allowSingle : false
                },
                api: {
                    read : 'webservices/Dependencies.asmx/Get',
                    create: 'webservices/Dependencies.asmx/Create',
                    destroy: 'webservices/Dependencies.asmx/Delete'
                }
            }
        });


        var start   = new Date(2010, 1, 1),
            end     = Sch.util.Date.add(start, Sch.util.Date.MONTH, 10);


        var g = Ext.create("Gnt.panel.Gantt", {
            height: 500,
            width: 1000,
            renderTo: Ext.getBody(),
            leftLabelField: 'Name',
            loadMask: true,
            startDate: start,
            endDate: end,
            multiSelect : true,
            cascadeChanges : true,
            viewPreset: 'weekAndDayLetter',
            // Add some extra functionality
            plugins : [
                Ext.create("Gnt.plugin.TaskContextMenu"),
                Ext.create('Sch.plugin.TreeCellEditing', {
                    clicksToEdit: 1
                })
            ],
            eventRenderer: function (task) {
                var prioCls;
                switch (task.get('Priority')) {
                    case TaskPriority.Low:
                        prioCls = 'sch-gantt-prio-low';
                        break;

                    case TaskPriority.Normal:
                        prioCls = 'sch-gantt-prio-normal';
                        break;

                    case TaskPriority.High:
                        prioCls = 'sch-gantt-prio-high';
                        break;
                }

                return {
                    cls: prioCls
                };
            },

            // Setup your static columns
            columns: [
               new Gnt.column.WBS({ width : 100 }),
               {
                   xtype : 'namecolumn',
                   width : 150
               },
               new Gnt.column.StartDate(),
               new Gnt.column.Duration(),
               new Gnt.column.PercentDone(),
               {
                   header       : 'Priority',
                   width        : 50,
                   dataIndex    : 'Priority',
                   renderer     : function (v, m, r) {
                       switch (v) {
                           case TaskPriority.Low:
                               return 'Low';

                           case TaskPriority.Normal:
                               return 'Normal';

                           case TaskPriority.High:
                               return 'High';
                       }
                   }
               },
               {
                    xtype       : 'booleancolumn',
                    width       : 50,

                    header      : 'Manual',

                    dataIndex   : 'ManuallyScheduled',

                    field       : {
                        xtype   : 'combo',
                        store   : [ 'true', 'false' ]
                    }
               }
            ],
            taskStore: taskStore,
            dependencyStore: dependencyStore,
            tooltipTpl: new Ext.XTemplate(
                '<h4 class="tipHeader">{Name}</h4>',
                '<table class="taskTip">',
                    '<tr><td>Start:</td> <td align="right">{[values._record.getDisplayStartDate("y-m-d")]}</td></tr>',
                    '<tr><td>End:</td> <td align="right">{[values._record.getDisplayEndDate("y-m-d")]}</td></tr>',
                    '<tr><td>Progress:</td><td align="right">{PercentDone}%</td></tr>',
                '</table>'
            ).compile(),

            tbar: [
                {
                    text: 'Collapse all',
                    iconCls: 'icon-collapseall',
                    handler: function () {
                        g.collapseAll();
                    }
                },
                 {
                     text: 'Expand all',
                     iconCls: 'icon-expandall',
                     handler: function () {
                         g.expandAll();
                     }
                 },
                {
                    text: 'Zoom to fit',
                    iconCls: 'icon-zoomtofit',
                    handler: function () {
                        g.zoomToFit();
                    }
                },
                {
                    text: 'Save',
                    iconCls: 'icon-save',
                    handler: function () {
                        taskStore.sync();
                    }
                }
            ]
        });
    }
};
