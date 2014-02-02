Ext.require([
    'Gnt.panel.Gantt',
    'Sch.plugin.TreeCellEditing',
    'Gnt.column.PercentDone',
    'Gnt.column.StartDate',
    'Gnt.column.EndDate',
    'Gnt.column.ResourceAssignment',
    'Gnt.model.Assignment'
]);

Ext.define('MsProjectTask', {
    extend           : 'Gnt.model.Task',
    inclusiveEndDate : true,
    fields           : [
        {name : 'Milestone', type : 'boolean', defaultValue : 'false'}
    ],

    isMilestone : function () {
        return this.get('Milestone')
    }
});

Ext.onReady(function () {

    Ext.define('MSProjectImportPanel', {
        extend      : 'Ext.form.Panel',
        width       : 300,
        frame       : true,
        title       : 'Load data from MS Project',
        bodyPadding : '10 10 0',

        defaults      : {
            anchor     : '100%',
            allowBlank : false,
            msgTarget  : 'side',
            labelWidth : 50
        },
        initComponent : function () {
            this.addEvents('dataavailable');

            Ext.apply(this, {
                items   : [
                    {
                        xtype        : 'filefield',
                        id           : 'form-file',
                        emptyText    : 'Upload .mpp file',
                        fieldLabel   : 'File',
                        name         : 'mpp-file',
                        buttonText   : '',
                        buttonConfig : {
                            iconCls : 'upload-icon'
                        }
                    }
                ],
                buttons : [
                    {
                        text    : 'Load',
                        handler : function () {
                            var panel = this.up('form');
                            var form = panel.getForm();
                            if (form.isValid()) {
                                form.submit({
                                    url     : 'msp-load.php',
                                    waitMsg : 'Loading data...',
                                    failure : function (form, action) {
                                        msg('Import failed!', 'Please make sure the input data is valid. Error message: ' + action.result.msg);
                                    },
                                    success : function (form, action) {
                                        panel.fireEvent('dataavailable', panel, action.result.data);
                                    }
                                });
                            }
                        }
                    },
                    {
                        text    : 'Reset',
                        handler : function () {
                            this.up('form').getForm().reset();
                        }
                    }
                ]
            });

            this.callParent(arguments);
        }
    });

    var msg = function (title, msg) {
        Ext.Msg.show({
            title    : title,
            msg      : msg,
            minWidth : 200,
            modal    : true,
            icon     : Ext.Msg.INFO,
            buttons  : Ext.Msg.OK
        });
    };

    var resourceStore = Ext.create("Gnt.data.ResourceStore", {
        autoLoad : true,
        proxy    : {
            type : 'memory'
        }
    });

    var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        autoLoad : true,
        proxy    : {
            type : 'memory'
        }
    });

    var assignmentStore = Ext.create("Gnt.data.AssignmentStore", {
        autoLoad      : true,
        resourceStore : resourceStore,
        proxy         : {
            type : 'memory'
        }
    });

    var taskStore = Ext.create("Gnt.data.TaskStore", {
        model : 'MsProjectTask',
        proxy : {
            type : 'memory'
        },
        root  : {
            children : [
                { Name : 'Hello World', StartDate : new Date(2012, 4, 1), EndDate : new Date(2012, 4, 3), leaf : true}
            ]
        }
    });

    var g = Ext.create('Gnt.panel.Gantt', {
        height           : ExampleDefaults.height,
        width            : ExampleDefaults.width,
        renderTo         : 'example-container',
        resourceStore    : resourceStore,
        assignmentStore  : assignmentStore,
        taskStore        : taskStore,
        dependencyStore  : dependencyStore,
        stripeRows       : true,
        lockedGridConfig : {
            width : 300
        },

        leftLabelField    : {
            dataIndex : 'Name',
            editor    : { xtype : 'textfield' }
        },
        highlightWeekends : true,
        showTodayLine     : true,
        loadMask          : true,
        startDate         : new Date(2012, 4, 1),
        endDate           : Sch.util.Date.add(new Date(2012, 4, 1), Sch.util.Date.WEEK, 20),
        viewPreset        : 'weekAndDayLetter',

        //static column that will be removed when columns from mpp file are loaded
        columns           : [
            {
                xtype     : 'namecolumn',
                width     : 200
            }
        ],
        tbar              : [
            new MSProjectImportPanel({
                listeners : {
                    dataavailable : function (form, data) {
                        msg('Success', 'Data from .mpp file loaded ');

                        g.resourceStore.loadData(data.resources);
                        g.assignmentStore.loadData(data.assignments);
                        g.dependencyStore.loadData(data.dependencies);
                        g.taskStore.setRootNode(data.tasks);

                        g.lockedGrid.reconfigure(g.lockedGrid.getStore(), data.columns);

                        g.expandAll();

                        var span = g.taskStore.getTotalTimeSpan();
                        if (span.start && span.end) {
                            g.setTimeSpan(span.start, span.end);
                        }
                    }
                }
            })
        ]
    });
});
