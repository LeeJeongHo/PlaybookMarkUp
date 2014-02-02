StartTest(function (t) {
    t.diag('Testing different scenarios that should trigger dependency repaint')

    var gantt = t.getGantt({
        cascadeChanges : false,
        startDate : new Date(2012, 11, 3),
        endDate : new Date(2012, 11, 31),
        rightLabelField : 'Name'
    });

    var firstTask = gantt.taskStore.getRootNode().childNodes[0].childNodes[0]
    var secondTask = gantt.taskStore.getRootNode().childNodes[0].childNodes[1];

    firstTask.setStartEndDate(new Date(2012, 11, 3), new Date(2012, 11, 31));
    secondTask.setStartEndDate(new Date(2012, 11, 3), new Date(2012, 11, 30));

    gantt.dependencyStore.removeAll();

    gantt.render(document.body)

    var dep = new Gnt.model.Dependency({
        From    : firstTask.data.Id,
        To      : secondTask.data.Id,
        Type    : 2,
        Cls     : 'foo'
    });

    t.chain(
        { waitFor : 'RowsVisible', args : gantt },

        function (next) {

            gantt.dependencyStore.add(dep);

            next();
        },

        { waitFor : 'selector', args : '.foo-line' },

        { waitFor : 300 },

        function (next) {
            t.pass('Should see new dependency after dependency store add');

            Ext.select('.sch-dependency').remove();
            firstTask.shift(Sch.util.Date.DAY, 1);

            next();
        },

        { waitFor : 'selector', args : '.foo-line' },

        function (next) {
            t.pass('Should see dependency refreshed after task update');
            dep.set('Cls', 'bar');

            next();
        },


        { waitFor : 'selector', args : '.bar-line' },

        function (next) {
            t.pass('Should see new dependency after dependency model update');
            firstTask.parentNode.collapse();

            next();
        },

        { waitFor : 'selectorNotFound', args : '.bar-line' },

        function (next) {
            t.pass('Should not see dependency after root collapse');
            firstTask.parentNode.expand();

            next();
        },

        { waitFor : 'selector', args : '.bar-line' },

        function (next) {
            t.pass('Should see dependency after root expand');
            dep.store.remove(dep);

            next();
        },

        { waitFor : 'selectorNotFound', args : '.bar-line' },

        function (next) {
            t.pass('Should not see new dependency after model removed');

            next()
        },
        
        // at this point there should be no dependencies in the dependency store
        { waitFor : 'selectorNotFound', args : '.sch-dependency' },
        
        function (next) {
            gantt.dependencyStore.add(new Gnt.model.Dependency({
                From    : firstTask.data.Id,
                To      : secondTask.data.Id,
                Type    : 2
            }));

            next();
        },

        { waitFor : 'selector', args : '.sch-dependency' },

        function(next) {
            t.willFireNTimes(gantt.getSchedulingView().getDependencyView(), 'refresh', 1);
            t.willFireNTimes(gantt.getSchedulingView(), 'refresh', 1);

            gantt.taskStore.filterTreeBy(function (task) {
                return false;
            });
        }
    );
})    
