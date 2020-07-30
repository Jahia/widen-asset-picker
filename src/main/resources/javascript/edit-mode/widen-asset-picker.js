function getCustomProductPickerData () {
    console.log("getCustomProductPickerData !");
    // var frm = document.getElementById("cioProductPickerFrame");
    //
    // if (!frm) {
    //     return undefined;
    // }
    //
    // var fw = frm.contentWindow;
    // if(!fw || !fw.productPickerData) {
    //     return undefined;
    // }
    //
    // return fw.productPickerData;
}


function widenPickerInit(data) {
    console.log("widenPickerInit !");
    const iframe = `<iframe 
            id="widenAssetPickerFrame" width="100%" height="100%" frameborder="0"
            src="${jahiaGWTParameters.contextPath}${jahiaGWTParameters.servletPath}/editframe/default/${jahiaGWTParameters.lang}/sites/${jahiaGWTParameters.siteKey}.widen-asset-edit-picker.html"/>`
    return $.parseHTML(iframe)[0];



    // return $.parseHTML("<iframe id=\"cioProductPickerFrame\" width=\"100%\" height=\"100%\" frameborder='0' src=\""+jahiaGWTParameters.contextPath + jahiaGWTParameters.servletPath + "/editframe/default/" + jahiaGWTParameters.lang + "/sites/" + jahiaGWTParameters.siteKey + ".widen-asset-edit-picker.html\"/>")[0];
}

function widenPickerLoad(data) {
    console.log("widenPickerLoad !");
    // var pickerData = getCustomProductPickerData();
    // var $data = data;
    // if(pickerData !== undefined) {
    //     pickerData.load(data);
    // } else {
    //     var frm = document.getElementById("cioProductPickerFrame");
    //
    //     if (frm !== undefined) {
    //         var fw = frm.contentWindow;
    //         if(fw !== undefined) {
    //             fw.addEventListener("load",function (event) {
    //                 console.log('iframe is completely loaded');
    //                 pickerData = getCustomProductPickerData();
    //                 pickerData.load($data);
    //             });
    //         }
    //     }
    // }
}

function widenPickerGet() {
    console.log("widenPickerGet !");
    // var pickerData = getCustomProductPickerData();
    // if(pickerData !== undefined) {
    //     return pickerData.get();
    // }
}