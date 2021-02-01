var BrowserTab = React.createClass({
  render: function () {
    var title = this.props.page.title || 'loading'
    return <div title="Mass URL Scan" onClick={this.props.onClick} onContextMenu={this.props.onContextMenu}>
      <span>
        {title}
        {this.props.page.isLoading ? <i className="fa fa-spinner fa-pulse" /> : undefined}
      </span>
      <a onClick={this.props.onxClose}><i className="fa fa-chrome" /></a>
      
    </div>
  }
})

var BrowserTabs = React.createClass({
  render: function () {
    var self = this
    return <div id="browser-tabs">
      <a className="close" onClick={this.props.onClose}><i className="fa fa-circle" /></a>
      <a className="minimize" onClick={this.props.onMinimize}><i className="fa fa-circle" /></a>
      <a className="maximize" onClick={this.props.onMaximize}><i className="fa fa-circle" /></a>
      
      {this.props.pages.map(function (page, i) {
        if (!page)
          return
        
        function onClick (e) {xsswxb() }
        function onContextMenu (e) { self.props.onTabContextMenu(e, page, i) }
        function onxClose (e) { e.preventDefault();  }
        return <BrowserTab key={'browser-tab-'+i} isActive={self.props.currentPageIndex == i} page={page} onClick={onClick} onContextMenu={onContextMenu}  />
      })}
    </div>
  }  
})

function xsswxb(){
  const remote = require('electron').remote;
  const BrowserWindow = remote.BrowserWindow;
  const win = new BrowserWindow({
    icon: __dirname + '/build/1.ico',
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration : true,
      webviewTag : true,
      contextIsolation: false

      
    
  }
  
  });
  win.setMenuBarVisibility(false)

  win.loadURL('file://' + require('path').join(__dirname, 'mass.html'))

  

}