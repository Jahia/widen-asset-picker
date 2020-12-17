export const replaceAction = {
    init: context => {
        context.enabled = !context.field.readOnly;
        context.key = 'replaceWidenContent';
    },
    onClick: context => {
        if (context.enabled) {
            context.widenStoreDispatch({
                case: 'TOGGLE_SHOW_PICKER'
            });
        }
    }
};
