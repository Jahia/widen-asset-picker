export const unsetFieldAction = {
    init: context => {
        // const value = context.formik.values[context.field.name];
        // context.enabled = Boolean(!context.field.readOnly && (
        //     Array.isArray(value) ? value && value.length !== 0 : value
        // ));
        console.log("context.editorValue : ",context.editorValue);
        console.log("context.value : ",context.value);
        //TODO replace selectedItem by value
        context.enabled = !context.field.readOnly && context.editorValue;
        context.key = 'unsetFieldActionWidenPicker';
    },
    onClick: context => {
        if (context.enabled) {
            console.log("context.widenStoreDispatch : ",context.widenStoreDispatch);
            context.widenStoreDispatch({
                case: 'DELETE_SELECTED_ASSET'
            });
        }
    }
};
