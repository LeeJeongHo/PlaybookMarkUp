StartTest(function(t) {

    Ext.Loader.setPath('Sch', '../../ExtScheduler2.x/js/Sch');
    Ext.Loader.setPath('Gnt', '../js/Gnt');

    // This test grab 1st level phrases from each locale class and tries to find its
    // usage in gnt-all-debug.js. Purpose is to detect unused locales.

    var getFile     = function (url, callback) {
        var as  = t.beginAsync();

        Ext.Ajax.request({
            url         : url,
            callback    : function(options, success, response) {
                t.endAsync(as);

                if (!success) t.fail('File [' + url + '] failed to load');

                success && callback && callback(response.responseText);
            }
        });
    };

    var searchLocale = function (text, phrase, pos, context) {
        // we are looking for .L("phrase") call
        var str = '\\.L\\(\\s*["\']' + phrase + '["\']';
        if (context) str += '\\s*,\\s*' + context + '\\s*\\)';

        var reg     = new RegExp(str, 'g'),
            match   = reg.exec(text),
            index   = match ? match.index : -1;
        while (index < pos && match) {
            match   = reg.exec(text);
            index   = match ? match.index : -1;
        }
        return index;
    };

    var testLocale = function (t, cls, gntAllDebugText) {
        var pos;

        var classesEntries = [];

        // loop over classes supported by locale
        for (var className in cls.l10n) {
            // get class definition start position
            pos = gntAllDebugText.search(new RegExp('\\nExt\\.define\\(\\s*[\'"]' + className.replace('.', '\\.') + '["\']\\s*,'));
            if (pos > -1) {
                // keep position
                classesEntries.push({ name : className, pos : pos });
            } else {
                t.fail(className + ' not found');
            }
        }

        // sort classes by their position
        classesEntries.sort(function (a, b) { return a.pos - b.pos; });

        var phrase, len = classesEntries.length;
        // loop over collected classes
        classesEntries.forEach(function (entry, index) {
            // loop over their localized phrases
            for (var phrase in cls.l10n[entry.name]) {

                // search for phrase
                pos = searchLocale(gntAllDebugText, phrase, entry.pos);
                // fail - if it's not found or found in another class
                if (pos < entry.pos || (index < len - 1 && pos >= classesEntries[index + 1].pos)) {
                    t.fail(entry.name+': ' + phrase+' not found');
                }

            }
        });
    };


    getFile('../gnt-all-debug.js', function (text) {

        t.requireOk(
            [
                'Gnt.locale.En',
                'Gnt.locale.De',
                'Gnt.locale.RuRU',
                'Gnt.locale.Pl',
                'Gnt.locale.SvSE',
                'Gnt.locale.It'
            ],
            function() {
                t.it('Gnt.locale.En', function(t) {
                    testLocale(t, Gnt.locale.En, text);
                })

                t.it('Gnt.locale.De', function (t) {
                    testLocale(t, Gnt.locale.De, text);
                });

                t.it('Gnt.locale.RuRU', function (t) {
                    testLocale(t, Gnt.locale.RuRU, text);
                });

                t.it('Gnt.locale.Pl', function (t) {
                    testLocale(t, Gnt.locale.Pl, text);
                });

                t.it('Gnt.locale.SvSE', function (t) {
                    testLocale(t, Gnt.locale.SvSE, text);
                });

                t.it('Gnt.locale.It', function (t) {
                    testLocale(t, Gnt.locale.It, text);
                });
            }
        );
    });
});
