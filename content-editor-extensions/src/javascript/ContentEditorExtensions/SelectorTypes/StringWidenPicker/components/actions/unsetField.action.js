export const unsetFieldAction = {
    init: context => {
        // const value = context.formik.values[context.field.name];
        // context.enabled = Boolean(!context.field.readOnly && (
        //     Array.isArray(value) ? value && value.length !== 0 : value
        // ));
        console.log("context.selectedItem : ",context.selectedItem);
        context.enabled = !context.field.readOnly && context.selectedItem;
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
