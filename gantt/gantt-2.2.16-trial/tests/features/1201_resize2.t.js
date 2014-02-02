StartTest(function(t) {
    

    

    t.it("should hide the tooltip even if the resize didn't update the task", function(t) {
        var g = t.getGantt2({
            startDate   : new Date(2010, 1, 1),
            height      : 200,
            cls         : 'one',
            renderTo    : Ext.getBody()
        });

        t.chain(
            {
                waitFor     : 'rowsVisible', args : g
            },
            {
                moveCursorTo : '.one .sch-resizable-handle-start'
            },
            {
                moveCursorTo : '.one .sch-resizable-handle-start',
                offset       : [-3, 6]
            },

            function(next) {

                t.it('should see the resize handle on top of bar elements', function(t) {
                    var el = Ext.getBody().down('.one .sch-resizable-handle-start');
                    var x = el.getX() - 1;
                    var y = el.getY() + 5;

                    t.moveByWithCallback([6, 0], function(e) {
                        var foundEl = t.elementFromPoint(e.getX(), e.getY());
                        var ok = Ext.fly(foundEl).hasCls('sch-gantt-terminal') || Ext.fly(foundEl).hasCls('sch-resizable-handle');

                        t.ok(ok, 'Should not see underlying bar elements');
                    }, next)
                })
            },

            {
                moveCursorTo : '.one .sch-resizable-handle-start'
            },

            {
                action : 'mouseDown'
            },
            { waitFor : 1000 },

            function(next) {
                t.selectorNotExists('.sch-tip', 'Should not see tooltip visible after long mousedown without move');
            }
        )
    })

    t.it("should not start a resize if right clicking resize handle", function(t) {
        var g = t.getGantt2({
            startDate   : new Date(2010, 1, 1),
            renderTo    : Ext.getBody(),
            height      : 200,
            cls         : 'two'
        });

        t.wontFire(g, 'beforetaskresize');

        t.chain(
            {
                waitFor     : 'rowsVisible', args : g
            },
            {
                moveCursorTo : '.two .sch-gantt-task-handle'
            },
            {
                action : 'rightClick'
            },

            { waitFor : 100 },

            {
                action : 'moveCursor',
                by     : [-20, 0]
            },

            function() {
            }
        )
    })
})
