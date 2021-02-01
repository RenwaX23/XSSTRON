var pathlib = require('path')

var BrowserPageSearch = React.createClass({
  componentDidUpdate: function (prevProps) {
    if (!prevProps.isActive && this.props.isActive)
      this.refs.input.getDOMNode().focus()
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    return (this.props.isActive != nextProps.isActive)
  },
  onKeyDown: function (e) {
    if (e.keyCode == 13) {
      e.preventDefault()
      this.props.onPageSearch(e.target.value)
    }
  },
  render: function () {
    return <div id="browser-page-search" className={this.props.isActive ? 'visible' : 'hidden'}>
      <input ref="input" type="text" placeholder="Search..." onKeyDown={this.onKeyDown} />
    </div>
  }
})

var BrowserPageStatus = React.createClass({
  render: function () {
    var status = this.props.page.statusText
    if (!status && this.props.page.isLoading)
      status = 'Loading...'
    return <div id="browser-page-status" className={status ? 'visible' : 'hidden'}>{status}</div>
  }
})

var BrowserPage = React.createClass({
  componentDidMount: function () {
    // setup resize events
    window.addEventListener('resize', resize)
    resize()

    // attach webview events
    for (var k in webviewEvents)
      this.refs.webview.getDOMNode().addEventListener(k, webviewHandler(this, webviewEvents[k]))

    // set location, if given
    if (this.props.page.location)
      this.navigateTo(this.props.page.location)
  },
  componentWillUnmount: function () {
    window.removeEventListener('resize', resize)    
  },

  navigateTo: function (l) {
    var webview = this.refs.webview.getDOMNode()
    webview.setAttribute('src', l)
  },

  onPageSearch: function (query) {
    this.refs.webview.getDOMNode().executeJavaScript('window.find("'+query+'", 0, 0, 1)')
  },

  render: function () {
    
    return <div className="sheta" >
      <BrowserPageSearch isActive={this.props.page.isSearching} onPageSearch={this.onPageSearch} />
      <webview ref="webview" onContextMenu={this.props.onContextMenu} />
      <BrowserPageStatus page={this.props.page} />
      
    </div>
  }  
})

function webviewHandler (self, fnName) {
  return function (e) {
    if (self.props[fnName])
      self.props[fnName](e, self.props.page, self.props.pageIndex)
  }
}

var webviewEvents = {
  'load-commit': 'onLoadCommit',
  'did-start-loading': 'onDidStartLoading',
  'did-stop-loading': 'onDidStopLoading',
  'did-finish-load': 'onDidFinishLoading',
  'did-fail-load': 'onDidFailLoad',
  'did-get-response-details': 'onDidGetResponseDetails',
  'did-get-redirect-request': 'onDidGetRedirectRequest',
  'dom-ready': 'onDomReady',
  'page-title-set': 'onPageTitleSet',
  'close': 'onClose',
  'destroyed': 'onDestroyed',
  'ipc-message': 'onIpcMessage',
  'console-message': 'onConsoleMessage'
}
setTimeout(() => {
  document.querySelector('webview').addEventListener('new-window', (e) => {
    const protocol = require('url').parse(e.url).protocol
    if (protocol === 'http:' || protocol === 'https:') {
      let win = new BrowserWindow({icon: __dirname + '/build/1.ico',width: 800, height: 600})
      win.loadURL(e.url);
    }
  })
}, 500);


function resize () {
  Array.prototype.forEach.call(document.querySelectorAll('webview'), function (webview) {
    var obj = webview && webview.querySelector('::shadow object')
    if (obj)
      obj.style.height = (window.innerHeight - 59) + 'px' // -61 to adjust for the tabs and navbar regions
  })
}