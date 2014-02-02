StartTest(function(t) {
    var done = false;

    var createFn = function(record, start, end, e){
        if (!done) {
            t.ok(arguments[0] instanceof Gnt.model.Task &&
                arguments[1] instanceof Date &&
                arguments[2] instanceof Date &&
                arguments[3] instanceof Ext.EventObjectImpl,'Correct function arguments');
            done = true;
        }

        if (end > new Date(2010, 1, 5)){
            return false;
        }

        return true;
    };

    var g = t.getGantt({ 
        startDate : new Date(2010, 1, 1),
        createValidatorFn: createFn,
        enableDragCreation: true,
        lockedGridConfig: {
            collapsible: true,
            collapsed: true
        }
    });

    g.render(Ext.getBody());

    t.waitForRowsVisible(g.normalGrid, function testEvents() {

        g.getRootNode().insertChild(0, { leaf : true });

        var firstCell = t.getFirstCell(g.normalGrid);
        var startXY = firstCell.getXY();
        startXY[0] = startXY[0] + 2;
        startXY[1] = startXY[1] + 2;

        t.dragBy(startXY, [150, 0], function() {
            t.is(g.getRootNode().firstChild.getStartDate(), null, 'StartDate read ok. Task not created.');
            t.is(g.getRootNode().firstChild.getEndDate(), null, 'EndDate read ok. Task not created.');

            done = false;
            t.dragBy(startXY, [75, 0], function() {
                t.is(g.getRootNode().firstChild.getStartDate(), new Date(2010, 1, 1), 'StartDate read ok');
                t.isGreater(g.getRootNode().firstChild.getEndDate(), new Date(2010, 1, 2), 'EndDate read ok');
            });      
        });
    });
});  
