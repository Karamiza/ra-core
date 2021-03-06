import { isValidElement, cloneElement, useCallback } from 'react';
import get from 'lodash/get';
import { useTranslate } from '../i18n';
/*
 * Returns helper functions for choices handling.
 *
 * @param optionText Either a string defining the property to use to get the choice text, a function or a React element
 * @param optionValue The property to use to get the choice value
 * @param translateChoice A boolean indicating whether to option text should be translated
 *
 * @returns An object with helper functions:
 * - getChoiceText: Returns the choice text or a React element
 * - getChoiceValue: Returns the choice value
 */
var useChoices = function (_a) {
    var _b = _a.optionText, optionText = _b === void 0 ? 'name' : _b, _c = _a.optionValue, optionValue = _c === void 0 ? 'id' : _c, _d = _a.translateChoice, translateChoice = _d === void 0 ? true : _d;
    var translate = useTranslate();
    var getChoiceText = useCallback(function (choice) {
        if (isValidElement(optionText)) {
            return cloneElement(optionText, {
                record: choice,
            });
        }
        var choiceName = typeof optionText === 'function'
            ? optionText(choice)
            : get(choice, optionText);
        return translateChoice
            ? translate(choiceName, { _: choiceName })
            : choiceName;
    }, [optionText, translate, translateChoice]);
    var getChoiceValue = useCallback(function (choice) { return get(choice, optionValue); }, [
        optionValue,
    ]);
    return {
        getChoiceText: getChoiceText,
        getChoiceValue: getChoiceValue,
    };
};
export default useChoices;
