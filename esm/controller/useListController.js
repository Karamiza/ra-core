var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { isValidElement, useEffect, useMemo } from 'react';
import inflection from 'inflection';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import useListParams from './useListParams';
import useRecordSelection from './useRecordSelection';
import useVersion from './useVersion';
import { useTranslate } from '../i18n';
import { SORT_ASC } from '../reducer/admin/resource/list/queryReducer';
import { CRUD_GET_LIST } from '../actions';
import { useNotify } from '../sideEffect';
import useGetList from '../dataProvider/useGetList';
var defaultSort = {
    field: 'id',
    order: SORT_ASC,
};
var defaultData = {};
/**
 * Prepare data for the List view
 *
 * @param {Object} props The props passed to the List component.
 *
 * @return {Object} controllerProps Fetched and computed data for the List view
 *
 * @example
 *
 * import { useListController } from 'react-admin';
 * import ListView from './ListView';
 *
 * const MyList = props => {
 *     const controllerProps = useListController(props);
 *     return <ListView {...controllerProps} {...props} />;
 * }
 */
var useListController = function (props) {
    useCheckMinimumRequiredProps('List', ['basePath', 'resource'], props);
    var basePath = props.basePath, resource = props.resource, hasCreate = props.hasCreate, filterDefaultValues = props.filterDefaultValues, _a = props.sort, sort = _a === void 0 ? defaultSort : _a, _b = props.perPage, perPage = _b === void 0 ? 10 : _b, filter = props.filter, _c = props.debounce, debounce = _c === void 0 ? 500 : _c;
    if (filter && isValidElement(filter)) {
        throw new Error('<List> received a React element as `filter` props. If you intended to set the list filter elements, use the `filters` (with an s) prop instead. The `filter` prop is internal and should not be set by the developer.');
    }
    var location = useLocation();
    var translate = useTranslate();
    var notify = useNotify();
    var version = useVersion();
    var _d = useListParams({
        resource: resource,
        location: location,
        filterDefaultValues: filterDefaultValues,
        sort: sort,
        perPage: perPage,
        debounce: debounce,
    }), query = _d[0], queryModifiers = _d[1];
    var _e = useRecordSelection(resource), selectedIds = _e[0], selectionModifiers = _e[1];
    /**
     * We want the list of ids to be always available for optimistic rendering,
     * and therefore we need a custom action (CRUD_GET_LIST) that will be used.
     */
    var _f = useGetList(resource, {
        page: query.page,
        perPage: query.perPage,
    }, { field: query.sort, order: query.order }, __assign(__assign({}, query.filter), filter), {
        action: CRUD_GET_LIST,
        onFailure: function (error) {
            return notify(typeof error === 'string'
                ? error
                : error.message || 'ra.notification.http_error', 'warning');
        },
    }), ids = _f.ids, total = _f.total, loading = _f.loading, loaded = _f.loaded;
    var data = useSelector(function (state) {
        return get(state.admin.resources, [resource, 'data'], defaultData);
    });
    // When the user changes the page/sort/filter, this controller runs the
    // useGetList hook again. While the result of this new call is loading,
    // the ids and total are empty. To avoid rendering an empty list at that
    // moment, we override the ids and total with the latest loaded ones.
    var defaultIds = useSelector(function (state) {
        return get(state.admin.resources, [resource, 'list', 'ids'], []);
    });
    var defaultTotal = useSelector(function (state) {
        return get(state.admin.resources, [resource, 'list', 'total'], 0);
    });
    var finalIds = typeof total === 'undefined' ? defaultIds : ids;
    useEffect(function () {
        if (query.page <= 0 ||
            (!loading && query.page > 1 && (finalIds || []).length === 0)) {
            // query for a page that doesn't exist, set page to 1
            queryModifiers.setPage(1);
        }
    }, [loading, query.page, finalIds, queryModifiers, total, defaultIds]);
    var currentSort = useMemo(function () { return ({
        field: query.sort,
        order: query.order,
    }); }, [query.sort, query.order]);
    var resourceName = translate("resources." + resource + ".name", {
        smart_count: 2,
        _: inflection.humanize(inflection.pluralize(resource)),
    });
    var defaultTitle = translate('ra.page.list', {
        name: resourceName,
    });
    return {
        basePath: basePath,
        currentSort: currentSort,
        data: data,
        defaultTitle: defaultTitle,
        displayedFilters: query.displayedFilters,
        filterValues: query.filterValues,
        hasCreate: hasCreate,
        hideFilter: queryModifiers.hideFilter,
        ids: finalIds,
        loaded: loaded || defaultIds.length > 0,
        loading: loading,
        onSelect: selectionModifiers.select,
        onToggleItem: selectionModifiers.toggle,
        onUnselectItems: selectionModifiers.clearSelection,
        page: query.page,
        perPage: query.perPage,
        resource: resource,
        selectedIds: selectedIds,
        setFilters: queryModifiers.setFilters,
        setPage: queryModifiers.setPage,
        setPerPage: queryModifiers.setPerPage,
        setSort: queryModifiers.setSort,
        showFilter: queryModifiers.showFilter,
        total: typeof total === 'undefined' ? defaultTotal : total,
        version: version,
    };
};
export var injectedProps = [
    'basePath',
    'currentSort',
    'data',
    'defaultTitle',
    'displayedFilters',
    'filterValues',
    'hasCreate',
    'hideFilter',
    'ids',
    'loading',
    'loaded',
    'onSelect',
    'onToggleItem',
    'onUnselectItems',
    'page',
    'perPage',
    'refresh',
    'resource',
    'selectedIds',
    'setFilters',
    'setPage',
    'setPerPage',
    'setSort',
    'showFilter',
    'total',
    'version',
];
/**
 * Select the props injected by the useListController hook
 * to be passed to the List children need
 * This is an implementation of pick()
 */
export var getListControllerProps = function (props) {
    return injectedProps.reduce(function (acc, key) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[key] = props[key], _a)));
    }, {});
};
/**
 * Select the props not injected by the useListController hook
 * to be used inside the List children to sanitize props injected by List
 * This is an implementation of omit()
 */
export var sanitizeListRestProps = function (props) {
    return Object.keys(props)
        .filter(function (propName) { return !injectedProps.includes(propName); })
        .reduce(function (acc, key) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[key] = props[key], _a)));
    }, {});
};
export default useListController;
