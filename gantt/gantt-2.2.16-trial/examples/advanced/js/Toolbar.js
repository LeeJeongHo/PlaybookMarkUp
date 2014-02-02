Ext.define("MyApp.Toolbar", {
    extend : "Ext.Toolbar",
    cls    : 'my-toolbar',

    gantt  : null,

    initComponent : function () {
        var gantt = this.gantt;

        gantt.taskStore.on({
            'filter-set'   : function () {
                this.down('[iconCls=icon-collapseall]').disable()
                this.down('[iconCls=icon-expandall]').disable()
            },
            'filter-clear' : function () {
                this.down('[iconCls=icon-collapseall]').enable()
                this.down('[iconCls=icon-expandall]').enable()
            },
            scope          : this
        })

        Ext.apply(this, {
            defaults : { scale : 'medium' },

            items : [
                {
                    tooltip  : 'Previous timespan',
                    iconCls : 'icon icon-left',
                    handler : function () {
                        gantt.shiftPrevious();
                    }
                },
                {
                    tooltip  : 'Next timespan',
                    iconCls : 'icon icon-right',
                    handler : function () {
                        gantt.shiftNext();
                    }
                },
                {
                    tooltip  : 'Collapse all',
                    iconCls : 'icon icon-collapseall',
                    handler : function () {
                        gantt.collapseAll();
                    }
                },

                {
                    tooltip  : 'Expand all',
                    iconCls : 'icon icon-expandall',
                    handler : function () {
                        gantt.expandAll();
                    }
                },
                {
                    tooltip  : 'Zoom out',
                    iconCls : 'icon icon-zoomout',
                    handler : function () {
                        gantt.zoomOut();
                    }
                },
                {
                    tooltip  : 'Zoom in',
                    iconCls : 'icon icon-zoomin',
                    handler : function () {
                        gantt.zoomIn();
                    }
                },
                {
                    tooltip      : 'Highlight critical path',
                    iconCls      : 'icon icon-criticalpath',
                    enableToggle : true,
                    handler      : function (btn) {
                        var v = gantt.getSchedulingView();
                        if (btn.pressed) {
                            v.highlightCriticalPaths(true);
                        } else {
                            v.unhighlightCriticalPaths(true);
                        }
                    }
                },
                {
                    tooltip      : 'Add Deliverable',
                    iconCls      : 'icon icon-add',
                    enableToggle : true,
                    handler      : function (btn) {
                        var task = gantt.taskStore.getRootNode().appendChild({
//                            Name : 'New Task',
                            leaf : true
                        });
                        gantt.getSchedulingView().scrollEventIntoView(task);
                        gantt.editingInterface.startEdit(task, 1);
                    }
                },
                {
                    tooltip      : 'Remove Deliverable(s)',
                    iconCls      : 'icon icon-delete',
                    enableToggle : true,
                    handler      : function (btn) {
                        gantt.getSelectionModel().selected.each(function(task) {
//                            task.remove();
//                        	 Ext.Msg.alert('Warning', 'Are you sure you want to delete?');
                        	Ext.MessageBox.show({
                                title: 'Warning',
                                msg: 'Are you sure you want to delete?',
                                icon: Ext.MessageBox.WARNING,
                                buttons: Ext.Msg.OK
                            });
                        })
                    }
                }
               
               
            ]
        });

        this.callParent(arguments);
    },

    applyPercentDone : function (value) {
        this.gantt.getSelectionModel().selected.each(function (task) {
            task.setPercentDone(value);
        });
    },

    showFullScreen : function () {
        this.gantt.el.down('.x-panel-body').dom[this._fullScreenFn]();
    },

    // Experimental, not X-browser
    _fullScreenFn  : (function () {
        var docElm = document.documentElement;

        if (docElm.requestFullscreen) {
            return "requestFullscreen";
        }
        else if (docElm.mozRequestFullScreen) {
            return "mozRequestFullScreen";
        }
        else if (docElm.webkitRequestFullScreen) {
            return "webkitRequestFullScreen";
        }
    })()
})
;
