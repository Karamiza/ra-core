import { Pagination, Record, Sort } from '../../types';
import { FieldInputProps } from 'react-final-form';
/**
 * Prepare data for the ReferenceArrayInput components
 *
 * @example
 *
 * const { choices, error, loaded, loading } = useReferenceArrayInputController({
 *      basePath: 'resource';
 *      record: { referenceIds: ['id1', 'id2']};
 *      reference: 'reference';
 *      resource: 'resource';
 *      source: 'referenceIds';
 * });
 *
 * @param {Object} option
 * @param {string} option.basePath basepath to current resource
 * @param {Object} option.record The The current resource record
 * @param {string} option.reference The linked resource name
 * @param {string} option.resource The current resource name
 * @param {string} option.source The key of the linked resource identifier
 *
 * @return {Object} controllerProps Fetched data and callbacks for the ReferenceArrayInput components
 */
declare const useReferenceArrayInputController: ({ filter: defaultFilter, filterToQuery, input, perPage, sort: defaultSort, options, reference, resource, source, }: Option) => ReferenceArrayInputProps;
export default useReferenceArrayInputController;
/**
 * @typedef ReferenceArrayProps
 * @type {Object}
 * @property {Array} ids the list of ids.
 * @property {Object} data Object holding the reference data by their ids
 * @property {Object} error the error returned by the dataProvider
 * @property {boolean} loading is the reference currently loading
 * @property {boolean} loaded has the reference already been loaded
 */
interface ReferenceArrayInputProps {
    choices: Record[];
    error?: any;
    warning?: any;
    loading: boolean;
    loaded: boolean;
    setFilter: (filter: any) => void;
    setPagination: (pagination: Pagination) => void;
    setSort: (sort: Sort) => void;
}
interface Option {
    basePath: string;
    filter?: any;
    filterToQuery?: (filter: any) => any;
    input: FieldInputProps<any, HTMLElement>;
    options?: any;
    perPage?: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: Sort;
    source: string;
}
