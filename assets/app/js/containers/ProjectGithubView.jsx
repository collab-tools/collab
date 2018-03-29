import { connect } from 'react-redux';
import { getCurrentProject, getProjectTasks, getProjectCommits, getProjectBranches, getProjectReleases } from '../selector';
import GithubView from '../components/Github/GithubView.jsx';
import { getCommits, getBranches, getReleases } from '../actions/ReduxTaskActions.js';

const mapStateToProps = (state) => (
  {
    project: getCurrentProject(state),
    tasks: getProjectTasks(state),
    commits: getProjectCommits(state),
    branches: getProjectBranches(state),
    releases: getProjectReleases(state),
  }
);

const mapDispatchToProps = (dispatch) => ({
  actions: {
    onGetCommits: (repoName, repoOwner) => {
      getCommits(repoName, repoOwner)(dispatch);
    },
    onGetBranches: (repoName, repoOwner) => {
      getBranches(repoName, repoOwner)(dispatch);
    },
    onGetReleases: (repoName, repoOwner) => {
      getReleases(repoName, repoOwner)(dispatch);
    },
  },
}); 

export default connect(mapStateToProps, mapDispatchToProps)(GithubView);