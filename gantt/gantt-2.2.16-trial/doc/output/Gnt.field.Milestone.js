Ext.data.JsonP.Gnt_field_Milestone({"tagname":"class","name":"Gnt.field.Milestone","autodetected":{"aliases":true,"alternateClassNames":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"Milestone.js","href":"Milestone.html#Gnt-field-Milestone"}],"extends":"Ext.form.field.ComboBox","aliases":{"widget":["milestonefield"]},"alternateClassNames":[],"mixins":["Gnt.field.mixin.TaskField","Gnt.mixin.Localizable"],"requires":["Ext.data.JsonStore"],"uses":[],"members":[{"name":"highlightColor","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-highlightColor","meta":{}},{"name":"highlightTaskUpdates","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-highlightTaskUpdates","meta":{}},{"name":"instantUpdate","tagname":"cfg","owner":"Gnt.field.Milestone","id":"cfg-instantUpdate","meta":{}},{"name":"l10n","tagname":"cfg","owner":"Sch.mixin.Localizable","id":"cfg-l10n","meta":{}},{"name":"suppressTaskUpdate","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-suppressTaskUpdate","meta":{}},{"name":"task","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-task","meta":{}},{"name":"taskStore","tagname":"cfg","owner":"Gnt.field.mixin.TaskField","id":"cfg-taskStore","meta":{}},{"name":"activeLocaleId","tagname":"property","owner":"Sch.mixin.Localizable","id":"property-activeLocaleId","meta":{"private":true}},{"name":"allowBlank","tagname":"property","owner":"Gnt.field.Milestone","id":"property-allowBlank","meta":{"private":true}},{"name":"displayField","tagname":"property","owner":"Gnt.field.Milestone","id":"property-displayField","meta":{"private":true}},{"name":"forceSelection","tagname":"property","owner":"Gnt.field.Milestone","id":"property-forceSelection","meta":{"private":true}},{"name":"lastHighlight","tagname":"property","owner":"Gnt.field.mixin.TaskField","id":"property-lastHighlight","meta":{"private":true}},{"name":"legacyMode","tagname":"property","owner":"Sch.mixin.Localizable","id":"property-legacyMode","meta":{"private":true}},{"name":"queryMode","tagname":"property","owner":"Gnt.field.Milestone","id":"property-queryMode","meta":{"private":true}},{"name":"taskField","tagname":"property","owner":"Gnt.field.mixin.TaskField","id":"property-taskField","meta":{"private":true}},{"name":"valueField","tagname":"property","owner":"Gnt.field.Milestone","id":"property-valueField","meta":{"private":true}},{"name":"constructor","tagname":"method","owner":"Gnt.field.Milestone","id":"method-constructor","meta":{}},{"name":"L","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-L","meta":{}},{"name":"applyChanges","tagname":"method","owner":"Gnt.field.Milestone","id":"method-applyChanges","meta":{"private":true}},{"name":"applyLocale","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-applyLocale","meta":{"private":true}},{"name":"destroy","tagname":"method","owner":"Gnt.field.Milestone","id":"method-destroy","meta":{"private":true}},{"name":"destroyTaskListener","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-destroyTaskListener","meta":{"private":true}},{"name":"getSuppressTaskUpdate","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-getSuppressTaskUpdate","meta":{"private":true}},{"name":"getValue","tagname":"method","owner":"Gnt.field.Milestone","id":"method-getValue","meta":{"private":true}},{"name":"highlightField","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-highlightField","meta":{"private":true}},{"name":"isLocaleApplied","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-isLocaleApplied","meta":{"private":true}},{"name":"localize","tagname":"method","owner":"Sch.mixin.Localizable","id":"method-localize","meta":{}},{"name":"onSetTask","tagname":"method","owner":"Gnt.field.Milestone","id":"method-onSetTask","meta":{"private":true}},{"name":"onTaskUpdateProcess","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-onTaskUpdateProcess","meta":{"private":true}},{"name":"setSuppressTaskUpdate","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-setSuppressTaskUpdate","meta":{"private":true}},{"name":"setTask","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-setTask","meta":{}},{"name":"setValue","tagname":"method","owner":"Gnt.field.Milestone","id":"method-setValue","meta":{"private":true}},{"name":"updateReadOnly","tagname":"method","owner":"Gnt.field.mixin.TaskField","id":"method-updateReadOnly","meta":{"private":true}},{"name":"valueToVisible","tagname":"method","owner":"Gnt.field.Milestone","id":"method-valueToVisible","meta":{"private":true}}],"code_type":"ext_define","id":"class-Gnt.field.Milestone","component":false,"superclasses":["Ext.form.field.ComboBox"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.form.field.ComboBox<div class='subclass '><strong>Gnt.field.Milestone</strong></div></div><h4>Mixins</h4><div class='dependency'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='docClass'>Gnt.field.mixin.TaskField</a></div><div class='dependency'><a href='#!/api/Gnt.mixin.Localizable' rel='Gnt.mixin.Localizable' class='docClass'>Gnt.mixin.Localizable</a></div><h4>Requires</h4><div class='dependency'>Ext.data.JsonStore</div><h4>Files</h4><div class='dependency'><a href='source/Milestone.html#Gnt-field-Milestone' target='_blank'>Milestone.js</a></div></pre><div class='doc-contents'><p>A specialized field allowing a user to convert regular task to milestone and back.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-highlightColor' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-highlightColor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-highlightColor' class='name expandable'>highlightColor</a> : String<span class=\"signature\"></span></div><div class='description'><div class='short'>A color to use when highlighting the field. ...</div><div class='long'><p>A color to use when highlighting the field. See <a href=\"#!/api/Gnt.field.mixin.TaskField-cfg-highlightTaskUpdates\" rel=\"Gnt.field.mixin.TaskField-cfg-highlightTaskUpdates\" class=\"docClass\">highlightTaskUpdates</a> option.</p>\n<p>Defaults to: <code>'#009900'</code></p></div></div></div><div id='cfg-highlightTaskUpdates' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-highlightTaskUpdates' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-highlightTaskUpdates' class='name expandable'>highlightTaskUpdates</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>When set to true, field will highlight itself when its value is changed due to changes in some other field. ...</div><div class='long'><p>When set to <code>true</code>, field will highlight itself when its value is changed due to changes in some other field.\nFor example when changing the end date of the task, its duration will change as well and will highlight itself.</p>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='cfg-instantUpdate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-cfg-instantUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-cfg-instantUpdate' class='name expandable'>instantUpdate</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Set to false to prevent automatic applying changes to task on each setValue call. ...</div><div class='long'><p>Set to <code>false</code> to prevent automatic applying changes to task on each <a href=\"#!/api/Gnt.field.Milestone-method-setValue\" rel=\"Gnt.field.Milestone-method-setValue\" class=\"docClass\">setValue</a> call.\nTo apply changes manually one can use <a href=\"#!/api/Gnt.field.Milestone-method-applyChanges\" rel=\"Gnt.field.Milestone-method-applyChanges\" class=\"docClass\">applyChanges</a> method.</p>\n<p>Defaults to: <code>false</code></p><p>Overrides: <a href=\"#!/api/Gnt.field.mixin.TaskField-cfg-instantUpdate\" rel=\"Gnt.field.mixin.TaskField-cfg-instantUpdate\" class=\"docClass\">Gnt.field.mixin.TaskField.instantUpdate</a></p></div></div></div><div id='cfg-l10n' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-cfg-l10n' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-cfg-l10n' class='name expandable'>l10n</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Container of locales for the class.</p>\n</div><div class='long'><p>Container of locales for the class.</p>\n</div></div></div><div id='cfg-suppressTaskUpdate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-suppressTaskUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-suppressTaskUpdate' class='name expandable'>suppressTaskUpdate</a> : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>A number flag, when greater than 0 prevents task updates. ...</div><div class='long'><p>A number flag, when greater than 0 prevents task updates.</p>\n<p>Defaults to: <code>0</code></p></div></div></div><div id='cfg-task' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-task' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-task' class='name expandable'>task</a> : <a href=\"#!/api/Gnt.model.Task\" rel=\"Gnt.model.Task\" class=\"docClass\">Gnt.model.Task</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Task being edited. ...</div><div class='long'><p>Task being edited. Field will apply all it's value changes directly to this task (if <a href=\"#!/api/Gnt.field.mixin.TaskField-cfg-instantUpdate\" rel=\"Gnt.field.mixin.TaskField-cfg-instantUpdate\" class=\"docClass\">instantUpdate</a> is <code>true</code>).</p>\n</div></div></div><div id='cfg-taskStore' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-cfg-taskStore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-cfg-taskStore' class='name expandable'>taskStore</a> : <a href=\"#!/api/Gnt.data.TaskStore\" rel=\"Gnt.data.TaskStore\" class=\"docClass\">Gnt.data.TaskStore</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Task store should provided if task being edited is not in any task store yet and thus does not have a calendar. ...</div><div class='long'><p>Task store should provided if task being edited is not in any task store yet and thus does not have a calendar.\nIn such case we'll retrieve a calendar from the task store (project calendar).</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-activeLocaleId' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-property-activeLocaleId' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-property-activeLocaleId' class='name expandable'>activeLocaleId</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>''</code></p></div></div></div><div id='property-allowBlank' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-property-allowBlank' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-property-allowBlank' class='name expandable'>allowBlank</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-displayField' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-property-displayField' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-property-displayField' class='name expandable'>displayField</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'text'</code></p></div></div></div><div id='property-forceSelection' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-property-forceSelection' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-property-forceSelection' class='name expandable'>forceSelection</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-lastHighlight' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-property-lastHighlight' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-property-lastHighlight' class='name expandable'>lastHighlight</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>0</code></p></div></div></div><div id='property-legacyMode' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-property-legacyMode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-property-legacyMode' class='name expandable'>legacyMode</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-queryMode' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-property-queryMode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-property-queryMode' class='name expandable'>queryMode</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'local'</code></p></div></div></div><div id='property-taskField' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-property-taskField' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-property-taskField' class='name expandable'>taskField</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>''</code></p></div></div></div><div id='property-valueField' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-property-valueField' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-property-valueField' class='name expandable'>valueField</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'value'</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Gnt.field.Milestone-method-constructor' class='name expandable'>Gnt.field.Milestone</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Gnt.field.Milestone\" rel=\"Gnt.field.Milestone\" class=\"docClass\">Gnt.field.Milestone</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Gnt.field.Milestone\" rel=\"Gnt.field.Milestone\" class=\"docClass\">Gnt.field.Milestone</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-L' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-L' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-L' class='name expandable'>L</a>( <span class='pre'>id, [legacyHolderProp], [skipLocalizedCheck]</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>This is shorthand reference to localize. ...</div><div class='long'><p>This is shorthand reference to <a href=\"#!/api/Sch.mixin.Localizable-method-localize\" rel=\"Sch.mixin.Localizable-method-localize\" class=\"docClass\">localize</a>. Retrieves translation of a phrase.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Identifier of phrase.</p>\n</div></li><li><span class='pre'>legacyHolderProp</span> : String (optional)<div class='sub-desc'><p>Legacy class property name containing locales.</p>\n<p>Defaults to: <code>this.legacyHolderProp</code></p></div></li><li><span class='pre'>skipLocalizedCheck</span> : Boolean (optional)<div class='sub-desc'><p>Do not localize class if it's not localized yet.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Translation of specified phrase.</p>\n</div></li></ul></div></div></div><div id='method-applyChanges' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-method-applyChanges' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-method-applyChanges' class='name expandable'>applyChanges</a>( <span class='pre'>task</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-applyLocale' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-applyLocale' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-applyLocale' class='name expandable'>applyLocale</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-destroy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-method-destroy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-method-destroy' class='name expandable'>destroy</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-destroyTaskListener' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-destroyTaskListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-destroyTaskListener' class='name expandable'>destroyTaskListener</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getSuppressTaskUpdate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-getSuppressTaskUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-getSuppressTaskUpdate' class='name expandable'>getSuppressTaskUpdate</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-method-getValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-method-getValue' class='name expandable'>getValue</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-highlightField' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-highlightField' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-highlightField' class='name expandable'>highlightField</a>( <span class='pre'>color, options</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>color</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-isLocaleApplied' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-isLocaleApplied' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-isLocaleApplied' class='name expandable'>isLocaleApplied</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-localize' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Sch.mixin.Localizable' rel='Sch.mixin.Localizable' class='defined-in docClass'>Sch.mixin.Localizable</a><br/><a href='source/Localizable2.html#Sch-mixin-Localizable-method-localize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.mixin.Localizable-method-localize' class='name expandable'>localize</a>( <span class='pre'>id, [legacyHolderProp], [skipLocalizedCheck]</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves translation of a phrase. ...</div><div class='long'><p>Retrieves translation of a phrase. There is a shorthand <a href=\"#!/api/Sch.mixin.Localizable-method-L\" rel=\"Sch.mixin.Localizable-method-L\" class=\"docClass\">L</a> for this method.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : String<div class='sub-desc'><p>Identifier of phrase.</p>\n</div></li><li><span class='pre'>legacyHolderProp</span> : String (optional)<div class='sub-desc'><p>Legacy class property name containing locales.</p>\n<p>Defaults to: <code>this.legacyHolderProp</code></p></div></li><li><span class='pre'>skipLocalizedCheck</span> : Boolean (optional)<div class='sub-desc'><p>Do not localize class if it's not localized yet.</p>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Translation of specified phrase.</p>\n</div></li></ul></div></div></div><div id='method-onSetTask' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-method-onSetTask' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-method-onSetTask' class='name expandable'>onSetTask</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onTaskUpdateProcess' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-onTaskUpdateProcess' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-onTaskUpdateProcess' class='name expandable'>onTaskUpdateProcess</a>( <span class='pre'>task, initiator</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>initiator</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-setSuppressTaskUpdate' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-setSuppressTaskUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-setSuppressTaskUpdate' class='name expandable'>setSuppressTaskUpdate</a>( <span class='pre'>inc</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>inc</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-setTask' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-setTask' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-setTask' class='name expandable'>setTask</a>( <span class='pre'>task</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Binds task to the field. ...</div><div class='long'><p>Binds task to the field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : <a href=\"#!/api/Gnt.model.Task\" rel=\"Gnt.model.Task\" class=\"docClass\">Gnt.model.Task</a><div class='sub-desc'><p>Task to bind.</p>\n</div></li></ul></div></div></div><div id='method-setValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-method-setValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-method-setValue' class='name expandable'>setValue</a>( <span class='pre'>value</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>@OVERRIDE ...</div><div class='long'><p>@OVERRIDE</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-updateReadOnly' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Gnt.field.mixin.TaskField' rel='Gnt.field.mixin.TaskField' class='defined-in docClass'>Gnt.field.mixin.TaskField</a><br/><a href='source/TaskField.html#Gnt-field-mixin-TaskField-method-updateReadOnly' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.mixin.TaskField-method-updateReadOnly' class='name expandable'>updateReadOnly</a>( <span class='pre'>task</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>task</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-valueToVisible' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Gnt.field.Milestone'>Gnt.field.Milestone</span><br/><a href='source/Milestone.html#Gnt-field-Milestone-method-valueToVisible' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Gnt.field.Milestone-method-valueToVisible' class='name expandable'>valueToVisible</a>( <span class='pre'>value</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{}});