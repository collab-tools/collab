import * as AppConstants from '../AppConstants';

const CREATE_TASK_ENDPOINT = '/tasks';
const COMPLETE_TASK_ENDPOINT = '/mark_completed';
const CREATE_MILESTONE_ENDPOINT = '/milestones';
const CREATE_PROJECT_ENDPOINT = '/projects';
const CREATE_MESSAGE_ENDPOINT = '/messages';
const INVITE_TO_PROJECT_ENDPOINT = '/invite_to_project';
const POPULATE_ENDPOINT = '/user/populate';
const GET_NOTIFICATION_ENDPOINT = '/notifications';

const API_BASE_URL = AppConstants.API_BASE_URL;

import $ from 'jquery'
import Promise from 'bluebird'
import {dumpList} from './general'

const googleDriveAPIFiledParams = "fields=lastModifyingUser%2CmodifiedTime%2CiconLink%2CwebViewLink%2Cparents%2Cname%2Cid%2CmimeType"

export function uploadFile(multipartRequestBody) {
    return $.ajax('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&'+googleDriveAPIFiledParams ,{
        'data': multipartRequestBody,
        'type': 'POST',
        'processData': false,
        'headers': {
            'Authorization': 'Bearer ' + localStorage.getItem('google_token'),
            'Content-Type': 'multipart/mixed; boundary="' + AppConstants.MULTIPART_BOUNDARY + '"'
        }
    })
}

export function removeFile(fileId) {
  return $.ajax('https://www.googleapis.com/drive/v3/files/' + fileId, {
    'type': 'DELETE',
    'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem('google_token')
    }
  })
}

export function copyFile(fileId) {
  return $.ajax('https://www.googleapis.com/drive/v3/files/' + fileId +"/copy?"+googleDriveAPIFiledParams, {
    'type': 'POST',
    'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem('google_token')
    }
  })
}

export function renameFile(fileId, newName) {
  return $.ajax('https://www.googleapis.com/drive/v3/files/' + fileId +"?"+googleDriveAPIFiledParams, {
    'type': 'PATCH',
    'processData': false,
    'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + localStorage.getItem('google_token')
    },
    'data': JSON.stringify({'name':newName})

  })
}

export function createFolder(multipartRequestBody) {
  return $.ajax('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&'+googleDriveAPIFiledParams,{
      'data': multipartRequestBody,
      'type': 'POST',
      'headers': {
          'Authorization': 'Bearer ' + localStorage.getItem('google_token'),
          'Content-Type': 'multipart/mixed; boundary="' + AppConstants.MULTIPART_BOUNDARY + '"'
      },
      'data': multipartRequestBody
  })
}

export function moveFile(fileId, oldParents, newParents) {

  return $.ajax('https://www.googleapis.com/drive/v3/files/' + fileId +"?"+googleDriveAPIFiledParams+"&addParents="+dumpList(newParents)+"&removeParents="+dumpList(oldParents), {
    'type': 'PATCH',
    'processData': false,
    'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + localStorage.getItem('google_token')
    }

  })
}


export function queryGoogleDrive(queryString) {
    return googleGet('/drive/v3/files', {
        'pageSize': '20',
        'q': "fullText contains '" + queryString + "'",
        'fields': 'files'
    })
}

export function getGoogleDriveFolders() {
    return googleGet('/drive/v3/files', {
        'pageSize': '100',
        'orderBy': 'modifiedTime desc',
        'spaces': 'drive',
        'q': "mimeType = 'application/vnd.google-apps.folder'",
        'fields': 'files'
    })
}

export function getChildrenFiles(folderId) {
    return googleGet('/drive/v3/files', {
        'pageSize': '100',
        'orderBy': 'modifiedTime desc',
        'q': "'" + folderId + "' in parents",
        'fields': 'files'
    })
}

export function listRepoEvents(owner, repo) {
    return $.ajax({
        url: 'https://api.github.com/repos/' + owner + '/' + repo + '/events',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('github_token')
        },
        type: 'GET'
    })
}

export function queryGithub(queryString, ownerRepos) {
    return $.ajax({
        url: 'https://api.github.com/search/code?q=' + queryString + '+in:file,path' + ownerRepos,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('github_token'),
            'Accept': 'application/vnd.github.v3.text-match+json'
        },
        type: 'GET'
    })
}


export function getFileInfo(fileId) {
    return googleGet('/drive/v3/files/' + fileId)
}

