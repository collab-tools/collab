import React, { Component, PropTypes } from 'react';
import { Dialog, FlatButton } from 'material-ui';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import { Form } from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

const propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  assigneeId: PropTypes.string,
  milestoneId: PropTypes.string,
  isGithubIssue: PropTypes.bool,
  userIsEditing: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  taskMethod: PropTypes.func.isRequired,
  // passed by container
  users: PropTypes.array.isRequired,
  milestones: PropTypes.array.isRequired,
};
class TaskModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      assigneeId: this.props.assigneeId || '',
      canSubmit: false,
      milestoneId: this.props.milestoneId,
      isGithubIssue: false,
      userIsEditing: this.props.userIsEditing,
    };
    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.handleGithubIssueChange = this.handleGithubIssueChange.bind(this);
    this.handleMilestoneIdChange = this.handleMilestoneIdChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
  }

  onDialogSubmit() {
    const content = this.taskInputField.getValue().trim();
    if (content !== '') {
      this.props.taskMethod(content, this.state.assigneeId, this.state.milestoneId, this.state.isGithubIssue);
    }
    this.props.handleClose();
  }
  enableButton() {
    this.setState({
      canSubmit: true,
    });
  }
  disableButton() {
    this.setState({
      canSubmit: false,
    });
  }
  handleChange(event, index, value) {
    this.setState({ assigneeId: value });
  }
  handleMilestoneIdChange(event, index, value) {
    this.setState({ milestoneId: value });
  }
  handleGithubIssueChange(event) {
    this.setState({
      isGithubIssue: event.target.checked
    });
  }
  renderGithubIssueCheckbox() {
    return (!this.state.userIsEditing &&
      <Checkbox
        checked={this.state.isGithubIssue}
        onClick={this.handleGithubIssueChange}
        value="isGithubIssue"
        label="Create GitHub Issue"
      />
    );
  }
  render() {
    const actions = [
      <FlatButton
        key={1}
        label="Cancel"
        secondary
        onTouchTap={this.props.handleClose}
      />,
      <FlatButton
        className="add-task-submit-btn"
        key={2}
        label="Submit"
        primary
        onTouchTap={this.onDialogSubmit}
        disabled={!this.state.canSubmit}
      />,
    ];


    const possibleAssignees = this.props.users.map(user => (
      <MenuItem
        value={user.id}
        key={user.id}
        primaryText={user.display_name}
      />
    ));
    possibleAssignees.unshift(<MenuItem key={0} value={''} primaryText="None" />);
    const possibleMilestones = this.props.milestones.map(milestone => (
      <MenuItem
        value={milestone.id}
        key={milestone.id}
        primaryText={milestone.content}
      />
  ));
    return (
      <Dialog
        autoScrollBodyContent
        title={this.props.title}
        actions={actions}
        onRequestClose={this.props.handleClose}
        open
        titleClassName="borderless"
        actionsContainerClassName="borderless"
      >
        <Form
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          onValidSubmit={this.onDialogSubmit}
        >
          <FormsyText
            required
            autoFocus
            fullWidth
            multiLine
            autoComplete="off"
            className="add-task-name-input"
            name="Task name"
            floatingLabelText="Task Name (required)"
            ref={(input) => { this.taskInputField = input; }}
            value={this.props.content}
          />
          <br />
          <SelectField
            className="add-task-milestone-select"
            required
            value={this.state.milestoneId}
            onChange={this.handleMilestoneIdChange}
            floatingLabelFixed
            floatingLabelText="Milestone"
          >
            {possibleMilestones}
          </SelectField>
          <br />
          <SelectField
            className="add-task-assignee-select"
            value={this.state.assigneeId}
            onChange={this.handleChange}
            floatingLabelFixed
            floatingLabelText="Assign to"
          >
            {possibleAssignees}
          </SelectField>
          <br />
          {this.renderGithubIssueCheckbox()}
        </Form>
      </Dialog>
    );
  }
}
TaskModal.propTypes = propTypes;

// export default TaskModal;
export default TaskModal;
