StartTest({ defaultTimeout : 60000 }, function(t) {
    var scripts = Ext.select('script', Ext.getHead());
    var foundGantt = false;
    var foundExt = false;

    scripts.each(function(el) {
        if (el.dom.src && el.dom.src.match(/gnt-all-debug\.js/)){
            foundGantt = true;
        }

        if (el.dom.src && el.dom.src.match(/cdn\.sencha\.(io|com)/) && el.dom.src.match('ext-all.js')){
            foundExt = true;
        }
    });

    t.ok(foundGantt, 'Script tag with sch-all-debug.js found');

    t.ok(foundExt, 'ext-all.js script tag using cdn.sencha.io found');

    t.waitForSelector('.sch-gantt-item', function() {
        t.pass('Example rendered without exception');

        t.monkeyTest(t.cq1('ganttpanel').el, Ext.isIE ? 3 : 10, null, t.done, t);
    });
});
