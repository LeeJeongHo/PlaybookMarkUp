describe('Each row should contain one task, 2 labels, 2 dependency terminal', function(t) {
    

    var taskStore = Ext.create("Gnt.data.TaskStore", {
        proxy       : 'memory',

        root        : {
            expanded    : true,

            children    : [
                {
                    Id          : 1,
                    Name        : 'vask1',
                    leaf        : true,
                    StartDate   : new Date(2011, 6, 1),
                    Duration    : 1
                },
                {
                    Id          : 2,
                    Name        : 'vask2',
                    leaf        : true,
                    StartDate   : new Date(2011, 6, 5),
                    Duration    : 0
                },
                {
                    Id          : 3,
                    Name        : 'vask3',
                    leaf        : false,
                    StartDate   : new Date(2011, 6, 1),
                    Duration    : 1
                }
            ]
        }
    });

    t.describe('Left label + right label', function(t) {

        var gantt               = t.getGantt2({
            height                  : 100,
            width                   : 600,
            startDate               : new Date(2011, 6, 1),
            endDate                 : new Date(2011, 6, 28),
            taskStore               : taskStore,
            leftLabelField          : 'Duration',
            rightLabelField         : 'Id',
            renderTo                : Ext.getBody()
        });

        t.waitForRowsVisible(gantt, function() {
            t.it('Should render two labels per leaf task', function(t) {
                t.expect(gantt.el.select('.x-grid-row:nth-child(1) .sch-gantt-terminal').getCount()).toEqual(2);
                t.expect(gantt.el.select('.x-grid-row:nth-child(1) .sch-gantt-label').getCount()).toEqual(2);
            });

            t.it('Should render two labels per milestone task', function(t) {
                t.expect(gantt.el.select('.x-grid-row:nth-child(2) .sch-gantt-terminal').getCount()).toEqual(2);
                t.expect(gantt.el.select('.x-grid-row:nth-child(2) .sch-gantt-label').getCount()).toEqual(2);
            });

            t.it('Should render two labels per parent task', function(t) {
                t.expect(gantt.el.select('.x-grid-row:nth-child(3) .sch-gantt-terminal').getCount()).toEqual(2);
                t.expect(gantt.el.select('.x-grid-row:nth-child(3) .sch-gantt-label').getCount()).toEqual(2);
            });
        })
    })

    t.describe('Left label', function(t) {

        var gantt               = t.getGantt2({
            height                  : 100,
            width                   : 600,
            startDate               : new Date(2011, 6, 1),
            endDate                 : new Date(2011, 6, 28),
            taskStore               : taskStore,
            leftLabelField          : 'Duration',
            renderTo                : Ext.getBody()
        });

        t.waitForRowsVisible(gantt, function() {
            t.it('Should render two labels per leaf task', function(t) {
                t.expect(gantt.el.select('.x-grid-row:nth-child(1) .sch-gantt-label').getCount()).toEqual(1);
            });

            t.it('Should render two labels per milestone task', function(t) {
                t.expect(gantt.el.select('.x-grid-row:nth-child(2) .sch-gantt-label').getCount()).toEqual(1);
            });

            t.it('Should render two labels per parent task', function(t) {
                t.expect(gantt.el.select('.x-grid-row:nth-child(3) .sch-gantt-label').getCount()).toEqual(1);
            });
        })
    })

    t.describe('No label, no dependency terminals', function(t) {

        var gantt               = t.getGantt2({
            height                  : 100,
            width                   : 600,
            enableDependencyDragDrop: false,
            startDate               : new Date(2011, 6, 1),
            endDate                 : new Date(2011, 6, 28),
            leftLabelField          : null,
            rightLabelField         : null,
            taskStore               : taskStore,
            renderTo                : Ext.getBody()
        });

        t.waitForRowsVisible(gantt, function() {
            t.expect(gantt.el.select('.sch-gantt-terminal').getCount()).toEqual(0);
            t.expect(gantt.el.select('.sch-gantt-label').getCount()).toEqual(0);
        })
    })

    t.describe('All labels', function(t) {

        var gantt               = t.getGantt2({
            height                  : 140,
            width                   : 600,
            startDate               : new Date(2011, 6, 1),
            endDate                 : new Date(2011, 6, 28),
            taskStore               : taskStore,
            leftLabelField          : 'Name',
            rightLabelField         : 'Name',
            topLabelField           : 'Name',
            bottomLabelField        : 'Name',
            renderTo                : Ext.getBody()
        });

        t.waitForRowsVisible(gantt, function() {
            t.it('Should render four labels per leaf task', function(t) {
                t.expect(gantt.el.select('.x-grid-row:nth-child(1) .sch-gantt-label').getCount()).toEqual(4);
            });

            t.it('Should render four labels per milestone task', function(t) {
                t.expect(gantt.el.select('.x-grid-row:nth-child(2) .sch-gantt-label').getCount()).toEqual(4);
            });

            t.it('Should render four labels per parent task', function(t) {
                t.expect(gantt.el.select('.x-grid-row:nth-child(3) .sch-gantt-label').getCount()).toEqual(4);
            });
        })
    })
})
