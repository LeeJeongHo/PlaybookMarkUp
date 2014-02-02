StartTest(function(t) {
    // see https://www.assembla.com/spaces/bryntum/tickets/416
    
    // misalignment is caused by the "parentTaskOffset" compensation in the Gnt.view.Gantt
    
    // configure the gantt, that
    // 1) there's a vertical scroll
    // 2) that the viewport end date comes on the middle of some long-lasting parent task
    var gantt           = t.getGantt({
        height          : 200,
        endDate         : new Date(2010, 1, 8),
        renderTo        : Ext.getBody(),
        
        // enable column lines, which may cause a misalignment of header
        columnLines     : true,
        
        width           : 400,
        lockedGridConfig    : {
            width       : 150
        }
    });
    
    var schedulingView
    
    t.chain(
        {
            waitFor     : 'rowsVisible',
            args        : gantt
        },
        {
            // it seems shortly after initial rendering, the "scrollTop" position of the buffered schedulingView will be reset to 0
            // need to wait some time before modifiying it
            waitFor     : 300
        },
        function (next) {
            schedulingView  = gantt.getSchedulingView();
            var el          = schedulingView.el;
            
            // this is the root cause of the misalignment - the scrollWidth of the view element is bigger than the <table> width
            // because some elements exceed the table
            t.is(el.dom.scrollWidth, el.child('table').dom.clientWidth, 'Nothing is exceeding the table')
    
            // scrolling the scheduling view to right-most position
            el.dom.scrollLeft    = el.dom.scrollWidth;
            
            next()
        },
        {
            // processing of scrolling is async, need to wait again
            waitFor     : 300
        },
        function (next) {
            var schedulingViewEl    = schedulingView.el
            
            // mathing within 1px threshhold
            t.isApprox(schedulingViewEl.child('table').getRight(), schedulingView.headerCt.el.down('table').getRight(), 2, 'No misalignment')
        }
    );
})    

