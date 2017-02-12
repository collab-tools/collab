import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'
import AddIcon from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import {Button, Grid, Row, Col} from 'react-bootstrap'

import TaskRow from './TaskRow.jsx'
import CompletedRow from './CompletedRow.jsx'
import TaskModal from './TaskModal.jsx'
import MilestoneModal from './MilestoneModal.jsx'
import * as SocketActions from '../../actions/SocketActions'



class MilestoneRow extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isDialogOpen: false,
      milestoneDialog: false,
      showOngoing: true,
      showCompleted:false,
      showAction: false,
      isDeleteConfirmationOpen: false,
    }
  }

  onMouseEnter() {
      this.setState({
          showAction: true
      })
  }

  onMouseLeave() {
      this.setState({
          showAction: false
      })
  }
  toggleOngoing() {
    this.setState({
      showOngoing: !this.state.showOngoing
    })
  }
  toggleCompleted() {
    this.setState({
      showCompleted: !this.state.showCompleted
    })
  }
  openModal() {
    this.setState({
      isDialogOpen: true
    })
  }
  openMilestoneModal(id) {
    this.setState({
      milestoneDialog: true
    })
    const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
    socketActions.userIsEditing('milestone', id)
  }

  handleMilestoneClose(id) {
    this.setState({
      milestoneDialog: false
    })
    const socketActions = bindActionCreators(SocketActions, this.props.dispatch);
    socketActions.userStopsEditing('milestone', id)
  }
  handleClose() {
    this.setState({
      isDialogOpen: false
    })
  }
  handleDeleteConfirmationOpen() {
    this.setState({
      isDeleteConfirmationOpen: true
    })
  }
  handleDeleteConfirmationClose() {
    this.setState({
      isDeleteConfirmationOpen: false
    })
  }

  deleteMilestone() {
    this.props.onDeleteMilestone()
  }
  editMilestone(content, deadline) {
    this.props.onEditMilestone(content, deadline)
  }

  addTask(content, assignee_id) {
    let task = {
      id: _.uniqueId('task'), //temp id
      content: content,
      project_id: this.props.projectId,
      milestone_id: this.props.milestone.id,
      assignee_id: assignee_id
    }
    this.props.actions.addTask(task);
  }
  deleteTask(task_id) {
    this.props.actions.deleteTask(task_id, this.props.projectId)
  }
  markDone(task_id) {
    this.props.actions.markDone(task_id, this.props.projectId)
  }
  editTask(task_id, content, assignee) {
    this.props.actions.editTask(task_id, content, assignee)
  }


  render() {
    let taskList = []
    let ongoingTasks = this.props.tasks.filter(task => !task.completed_on && !task.dirty)
    ongoingTasks.forEach(task => {
      if(this.state.showOngoing) {
        // Only show non-completed tasks and non-dirtied tasks
          let assignees = this.props.users.filter(user => user.id === task.assignee_id)
          let highlightId = this.context.location.query.highlight
          let highlight = false
          if (highlightId === task.id) {
            highlight = true
          }
          taskList.push(
            <TaskRow
            key={task.id}
            task={task}
            assignees={assignees}
            onCheck={this.markDone.bind(this, task.id)}
            onEdit={this.editTask.bind(this, task.id)}
            onDelete={this.deleteTask.bind(this, task.id)}
            users={this.props.users}
            highlight={highlight}/>
          )
      }

    }) // task forEach
    let completedTasks = this.props.tasks.filter(task => task.completed_on)
    if (this.state.showCompleted && completedTasks.length > 0) {
      taskList.push(
        <CompletedRow
          key={_.uniqueId('completed')}
          completedTasks={completedTasks}
          actions={this.props.actions}
          highlightId={this.context.location.query.highlight}
          />)
    }

    // render milestone Actions
    let milestoneActions = null;
    if (this.props.milestone.id && this.state.showAction) {
        milestoneActions =
        <div className="milestone-actions">
            <i className="material-icons edit-task" onClick={this.openMilestoneModal.bind(this, this.props.milestone.id)}>mode_edit</i>
            <i className="material-icons delete-task" onClick={this.handleDeleteConfirmationOpen.bind(this)}>delete</i>
        </div>
    }
    // confirmDeleteDialog
    const confirmDeleteActions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.handleDeleteConfirmationClose.bind(this)}
      />,
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.deleteMilestone.bind(this)}
      />,
    ];

    let confirmDeleteMsg = "Are you sure to delete this milestone?"
    if(ongoingTasks.length>0) {
      confirmDeleteMsg = "You still have " + ongoingTasks.length + " ongoing task(s). " + confirmDeleteMsg
    }
    let confirmDeleteDialog =
    <Dialog
      autoScrollBodyContent
      actions={confirmDeleteActions}
      modal={false}
      open={this.state.isDeleteConfirmationOpen}
      onRequestClose={this.handleDeleteConfirmationClose.bind(this)}>
      {confirmDeleteMsg}
    </Dialog>


    let ongoingText =  ongoingTasks.length + ' Ongoing'
    let completedTask = completedTasks.length + ' Completed '
    let ongoingLabelStyle = {
      opacity: this.state.showOngoing ? 1 : 0.5,
    }
    let completedLabelStyle = {
      opacity: this.state.showCompleted ? 1 : 0.5,
    }
    let milestoneInfo =
    <div className="milestone-row-info">
      <FlatButton labelStyle={ongoingLabelStyle} label={ongoingText} primary={true} onTouchTap={this.toggleOngoing.bind(this)}/>
      <FlatButton labelStyle={completedLabelStyle} label={completedTask} secondary={true} onTouchTap={this.toggleCompleted.bind(this)}/>
    </div>

    // DEADLINE
    let deadlineText = null
    if (this.props.milestone.deadline) {
      let eventTime = new Date(this.props.milestone.deadline)
      let options = {year: 'numeric', month: 'long', day: 'numeric' }
      deadlineText = 'Due by ' + eventTime.toLocaleDateString('en-US', options)

    }
    let subtitle = <span className=""><p className='text-muted'>{deadlineText}</p></span>

    // EDITING INDICATOR
    let editIndicator = null
    let listStyle = {}

    if (this.props.milestone.editing) {
      let editor = this.props.users.filter(user => user.id === this.props.milestone.edited_by)[0]
      if (editor && editor.online) {
        let divStyle = {
          float: 'right',
          fontSize: 'smaller',
          color: 'white',
          background: editor.colour,
          fontWeight: 'bold'
        }

        editIndicator =
        <div style={divStyle}>{editor.display_name} is editing</div>
        listStyle = {
          borderStyle: 'solid',
          borderColor: editor.colour
        }
      }
    }
      return (
        <Paper zDepth={0} style={listStyle}>
          <Grid fluid={true}>
          <div className="milestone-row">
          {editIndicator}

          <div className="milestone-row-header">
            <Grid fluid={true}>
              <Row>
                <Col xs={10}>
                  <div className="milestone-title"
                    onMouseEnter={this.onMouseEnter.bind(this)}
                    onMouseLeave={this.onMouseLeave.bind(this)}
                    >
                    {this.props.milestone.content}
                    {milestoneActions}
                    {milestoneInfo}
                  </div>
                  <smaill>{subtitle}</smaill>

                </Col>
                <Col xs={2}>

                  <div className="pull-right">
                    <IconButton
                      tooltip="new task"
                      tooltipPosition="top-right"
                      onClick={this.openModal.bind(this)}
                    ><AddIcon/></IconButton>
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
          <Divider/>
          <div>
            {taskList}
          </div>
            <TaskModal
              key={this.props.milestone.id+'_taskModal'}
              title="Add Task"
              open={this.state.isDialogOpen}
              handleClose={this.handleClose.bind(this)}
              taskMethod={this.addTask.bind(this)}
              users={this.props.users}
              />
            <MilestoneModal
              key = {this.props.milestone.id+'milestoneModal'}
              title="Edit Milestone"
              open={this.state.milestoneDialog}
              handleClose={this.handleMilestoneClose.bind(this, this.props.milestone.id)}
              method={this.editMilestone.bind(this)}
              deadline={this.props.milestone.deadline}
              content={this.props.milestone.content}
              />
            {confirmDeleteDialog}
          </div>
        </Grid >
        </Paper>


      );
    }
  }

MilestoneRow.contextTypes = {
  location: React.PropTypes.object
}

 export default connect()(MilestoneRow)
