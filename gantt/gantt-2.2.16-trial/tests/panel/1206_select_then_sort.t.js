StartTest(function(t) {
    // this test verifies the regression - sorting by name of the gantt with selected row 
    // triggers "Maximum call stack size exceeded" exception
    
    var gantt       = t.getGantt({
        renderTo        : Ext.getBody()
    })
    
    var lockedView  = gantt.lockedGrid.getView()
    
    t.firesOk(lockedView, 'refresh', 2, "Locked view refreshes only twice")
    t.firesOk(gantt.normalGrid.getView(), 'refresh', 2, "Scheduling view refreshes only twice")
    
    t.chain(
        {
            waitFor     : 'waitForTasksAndDependenciesToRender',
            args        : gantt
        },
        {
            action      : 'click',
            target      : function () {
                return lockedView.getNode(1)
            }
        },
        // issue is triggered by the 2nd sort only
        {
            action      : 'click',
            target      : function () {
                return gantt.lockedGrid.headerCt.items.getAt(0)
            }
        },
        {
            action      : 'click',
            target      : function () {
                return gantt.lockedGrid.headerCt.items.getAt(0)
            }
        }
    )
})    

