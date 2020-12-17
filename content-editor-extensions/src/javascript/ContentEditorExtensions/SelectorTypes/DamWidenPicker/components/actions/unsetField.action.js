export const unsetFieldAction = {
    init: context => {
        context.enabled = !context.field.readOnly && context.editorValue;
        context.key = 'unsetFieldActionWidenPicker';
    },
    onClick: context => {
        if (context.enabled) {
            context.widenStoreDispatch({
                case: 'DELETE_SELECTED_ASSET'
            });
        }
    }
};
