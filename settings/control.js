const $ = (selector) => {
    const result = document.querySelectorAll(selector);
    return result.length > 1 ? result : result[0];
}

document.addEventListener("DOMContentLoaded", () => {
    const savedLocation = window.myApp.getSavedPath();
    if (savedLocation) {
        $("#saved-location").value = savedLocation;
    }

    $("#choose-location").addEventListener("click", () => {
        window.myApp.openSettingDialog().then((res) => {
            if (Array.isArray(res.filePaths)) {
                $("#saved-location").value = res.filePaths[0];
                window.myApp.saveSettingPath(res.filePaths[0]);
            }
        })
    })
})