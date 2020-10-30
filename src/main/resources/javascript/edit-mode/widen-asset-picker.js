const __widenFrameID__ = "widenAssetPickerFrame";

function getCustomWidenPickerFrameWindow () {
    const frame = document.getElementById(__widenFrameID__);
    if (!frame)
        return undefined;

    return frame.contentWindow;
}
function getCustomWidenPickerInterface () {
    console.log("getCustomWidenPickerInterface !");
    const frameWindow = getCustomWidenPickerFrameWindow();
    if(!frameWindow || !frameWindow.widenPickerInterface) {
        return undefined;
    }
    return frameWindow.widenPickerInterface;
}

function widenPickerInit(data) {
    console.log("widenPickerInit with jahiaGWTParameters : ",jahiaGWTParameters);
    const iframe = `<iframe 
            id="${__widenFrameID__}" width="100%" height="100%" frameborder="0"
            src="${jahiaGWTParameters.contextPath}${jahiaGWTParameters.servletPath}/editframe/default/${jahiaGWTParameters.lang}/sites/${jahiaGWTParameters.siteKey}.widen-asset-edit-picker.html"/>`
    return $.parseHTML(iframe)[0];
}
//called when the picker is loaded
function widenPickerLoad(data) {
    console.log("widenPickerLoad ! data -> ",data);
    const $data = data;

    let pickerInterface = getCustomWidenPickerInterface();
    if(pickerInterface !== undefined) {
        pickerInterface.load(data);
    } else {
        const frameWindow = getCustomWidenPickerFrameWindow();
        if(frameWindow !== undefined) {
            frameWindow.addEventListener("load", event => {
                console.log('iframe picker is completely loaded');
                pickerInterface = getCustomWidenPickerInterface();
                pickerInterface.load($data);
            });
        }
    }
}
//called when click the picker save button
function widenPickerGet() {
    const pickerInterface = getCustomWidenPickerInterface();
    if(pickerInterface !== undefined) {
        return pickerInterface.data;
    }
}