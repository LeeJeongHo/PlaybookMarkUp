StartTest(function(t) {
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
        range               : "complete",
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

    t.ok(!!htmls, "Export array is not empty");

    setIframe(htmls[0].html);

    var depView = t.$('.sch-dependencyview-ct', doc)[0];

    t.is(parseFloat(getStyle(depView, "left")), 0, "0th page: no `left` shift");
    t.is(parseFloat(getStyle(depView, "top")), 0, "0th page: no `top` shift");

    setIframe(htmls[1].html);

    depView = t.$('.sch-dependencyview-ct', doc)[0];

    t.is(parseFloat(getStyle(depView, "left")), getLeftShift(1), "1st page: left shift is correct");
    t.is(parseFloat(getStyle(depView, "top")), 0, "1st page: no `top` shift");

    setIframe(htmls[2].html);

    depView = t.$('.sch-dependencyview-ct', doc)[0];

    t.is(parseFloat(getStyle(depView, "left")), getLeftShift(2), "2nd page: left shift is correct");
    t.is(parseFloat(getStyle(depView, "top")), 0, "2nd page: no `top` shift");

    setIframe(htmls[3].html);

    depView = t.$('.sch-dependencyview-ct', doc)[0];

    t.is(parseFloat(getStyle(depView, "left")), getLeftShift(3), "3rd page: left shift is correct");
    t.is(parseFloat(getStyle(depView, "top")), 0, "3rd page: no `top` shift");
});