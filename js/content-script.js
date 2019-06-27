function injectCustomJs(jsPath)
{
    jsPath = jsPath
    var temp = document.createElement('script')
    temp.setAttribute('type', 'module')
    temp.src = chrome.extension.getURL(jsPath)
    document.body.appendChild(temp)
}

document.addEventListener('DOMContentLoaded', () => {
  injectCustomJs('js/marked.min.js')
  injectCustomJs('js/inject.js')
})
