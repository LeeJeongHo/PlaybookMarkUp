StartTest(function (t) {

    function getTaskStore(config) {

        return Ext.create("Gnt.data.TaskStore", Ext.apply({
            proxy : {
                type   : 'memory',
                reader : {
                    type : 'json'
                }
            },

            root : {
                expanded : false,

                children : [
                    {
                        Id        : 1,
                        StartDate : '2010-01-01',
                        EndDate   : '2010-01-21',
                        children  : [
                            {
                                Id        : 2,
                                leaf      : true,
                                StartDate : '2010-01-01',
                                EndDate   : '2010-01-07'
                            },
                            {
                                Id        : 3,
                                leaf      : true,
                                StartDate : '2010-01-07',
                                EndDate   : '2010-01-10'
                            },
                            {
                                Id        : 4,
                                leaf      : true,
                                StartDate : '2010-01-15',
                                EndDate   : '2010-01-21'
                            }
                        ]
                    }
                ]
            }
        }, config));
    }

    t.it('Sanity checks', function (t) {
        var taskStore = getTaskStore();

        var node1 = taskStore.getNodeById(1);
        var node2 = taskStore.getNodeById(2);
        var node3 = taskStore.getNodeById(3);
        var node4 = taskStore.getNodeById(4);

        node3.indent();
        t.notOk(node2.isLeaf(), 'Node2 not leaf after node3 indent');

        t.isDateEqual(node2.getStartDate(), new Date(2010, 0, 7), 'Node2 start');
        t.isDateEqual(node2.getEndDate(), new Date(2010, 0, 10), 'Node2 end');

        node4.indent();
        t.isDateEqual(node3.getStartDate(), new Date(2010, 0, 7), 'Node2 start');
        t.isDateEqual(node3.getEndDate(), new Date(2010, 0, 10), 'Node2 end');

        t.isDateEqual(node2.getStartDate(), new Date(2010, 0, 7), 'Node2 start');
        t.isDateEqual(node2.getEndDate(), new Date(2010, 0, 21), 'Node2 end');

    })

    t.it('Indent with dependencies', function (t) {
        var taskStore = getTaskStore({
            cascadeChanges  : true,
            dependencyStore : new Gnt.data.DependencyStore({
                data : [
                    { From : 2, To : 3 }
                ]
            })
        });

        taskStore.indent([taskStore.getById(2), taskStore.getById(3)])
    })
})
