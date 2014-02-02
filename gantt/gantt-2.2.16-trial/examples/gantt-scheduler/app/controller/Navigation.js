Ext.define("MyApp.controller.Navigation", {
    extend : 'Ext.app.Controller',

    views  : ['Navigation'],

    refs : [
        // This auto-generates a "getEmployeeScheduler" getter for this ComponentQuery selector
        // See http://docs.sencha.com/ext-js/4-1/#!/api/Ext.app.Controller-cfg-refs
        { ref : "mainContainer",    selector : '#maincontainer' },
        { ref : "gantt",            selector : 'gantt' },
        { ref : "settings",         selector : 'settings' }
    ],

    init : function() {
        this.control({
            'navigation button' : {
                click : this.onNavigationClick
            }
        });
    },

    onNavigationClick : function(btn) {
        var sched = this.getResourceScheduler();
        var gantt = this.getGantt();
        var resourceList = this.getResourceList();
        var settings = this.getSettings();
        var histogram = this.getHistogram();

        switch(btn.itemId) {
            case 'gantt':
                resourceList && resourceList.hide();
                sched && sched.hide();
                histogram && histogram.hide();

                gantt.show();
                break;

            case 'resourceschedule':
                resourceList && resourceList.hide();
                histogram && histogram.hide();

                sched.setVisible(btn.pressed);
                break;

            case 'resourcelist':
                sched && sched.hide();
                gantt.hide();
                histogram && histogram.hide();

                resourceList.show();
                break;

            case 'settings':
                settings && settings.setVisible(btn.pressed);

                break;

            case 'histogram':
                resourceList.hide();
                sched.hide();
                histogram.setVisible(btn.pressed);
                break;
        }
    },

    getResourceScheduler : function() {
        if (!this.scheduler) {
            var gantt = this.getGantt();

            this.scheduler = new MyApp.view.ResourceSchedule({
                resourceStore   : gantt.taskStore.resourceStore,
                eventStore      : gantt.taskStore,
                assignmentStore : gantt.assignmentStore,

                partnerTimelinePanel   : gantt,

                // Share non-working time visualization
                workingTimeStore : gantt.getWorkingTimePlugin().store
            });

            this.getMainContainer().add(this.scheduler);

            var ganttViewEl = gantt.getSchedulingView().el;
            var schedulerViewEl = this.scheduler.getSchedulingView().el;

            // Sync the scrolling
            schedulerViewEl.on('scroll', function(ev, el) { ganttViewEl.scrollTo('left', el.scrollLeft); });
            ganttViewEl.on('scroll', function(ev, el) { schedulerViewEl.scrollTo('left', el.scrollLeft); });

            gantt.on('zoomchange', function() {
                this.scheduler.normalGrid.scrollTask.cancel();
            }, this);
        }

        return this.scheduler;
    },

    getResourceList : function() {
        if (!this.resourceList) {
            var gantt = this.getGantt();

            this.resourceList = this.getMainContainer().add({
                xtype : 'resourcelist',
                store : gantt.resourceStore
            });

        }

        return this.resourceList;
    },

    getHistogram : function() {
        if (!this.histogram) {
            var gantt = this.getGantt();

            this.histogram = new MyApp.view.ResourceHistogram({
                partnerTimelinePanel    : gantt,
                resourceStore           : gantt.resourceStore,
                taskStore               : gantt.taskStore,
                assignmentStore         : gantt.assignmentStore
            });

            this.getMainContainer().add(this.histogram);
        }

        return this.histogram;
    }
});