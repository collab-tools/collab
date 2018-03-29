import assign from 'object-assign';
import * as AppConstants from '../AppConstants';
/*
Example state tree:
const branches = [
  {
    id: '123G4',
    releaseCount: 1,
    url: https://github.com/repos/owner/name/releases,
  },
];
*/
const releases = (state = {
  id: null,
  releaseCount: null,
  url: null
}, action) => {
    switch (action.type) {
    case AppConstants.GET_RELEASES:
      let payload = action.releases;
        state = {
          id: payload.id,
          releaseCount: payload.releaseCount,
          url: payload.url
        };
        return state;
    default:
      return state;
  }
};
export default releases;