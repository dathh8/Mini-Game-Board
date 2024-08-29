import * as types from '../constants/ActionTypes'
const initialState = {
  data: [],
  dataFetched: false,
  isFetching: false,
  error: false
}
export default function dataReducer (state = initialState, action) {
    switch (action.type) {
      case types.FETCHING_DATA:
        return {
          ...state,
          data: [],
          isFetching: true
        }
        case types.CHECK_LOGIN:
        return {
          ...state,
          data: [],
          isFetching: true
        }
      default:
        return state
    }
  }