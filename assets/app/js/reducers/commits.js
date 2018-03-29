import assign from 'object-assign';
import * as AppConstants from '../AppConstants';
/*
Example state tree:
const commits = [
  {
    id: '123G4',
    contributions: { },
    contributors: 6,
    contributions_url: 'https://github.com/owner/name/commits/master',
    contributors_url: 'https://github.com/owner/name/graphs/contributors',
  },
];
*/
const commits = (state = {}, action) => {
    switch (action.type) {
    case AppConstants.GET_COMMITS:
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
        contributions_url: payload.contributionsURL,
        contributors_url: payload.contributorsURL,
      }
        state.push(commitsState);
        return state;
    default:
      return state;
  }
};
export default commits;