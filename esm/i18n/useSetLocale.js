import { useContext, useCallback } from 'react';
import { TranslationContext } from './TranslationContext';
import { useUpdateLoading } from '../loading';
import { useNotify } from '../sideEffect';
/**
 * Set the current locale using the TranslationContext
 *
 * This hook rerenders when the locale changes.
 *
 * @example
 *
 * import { useSetLocale } from 'react-admin';
 *
 * const availableLanguages = {
 *     en: 'English',
 *     fr: 'Français',
 * }
 * const LanguageSwitcher = () => {
 *     const setLocale = useSetLocale();
 *     return (
 *         <ul>{
 *             Object.keys(availableLanguages).map(locale => {
 *                  <li key={locale} onClick={() => setLocale(locale)}>
 *                      {availableLanguages[locale]}
 *                  </li>
 *              })
 *         }</ul>
 *     );
 * }
 */
var useSetLocale = function () {
    var _a = useContext(TranslationContext), setLocale = _a.setLocale, i18nProvider = _a.i18nProvider;
    var _b = useUpdateLoading(), startLoading = _b.startLoading, stopLoading = _b.stopLoading;
    var notify = useNotify();
    return useCallback(function (newLocale) {
        return new Promise(function (resolve) {
            startLoading();
            // so we systematically return a Promise for the messages
            // i18nProvider may return a Promise for language changes,
            resolve(i18nProvider.changeLocale(newLocale));
        })
            .then(function () {
            stopLoading();
            setLocale(newLocale);
        })
            .catch(function (error) {
            stopLoading();
            notify('ra.notification.i18n_error', 'warning');
            console.error(error);
        });
    }, [i18nProvider, notify, setLocale, startLoading, stopLoading]);
};
export default useSetLocale;
