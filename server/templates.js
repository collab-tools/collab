var constants = require('./constants')

module.exports = {
    getMessage: function(template, data) {
        var message = ''
        switch (template){
            case this.INVITE_TO_PROJECT:
                message = data.displayName + ' has invited you to the project ' + data.projectName
                break
            case this.JOINED_PROJECT:
                message = data.displayName + ' has joined the project ' + data.projectName
                break
            case this.DECLINED_PROJECT:
                message = data.displayName + ' has declined to join the project ' + data.projectName
                break
            case this.GITHUB_CREATE:
                message = data.displayName + ' has created the ' + data.ref_type + ' ' + data.ref
                break
            case this.GITHUB_PUSH:
                message = data.displayName + ' has pushed ' + data.commitSize + ' commits'
                break
            case this.DRIVE_CREATE:
                message = data.displayName + ' has created a new folder in ' + data.directory
                break
            case this.DRIVE_REMOVE:
                message = data.displayName + ' has removed the file ' + data.fileName
                break
            case this.DRIVE_UPDATE:
                message = data.displayName + ' has updated the file ' + data.fileName
                break
            case this.DRIVE_UPLOAD:
                message = data.displayName + ' has uploaded the file ' + data.fileName
                break
            case this.DRIVE_COPY:
                message = data.displayName + ' has copied the file ' + data.fileName
                break
            case this.DRIVE_RENAME:
                message = data.displayName + ' has renamed the file ' + data.fileName
                break
            case this.DRIVE_MOVE:
                message = data.displayName + ' has moved the file ' + data.fileName 
                break
            case this.GITHUB_MILESTONE:
                message = data.displayName + ' has ' + data.action + ' a github milestone ' + data.milestone.title
                break
            default:
                message = ''
        }
        return message
    },

    getLink: function(notification_id) {
        return  ''
    },

    INVITE_TO_PROJECT: 'INVITE_TO_PROJECT',
    JOINED_PROJECT: 'JOINED_PROJECT',
    DECLINED_PROJECT: 'DECLINED_PROJECT',
    GITHUB_CREATE: 'GITHUB_CREATE',
    GITHUB_PUSH: 'GITHUB_PUSH',
    // CHANGES
    GITHUB_ISSUES: 'GITHUB_ISSUES',
    GITHUB_MILESTONE: 'GITHUB_MILESTONE',
    // UP TO HERE
    DRIVE_CREATE: 'DRIVE_CREATE',
    DRIVE_REMOVE: 'DRIVE_REMOVE',
    DRIVE_UPDATE: 'DRIVE_UPDATE',
    DRIVE_UPLOAD: 'DRIVE_UPLOAD',
    DRIVE_COPY: 'DRIVE_COPY',
    DRIVE_RENAME: 'DRIVE_RENAME',
    DRIVE_MOVE: 'DRIVE_MOVE',
}