function googleGet(endpoint, params) {
    return $.ajax({
        url: 'https://www.googleapis.com' + endpoint,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('google_token')
        },
        type: 'GET',
        data: params
    });
}

function ajaxPost(endpoint, payload) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        data: payload,
        type: 'POST'
    });
}

function ajaxPut(endpoint, payload) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        data: payload,
        type: 'PUT'
    });
}

function ajaxGet(endpoint) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        type: 'GET'
    });
}

function ajaxDelete(endpoint, data) {
    return $.ajax({
        url: API_BASE_URL + endpoint,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        data: data,
        type: 'DELETE'
    });
}

export function serverDeclineProject(projectId) {
    return $.ajax({
        url: API_BASE_URL + '/decline_project/' + projectId,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        type: 'PUT'
    })
}

export function serverAcceptProject(projectId) {
    return $.ajax({
        url: API_BASE_URL + '/join_project/' + projectId,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        type: 'PUT'
    })
}

export function githubOAuth(code) {
    return ajaxPost('/github/oauth/access_token', {code: code})
}

export function getGithubRepos() {
    return $.ajax({
        url: 'https://api.github.com/user/repos?per_page=100',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('github_token')
        },
        type: 'GET'
    })
}

export function syncGithubIssues(projectId, name, owner) {
    return ajaxPost('/github/sync/' + projectId, {
        token: localStorage.getItem('github_token'),
        name: name,
        owner: owner
    })
}

export function setupGithubWebhook(name, owner) {
    return ajaxPost('/webhook/github/setup', {
        token: localStorage.getItem('github_token'),
        name: name,
        owner: owner
    })
}

export function serverDeleteNotification(id) {
    return ajaxDelete('/notification/' + id)
}

export function serverGetNotifications() {
    return ajaxGet(GET_NOTIFICATION_ENDPOINT)
}

export function serverGetNewesfeed() {
    return ajaxGet('/newsfeed')
}

export function serverInviteToProject(payload) {
    return ajaxPost(INVITE_TO_PROJECT_ENDPOINT, payload);
}

export function serverCreatePost(payload, projectId) {
    return ajaxPost('/newsfeed/' + projectId, payload);
}

export function serverUpdateUser(payload) {
    return ajaxPut('/user/' + localStorage.getItem('user_id'), payload)
}

export function serverUpdateGithubLogin(token) {
    return ajaxPut('/user/github/' + localStorage.getItem('user_id'), {token:token})
}

export function serverPopulate() {
    return ajaxGet(POPULATE_ENDPOINT + '/' + localStorage.getItem('user_id'))
}

export function serverCreateTask(payload) {
    payload.github_token = localStorage.getItem('github_token')
    return ajaxPost(CREATE_TASK_ENDPOINT, payload);
}


export function serverDeleteTask(task_id, project_id) {
    return ajaxDelete('/task/' + task_id, {project_id: project_id})
}

export function serverEditTask(task_id, payload) {
    payload.github_token = localStorage.getItem('github_token')
    return ajaxPut('/task/' + task_id, payload);
}

export function serverCreateMilestone(payload) {
    payload.github_token = localStorage.getItem('github_token')
    return ajaxPost(CREATE_MILESTONE_ENDPOINT, payload);
}

export function serverDeleteMilestone(milestone_id, project_id) {
    return ajaxDelete('/milestone/' + milestone_id, {
        project_id: project_id,
        github_token: localStorage.getItem('github_token')
    })
}

export function serverCreateProject(payload) {
    return ajaxPost(CREATE_PROJECT_ENDPOINT, payload);
}

export function serverUpdateProject(project_id, payload) {
    return ajaxPut('/project/' + project_id, payload);
}

export function serverEditMilestone(milestone_id, payload) {
    payload.github_token = localStorage.getItem('github_token')
    return ajaxPut('/milestone/' + milestone_id, payload);
}

export function serverMarkDone(task_id, project_id) {
    return ajaxPost(COMPLETE_TASK_ENDPOINT, {
        task_id: task_id,
        project_id: project_id,
        github_token: localStorage.getItem('github_token')
    })
}

export const refreshTokens = () => (
  ajaxPost('/refresh_google_token')
);

export const serverCreateMessage = (payload) => (
  ajaxPost(CREATE_MESSAGE_ENDPOINT, payload)
);
export const serverEditMessage = (messageId, payload) => (
  ajaxPut(`/message/${messageId}`, payload)
);
export const serverDeleteMessage = (messageId) => (
  ajaxDelete(`/message/${messageId}`)
);
