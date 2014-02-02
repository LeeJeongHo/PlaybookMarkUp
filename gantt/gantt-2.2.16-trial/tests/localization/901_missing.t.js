StartTest(function(t) {

    // this test compares each locale class with english one to find not supported phrases or sub-classes
    Ext.Loader.setPath('Sch', '../../ExtScheduler2.x/js/Sch');
    Ext.Loader.setPath('Gnt', '../js/Gnt');

    // list specifying phrases equal to English which should be ignored
    var ignoreRe = {
        RuRU    : 'WBS.text|DependencyGrid.idText|Sequence.text',
        Pl      : 'ok|baseline|idText|Sequence.text',
        SvSE    : 'startText|ok|idText|StartDate.text|WBS.text|Slack.text|baselineStartText|Sequence.text',
        De      : /name|start|end|WBS|baselineText|okText|slack|alertCaption|Sequence\.text/i,
        It      : /Calendar\.okText|CalendarWindow\.ok|DependencyEditor\.lagText|DependencyGrid\.(idText|lagText)|TaskEditor\.okText|Milestone\.no|Milestone\.text|Note\.text|TaskContextMenu\.addMilestone|Sequence\.text/
    };
    var errors = 0;

    var checkObject = function (t, master, tested, path, ignoreRe) {
        for (var prop in master) {
            var p = path + (path ? '.' : '') + prop;

            if (prop in tested && typeof tested[prop] === typeof master[prop]) {
                if ('object' === typeof master[prop]) {
                    checkObject(t, master[prop], tested[prop], p, ignoreRe);

                // if phrase matches corresponding one from En locale and not mentioned in ignore list
                } else if (master[prop] === tested[prop] && (!ignoreRe || !p.match(ignoreRe))) {
                    t.fail(p + ' matches En locale');
                    errors++;
                }
            } else {
                t.fail(p + ' is not supported');
                errors++;
            }
        }
    };

    function assertLocale(t, master, tested) {
        errors = 0;

        // get last fraction of class name to retreive corresponding list from ignoreRe
        var id = Ext.getClassName(Ext.getClass(tested)).split('.').pop();

        // compare the content of l10n
        checkObject(t, master.l10n, tested.l10n, '', ignoreRe[id]);

        t.is(errors, 0, 'Locale is completely translated');
    }

    t.requireOk(
        [
            'Gnt.locale.En',
            'Gnt.locale.RuRU',
            'Gnt.locale.De',
            'Gnt.locale.Pl',
            'Gnt.locale.SvSE',
            'Gnt.locale.It'
        ],
        function () {

            t.it('Gnt.locale.RuRU', function(t) {
                assertLocale(t, Gnt.locale.En, Gnt.locale.RuRU);
            });

            t.it('Gnt.locale.SvSE', function (t) {
                assertLocale(t, Gnt.locale.En, Gnt.locale.SvSE);
            });

            t.it('Gnt.locale.De', function (t) {
                assertLocale(t, Gnt.locale.En, Gnt.locale.De);
            });

            t.it('Gnt.locale.Pl', function (t) {
                assertLocale(t, Gnt.locale.En, Gnt.locale.Pl);
            });

            t.it('Gnt.locale.It', function (t) {
                assertLocale(t, Gnt.locale.En, Gnt.locale.It);
            });
        }
    );
});
