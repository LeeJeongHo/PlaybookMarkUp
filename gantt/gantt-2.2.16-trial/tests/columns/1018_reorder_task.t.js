StartTest(function(t) {
    var tasks = [
        {
            Id          : 5,
            Duration    : 3,
            StartDate   : new Date(2013, 7, 5),
            leaf        : true
        },
        {
            Id          : 1,
            expanded    : 1,
            StartDate   : '2010-01-28T00:00:00',
            children    : [
                {
                    Id          : 13,
                    Duration    : 3,
                    StartDate   : new Date(2013, 7, 1),
                    leaf        : true
                },
                {
                    Id          : 14,
                    Duration    : 4,
                    leaf        : true
                }
            ]
        }
    ];

    var ds = new Gnt.data.DependencyStore({
        data : [
            {
                From    : 5,
                To      : 13
            },
            {
                From    : 13,
                To      : 14
            }
        ]
    });

    var ts = new Gnt.data.TaskStore({
        dependencyStore : ds,
        root : {
            expanded : true,
            children : tasks
        }
    });

    var gantt = new Gnt.panel.Gantt({
        columns       : [
            {
                xtype     : 'namecolumn'
            },
            {
                xtype : 'earlystartdatecolumn'
            }
        ],

        taskStore        : ts,
        renderTo         : document.body
    })

    ts.getById(1).appendChild(ts.getById(5));

    t.is(ts.getById(13).getEarlyStartDate(), new Date(2013, 7, 8), 'correct early start date');

});
