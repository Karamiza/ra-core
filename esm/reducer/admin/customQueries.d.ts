import { Reducer } from 'redux';
export interface State {
    [key: string]: any;
}
declare const customQueriesReducer: Reducer<State>;
export default customQueriesReducer;
