StartTest(function(t) {
    
    var gantt               = t.getGantt({
        renderTo    : Ext.getBody(),
        animate     : false,
        rootVisible : true,
        
        startDate           : new Date(2010, 1, 1),
        
        lockedViewConfig    : {
            // Enable node reordering in the locked grid
            plugins     : {
                ptype           : 'treeviewdragdrop',
                containerScroll : true
            }
        }
    });
    
    var view        = gantt.getSchedulingView(),
        depView     = view.getDependencyView();
        
    t.chain(
        {
            waitFor     : 'waitForTasksAndDependenciesToRender',
            args        : gantt
        },
        function (next) {
            view.highlightCriticalPaths();
            
            t.isGreater(view.el.select('.' + depView.selectedCls).getCount(), 0, 'Found some critical path els');
            
            next()
        },
        // re-ordering should work while critical path is highlighted
        {
            drag        : '.x-grid-inner-locked .x-grid-row:nth-child(2)',
            to          : '.x-grid-inner-locked .x-grid-row:nth-child(5)'
        },
        function (next) {
            view.unhighlightCriticalPaths();
            
            gantt.taskStore.getRootNode().collapse();
            
            next()
        },
        { waitFor : 'SelectorNotFound', args : [ '.' + depView.selectedCls, view.el ] },
        
        function (next) {
            view.highlightCriticalPaths();
            view.unhighlightCriticalPaths();
            
            t.pass('Could highlight/unhiglight cpath when no elements are in the dom');
            
            next()
        }
    )
    
})    
