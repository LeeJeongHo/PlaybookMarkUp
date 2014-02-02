/*
 * FOR THE TESTS TO WORK, YOU NEED TO HAVE YOUR EXT JS SDK FOLDER ON THE SAME LEVEL AS THE EXT SCHEDULER/GANTT FOLDER
 */

var Harness = Siesta.Harness.Browser.ExtJS;
var extRoot = Harness.getQueryParam('extroot');
var debug = typeof Ext !== "undefined";  // Use debug versions when a browser harness is present
var targetExtVersions;

// Using external Ext copy
if (extRoot) {
    // strip any trailing slashes
    extRoot = extRoot.replace(/\/$/, '')
    targetExtVersions = ['external'];
} else {
    targetExtVersions = [
        '4.2.1',
        '4.2.2'
    ];
}

var injectVersion = function (items, version) {

    for (var i = 0; i < items.length; i++) {
        var test = items[ i ];

        if (typeof test == 'string') test = { url : test }

        if (test.items)
            injectVersion(test.items, version);
        else {
            test.name = test.url.replace(/(?:.*\/)?([^/]+)$/, '$1')
            test.url += (test.url.match(/\?/) ? '&' : '?') + 'Ext=' + version;
        }

        items[ i ] = test
    }
};

Harness.configure({
    title                   : 'Ext Gantt Test Suite',

    keepResults             : false,
    testClass               : Bryntum.Test,

    allowExtVersionChange   : true,
    disableCaching          : false,
    autoCheckGlobals        : true,
    overrideSetTimeout      : true,

    enableCodeCoverage      : Boolean(window.IstanbulCollector),
    coverageUnit            : 'extjs_class',

    expectedGlobals         : [
        'Sch',
        'Gnt'
    ]
});

var topItems = [];

