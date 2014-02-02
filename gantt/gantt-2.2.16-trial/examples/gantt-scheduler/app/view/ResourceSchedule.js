Ext.define("MyApp.view.ResourceSchedule", {
    extend                  : 'Sch.panel.SchedulerGrid',
    alias                   : 'widget.resourceschedule',
    title                   : 'RESOURCE SCHEDULE',
    flex                    : 1,
    layout                  : 'border',
    hidden                  : true,

    // Use the same layout and appearance as the Gantt chart
    lockedGridConfig        : { width : 300, region : 'west'},
    viewConfig              : { preserveScrollOnRefresh : true },

    // Scheduler configs
    viewPreset              : 'weekAndDayLetter',
    enableDragCreation      : false,
    barMargin               : 5,
    rowHeight               : 30,
    assignmentStore         : null,
    workingTimeStore        : null,

    initComponent : function() {
        Ext.apply(this, {
            features : [{
                groupHeaderTpl: '{name}',
                ftype : 'grouping'
            }],
            plugins : [
                new Sch.plugin.TreeCellEditing({ }),

                // Reuse store for weekend highlighting
                new Sch.plugin.Zones({
                    store : this.workingTimeStore
                })
            ],
            columns                 : [
                { text : 'Name', flex:1, dataIndex : 'Name', editor : { xtype : 'textfield' }}
            ]
        });

        // Since the scheduler doesn't (yet) know of assignments, give it some help
        this.assignmentStore.on({
            update  : this.fullRefresh,
            load    : this.fullRefresh,
            add     : this.fullRefresh,
            remove  : this.fullRefresh,
            refresh : this.fullRefresh,
            scope   : this,
            buffer  : 1
        });

        this.callParent(arguments);
    },

    fullRefresh : function() {
        this.getSchedulingView().refresh();
    }
});