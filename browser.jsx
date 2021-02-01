'use strict'
var remote = require('electron').remote
const { Menu } = require('electron')
var clipboard = require('electron').clipboard
var urllib = require('electron').url

setTimeout(function(){
  document.getElementsByClassName('fa-bug')[0].style.color='red'

},500)



function createPageObject (location) {
  return {
    location: location||'https://github.com/RenwaX23/XSSTRON',
    statusText: false,
    title: 'new tab',
    isLoading: false,
    isSearching: false,
    canGoBack: false,
    canGoForward: false,
    canRefresh: false
  }
}

var BrowserChrome = React.createClass({
  getInitialState: function () {
    return {
      pages: [createPageObject()],
      currentPageIndex: 0
    }
  },
  componentWillMount: function () {
    // bind handlers to this object
    for (var k in this.tabHandlers)  this.tabHandlers[k]  = this.tabHandlers[k].bind(this)
    for (var k in this.navHandlers)  this.navHandlers[k]  = this.navHandlers[k].bind(this)
    for (var k in this.pageHandlers) this.pageHandlers[k] = this.pageHandlers[k].bind(this)
  },
  componentDidMount: function () {
    // attach webview events

    // attach keyboard shortcuts
    // :TODO: replace this with menu hotkeys
    var self = this
    document.body.addEventListener('keydown', function (e) {
      if (e.metaKey && e.keyCode == 70) { // cmd+f
        // start search
        self.getPageObject().isSearching = true
        self.setState(self.state)

        // make sure the search input has focus
        self.getPage().getDOMNode().querySelector('#browser-page-search input').focus()
      } else if (e.keyCode == 27) { // esc
        // stop search
        self.getPageObject().isSearching = false
        self.setState(self.state)
      }
    })
  },

  getWebView: function (i) {
    i = (typeof i == 'undefined') ? this.state.currentPageIndex : i
    return this.refs['page-'+i].refs.webview.getDOMNode()
  },
  getPage: function (i) {
    i = (typeof i == 'undefined') ? this.state.currentPageIndex : i
    return this.refs['page-'+i]
  },
  getPageObject: function (i) {
    i = (typeof i == 'undefined') ? this.state.currentPageIndex : i
    return this.state.pages[i]
  },


  tabContextMenu: function (pageIndex) {
    var self = this
    var menu = new Menu()
  },
  
  

  tabHandlers: {
 
    onMaximize: function () {
      if (remote.getCurrentWindow())
        remote.getCurrentWindow().maximize()
      else
        remote.unmaximize()
    },
    onMinimize: function () {
      remote.getCurrentWindow().minimize()
    },
    onClose: function () {
      remote.getCurrentWindow().close()
    }
  },

  navHandlers: {
    onClickHome: function () {
      if(swich){
     swich=0;
     document.getElementsByClassName('fa-bug')[0].style.color='black'
    }
     else {
       swich=1;
       document.getElementsByClassName('fa-bug')[0].style.color='red'

     }
      
    },
    onClickBack: function () {
      this.getWebView().goBack()
    },
    onClickRefresh: function () {
      this.getWebView().reload()
    },
    onClickBundles: function () {
      var location = urllib.parse(this.getWebView().getURL()).path
      this.getPage().navigateTo('/bundles/view.html#'+location)
    },
    onClickVersions: function () {
      var location = urllib.parse(this.getWebView().getURL()).path
      this.getPage().navigateTo('/bundles/versions.html#'+location)
    },
    onClickSync: console.log.bind(console, 'sync'),
    onEnterLocation: function (location) {
      this.getPage().navigateTo(location)
    },
    onChangeLocation: function (location) {
      var page = this.getPageObject()
      page.location = location
      this.setState(this.state)      
    },
    
  },
  pageHandlers: {
    onDidStartLoading: function (e, page) {
      page.isLoading = true
      page.title = false
      this.setState(this.state)
    },
    onDomReady: function (e, page, pageIndex) {
      var webview = this.getWebView(pageIndex)
      page.canGoBack = webview.canGoBack()
      page.canRefresh = true
      this.setState(this.state)
    },
    onDidStopLoading: function (e, page, pageIndex) {
      // update state
      var webview = this.getWebView(pageIndex)
      page.statusText = false
      page.location = webview.getURL()
      page.canGoBack = webview.canGoBack()
      if (!page.title)
        page.title = page.location
      page.isLoading = false
      this.setState(this.state)
    },
    onPageTitleSet: function (e) {
      var page = this.getPageObject()
      page.title = e.title
      page.location = this.getWebView().getURL()
      this.setState(this.state)
    },
    onContextMenu: function (e, page, pageIndex) {
      this.getWebView(pageIndex).send('get-contextmenu-data', { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
    },
    onIpcMessage: function (e, page) {
      if (e.channel == 'status') {
        page.statusText = e.args[0]
        this.setState(this.state)
      }
      else if (e.channel == 'contextmenu-data') {
        this.webviewContextMenu(e.args[0])
      }
    }
  },

  render: function() {
    var self = this
    return <div>
      <BrowserTabs ref="tabs" pages={this.state.pages} currentPageIndex={this.state.currentPageIndex} {...this.tabHandlers} />
      <BrowserNavbar ref="navbar" {...this.navHandlers} page={this.state.pages[this.state.currentPageIndex]} />
      {this.state.pages.map(function (page, i) {
        if (!page)
          return
        return <BrowserPage ref={'page-'+i} key={'page-'+i} {...self.pageHandlers} page={page} pageIndex={i} isActive={i == self.state.currentPageIndex} />
      })}
    </div>
  }
})

// render
React.render(
  <BrowserChrome />,
  document.getElementById('browser-chrome')
)
