StartTest(function (t) {
    function getDataSet1() {
        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            proxy       : {
                type    : 'memory',
                reader  : {
                    type    : 'json'
                }
            },

            data    : [
                {
                    From        : 1,
                    To          : 2,
                    Type        : 2
                }
            ]
        });


        var taskStore = Ext.create("Gnt.data.TaskStore", {
            root        : {
                children    : [
                    {
                        Id          : 1,
                        leaf        : true,
                        StartDate   : new Date(2011, 6, 1),
                        EndDate     : new Date(2011, 6, 5)
                    },
                    {
                        Id          : 2,
                        leaf        : true,
                        StartDate   : new Date(2011, 6, 5),
                        EndDate     : new Date(2011, 6, 20)
                    }
                ]
            }
        });

        return { taskStore : taskStore, dependencyStore: dependencyStore };
    }

    function getDataSet2() {
        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            proxy       : {
                type    : 'memory',
                reader  : {
                    type    : 'json'
                }
            },

            data    : [
                {
                    From        : 1,
                    To          : 2,
                    Type        : 2
                }
            ]
        });


        var taskStore = Ext.create("Gnt.data.TaskStore", {
            root        : {
                children    : [
                    {
                        Id          : 1,
                        collapsed   : true,
                        StartDate   : new Date(2011, 6, 1),
                        EndDate     : new Date(2011, 6, 5),
                        children    : [
                            {
                                Id          : 1,
                                leaf        : true,
                                StartDate   : new Date(2011, 6, 1),
                                EndDate     : new Date(2011, 6, 5)
                            },
                            {
                                Id          : 2,
                                leaf        : true,
                                StartDate   : new Date(2011, 6, 5),
                                EndDate     : new Date(2011, 6, 20)
                            }
                        ]
                    }
                ]
            }
        });

        return { taskStore : taskStore, dependencyStore: dependencyStore };
    }

    t.it('Should not crash when deleting a task which has dependencies', function(t) {
        var ds = getDataSet1(),
            taskStore = ds.taskStore,
            dependencyStore = ds.dependencyStore;

        var gantt = t.getGantt({
            startDate       : new Date(2011, 6, 0),
            endDate         : new Date(2011, 7, 0),
            renderTo        : Ext.getBody(),
            height          : 200,
            taskStore       : taskStore,
            dependencyStore : dependencyStore,
            columns         : [ { xtype : 'treecolumn'}, { xtype : 'predecessorcolumn' }, { xtype : 'successorcolumn' } ]
        });

        t.chain(
            { waitFor : 'tasksAndDependenciesToRender' },

            function() {
                taskStore.remove(taskStore.getById(1));
                t.is(dependencyStore.getCount(), 0, 'DependencyStore should be empty after task remove');
                taskStore.getById(2).remove();

                t.selectorNotExists('.sch-dependency', 'No dependency elements found');
            }
        )
    })

    t.it('Should not crash when deleting a parent task with child task that has dependencies', function(t) {
        var ds = getDataSet2(),
            taskStore = ds.taskStore,
            dependencyStore = ds.dependencyStore;

        var gantt = t.getGantt({
            startDate       : new Date(2011, 6, 0),
            endDate         : new Date(2011, 7, 0),
            renderTo        : Ext.getBody(),
            height          : 200,
            taskStore       : taskStore,
            dependencyStore : dependencyStore,
            columns         : [ { xtype : 'treecolumn'}, { xtype : 'predecessorcolumn' }, { xtype : 'successorcolumn' } ]
        });

        t.chain(
            { waitFor : 'rowsVisible', args : gantt },

            function() {
                taskStore.remove(taskStore.getById(1));
                t.is(dependencyStore.getCount(), 0, 'DependencyStore should be empty after task remove');
                taskStore.getById(2).remove();

                t.selectorNotExists('.sch-dependency', 'No dependency elements found');
            }
        )
    })

})
