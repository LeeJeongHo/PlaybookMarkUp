StartTest(function(t) {

    // Here we check that translation will be taken from a parent class if it's not specified for the original class it was requested of

    var dayEditor   = new Gnt.widget.calendar.DayEditor({
        calendarDay : t.getBusinessTimeCalendar().getAt(0)
    });

    t.is(dayEditor.L('removeText'), 'Remove', 'locale removeText grabbed from parent class');

});
