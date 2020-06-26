import { useCallback } from 'react';
import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import useLogout from './useLogout';
import useNotify from '../sideEffect/useNotify';
/**
 * Get a callback for calling the authProvider.checkAuth() method.
 * In case of rejection, redirects to the login page, displays a notification,
 * and throws an error.
 *
 * This is a low level hook. See those more specialized hooks
 * for common authentication tasks, based on useAuthCheck.
 *
 * @see useAuthenticated
 * @see useAuthState
 *
 * @returns {Function} checkAuth callback
 *
 * @example
 *
 * import { useCheckAuth } from 'react-admin';
 *
 * const MyProtectedPage = () => {
 *     const checkAuth = useCheckAuth();
 *     useEffect(() => {
 *         checkAuth().catch(() => {});
 *     }, []);
 *     return <p>Private content: EZAEZEZAET</p>
 * } // tip: use useAuthenticated() hook instead
 *
 * const MyPage = () => {
 *     const checkAuth = useCheckAuth();
 *     const [authenticated, setAuthenticated] = useState(true); // optimistic auth
 *     useEffect(() => {
 *         checkAuth({}, false)
 *              .then(() => setAuthenticated(true))
 *              .catch(() => setAuthenticated(false));
 *     }, []);
 *     return authenticated ? <Bar /> : <BarNotAuthenticated />;
 * } // tip: use useAuthState() hook instead
 */
var useCheckAuth = function () {
    var authProvider = useAuthProvider();
    var notify = useNotify();
    var logout = useLogout();
    var checkAuth = useCallback(function (params, logoutOnFailure, redirectTo) {
        if (params === void 0) { params = {}; }
        if (logoutOnFailure === void 0) { logoutOnFailure = true; }
        if (redirectTo === void 0) { redirectTo = defaultAuthParams.loginUrl; }
        return authProvider.checkAuth(params).catch(function (error) {
            if (logoutOnFailure) {
                logout({}, error && error.redirectTo
                    ? error.redirectTo
                    : redirectTo);
                notify(getErrorMessage(error, 'ra.auth.auth_check_error'), 'warning');
            }
            throw error;
        });
    }, [authProvider, logout, notify]);
    return authProvider ? checkAuth : checkAuthWithoutAuthProvider;
};
var checkAuthWithoutAuthProvider = function () { return Promise.resolve(); };
var getErrorMessage = function (error, defaultMessage) {
    return typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
            ? defaultMessage
            : error.message;
};
export default useCheckAuth;
