Ext.define("App.view.GanttPanel", {
    extend : "Gnt.panel.Gantt",

    requires : [
        'App.model.Dependency',
        'App.model.Task',
        'App.store.Task',
        'App.store.Dependency',
        'App.store.Assignment'
    ],

    leftLabelField: 'Name',
    loadMask: true,
    multiSelect: true,
    cascadeChanges: true,
    viewPreset: 'weekAndDayLetter',

    initComponent : function() {
        var combo = new Ext.form.ComboBox({
            store       : new Ext.data.ArrayStore({
                id      : 0,
                fields  : [
                    'Id',
                    'displayText'
                ],
                data    : [[0, 'Low'], [1, 'Normal'], [2, 'High']]
            }),
            triggerAction   : 'all',
            mode            : 'local',
            valueField      : 'Id',
            displayField    : 'displayText'
        });

        var assignmentEditor = Ext.create('Gnt.widget.AssignmentCellEditor', {
            assignmentStore: this.assignmentStore,
            resourceStore: this.resourceStore
        });

        var g = this;

        Ext.apply(this, {
            // Add some extra functionality
            plugins: [
                Ext.create("Gnt.plugin.TaskContextMenu"),
                Ext.create('Sch.plugin.TreeCellEditing', {
                    clicksToEdit: 1,
                    listeners: {
                        edit: function () {
                            g.assignmentStore.sync();
                        }
                    }
                })
            ],

            layout: 'border',

            lockedGridConfig: {
                width   : 250,
                split   : true,
                region  : 'west'
            },

            schedulerConfig: {
                region  : 'center'
            },

            lockedViewConfig: {
                plugins: {
                    ptype: 'treeviewdragdrop'
                }
            },
            tooltipTpl: new Ext.XTemplate(
                '<h4 class="tipHeader">{Name}</h4>',
                '<table class="taskTip">',
                    '<tr><td>Start:</td> <td align="right">{[values._record.getDisplayStartDate("y-m-d")]}</td></tr>',
                    '<tr><td>End:</td> <td align="right">{[values._record.getDisplayEndDate("y-m-d")]}</td></tr>',
                    '<tr><td>Progress:</td><td align="right">{PercentDone}%</td></tr>',
                '</table>'
            ).compile(),

            // Setup your static columns
            columns: [
                { text : 'Id', dataIndex : 'Id', width: 40 },
                new Gnt.column.WBS(),
                {
                    xtype   : 'namecolumn',
                    width   : 150
                },
                new Gnt.column.StartDate(),
                new Gnt.column.Duration(),
                new Gnt.column.PercentDone(),
                {
                    text        : 'Priority',
                    width       : 50,
                    dataIndex   : 'Priority',
                    renderer    : function (v, m, r) {
                        switch (v) {
                            case TaskPriority.Low:
                                return 'Low';

                            case TaskPriority.Normal:
                                return 'Normal';

                            case TaskPriority.High:
                                return 'High';
                        }
                    },
                    editor      : combo
                },
                {
                    xtype       : 'booleancolumn',
                    width       : 50,

                    header      : 'Manual',

                    dataIndex   : 'ManuallyScheduled',

                    editor      : {
                        xtype: 'combo',
                        store: ['true', 'false']
                    }
                },
                {
                    header: 'Assigned Resources',
                    width: 150,
                    editor: assignmentEditor,
                    xtype: 'resourceassignmentcolumn'
                }
            ],
            tbar: [
                {
                    text: 'Indent',
                    handler: function () {
                        g.taskStore.indent(g.getSelectionModel().getSelection());
                    }
                },
                {
                    text: 'Outdent',
                    handler: function () {
                        g.taskStore.outdent(g.getSelectionModel().getSelection());
                    }
                },
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
                    iconCls: 'zoomfit',
                    handler: function () {
                        g.zoomToFit();
                    }
                }
            ]
        });

        this.callParent(arguments);
    },

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
    }
});
