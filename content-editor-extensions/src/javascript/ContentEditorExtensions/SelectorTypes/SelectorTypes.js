import DamWidenPickerCmp from './DamWidenPicker';
import {registerWidenPickerActions} from "./DamWidenPicker/components/actions";

export const registerSelectorTypes = registry => {
    registry.add('selectorType', 'WidenPicker', {cmp: DamWidenPickerCmp, supportMultiple: false});
    registerWidenPickerActions(registry);
};
