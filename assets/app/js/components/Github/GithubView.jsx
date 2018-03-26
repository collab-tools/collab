import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

//import EventList from './EventList.jsx';

const styles = {
  container: {
    display: 'block',
    position: 'relative',
    boxSizing: 'border-box',
    height: '100%',
    marginTop: '10px',
    borderRadius: '2px',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px ',
    overflowY: 'auto',
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(255, 255, 255)',
    overflow: 'hidden',
  },

  numbersTable: {
    display: 'table',
    width: '100%',
    height: '100px',
    paddingRight: '60px',
    paddingLeft: '60px',
    paddingTop: '10px',
    paddingBottom: '10px',
    textAlign: 'center',
    border: '1px solid #dfe2e5',
  },

  tableCell: {
    display: 'inline-block',
    width: '25%',
    padding: '10px 70px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    fontSize: '20px',
    fontColor: '#586069',
    cursor: 'pointer',

  },

  span: {
    padding: '1px 1px',
    fontWeight: 'bold',
    fontSize: '22px',
  },

  getCommitBtn: {
    height: 30,
  },
};

const propTypes = {
  // props passed by parents

  // props passed by container
  //users: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  commits: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
  actions: React.PropTypes.shape({
    onGetCommits: PropTypes.func.isRequired,
  }),
  //folders: PropTypes.array.isRequired,

};

class GithubView extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.getCommits = this.getCommits.bind(this);
  }

  componentWillMount() { //call the api here
    //const payload = this.props.dispatch(getCommits(this.props.project.github_repo_name, this.props.project.github_repo_owner));
    //const commits = payload.noOfCommits;
    //const contributors = payload.noOfContributors;
    console.log("github view component mounts");
  }

  getCommits(repoName, repoOwner) {
    console.log("commits gotten")
    this.props.actions.onGetCommits(repoName, repoOwner);
  }

  renderCommitButton() {
    const className = 'commit-btn';
    console.log('rendercommitbutton', this.props.project) //get this.props.project.github_repo_name & this.props.project.github_repo_owner
    return (
      <RaisedButton
        key="commit-btn"
        label="get commit"
        className={className}
        onTouchTap={this.getCommits("CS3219-Travis-demo", "JavanHuang")} //this
        secondary
        style={styles.getCommitBtn}
      />
    );
  }

  render() {
    console.log("this works githubview");
    const { project, tasks, commits } = this.props;
    return (
      <div style={styles.container}>
      {this.renderCommitButton()}
            <table style={styles.numbersTable}>
              <tbody>
                <tr style={styles.tableCell}>
                    <svg aria-hidden="true" class="octicon oscticon-history" height="20" version="1.1" padding="6" viewBox="0 0 16 20" width="16"><path fillRule="evenodd" d="M8 13H6V6h5v2H8v5zM7 1C4.81 1 2.87 2.02 1.59 3.59L0 2v4h4L2.5 4.5C3.55 3.17 5.17 2.3 7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-.34.03-.67.09-1H.08C.03 7.33 0 7.66 0 8c0 3.86 3.14 7 7 7s7-3.14 7-7-3.14-7-7-7z"></path></svg>
                    <span style= {styles.span}> {commits.contributions} </span> commits </tr>
                <tr style={styles.tableCell}> 
                    <svg aria-hidden="true" class="octicon octicon-issue-opened" height="20" version="1.1" padding="6" viewBox="0 0 16 20" width="16"><path fillRule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
                    <span style= {styles.span}> {tasks.length} </span> issues </tr>
                <tr style={styles.tableCell}> 
                    <svg aria-hidden="true" class="octicon octicon-organization" height="20" version="1.1" padding="6" viewBox="0 0 18 20" width="18"><path fillRule="evenodd" d="M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4"></path></svg>
                    <span style= {styles.span}> 2 </span> contributors </tr>
                <tr style={styles.tableCell}> 
                    <svg aria-hidden="true" class="octicon octicon-git-branch" height="20" version="1.1" padding="6" viewBox="0 0 12 20" width="12"><path fillRule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 0 0-1-3.72C.88 1 0 1.89 0 3a2 2 0 0 0 1 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                    <span style= {styles.span}> 1 </span> branches </tr> 
                </tbody>
          </table>
      </div>
    );
  }
}

GithubView.propTypes = propTypes;
export default GithubView;


//                    <object type="image/svg+xml" data="../../../images/history.svg">Your browser does not support SVGs</object>
//                    <svg aria-hidden="true" class="octicon octicon-history" height="20" version="1.1" padding="6" viewBox="0 0 16 20" width="16"><path fill-rule="evenodd" d="M8 13H6V6h5v2H8v5zM7 1C4.81 1 2.87 2.02 1.59 3.59L0 2v4h4L2.5 4.5C3.55 3.17 5.17 2.3 7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-.34.03-.67.09-1H.08C.03 7.33 0 7.66 0 8c0 3.86 3.14 7 7 7s7-3.14 7-7-3.14-7-7-7z"></path></svg>

//                    <object type="image/svg+xml" data="../../../images/issue-opened.svg">Your browser does not support SVGs</object>
//                    <svg aria-hidden="true" class="octicon octicon-issue-opened" height="20" version="1.1" padding="6" viewBox="0 0 16 20" width="16"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>

//                    <object type="image/svg+xml" data="../../../images/organisation.svg">Your browser does not support SVGs</object>
//                    <svg aria-hidden="true" class="octicon octicon-organization" height="20" version="1.1" padding="6" viewBox="0 0 18 20" width="18"><path fill-rule="evenodd" d="M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4"></path></svg>

//                    <object type="image/svg+xml" data="../../../images/git-branch.svg">Your browser does not support SVGs</object>
//                    <svg aria-hidden="true" class="octicon octicon-git-branch" height="20" version="1.1" padding="6" viewBox="0 0 12 20" width="12"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v.3c-.02.52-.23.98-.63 1.38-.4.4-.86.61-1.38.63-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 0 0-1-3.72C.88 1 0 1.89 0 3a2 2 0 0 0 1 1.72v6.56c-.59.35-1 .99-1 1.72 0 1.11.89 2 2 2 1.11 0 2-.89 2-2 0-.53-.2-1-.53-1.36.09-.06.48-.41.59-.47.25-.11.56-.17.94-.17 1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>