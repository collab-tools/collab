import React, { Component } from 'react'
import OnlineUsers from '../components/OnlineUsers.jsx'
import Add from './../icons/Add.jsx'
import {getCurrentProject} from '../utils/general'
import { IconButton, Dialog, TextField, FlatButton } from 'material-ui'

class ProjectHeader extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            isDialogOpen: false
        }
    }

    handleRequestClose(buttonClicked) {
        if (!buttonClicked && this.state.openDialogStandardActions) return
        this.setState({
            isDialogOpen: false
        })
    }
    onDialogSubmit() {
        let content = this.refs.milestoneField.getValue().trim()
        if (content !== '') {
            this.addMilestone(content)
        }
        this.setState({
            isDialogOpen: false
        })
    }

    openModal() {
        this.setState({
            isDialogOpen: true
        })
    }

    addMilestone(content) {
        this.props.actions.createMilestone({
            id: _.uniqueId('milestone'),
            content: content,
            deadline: null,
            project_id: getCurrentProject(),
            tasks: []
        })
    }

    render() {
        let actions = [
            <FlatButton
                key={1}
                label="Cancel"
                secondary={true}
                onTouchTap={this.onDialogSubmit.bind(this)} />,
            <FlatButton
                key={2}
                label="Submit"
                primary={true}
                onTouchTap={this.onDialogSubmit.bind(this)} />
        ]

        return (
            <div className='project-header'>
                <h1 className='project-header-text'>{this.props.projectName} </h1>
                <IconButton onClick={this.openModal.bind(this)} tooltip="Add milestone">
                    <Add className="add-milestone-btn"/>
                </IconButton>

                <Dialog
                    title="Add Milestone"
                    actions={actions}
                    open={this.state.isDialogOpen}
                    onRequestClose={this.handleRequestClose.bind(this)}>
                    <TextField
                        hintText="Milestone name"
                        onEnterKeyDown={this.onDialogSubmit.bind(this)}
                        ref="milestoneField"
                    />
                </Dialog>
                <OnlineUsers members={this.props.members} />
            </div>
        );
    }
}

export default ProjectHeader