StartTest(function (t) {
    t.expectGlobals('App', 'MyApp');

    var gantt, scheduler;

    function checkScrollSync() {
        var headersSynced = gantt.normalGrid.headerCt.el.dom.scrollLeft === scheduler.normalGrid.headerCt.el.dom.scrollLeft;
        var bodiesSynced = gantt.normalGrid.getView().getHorizontalScroll() === scheduler.normalGrid.getView().getHorizontalScroll();

        if (headersSynced && bodiesSynced) {
            t.ok(headersSynced, 'Header scroll synced');
            t.ok(bodiesSynced, 'Body scroll synced');
        }

        return headersSynced && bodiesSynced;
    }

    t.chain(
        { waitFor : 'selector', args : '.sch-gantt-item' },

        { action : 'click', target : '.icon-calendar' },

        { waitFor : 'selector', args : '.sch-event' },

        { waitFor : 1000 },

        function(next) {
            gantt = t.cq1('ganttpanel');
            scheduler = t.cq1('schedulergrid');

            t.ok(checkScrollSync(), 'In sync initially');
            gantt.zoomOut();
            next();
        },

        { waitFor : checkScrollSync },

        function(next) {
            gantt.zoomOut();
            next();
        },

        { waitFor : checkScrollSync },

        function(next) {
            gantt.zoomOut();
            next();
        },

        { waitFor : checkScrollSync },

        { drag : '>>ganttpanel splitter', by: [-10, 0] },

        function(next) {
            t.is(t.cq1('ganttpanel treepanel').getWidth(), t.cq1('schedulergrid gridpanel').getWidth(), 'Locked grid widths should be synced')

            t.livesOk(function() {
                scheduler.destroy();
            }, 'Should be able to destroy scheduler when paired with Gantt');

            t.livesOk(function() {
                gantt.destroy();
            }, 'Should be able to destroy gantt');
        }
    );
})
