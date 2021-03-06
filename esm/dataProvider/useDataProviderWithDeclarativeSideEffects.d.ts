import { DataProvider } from '../types';
/**
 * This version of the useDataProvider hook ensure Query and Mutation components are still usable
 * with side effects declared as objects.
 *
 * @deprecated This is for backward compatibility only and will be removed in next major version.
 */
declare const useDataProviderWithDeclarativeSideEffects: () => DataProvider;
export default useDataProviderWithDeclarativeSideEffects;
