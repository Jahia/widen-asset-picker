import {registry} from '@jahia/ui-extender';
import DamWidenPickerCmp from './DamWidenPicker';

export default function () {
    registry.add('callback', 'widenPickerEditor', {
        targets: ['jahiaApp-init:20'],
        callback: () => {
            registry.add('selectorType', 'WidenPicker', {cmp: DamWidenPickerCmp, supportMultiple: false});
            console.debug('%c WidenPicker Editor Extensions  is activated', 'color: #3c8cba');
            registry.add('damSelectorConfiguration','WidenPicker',{types: ['wdenmix:widenAsset'],label:'Widen'});
        }
    });
}
