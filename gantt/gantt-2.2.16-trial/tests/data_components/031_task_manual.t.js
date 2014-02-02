StartTest(function(t) {
    
    var getDataSet = function () {
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
                },
                {
                    From        : 1,
                    To          : 3,
                    Type        : 2
                },
                {
                    From        : 2,
                    To          : 4,
                    Type        : 2
                },
                {
                    From        : 3,
                    To          : 4,
                    Type        : 2
                },
                {
                    From        : 4,
                    To          : 5,
                    Type        : 2
                }
            ]
        });
        
    
        var taskStore = Ext.create("Gnt.data.TaskStore", {
            dependencyStore : dependencyStore,
            
            proxy       : {
                type    : 'memory',
                reader  : {
                    type    : 'json'
                }
            },
            
            root        : {
                expanded    : false,
                
                children    : [
                    {
                        Id          : 1,
                        leaf        : true,
                        StartDate   : new Date(2011, 6, 1),
                        EndDate     : new Date(2011, 6, 5)
                    },
                    {
                        Id          : 123,
                        
                        StartDate   : new Date(2011, 6, 15),
                        EndDate     : new Date(2011, 6, 23),
                        
                        children    : [
                            {
                                Id          : 2,
                                leaf        : true,
                                
                                ManuallyScheduled   : true,
                                
                                StartDate   : new Date(2011, 6, 16),
                                EndDate     : new Date(2011, 6, 20)
                            },
                            {
                                Id          : 3,
                                leaf        : true,
                                StartDate   : new Date(2011, 6, 18),
                                EndDate     : new Date(2011, 6, 22)
                            }
                        ]
                    },
                    {
                        Id          : 4,
                        leaf        : true,
                        StartDate   : new Date(2011, 6, 25),
                        EndDate     : new Date(2011, 6, 28)
                    },
                    {
                        Id          : 5,
                        leaf        : true,
                        StartDate   : new Date(2011, 6, 28),
                        EndDate     : new Date(2011, 6, 28)
                    }
                ]
            }
        });
        
        return {
            taskStore       : taskStore,
            dependencyStore : dependencyStore
        }
    }
    
    //======================================================================================================================================================================================================================================================
    t.diag('Cascades 1 - with manually scheduled task')
    
    var taskStore           = getDataSet().taskStore
    
    var task2       = taskStore.getById(2)
    
    t.is(task2.getDuration(), 4, 'Task2 has 4 days duration')
    
    var cascadeFired        = 0
    var beforeCascadeFired  = 0
    
    taskStore.on('beforecascade', function () { beforeCascadeFired++ })
    taskStore.on('cascade', function () { cascadeFired++ })
    
    taskStore.cascadeChangesForTask(taskStore.getById(1))
    
    t.ok(beforeCascadeFired == 1, "Should be exactly one `beforeCascadeFired` event before cascade")
    t.ok(cascadeFired == 1, "Should be exactly one `cascade` event after cascade")
    
    t.isStartEnd(taskStore.getById(1), new Date(2011, 6, 1), new Date(2011, 6, 5), 'Correct dates for `task1` after cascade')
    t.isStartEnd(taskStore.getById(2), new Date(2011, 6, 16), new Date(2011, 6, 20), 'Correct dates for `task2` after cascade (manually scheduled)')
    t.isStartEnd(taskStore.getById(3), new Date(2011, 6, 5), new Date(2011, 6, 9), 'Correct dates for `task3` after cascade')
    
    t.isStartEnd(taskStore.getById(123), new Date(2011, 6, 5), new Date(2011, 6, 20), 'Correct dates for `task123` after cascade')
    
    t.isStartEnd(taskStore.getById(4), new Date(2011, 6, 20), new Date(2011, 6, 23), 'Correct dates for `task4` after cascade')
    
    // NOTE: The milestone has not been re-scheduled to the next working day
    t.isStartEnd(taskStore.getById(5), new Date(2011, 6, 23), new Date(2011, 6, 23), 'Correctly did not re-scheduled the start date of the milestone to the next working day')
    
    
    
})    
