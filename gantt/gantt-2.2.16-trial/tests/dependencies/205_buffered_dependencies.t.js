StartTest(function(t) {
    function getBufferedGantt(config) {
        var generateTaskData = function() {
            var arr = [],
                i, j, k,
                cn, cn2,
                dt = new Date(2010, 0, 5);

            for (var i = 1; i < 5; i++) {
                cn = [];
                for (j = 1; j < 10; j++) {
                    cn2 = [];
                    for (k = 1; k < 10; k++) {
                        var nbr = (100*i)+(10*j)+k;
                        cn2.push({
                            Id : nbr,
                            Name : 'Child task ' + nbr,
                            StartDate : dt,
                            EndDate : Ext.Date.add(dt, Ext.Date.DAY, 2),
                            leaf : true
                        });
                    }
                    cn.push({
                        Id          : (100*i)+(10*j),
                        Name        : 'Child task ' + String(i)+String(j),
                        StartDate   : dt,
                        EndDate     : Ext.Date.add(dt, Ext.Date.DAY, 2),
                        expanded    : true,
                        children    : cn2
                    });
                    dt = Ext.Date.add(dt, Ext.Date.DAY, 1)
                }
                arr.push({  
                    Id          : i,
                    Name        : 'Root task #' + i,
                    StartDate   : new Date(2010, 0, 5),
                    EndDate     : dt,
                    children    : cn,
                    expanded    : true
                });
            }

            return arr;
        };

        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            data    : [
                {
                    Id          : 1,
                    From        : 111,
                    To          : 112,
                    Type        : 2
                },
                {
                    Id          : 2,
                    From        : 111,
                    To          : 499,
                    Type        : 2
                }
            ]
        });

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            // sorting slow downs the initial loading/rendering time for big trees
            sortOnLoad  : false,
            
            proxy       : {
                type : 'memory',
                data : generateTaskData()
            }
        });
        
        var gantt = t.getGantt(Ext.apply({
            taskStore           : taskStore,
            dependencyStore     : dependencyStore,
            
            width               : 400,
            
            startDate           : new Date(2010, 0, 5),
            endDate             : new Date(2010, 8, 5),
            
            columns             : [
                {
                    xtype       : 'treecolumn',
                    header      : 'Tasks',
                    sortable    : true,
                    dataIndex   : 'Id',
                    width       : 150,
                    editor      : {}
                }
            ],
            plugins             : ['bufferedrenderer'],
            renderTo            : Ext.getBody()
        }, config || {}));

        return gantt;
    }
    
    var gantt           = getBufferedGantt();
    var schedulingView  = gantt.getSchedulingView();
    var depView         = schedulingView.getDependencyView();
    
    var dep1            = gantt.dependencyStore.getById(1)
    var dep2            = gantt.dependencyStore.getById(2)
    
    var el              = schedulingView.el
    var lockedEl        = gantt.lockedGrid.getView().el
    
    t.chain(
        {
            waitFor     : 'waitForTasksAndDependenciesToRender',
            args        : gantt
        },
        function (next) {
            t.isGreater(depView.getElementsForDependency(dep1).getCount(), 0, 'Dependency 1 should be visible');
            t.isGreater(depView.getElementsForDependency(dep2).getCount(), 0, 'Dependency 2 should be visible');
            
            t.scrollVerticallyTo(el, 2000, next)
        },
        // having two 100ms waits seems more robust in IE than having one 1000ms wait
        {
            waitFor : 100
        },
        {
            waitFor : 100
        },

        function (next) {
            t.is(depView.getElementsForDependency(dep1).getCount(), 0, 'Dependency 1 should not be rendered since both "from" and "to" tasks are above/below current chunk');
            t.isGreater(depView.getElementsForDependency(dep2).getCount(), 0, 'Dependency 2 should be visible, even that both tasks are not rendered');
            
            next();
        },

        function(next) {
            t.scrollVerticallyTo(el, 0, next)
        },
        // having two 100ms waits seems more robust in IE than having one 1000ms wait
        {
            waitFor : 100
        },
        {
            waitFor : 100
        },
        
        function (next) {
            t.isGreater(depView.getElementsForDependency(dep1).getCount(), 0, 'Dependency 1 should be visible');
            t.isGreater(depView.getElementsForDependency(dep2).getCount(), 0, 'Dependency 2 should be visible');
            
            next()
        },
        
        function (next) {
            gantt.dependencyStore.removeAll();
            
            next()
        },
        {
            waitFor : 500
        },
        
        function (next) {
            t.selectorNotExists('.sch-dependency', 'No dependencies should be rendered after removing all records from dependency store');
            
            var task444     = gantt.taskStore.getById(444)
            
            // Making sure dependencies are not rendered if from/to task is not in view
            gantt.setStart(Sch.util.Date.add(task444.getEndDate(), Sch.util.Date.WEEK, 1));
            
            gantt.dependencyStore.add(new Gnt.model.Dependency({
                Id          : 3,
                From        : 111,
                To          : 444,
                Type        : 2
            }));
            
            next();
        },
        {
            waitFor     : 500
        },
        function() {
            t.selectorNotExists('.sch-dependency', 'No dependencies rendered if one of the tasks are outside current timeaxis');
        }
    )
})    

