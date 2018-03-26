import assign from 'object-assign';
import * as AppConstants from '../AppConstants';
/*
Example state tree:
const commits = [
  {
    id: '123G4',
    contributions: { },
    contributors: 6,
  },
];
*/
// new
const commits = (state = {}, action) => {
    switch (action.type) {
    case AppConstants.GET_COMMITS:
      console.log("action payload " + action);
      console.log("action commits" + action.commits);
      let payload = action.commits;
      let contributions = 0;
      let contributors = 0;
      payload.forEach(function (commit) {
        contributions += commit.contributions;
        contributors += 1;
      })
      let commitsState = {
        id: action.id,
        contributions: contributions,
        contributors: contributors,
      }
      console.log("contributions: " + commitsState.contributions);
      console.log("contributor: " + commitsState.contributors);
      console.log("commits: " + commits);
        state.push(commitsState);
        return state;

    case AppConstants.GET_CONTRIBUTORS:
        return action.contributors;
    default:
      return state;
  }
};
export default commits;