function getTestSuite(extRoot, version) {
    var suite = [
        {
            group : 'Scheduling Modes',

            forceDOMVisible : false, // test group for data-model only!

            items : [
                'scheduling_modes/data_model.t.js',
                'scheduling_modes/data_model_calendar.t.js',

                'scheduling_modes/availability1.t.js',
                'scheduling_modes/availability2.t.js',

                'scheduling_modes/effort_conversion.t.js',

                'scheduling_modes/fixed_duration.t.js',
                'scheduling_modes/fixed_duration2.t.js',

                'scheduling_modes/effort_driven.t.js',
                'scheduling_modes/effort_driven2.t.js',
                'scheduling_modes/effort_driven3.t.js',

                'scheduling_modes/dynamic_allocation.t.js',
                'scheduling_modes/dynamic_allocation_2.t.js',

                'scheduling_modes/resource_allocation.t.js',
                'scheduling_modes/resource_calendar.t.js',
                'scheduling_modes/task_calendar.t.js',

                'scheduling_modes/constrain.t.js',
                'scheduling_modes/task_with_own_calendar_and_assignments.t.js'
            ]
        },
        {
            group           : 'Sanity',
            forceDOMVisible : false,

            items : [
                'sanity/010_sanity.t.js',

                // For this test work, you also need a copy of the Ext Scheduler source files
                {
                    url     : 'sanity/011_on_demand.t.js',
                    preload : [
                        extRoot + "/ext-debug.js"
                    ]
                },
                'sanity/012_no_overrides.t.js',
                {
                    url         : 'sanity/013_lint.t.js',
                    alsoPreload : [ "sanity/jshint.js" ]
                },
                'sanity/014_subclassing.t.js',
                {
                    url         : 'sanity/017_private_method_overrides.t.js',
                    alsoPreload : ['sanity/symbols.js']
                },
                'sanity/015_taskstore_events.t.js',

                // For this test work, you also need a copy of the Ext Scheduler source files
                {
                    url     : 'sanity/018_on_demand_full.t.js',
                    preload : [
                        extRoot + "/ext-debug.js"
                    ]
                },
                {
                    url     : 'sanity/019_unscoped_css_rules.t.js',
                    preload : [
                        '../resources/css/sch-gantt-all.css',
                        extRoot + '/ext-all.js'
                    ]
                },
                {
                    url             : 'sanity/020_sencha_cmd_app.t.js',
                    hostPageUrl     : 'cmd_app/build/production/TestApp/'
                }
            ]
        },
        {
            group : 'Dependencies',

            items : [
                'legacyIE:dependencies/200_reorder_task.t.js',
                'legacyIE:dependencies/201_create.t.js',
                {
                    url             : 'dependencies/202_dnd_container_scroll.t.js',
                    forceDOMVisible : true
                },
                'legacyIE:dependencies/203_critical_path.t.js',
                'legacyIE:dependencies/204_rendering.t.js',
                'legacyIE:dependencies/205_buffered_dependencies.t.js',
                'legacyIE:dependencies/206_cyclic_detection.t.js',
                'legacyIE:dependencies/207_rendering_edges.t.js',
                'legacyIE:dependencies/208_repaint_triggers.t.js',
                {
                    scopeProviderConfig : { useStrictMode : false },
                    url                 : 'legacyIE:dependencies/209_terminal_zindex.t.js?quirks'
                },
                'legacyIE:dependencies/209_terminal_zindex.t.js',
                'legacyIE:dependencies/210_null_dates.t.js',
                'legacyIE:dependencies/211_z-index.t.js',
                'dependencies/212_add_lockedview_repaint.t.js',
                'dependencies/213_tasks_outside_view.t.js',
                'dependencies/214_dependency_view_events.t.js',
                'dependencies/215_delete_row_with_dependencies.t.js'
            ]
        },
        {
            group : 'State',

            items : [
                'state/130_stateful.t.js'
            ]
        },
        {
            group : 'Localization',

            items : [
                'localization/900_localization.t.js',
                'localization/901_missing.t.js',
                'localization/902_unused.t.js',
                'localization/903_legacy.t.js',
                {
                    url : 'localization/904_on_demand.t.js',
                    preload : [
                        extRoot + "/ext-debug.js"
                    ]
                },
                'localization/905_superclass.t.js'
            ]
        },
        {
            group           : 'Data components',
            forceDOMVisible : false,

            items : [
                'data_components/020_calendar.t.js',
                'data_components/021_calendar_raw.t.js',
                'data_components/022_calendar_loading.t.js',
                'data_components/023_custom_taskmodel_fields.t.js',
                'data_components/024_taskstore_calendar_loading_changing.t.js',
                'data_components/024_calendar_late_binding.t.js',
                'data_components/025_calendar_custom_weekend.t.js',
                'data_components/026_taskstore.t.js',
                'data_components/027_taskmodel_in_treestore.t.js',
                'data_components/028_calendar_dst.t.js',
                'data_components/029_assignment_missing_resource.t.js',
                'data_components/030_task.t.js',
                'data_components/031_task_manual.t.js',
                'data_components/032_task_index.t.js',
                'data_components/033_task_lag.t.js',
                'data_components/033_task_lag_with_units.t.js',
                'data_components/034_taskstore_getTotalTimespan.t.js',

                'data_components/035_task_indent.t.js',
                'data_components/035_task_indent2.t.js',
                'data_components/035_task_indent_dirty.t.js',
                'data_components/036_recalculate_parents.t.js',
                'data_components/036_recalculate_parents_effort.t.js',
                'data_components/036_recalculate_parents_percent_done.t.js',
                'data_components/036_cascade_changes_perf_regr.t.js',
                'data_components/037_task_indent_update.t.js',
                'data_components/038_task_model.t.js',
                'data_components/039_parent_task_update.t.js',
                'data_components/040_depedency_model.t.js',
                'data_components/041_depedency_model_crud.t.js',
                'data_components/042_depedency_store.t.js',
                'data_components/042_depedency_store2.t.js',
                'data_components/043_nested_beginedit.t.js',

                'data_components/050_assignment.t.js',
                'data_components/061_sorting.t.js',
                'data_components/062_reload_store.t.js',
                'data_components/063_store_ids.t.js',

                'data_components/cross-dst-task.t.js',
                'data_components/064_model_binding_to_taskstore.t.js',
                'data_components/065_task_milestone_startdate.t.js',
                'data_components/064_task_is_above.t.js',

                'data_components/066_load_store.t.js',
                'data_components/067_cascade_on_scheduling_mode.t.js',
                'data_components/068_total_time_span_cache.t.js',
                'data_components/069_task_outdent_recalc.t.js',
                'data_components/070_task_indent_drop_deps.t.js',
                'data_components/072_resource_allocation_info.t.js',
                'data_components/072_resource_allocation_info2.t.js',
                'data_components/073_lag_processing.t.js',
                'data_components/074_resource_skip_void_tasks.t.js',
                'data_components/075_task_insertbefore.t.js',
                'data_components/076_reorder_task.t.js',
                'data_components/077_task_replace_child.t.js',

                'data_components/080_milestone_skipnonworkingtime.t.js',
                'data_components/090_move_parent_task.t.js',
                'data_components/091_move_parent_task_cascade.t.js',

                'data_components/092_task_sequence_number.t.js',
                'data_components/093_cascade_changes.t.js',

                'data_components/100_deps_from_to_parent_task.t.js',
                'data_components/110_dependencies_caching.t.js',
                'data_components/120_cycles_protection.t.js'
            ]
        },
        {
            group           : 'Life cycles',
            forceDOMVisible : false,

            items : [
                'lifecycle/040_lifecycle.t.js',
                {
                    alsoPreload : [
                        "../../ExtScheduler2.x/sch-all-debug.js"
                    ],
                    url         : 'lifecycle/042_gantt_scheduler.t.js'
                },

                'lifecycle/044_gantt_in_autoWidth_panel.t.js'
            ]
        },
        {
            group : 'CSS',

            items : [
                'css/041_task_hover_css_class.t.js',
                'css/043_task_css_classes.t.js'
            ]
        },
        {
            group : 'Performance',

            items : [
                'performance/010_meta_data_change.t.js',
                'performance/011_task_update.t.js',
                'performance/012_editor_layouts.t.js',
                'performance/212_cascade_no_layouts.t.js',
                'performance/013_add_remove_update_layouts.t.js'
            ]
        },
        {
            group : 'CRUD',

            items : [
                'crud/060_crud.t.js',
                'crud/061_ui_with_clear_on_load.t.js',
                'crud/063_crud_autosync_with_ui.t.js',
                'crud/064_autosync_successor.t.js',
                'crud/065_autosync_predecessor.t.js',
                'crud/066_autosync_add_subtask.t.js',
                'crud/067_phantom_parent.t.js',
                'crud/067_phantom_parent2.t.js',
                'crud/068_assignment_crud.t.js',
                'crud/069_crud_autosync_with_ui_2.t.js',
                'crud/070_crud_modify_during_sync.t.js',
                'crud/071_loadData.t.js'
            ]
        },
        {
            group : 'Columns',

            items : [
                'legacyIE:columns/1000_cols_dirty_reset.t.js',
                'legacyIE:columns/1001_enddate.t.js',
                {
                    url             : 'legacyIE:columns/1002_tabbing.t.js',
                    forceDOMVisible : true
                },
                {
                    url             : 'legacyIE:columns/1002_tabbing_2.t.js',
                    forceDOMVisible : true
                },
                'legacyIE:columns/1003_enddate_milestone.t.js',
                'legacyIE:columns/1004_enddate2.t.js',
                'legacyIE:columns/1005_startdate.t.js',
                'legacyIE:columns/1006_date_clear.t.js',
                'legacyIE:columns/start_end_dates_editing.t.js',
                'legacyIE:columns/start_end_dates_editing_461.t.js',
                'legacyIE:columns/1007_predecessor.t.js',
                'legacyIE:columns/1008_addnew.t.js',
                'legacyIE:columns/1009_wbs.t.js',
                'legacyIE:columns/1010_percentdone.t.js',
                'legacyIE:columns/1011_schedulingmode.t.js',
                'legacyIE:columns/1012_resource_assignment.t.js',
                'legacyIE:columns/1013_duration.t.js',
                'legacyIE:columns/1014_dependency.t.js',
                'legacyIE:columns/1015_enddate_3.t.js',
                'legacyIE:columns/1016_earlylate.t.js',
                'legacyIE:columns/1017_duration_editor_place.t.js',
                'legacyIE:columns/1018_reorder_task.t.js',
                'legacyIE:columns/1019_effort.t.js',
                'legacyIE:columns/1020_sequence.t.js',
                'legacyIE:columns/1021_sequence.t.js'
            ]
        },
        {
            group : 'Fields',

            items : [
                'fields/10_startdate.t.js',
                'fields/11_startdate_null.t.js',
                'fields/10_startdate_with_time.t.js',
                'fields/12_startdate_new_milestone.t.js',
                'fields/13_startdate_editable.t.js',
                'fields/20_enddate.t.js',
                'fields/21_enddate_with_time.t.js',
                'legacyIE:fields/30_duration.t.js',
                'legacyIE:fields/40_schedulingmode.t.js',
                'legacyIE:fields/50_calendar.t.js',
                'legacyIE:fields/60_startdate_enddate.t.js',
                'legacyIE:fields/65_startdate_enddate2.t.js',
                'legacyIE:fields/70_dependency.t.js'
            ]
        },
        {
            group       : 'Composite & advanced tests',
            alsoPreload : [
                '../../ExtScheduler2.x/resources/css/sch-all.css',
                '../../ExtScheduler2.x/sch-all-debug.js'
            ],
            items       : [
                'composite/1100_gantt_scheduler.t.js',
                {
                    hostPageUrl : '../examples/gantt-scheduler/gantt-scheduler.html',
                    url         : 'composite/1101_gantt_scheduler2.t.js'
                }
            ]
        },
        {
            group : 'Plugins',

            items : [
                'legacyIE:plugins/090_cell_editing.t.js',
                'legacyIE:plugins/091_task_context_menu.t.js',
                'legacyIE:plugins/092_dependency_editor.t.js',
                'plugins/093_export.t.js',
                'plugins/094_print.t.js',
                'legacyIE:plugins/095_task_context_menu2.t.js',
                'legacyIE:plugins/096_taskeditor.t.js',
                'legacyIE:plugins/097_export_dependencies.t.js',
                'legacyIE:plugins/098_export_dependencies_range.t.js'
            ]
        },
        {
            group : 'Features',

            items : [
                'legacyIE:features/1200_label_editing.t.js',
                'legacyIE:features/1201_resize.t.js',
                'legacyIE:features/1201_resize2.t.js',
                'legacyIE:features/1202_dragcreator.t.js',
                'legacyIE:features/1203_working_time.t.js',
                'legacyIE:features/1204_dragdrop.t.js',
                'legacyIE:features/1205_dragcreator.t.js'
            ]
        },
        {
            group : 'Early/Late dates',

            items : [
                'earlylate_dates/010_earlylate_dates.t.js',
                'earlylate_dates/011_dependencies_changes.t.js',
                'earlylate_dates/012_cache_invalidate.t.js',
                'earlylate_dates/012_cache_invalidate2.t.js',
                'earlylate_dates/012_cache_invalidate_manual_task.t.js'
            ]
        },
        {
            group : 'Event API & Interaction',

            items : [
                'legacyIE:event/050_task_events.t.js',
                'legacyIE:event/051_schedule_events.t.js',
                'event/052_dependency_events.t.js',
                'event/053_update_events.t.js'
            ]
        },
        {
            group : 'Task Bar Interaction',

            items : [
                'legacyIE:taskbar/070_interaction_dnd.t.js',
                'legacyIE:taskbar/071_interaction_progress_dnd.t.js',
                'legacyIE:taskbar/072_dd_container_scroll.t.js',
                'legacyIE:taskbar/073_task_resize.t.js',
                'legacyIE:taskbar/074_drag_parent.t.js',
                'legacyIE:taskbar/075_sel_model.t.js',
                'legacyIE:taskbar/076_click_parent_task.t.js'
            ]
        },
        {
            group : 'Rendering',

            items : [
                'rendering/080_highlight_weekends.t.js',
                'rendering/081_highlight_tasks.t.js',
                'rendering/082_highlight_tasks_no_scroll.t.js',
                {
                    scopeProviderConfig : { useStrictMode : true },
                    url                 : 'rendering/083_baseline.t.js?strict'
                },
                {
                    scopeProviderConfig : { useStrictMode : false },
                    url                 : 'rendering/083_baseline.t.js?quirks'
                },
                'rendering/084_task_missing_data.t.js',
                'legacyIE:rendering/085_scroll_size.t.js',
                'legacyIE:rendering/086_cascade_redraw.t.js',
                'legacyIE:rendering/090_task_fields.t.js',
                'rendering/113_animated_collapse_expand.t.js',
                'rendering/114_sel_model.t.js',
                'legacyIE:rendering/115_collapse_expand.t.js',
                'legacyIE:rendering/116_locked_grid_cell_height.t.js',
                'legacyIE:rendering/174_column_headers_widths.t.js',
                'legacyIE:rendering/columnlines_misalignment.t.js',
                'rendering/202_custom_template.t.js',
                'rendering/203_zoom_to_fit_span.t.js'
            ]
        },
        {
            group : 'Validation',

            items : [
                'validation/169_cascade_bug.t.js',
                'validation/172_overriding_params.t.js'
            ]
        },
        {
            group : 'View',

            items : [
                'view/200_view.t.js',
                'view/201_dependency.t.js',
                'view/202_treenode_reorder.t.js',
                'view/203_buffered_view_1.t.js',
                'view/203_buffered_view_2.t.js',
                'view/203_buffered_view_3.t.js',
                'view/203_buffered_view_4.t.js',
                'view/203_buffered_view_5.t.js',
                'view/203_buffered_view_6.t.js',
                'view/204_view_xmlstore.t.js',
                'view/205_taskmodel_in_ext_tree.t.js',
                'view/206_load_collapsed.t.js',
                'view/207_dependency_drawing.t.js',
                {
                    preload : [
                        extRoot + '/ext-all-rtl.js',
                        extRoot + '/resources/css/ext-all-rtl.css',

                        '../gnt-all-debug.js',
                        '../resources/css/sch-gantt-all.css'
                    ],
                    url     : 'view/207_dependency_drawing_rtl.t.js'
                },
                'view/208_scroll_into_view.t.js',
                'view/209_sort_and_filter.t.js',
                'view/210_no_width_available.t.js',
                'view/211_view_ui_elements.t.js',
                {
                    hostPageUrl : '../examples/advanced/advanced.html',
                    url : 'view/212_scroll_after_cascade.t.js'
                },
                'view/213_indent.t.js',
                'view/214_keynav.t.js',
                'view/215_dependencyStore_population.t.js',
                'view/216_indent_dependencies.t.js'
            ]
        },
        {
            group : 'Widget',

            items : [
                'widget/1100_durationfield.t.js',
                'widget/1101_assignmentfield.t.js',
                'widget/1103_calendar.t.js',
                'widget/1104_assignmentgrid.t.js',
                'widget/1105_dependencygrid.t.js',
                'widget/1106_assignmenteditgrid.t.js',
                'widget/1107_taskform.t.js',
                'widget/1108_dependencygrid_phantoms.t.js',
                'widget/1109_calendar_load.t.js',
                'widget/1110_assignmenteditgrid_combo_filter.t.js',
                'widget/1111_dependencygrid_tasks_refresh.t.js',
                'widget/1112_calendar_save_changes.t.js',
                'widget/1113_dependencygrid_negative_lag.t.js'
            ]
        },
        {
            group : 'Panel',

            items : [
                'panel/1200_panel_store_bindings.t.js',
                'panel/1201_panel_property_translation.t.js',
                {
                    preload : [
                        { text : 'Ext = {buildSettings: {scopeResetCSS: true}};' },
                        extRoot + '/resources/css/ext-all-scoped.css',
                        extRoot + "/ext-all-debug.js",
                        '../gnt-all' + (debug ? '-debug' : '') + '.js',
                        '../resources/css/sch-gantt-all.css'
                    ],
                    url     : 'panel/1202_css_scoping.t.js'
                },
                'panel/1203_lockable_spacer.t.js',
                'panel/1204_panel_scroll_rowclick.t.js',
                'panel/1205_child_panels.t.js',
                'panel/1206_select_then_sort.t.js',
                'panel/1207_resizing_column.t.js',
                'panel/1208_expand_collapse_panels.t.js',
                'panel/1209_click_row_scroll.t.js',
                'panel/1210_start_end_dates.t.js'
            ]
        },
        {
            group : 'Histogram',

            items : [
                'histogram/00_build_bars.t.js',
                'histogram/10_refresh.t.js',
                'histogram/20_view_renderers.t.js',
                'histogram/21_reacting_to_timeaxis.t.js',
                'histogram/30_bar_events.t.js',
                'histogram/31_initialization.t.js',
                'histogram/32_view_renderers_after_respan.t.js'
            ]
        },
        {
            group : 'Util',

            items : [
                'util/300_dependency_parser.t.js',
                'util/301_duration_parser.t.js'
            ]
        },
        {
            group : 'Ext bugs',

            items : [
                'ext_bugs/010_removing_all_records.t.js'
            ]
        }
    ];


    injectVersion(suite, version);

    return suite;
}


