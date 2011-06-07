<%@ page import="org.icescrum.core.domain.Sprint; org.icescrum.core.domain.Task" %>
%{--
- Copyright (c) 2010 iceScrum Technologies.
-
- This file is part of iceScrum.
-
- iceScrum is free software: you can redistribute it and/or modify
- it under the terms of the GNU Affero General Public License as published by
- the Free Software Foundation, either version 3 of the License.
-
- iceScrum is distributed in the hope that it will be useful,
- but WITHOUT ANY WARRANTY; without even the implied warranty of
- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
- GNU General Public License for more details.
-
- You should have received a copy of the GNU Affero General Public License
- along with iceScrum.  If not, see <http://www.gnu.org/licenses/>.
-
- Authors:
-
- Vincent Barrier (vbarrier@kagilum.com)
--}%
<is:tableView>

    <g:set var="poOrSm" value="${sec.access(expression:'productOwner() or scrumMaster()',{true})}"/>
    <g:set var="inProduct" value="${sec.access(expression:'inProduct()',{true})}"/>

    <is:table id="tasks-table">

        <is:tableHeader width="5%" class="table-cell-checkbox">
            <g:checkBox name="checkbox-header"/>
        </is:tableHeader>
        <is:tableHeader width="14%" name="${message(code:'is.task.name')}"/>
        <is:tableHeader width="10%" name="${message(code:'is.task.state')}"/>
        <is:tableHeader width="8%" name="${message(code:'is.task.estimation')}"/>
        <is:tableHeader width="15%" name="${message(code:'is.backlogelement.description')}"/>
        <is:tableHeader width="15%" name="${message(code:'is.backlogelement.notes')}"/>
        <is:tableHeader width="8%" name="${message(code:'is.task.responsible')}"/>
        <is:tableHeader width="7%" name="${message(code:'is.task.date.inprogress')}"/>
        <is:tableHeader width="7%" name="${message(code:'is.task.date.done')}"/>

    %{-- Table group for recurrent tasks --}%
        <is:tableGroup
                elementId="recurrent"
                rendered="${displayRecurrentTasks}"
                editable="[controller:id,action:'updateTable',params:[product:params.product],onExitCell:'submit']">
            <is:tableGroupHeader>
                <is:menu rendered="${inProduct && sprint.state != Sprint.STATE_DONE}" yoffset="4"
                         class="dropmenu-action" id="menu-recurrent" contentView="window/recurrentOrUrgentTask"
                         params="[sprint:sprint,previousSprintExist:previousSprintExist,type:'recurrent',id:id]"/>
                <strong>${message(code: 'is.ui.sprintPlan.kanban.recurrentTasks')}</strong>
            </is:tableGroupHeader>
            <is:tableRows in="${recurrentTasks?.sort{it.rank}}" rowClass="${{task -> task.blocked?'ico-task-1':''}}"
                          var="task" elemID="id">

                <is:tableColumn class="table-cell-checkbox">
                    <g:checkBox name="check-${task.id}"/>
                    <is:menu rendered="${inProduct && sprint.state != Sprint.STATE_DONE}" yoffset="4"
                             class="dropmenu-action" id="story-task-${task.id}" contentView="/task/menu"
                             params="[id:id, task:task, story:story, user:user]"/>
                    <g:set var="attachment" value="${task.totalAttachments}"/>
                    <g:if test="${attachment}">
                        <span class="table-attachment"
                              title="${message(code: 'is.postit.attachment', args: [attachment, attachment > 1 ? 's' : ''])}"></span>
                    </g:if>
                </is:tableColumn>

                <is:tableColumn
                        editable="[type:'text', disabled:!((poOrSm || task.responsible?.id == user.id || task.creator?.id == user.id) && task.state != Task.STATE_DONE),name:'name']">${task.name.encodeAsHTML()}</is:tableColumn>
                <is:tableColumn
                        editable="[type:'selectui',id:'state',disabled:!(task?.responsible?.id == user.id && task?.state != Task.STATE_DONE),name:'state',values:stateSelect]"><is:bundle
                        bundle="taskStates" value="${task.state}"/></is:tableColumn>
                <is:tableColumn
                        editable="[type:'text',disabled:!(task?.responsible && task?.responsible?.id == user.id  && task?.state != Task.STATE_DONE) || (!task?.responsible && task?.creator?.id == user.id && task?.state != Task.STATE_DONE),name:'estimation']">${task.estimation >= 0 ? task.estimation : '?'}</is:tableColumn>
                <is:tableColumn
                        editable="[type:'textarea',disabled:!((poOrSm || task.responsible?.id == user.id || task.creator?.id == user.id) && task.state != Task.STATE_DONE),name:'description']">${task.description?.encodeAsHTML()?.encodeAsNL2BR()}</is:tableColumn>
                <is:tableColumn
                        editable="[type:'richarea',disabled:!((poOrSm || task.responsible?.id == user.id || task.creator?.id == user.id) && task.state != Task.STATE_DONE),name:'notes']">${task.notes}</is:tableColumn>

                <is:tableColumn>${task.responsible?.firstName?.encodeAsHTML()} ${task.responsible?.lastName?.encodeAsHTML()}</is:tableColumn>
                <is:tableColumn>${task.inProgressDate ? g.formatDate(formatName: 'is.date.format.short', date: task.inProgressDate, timezone: user?.preferences?.timezone ?: null) : ''}</is:tableColumn>
                <is:tableColumn>${task.doneDate ? g.formatDate(formatName: 'is.date.format.short', date: task.doneDate, timezone: user?.preferences?.timezone ?: null) : ''}</is:tableColumn>
            </is:tableRows>
        </is:tableGroup>

    %{-- Table group for urgent tasks --}%
        <is:tableGroup
                elementId="urgent"
                rendered="${displayUrgentTasks}"
                editable="[controller:id,action:'updateTable',params:[product:params.product],onExitCell:'submit']">
            <is:tableGroupHeader>
                <is:menu rendered="${inProduct && sprint.state != Sprint.STATE_DONE}" yoffset="4"
                         class="dropmenu-action" id="menu-urgent" contentView="window/recurrentOrUrgentTask"
                         params="[sprint:sprint,type:'urgent',id:id]"/>
                <strong>${message(code: 'is.ui.sprintPlan.kanban.urgentTasks')}</strong>
            </is:tableGroupHeader>
            <is:tableRows in="${urgentTasks?.sort{it.rank}}" rowClass="${{task -> task.blocked?'ico-task-1':''}}"
                          var="task" elemID="id">

                <is:tableColumn class="table-cell-checkbox">
                    <g:checkBox name="check-${task.id}"/>
                    <is:menu rendered="${inProduct && sprint.state != Sprint.STATE_DONE}" yoffset="4"
                             class="dropmenu-action" id="story-task-${task.id}" contentView="/task/menu"
                             params="[id:id, task:task, story:story, user:user]"/>
                    <g:set var="attachment" value="${task.totalAttachments}"/>
                    <g:if test="${attachment}">
                        <span class="table-attachment"
                              title="${message(code: 'is.postit.attachment', args: [attachment, attachment > 1 ? 's' : ''])}"></span>
                    </g:if>
                </is:tableColumn>

                <is:tableColumn
                        editable="[type:'text', disabled:!((poOrSm || task.responsible?.id == user.id || task.creator?.id == user.id) && task.state != Task.STATE_DONE),name:'name']">${task.name.encodeAsHTML()}</is:tableColumn>
                <is:tableColumn
                        editable="[type:'selectui',id:'state',disabled:!(task?.responsible?.id == user.id && task?.state != Task.STATE_DONE),name:'state',values:stateSelect]"><is:bundle
                        bundle="taskStates" value="${task.state}"/></is:tableColumn>
                <is:tableColumn
                        editable="[type:'text',disabled:!(task?.responsible && task?.responsible?.id == user.id  && task?.state != Task.STATE_DONE) || (!task?.responsible && task?.creator?.id == user.id && task?.state != Task.STATE_DONE),name:'estimation']">${task.estimation >= 0 ? task.estimation : '?'}</is:tableColumn>
                <is:tableColumn
                        editable="[type:'textarea',disabled:!((poOrSm || task.responsible?.id == user.id || task.creator?.id == user.id) && task.state != Task.STATE_DONE),name:'description']">${task.description?.encodeAsHTML()?.encodeAsNL2BR()}</is:tableColumn>
                <is:tableColumn
                        editable="[type:'richarea',disabled:!((poOrSm || task.responsible?.id == user.id || task.creator?.id == user.id) && task.state != Task.STATE_DONE),name:'notes']">${task.notes}</is:tableColumn>

                <is:tableColumn>${task.responsible?.firstName?.encodeAsHTML()} ${task.responsible?.lastName?.encodeAsHTML()}</is:tableColumn>
                <is:tableColumn>${task.inProgressDate ? g.formatDate(formatName: 'is.date.format.short', date: task.inProgressDate) : ''}</is:tableColumn>
                <is:tableColumn>${task.doneDate ? g.formatDate(formatName: 'is.date.format.short', date: task.doneDate) : ''}</is:tableColumn>
            </is:tableRows>
        </is:tableGroup>

    %{-- Table group for stories --}%
        <g:each in="${stories.sort{it.rank}}" var="story">
            <is:tableGroup
                    elementId="${story.id}"
                    editable="[controller:id,action:'updateTable',params:[product:params.product],onExitCell:'submit']">
                <is:tableGroupHeader>
                    <is:menu rendered="${inProduct}" yoffset="4" class="dropmenu-action" id="${story.id}"
                             contentView="/story/menu" params="[id:id,story:story,nextSprintExist:nextSprintExist]"/>
                    <is:scrumLink id="${story.id}" controller="backlogElement">
                        ${story.id}
                    </is:scrumLink> -
                    <is:postitIcon name="${story.feature?.name?.encodeAsHTML()}" color="${story.feature?.color}"/>
                    <strong>${story.name.encodeAsHTML()} - ${story.effort} - ${is.bundle(bundle: 'storyStates', value: story.state)}</strong>
                </is:tableGroupHeader>
                <is:tableRows in="${story.tasks.sort{it.rank}}" rowClass="${{task -> task.blocked?'ico-task-1':''}}"
                              var="task" elemID="id">
                    <is:tableColumn class="table-cell-checkbox">
                        <g:checkBox name="check-${task.id}"/>
                        <is:menu rendered="${inProduct && sprint.state != Sprint.STATE_DONE}" yoffset="4"
                                 class="dropmenu-action" id="story-task-${task.id}" contentView="/task/menu"
                                 params="[id:id, task:task, story:story, user:user]"/>
                        <g:set var="attachment" value="${task.totalAttachments}"/>
                        <g:if test="${attachment}">
                            <span class="table-attachment"
                                  title="${message(code: 'is.postit.attachment', args: [attachment, attachment > 1 ? 's' : ''])}"></span>
                        </g:if>
                    </is:tableColumn>

                    <g:set value="${(poOrSm || task.responsible?.id == user.id || task.creator?.id == user.id) && task.state != Task.STATE_DONE}"
                           var="disableEdit"/>

                    <is:tableColumn
                            editable="[type:'text', disabled:!(disableEdit),name:'name']">${task.name.encodeAsHTML()}</is:tableColumn>
                    <is:tableColumn
                            editable="[type:'selectui',id:'state',disabled:!(task?.responsible?.id == user.id && task?.state != Task.STATE_DONE),name:'state',values:stateSelect]"><is:bundle
                            bundle="taskStates" value="${task.state}"/></is:tableColumn>
                    <is:tableColumn
                            editable="[type:'text',disabled:!(task?.responsible && task?.responsible?.id == user.id  && task?.state != Task.STATE_DONE) || (!task?.responsible && task?.creator?.id == user.id && task?.state != Task.STATE_DONE),name:'estimation']">${task.estimation >= 0 ? task.estimation : '?'}</is:tableColumn>
                    <is:tableColumn
                            editable="[type:'textarea',disabled:!(disableEdit),name:'description']">${task.description?.encodeAsHTML()?.encodeAsNL2BR()}</is:tableColumn>
                    <is:tableColumn
                            editable="[type:'richarea',disabled:!(disableEdit),name:'notes']">${task.notes}</is:tableColumn>

                    <is:tableColumn>${task.responsible?.firstName?.encodeAsHTML()} ${task.responsible?.lastName?.encodeAsHTML()}</is:tableColumn>
                    <is:tableColumn>${task.inProgressDate ? g.formatDate(formatName: 'is.date.format.short', date: task.inProgressDate) : ''}</is:tableColumn>
                    <is:tableColumn>${task.doneDate ? g.formatDate(formatName: 'is.date.format.short', date: task.doneDate) : ''}</is:tableColumn>
                </is:tableRows>
            </is:tableGroup>

        </g:each>

    </is:table>
</is:tableView>
<jq:jquery>
    jQuery('#window-title-bar-${id} .content').html('${message(code: "is.ui." + id)} - ${message(code: "is.sprint")} ${sprint.orderNumber}  - ${is.bundle(bundle: 'sprintStates', value: sprint.state)} - [${g.formatDate(date: sprint.startDate, formatName: 'is.date.format.short')} -> ${g.formatDate(date: sprint.endDate, formatName: 'is.date.format.short')}]');
</jq:jquery>