StartTest(function (t) {
    t.diag('Dependencies should be rendered below the tasks')

    var gantt = t.getGantt({
        cascadeChanges : false,
        columns : [
            { xtype : 'treecolumn', dataIndex : 'Id'},
            { xtype : 'predecessorcolumn' },
            { xtype : 'successorcolumn' }
        ],
        startDate       : new Date(2012, 10, 5),
        endDate         : new Date(2012, 11, 31),
        dependencyStore : new Gnt.data.DependencyStore()
    });

    gantt.taskStore.getRootNode().removeAll();

    gantt.taskStore.getRootNode().appendChild({
        StartDate : new Date(2012, 10, 7),
        Duration  : 2,
        leaf      : true,
        Id        : 1
    });

    gantt.taskStore.getRootNode().appendChild({
        StartDate : new Date(2012, 10, 7),
        Duration  : 2,
        leaf      : true,
        Id        : 2
    });

    gantt.render(document.body)

    var view = gantt.getSchedulingView();

    t.chain(
        { waitFor : 'rowsVisible', args : gantt },

        function (next) {
            t.it('Should redraw affected rows when a new dependency is added', function(t) {
                t.willFireNTimes(gantt.lockedGrid.view, 'itemupdate', 2);

                gantt.dependencyStore.add(new Gnt.model.Dependency({
                    From    : 1,
                    To      : 2
                }));
            });

            t.it('Should redraw affected rows when a new dependency is updated', function(t) {
                t.willFireNTimes(gantt.lockedGrid.view, 'itemupdate', 2);

                gantt.dependencyStore.first().set({
                    From    : 1,
                    To      : "FOO"
                });
            });

            t.it('Should redraw affected rows when a dependency is removed', function(t) {
                t.willFireNTimes(gantt.lockedGrid.view, 'itemupdate', 1);

                gantt.dependencyStore.remove(gantt.dependencyStore.first());
            });

            t.it('Should NOT redraw any rows when a new dependency is added targeting tasks not in the task store', function(t) {
                t.wontFire(gantt.lockedGrid.view, 'itemupdate', 0);

                gantt.dependencyStore.add(new Gnt.model.Dependency({
                    From    : "ABC",
                    To      : "FOO"
                }));
            })
        }
    );
})    