// Add one top group per supported Ext JS version
for (var i = 0; i < targetExtVersions.length; i++) {
    var version = targetExtVersions[i];
    var root = extRoot || '../../extjs-' + version;

    topItems.push({
        group    : extRoot ? extRoot : ('Ext JS ' + version),

        // Only expand latest supported version
        expanded : i === targetExtVersions.length - 1,

        preload : [
            // For local debugging, ext-all-debug.js is optimal
            // For nightly test runs, we use ext-all.js which is faster
            // For nightly test runs in Webkit browsers we use ext-all-dev.js which outputs more warnings and error messages (will be slower)
            root + '/ext-all' + (debug ? '-debug' : ($.browser.webkit ? '-dev' : '')) + '.js',
            root + '/resources/css/ext-all.css',

            {
                // specifying type will be optional after merging "coverage" branch
                type        : 'js',
                url         : '../gnt-all-debug.js',
                instrument  : true
            },
            '../resources/css/sch-gantt-all.css'
        ],

        items : getTestSuite(root, version)
    });
}

if (!extRoot) {
    // Inject tests exercising the examples
    var exampleUrls =
            [
                'advanced/advanced.html',
                'assigningresources/resources.html',
                'baseline/baseline.html',
                'basic/basic.html',
                'buffered/buffered.html',
                'calendars/calendar.html',
                'dependencyeditor/dependencyeditor.html',
                'export/gantt-export.html',
                'gantt-print/gantt-print.html',
                'gantt-scheduler/gantt-scheduler.html',
                'holidays/holidays.html',
                'MSProject_import/import.html',
                'reorder/reorder.html',
                'scheduling_modes/scheduling_modes.html',
                'styles/styles.html',
                'taskeditor/taskeditor.html'
            ],
        exampleItems = [];

    for (var i = 0; i < exampleUrls.length; i++) {
        exampleItems[i] = {
            defaultTimeout : $.browser.msie ? 60000 : 30000,
            hostPageUrl : '../examples/' + exampleUrls[i],
            url         : 'legacyIE:sdk_examples/10000_sanity.t.js?' + exampleUrls[i],
            name        : '[' + i + '] ' + exampleUrls[i]
        };
    }

    topItems.push(
        {
            group              : 'Exercising SDK Examples',
            autoCheckGlobals   : false,
            overrideSetTimeout : false,
            preload            : [],
            items              : exampleItems
        }
    );
}

var processIE = function (group) {
    var copy        = []

    Joose.A.each(group, function (item) {
        if (item.group)
            copy.push(Joose.O.extend(item, {
                items       : processIE(item.items)
            }))
        else {
            var isString    = typeof item == 'string'
            var url         = isString ? item : item.url

            var match       = /^legacyIE:(.*)/i.exec(url)
            var striped     = match ? match[ 1 ] : url

            if (!window.IS_LEGACY_IE || match) copy.push(isString ? striped : Joose.O.extend(item, { url : striped }))
        }
    })

    return copy
}

Harness.start.apply(Harness, processIE(topItems));
