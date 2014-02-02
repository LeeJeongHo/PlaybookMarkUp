StartTest(function(t) {

    // Here we check that dependencies receive correct shift in case of particular time spane exporting (#867)

    t.expectGlobal('0'); // We love IE

    var plugin  = Ext.create('Gnt.plugin.Export', {
        printServer : '../examples/export/server.php',
        test        : true
    });

    var gantt   = t.getGantt({
        renderTo : Ext.getBody(),
        plugins  : plugin
    });

    var exported = plugin.doExport({
        format              : "Letter",
        orientation         : "portrait",
        range               : "date",
        dateFrom            : new Date(2010, 1, 11),
        dateTo              : new Date(2010, 1, 20),
        showHeader          : true,
        singlePageExport    : false
    });

    var iframe          = document.body.appendChild(document.createElement("iframe")),
        calculatedPages = exported.calculatedPages,
        htmls           = exported.htmlArray,
        doc;

    var getStyle = function (el, styleProp) {
        var style;
        if (el.currentStyle) {
            return el.currentStyle[styleProp];
        } else if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        }
    };

    var setIframe = function (html) {
        doc = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
    };

    var getLeftShift = function (page) {
        return !page ? 0 : - (calculatedPages.columnsAmountLocked * calculatedPages.timeColumnWidth +
            (page - 1) * calculatedPages.columnsAmountNormal * calculatedPages.timeColumnWidth);
    };

    t.is(htmls.length, 2, "2 pages exported");

    setIframe(htmls[0].html);

    var depView = t.$('.sch-dependencyview-ct', doc)[0];

    t.is(parseFloat(getStyle(depView, "left")), -60, "0th page: left shift is correct");
    t.is(parseFloat(getStyle(depView, "top")), 0, "0th page: no `top` shift");

    setIframe(htmls[1].html);

    depView = t.$('.sch-dependencyview-ct', doc)[0];

    t.is(parseFloat(getStyle(depView, "left")), -60 + getLeftShift(1), "1st page: left shift is correct");
    t.is(parseFloat(getStyle(depView, "top")), 0, "1st page: no `top` shift");
});
