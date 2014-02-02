StartTest(function (t) {
    
    //http://www.sencha.com/forum/showthread.php?268333-4.2.1-IE-quot-Focus-quot-method-can-break-on-destroyed-grid-views&p=982906#post982906
    Ext.Component.override({
        onDestroy : function () {
            if (this.focusTask) this.focusTask.cancel()
            
            this.callParent(arguments)
        }
    })
    
    var calendarWidget, calendar, dayGrid, weekGrid, dayStore, weekStore
    
    var generateDataSet = function (activeTab, doNotReCreateCalendar) {
        var parentCalendar1 = new Gnt.data.Calendar({
                name        : 'Parent1',
                calendarId  : 'Parent1'
            }),
            parentCalendar2 = new Gnt.data.calendar.BusinessTime({
                name        : 'Parent2',
                calendarId  : 'Parent2'
            });
    
        if (!doNotReCreateCalendar) calendar = new Gnt.data.calendar.BusinessTime({
            name            : 'Calendar',
            parent          : parentCalendar1,
            data            : [
                {
                    Id              : 'initial',
                    Date            : new Date(2010, 0, 13),
                    Name            : 'foo',
                    Cls             : 'gnt-national-holiday'
                }
            ]
        });
        
        if (calendarWidget) calendarWidget.destroy()
    
        calendarWidget = new Gnt.widget.calendar.Calendar({
            calendar    : calendar,
            height      : 550,
            width       : 600,
            renderTo    : Ext.getBody()
        });
        
        calendar        = calendar
        dayGrid         = calendarWidget.getDayGrid()
        weekGrid        = calendarWidget.getWeekGrid()
        dayStore        = dayGrid.getStore()
        weekStore       = weekGrid.getStore()
        
        if (activeTab != null) dayGrid.ownerCt.getLayout().setActiveItem(activeTab)
    }
    
    var today       = Ext.Date.clearTime(new Date())
    var today1wp    = Ext.Date.clearTime(Sch.util.Date.add(new Date(), Sch.util.Date.WEEK, 1))
    var today1wm    = Ext.Date.clearTime(Sch.util.Date.add(new Date(), Sch.util.Date.WEEK, -1))
    
    t.it('Adding day override should work', function (t) {
        generateDataSet()
        
        t.is(dayStore.getCount(), 1, "1 day override should present already");
        t.is(calendar.getCount(), 1, "1 day override should present already");
    
        t.chain(
            // test adding day override
            {
                click : function () { return dayGrid.el.down('.gnt-action-add') }
            },
            function (next) {
                t.is(dayStore.getCount(), 2, 'Day override successfully added.');
                t.is(dayStore.getAt(0).get('Date'), today, 'and it has current date');
    
                t.firesOk({
                    observable      : calendar,
                    events          : { update : 0, add : 1, remove : 0 },
                    
                    during          : function () {
                        calendarWidget.applyChanges()
                    }
                })
                
                t.is(calendar.getCount(), 2, 'Day override succcessfully added to the original calendar')
                
                var newOverride     = calendar.getAt(1)
                
                t.is(newOverride.get('Date'), today, 'and it has current date');
                t.notOk(newOverride.get('Id'), 'and it has empty Id');
                t.is(newOverride.get('Type'), 'DAY', 'and it has default type');
            }
        )
    })

    
    t.it('Editing day override name and date should work', function (t) {
        generateDataSet()
            
        t.chain(
            // test editing day override name and date
            { clickToEditCell : [ dayGrid, 0, 0 ] },
    
            function (next) {
                //select input of the editor...
                var editor = dayGrid.editingPlugin.getActiveEditor();
                editor.setValue('BAR');
                editor.completeEdit();
                next();
            },
            
            { clickToEditCell : [ dayGrid, 0, 1 ] },
            
            function (next) {
                var editor = dayGrid.editingPlugin.getActiveEditor();
    
                editor.setValue(Sch.util.Date.add(editor.getValue(), Sch.util.Date.DAY, 1));
                
                editor.completeEdit();
                
                t.firesOk({
                    observable      : calendar,
                    events          : { update : 1, add : 0, remove : 0 },
                    
                    during          : function () {
                        calendarWidget.applyChanges()
                    }
                })
                
                t.is(calendar.getById('initial').getName(), 'BAR', 'Name correctly changed')
                t.is(calendar.getById('initial').getDate(), new Date(2010, 0, 14), 'Date correctly incremented on 1 day')
            }
        )
    })
    
    t.it('Editing day override availability should work', function (t) {
        generateDataSet()
        
        var availabilityGrid
            
        t.chain(
            { click : function () { return t.getCell(dayGrid, 0, 0) } },
            
            { click : function () { return dayGrid.el.down('.gnt-action-edit') } },
            
            { 
                click : function () {
                    availabilityGrid    = calendarWidget.currentDayOverrideEditor
                    
                    return availabilityGrid.down('radiogroup [inputValue=true]') 
                } 
            },
            
            { click : function () { return availabilityGrid.addButton } },
            
            { clickToEditCell : function () { return [ availabilityGrid, 0, 0 ] } },
            function (next) {
                var editor = availabilityGrid.editingPlugin.getActiveEditor();
                editor.setValue('12:00AM');
                editor.completeEdit();
                
                next()
            },
            
            { clickToEditCell : function () { return [ availabilityGrid, 0, 1 ] } },
            function (next) {
                var editor = availabilityGrid.editingPlugin.getActiveEditor();
                editor.setValue('12:00AM');
                editor.completeEdit();
                
                next()
            },
            
            { click : function () { return availabilityGrid.ownerCt.down('button[text=OK]') } },
            
            function (next) {
                calendarWidget.applyChanges()
                
                t.isDeeply(calendar.getById('initial').getAvailability(), [
                    {
                        startTime       : new Date(0, 0, 0, 0, 0),
                        endTime         : new Date(0, 0, 1, 0, 0)
                    }
                ], '24h availability correctly saved in the calendar')
                
                t.isDeeply(calendar.getById('initial').getAvailability(true), [ '00:00-24:00' ], '24h availability correctly saved in string form in the calendar')
                
                next()
            }
        )
    })
    
        
    t.it('Adding and removing day override should work', function (t) {
        generateDataSet()
    
        t.chain(
            // test adding and removing day override
            {
                click : function () { return dayGrid.el.down('.gnt-action-add') }
            },
            {
                click : function () { return t.getCell(dayGrid, 1, 0) } 
            },
            {
                click : function () { return dayGrid.el.down('.gnt-action-remove') }
            },
            function (next) {
                t.firesOk({
                    observable      : calendar,
                    events          : { update : 0, add : 1, remove : 1 },
                    
                    during          : function () {
                        calendarWidget.applyChanges()
                    }
                })
            }
        )
    })
    
    t.it('Adding empty week override should work', function (t) {
        generateDataSet(1)
            
        t.chain(
            
            // test adding empty week override
            {
                click : function () { return weekGrid.el.down('.gnt-action-add') }
            },
            function (next) {
                t.is(weekStore.getCount(), 1, 'Week override successfully added.');
                t.is(weekStore.getAt(0).get('startDate'), today, 'and it has correct start date');
                t.is(weekStore.getAt(0).get('endDate'), today1wp, 'and it has correct end date');
                
                t.firesOk({
                    observable      : calendar,
                    events          : { update : 0, add : 1, remove : 0 },
                    
                    during          : function () {
                        calendarWidget.applyChanges()
                    }
                })
    
                t.is(calendar.getCount(), 2, 'Since new week override is empty, only a its main day should be added to the calendar')
                
                var newOverride     = calendar.getAt(1)
                
                t.notOk(newOverride.get('Id'), 'and it has empty Id');
                t.notOk(newOverride.get('Date'), 'and it has empty Date');
                t.is(newOverride.get('Type'), 'WEEKDAYOVERRIDE', 'and it has correct type of week day override');
                
                t.is(newOverride.getOverrideStartDate(), today, 'and it has correct start date');
                t.is(newOverride.getOverrideEndDate(), today1wp, 'and it has correct end date');
                
                var nonStandardWeek = calendar.getNonStandardWeekByStartDate(new Date())
                
                t.is(nonStandardWeek.startDate, today, 'correct start date for new week');
                t.is(nonStandardWeek.endDate, today1wp, 'correct end date for new week');
                
                t.is(nonStandardWeek.mainDay, newOverride, 'Main day correct set on the week object')
            }
        )
    })

    t.it('Adding week override with some re-defined days should work', function (t) {
        generateDataSet(1)
            
        t.chain(
    
            // test adding week override with some re-defined days
            {
                click : function () { return weekGrid.el.down('.gnt-action-add') }
            },
            {
                click : function () { return t.getCell(weekGrid, 0, 0) } 
            },
            {
                click : function () { return weekGrid.el.down('.gnt-action-edit') }
            },
            {
                click : function () { return t.cq1('calendarweekeditor').getDayTypeRadioGroup().el.query('input')[ 1 ] }
            },
            {
                click : function () { return t.cq1('calendarweekeditor').ownerCt.query('button[action=ok]')[ 0 ] }
            },
            
            function (next) {
                t.firesOk({
                    observable      : calendar,
                    events          : { update : 0, add : 1, remove : 0 },
                    
                    during          : function () {
                        calendarWidget.applyChanges()
                    }
                })
    
                t.is(calendar.getCount(), 3, 'Since new week override has 1 day, should be 3 days in the store: 1 original, 1 main + 1 week override day')
                
                var nonStandardWeek = calendar.getNonStandardWeekByStartDate(new Date())
                
                t.is(nonStandardWeek.startDate, today, 'correct start date for new week');
                t.is(nonStandardWeek.endDate, today1wp, 'correct end date for new week');
                
                // monday
                var overridenDay    = nonStandardWeek.weekAvailability[ 1 ]
                
                t.is(overridenDay.getType(), 'WEEKDAYOVERRIDE');
                t.is(overridenDay.getName(), nonStandardWeek.name, 'Name of overriden day is the same with week object');
                t.is(overridenDay.getName(), nonStandardWeek.mainDay.getName(), 'Name of overriden day is the same with the week main day');
                t.is(overridenDay.getOverrideStartDate(), today)
                t.is(overridenDay.getOverrideEndDate(), today1wp)
                t.notOk(overridenDay.get('Id'));
                t.notOk(overridenDay.get('Date'));
                
                // keeps the current calendar - can't be in own "iit"
                generateDataSet(1, true)
                
                next()
            },
            
            // test the editing of the week override created in the previous test
            function (next) {
                t.is(weekStore.getCount(), 1, '1 week override should present in the week grid from start - was created in the previous step')
                
                next()
            },
            {
                // click on the row to select it
                click : function () { return t.getCell(weekGrid, 0, 0) } 
            },        
            {
                click : function () { return weekGrid.el.down('.gnt-action-edit') }
            },
            {
                // chaing the type of the Monday to "default" - should remove the according day from week availability
                click : function () { return t.cq1('calendarweekeditor').getDayTypeRadioGroup().el.query('input')[ 0 ] }
            },
            function (next) {
                // selecting the Friday (by index in the store)
                t.cq1('calendarweekeditor').getWeekDaysGrid().getSelectionModel().select(4)
                
                next()
            },
            {
                // chaing the type of the Friday to "non-working day" - should add availability day
                click : function () { return t.cq1('calendarweekeditor').getDayTypeRadioGroup().el.query('input')[ 2 ] }
            },
            {
                click : function () { return t.cq1('calendarweekeditor').ownerCt.query('button[action=ok]')[ 0 ] }
            },
            
            { clickToEditCell : function () { return [ weekGrid, 0, 0 ] } },
            function (next) {
                var editor  = weekGrid.editingPlugin.getActiveEditor();
                editor.setValue('WEEKFOO');
                editor.completeEdit();
                next();
            },
            { clickToEditCell : function () { return [ weekGrid, 0, 1 ] } },
            function (next) {
                var editor  = weekGrid.editingPlugin.getActiveEditor();
                editor.setValue(today1wm);
                editor.completeEdit();
                next();
            },
            function (next) {
                // 1 update for main day
                // 1 removal of the Monday
                // 1 addition for the Friday
                t.firesOk({
                    observable      : calendar,
                    events          : { update : 1, add : 1, remove : 1 },
                    
                    during          : function () {
                        calendarWidget.applyChanges()
                    }
                })
                
                t.is(calendar.getCount(), 3, 'Since new week override has 1 day, should be 3 days in the store: 1 original, 1 main + 1 week override day')
                
                t.notOk(calendar.getNonStandardWeekByStartDate(new Date()), 'Should no longer find a non-standard week at the current date')
                
                var nonStandardWeek = calendar.getNonStandardWeekByStartDate(today1wm)
                
                t.is(nonStandardWeek.startDate, today1wm, 'correct start date for new week');
                t.is(nonStandardWeek.endDate, today1wp, 'correct end date for new week');
                
                t.notOk(nonStandardWeek.weekAvailability[ 1 ], 'Monday override was removed from the week availability')
                
                // friday
                var overridenDay    = nonStandardWeek.weekAvailability[ 5 ]
                
                t.is(overridenDay.getType(), 'WEEKDAYOVERRIDE');
                t.is(overridenDay.getName(), 'WEEKFOO', 'Found the newly entered name for the week override');
                t.is(overridenDay.getName(), nonStandardWeek.name, 'Name of overriden day is the same with week object');
                t.is(overridenDay.getName(), nonStandardWeek.mainDay.getName(), 'Name of overriden day is the same with the week main day');
                t.is(overridenDay.getOverrideStartDate(), today1wm)
                t.is(overridenDay.getOverrideEndDate(), today1wp)
                t.notOk(overridenDay.get('Id'));
                t.notOk(overridenDay.get('Date'));
                
                // keeps the current calendar - can't be in own "iit"
                generateDataSet(1, true)
                
                next()
            },
            
            // test the removal of the week override edited in the previous test
            function (next) {
                t.is(weekStore.getCount(), 1, '1 week override should present in the week grid from start - was created in the previous step')
                
                next()
            },
            {
                // click on the row to select it
                click : function () { return t.getCell(weekGrid, 0, 0) } 
            },        
            {
                click : function () { return weekGrid.el.down('.gnt-action-remove') }
            },
            
            function (next) {
                // 0 update 
                // 2 removal - 1 main + 1 override 
                // 0 addition
                
                t.firesOk({
                    observable      : calendar,
                    events          : { update : 0, add : 0, remove : 2 },
                    
                    during          : function () {
                        calendarWidget.applyChanges()
                    }
                })
                
                t.is(calendar.getCount(), 1, 'Should remain only initial override')
                
                t.notOk(calendar.getNonStandardWeekByStartDate(new Date()), 'Should no longer find a non-standard week at the current date')
                t.notOk(calendar.getNonStandardWeekByStartDate(today1wm), 'Should no longer find a non-standard week at the current date - 1 week')
            }
        )
    })
});
