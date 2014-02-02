StartTest(function(t) {
    var ts = new Gnt.data.TaskStore({
        model : 'Gnt.model.Task',
        proxy       : {
            type    : 'memory',
            reader  : {
                type    : 'json'
            }
        },

        root        : {
            expanded    : false
        }
    });

    var tree = Ext.create('Ext.tree.Panel', {
        store: ts,
        renderTo: document.body,
        height: 300,
        width: 250
    });

    ts.proxy.data = [
        {
            Id          : 1,
            StartDate   : new Date(2011, 6, 1),
            EndDate     : new Date(2011, 6, 5),
            children    : [
                {
                    Id          : 6,
                    leaf        : true,
                    StartDate   : new Date(2011, 6, 28),
                    Duration    : 0
                }
            ]
        }
    ];

    ts.load();
    ts.getRootNode().firstChild.set('StartDate', new Date(2010,1,1));
    t.is(ts.getRootNode().firstChild.getStartDate(), new Date(2010,1,1), 'StartDate found using plain treestore');
})