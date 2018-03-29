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
    marginTop: '20px',
    display: 'inline-block',
    width: '25%',
    padding: '10px 70px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontColor: '#586069',
    cursor: 'pointer',
  },
  bold: {
    fontSize: '20px',
    fontFamily:'Roboto, sans-serif',
  },
  h2: {
    fontSize: '18px',
    fontWeight: '700',
    fontFamily:'Roboto, sans-serif',
  },
  h3: {
    fontSize: '16px',
    fontFamily:'Roboto, sans-serif',
  },
};

const propTypes = {
  // props passed by container
  project: PropTypes.object.isRequired,
  commits: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
  actions: React.PropTypes.shape({
    onGetCommits: PropTypes.func.isRequired,
    onGetBranches: PropTypes.func.isRequired,
    onGetReleases: PropTypes.func.isRequired,
  }),

};

class GithubView extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.getCommits = this.getCommits.bind(this);
    this.getBranches = this.getBranches.bind(this);
    this.getReleases = this.getReleases.bind(this);
  }

  componentWillMount() {
    this.getCommits(this.props.project.github_repo_name, this.props.project.github_repo_owner);
    this.getBranches(this.props.project.github_repo_name, this.props.project.github_repo_owner);
    this.getReleases(this.props.project.github_repo_name, this.props.project.github_repo_owner);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.contributions !== this.props.contributions) {
     this.props.contributions = this.props.contributions;
    }

    if (prevProps.branchCount !== this.props.branchCount) {
      this.props.branchCount = this.props.branchCount;
     }

     if (prevProps.releaseCount !== this.props.releaseCount) {
      this.props.releaseCount = this.props.releaseCount;
     }
  }

  getCommits(repoName, repoOwner) {
    this.props.actions.onGetCommits(repoName, repoOwner);
  }

  getBranches(repoName, repoOwner) {
    this.props.actions.onGetBranches(repoName, repoOwner);
  }

  getReleases(repoName, repoOwner) {
    this.props.actions.onGetReleases(repoName, repoOwner);
  }

  render() {
    const { project, tasks, commits, branches, releases } = this.props;

    return (
      <div style={styles.container}>
        <h2 style={styles.h2}> GitHub Repository Info </h2>
        <h3 style={styles.h3}> Select a Repository to sync @ the Settings tab to view your Repository Information here! </h3>
        <div style={styles.numbersTable}>
          <div style={styles.tableCell}>
            <a href={commits.contributions_url}> 
              <b style={styles.bold}>{commits.contributions}</b>  commits </a>
            </div>
          <div style={styles.tableCell}>
            <a href={releases.url}> 
              <b style={styles.bold}>{releases.releaseCount}</b>  releases </a>
            </div>
          <div style={styles.tableCell}>
            <a href={branches.url}>
              <b style={styles.bold}>{branches.branchCount}</b>  branches </a> 
            </div>
          <div style={styles.tableCell}> 
            <a href={commits.contributors_url}>
              <b style={styles.bold}>{commits.contributors}</b>  contributors </a>
            </div>
        </div>
      </div>
    );
  }
} 

GithubView.propTypes = propTypes;
export default GithubView;