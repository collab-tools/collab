import assign from 'object-assign';
import * as AppConstants from '../AppConstants';
/*
Example state tree:
const branches = [
  {
    id: '123G4',
    branchCount: 4,
    url: https://github.com/repos/owner/name/branches,
  },
];
*/
const branches = (state = {
  id: null,
  branchCount: null,
  url: null
}, action) => {
    switch (action.type) {
    case AppConstants.GET_BRANCHES:
      let payload = action.branches;
        state = {
          id: payload.id,
          branchCount: payload.branchCount,
          url: payload.url
        };
        return state;
    default:
      return state;
  }
};
export default branches;