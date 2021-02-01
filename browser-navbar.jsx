function normalizedUri(input) {
  var prefix = 'http://';
  var prefix2 = 'https://';


  if (!/^([^:\/]+)(:\/\/)/g.test(input) && (!prefix.includes(input)) && !prefix2.includes(input)) {
    input = prefix + input;
  }
 
  


  return input;
}

var BrowserNavbarBtn = React.createClass({
  render: function() {
    return <a href="#" className={this.props.disabled?'disabled':''} title={this.props.title} onClick={this.props.onClick}><i className={'fa fa-'+this.props.icon} /></a>
  }
})

var BrowserNavbarLocation = React.createClass({
  onKeyDown: function (e) {
    if (e.keyCode == 13)
      this.props.onEnterLocation(normalizedUri(e.target.value))
  },
  onChange: function (e) {
    this.props.onChangeLocation(normalizedUri(e.target.value))
  },
  render: function() {
    return <input type="text" onKeyDown={this.onKeyDown} onChange={this.onChange} onContextMenu={this.props.onContextMenu} value={this.props.page.location} />
  }
})



var BrowserNavbar = React.createClass({
  render: function() {
    return <div id="browser-navbar">
      <BrowserNavbarBtn className="bg" title="Start/Stop" icon="bug" onClick={this.props.onClickHome}/>
      <div className="jx">
      <BrowserNavbarBtn title="Back" icon="angle-left fa-lg" onClick={this.props.onClickBack} disabled={!this.props.page.canGoBack} />
      <BrowserNavbarBtn title="Refresh" icon="refresh" onClick={this.props.onClickRefresh} disabled={!this.props.page.canRefresh} />
      </div><div className="input-group">
        <BrowserNavbarLocation onEnterLocation={this.props.onEnterLocation} onChangeLocation={this.props.onChangeLocation} onContextMenu={this.props.onLocationContextMenu} page={this.props.page} />
      </div>
    </div>
  }
})
