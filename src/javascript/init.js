import {registry} from '@jahia/ui-extender';
import {WidenPickerContextInitializer} from './WidenPicker';
import {registerWidenPickerActions} from './WidenPicker/components/actions/registerPickerActions';
import svgWidenLogo from './asset/widen.svg';
import i18next from 'i18next';


i18next.loadNamespaces('widen-picker');

export default function () {
    registry.add('callback', 'widenPickerEditor', {
        targets: ['jahiaApp-init:20'],
        callback: () => {

            registry.add('selectorType', 'WidenPicker', {cmp: WidenPickerContextInitializer, supportMultiple: false});
            console.debug('%c WidenPicker Editor Extensions  is activated', 'color: #3c8cba');

            registry.add('damSelectorConfiguration','WidenPicker',{
                types: ['wdenmix:widenAsset'],
                label:'widen-picker:label.selectorConfig.label',
                description: 'widen-picker:label.selectorConfig.description',
                module:'widen-picker',
                icon: svgWidenLogo
            });

            registerWidenPickerActions(registry);
        }
    });

}
