StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setup')
    
    var g = t.getGantt({
        viewPreset      : 'weekAndDayLetter',
        renderTo : Ext.getBody(),
        highlightWeekends : true,
        weekendsAreWorkdays : false
    });
    
    t.waitForSelector('.sch-zone', function() {
        t.pass('Weekend zones rendered ok');
        
    })
})    
