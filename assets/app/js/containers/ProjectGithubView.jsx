import { connect } from 'react-redux';
import { getCurrentProject, getProjectTasks, getProjectCommits } from '../selector';
import GithubView from '../components/Github/GithubView.jsx';
import { getCommits } from '../actions/ReduxTaskActions.js';

const mapStateToProps = (state) => (
  {
    project: getCurrentProject(state),
    tasks: getProjectTasks(state),
    commits: getProjectCommits(state),
  }
);

const mapDispatchToProps = (dispatch) => ({
  actions: {
    onGetCommits: (repoName, repoOwner) => {
      getCommits(repoName, repoOwner)(dispatch);
    },
  },
}); 

export default connect(mapStateToProps, mapDispatchToProps)(GithubView);