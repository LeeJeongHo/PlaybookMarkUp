StartTest(function (t) {
    var ts = new Gnt.data.TaskStore({
        proxy : 'memory'
    });
    var g = t.getGantt({ taskStore : ts, renderTo : document.body });

    ts.getRootNode().appendChild({ Name : 'foo' });

    t.willFireNTimes(g.taskStore, 'update', 1);

    var task = g.taskStore.getRootNode().firstChild;

    task.setName('asfo');
})
