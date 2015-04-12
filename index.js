'use strict';

var React = require('react-native');

var NavBarContainer = require('./components/NavBarContainer');

var {
  StyleSheet,
  Navigator,
  StatusBarIOS,
  View,
} = React;


var Router = React.createClass({

  getInitialState: function() {
    return {
      route: {
        name: null,
        index: null
      },
      dragStartX: null,
      didSwitchView: null,
    }
  },

  onWillFocus: function(route) {
    this.setState({ route: route });
  },

  onBack: function(navigator) {
    if (this.state.route.index > 0) {
      navigator.pop();
    }
  },

  onForward: function(route, navigator) {
    route.index = this.state.route.index + 1 || 1;
    navigator.push(route);
  },

  renderScene: function(route, navigator) {

    var goForward = function(route) {
      route.index = this.state.route.index + 1 || 1;
      navigator.push(route);
    }.bind(this);

    var goBackwards = function() {
      this.onBack(navigator);
    }.bind(this);

    var didStartDrag = function(evt) {
      var x = evt.nativeEvent.pageX;
      if (x < 28) {
        this.setState({ 
          dragStartX: x, 
          didSwitchView: false
        });
        return true;
      }
    }.bind(this);

    // Recognize swipe back gesture for navigation
    var didMoveFinger = function(evt) {
      var draggedAway = ((evt.nativeEvent.pageX - this.state.dragStartX) > 30);
      if (!this.state.didSwitchView && draggedAway) {
        this.onBack(navigator);
        this.setState({ didSwitchView: true });
      }
    }.bind(this);

    // Set to false to prevent iOS from hijacking the responder
    var preventDefault = function(evt) {
      return true;
    };

    var Content = route.component;
    
    return (
      <View
        style={styles.container}
        onStartShouldSetResponder={didStartDrag}
        onResponderMove={didMoveFinger}
        onResponderTerminationRequest={preventDefault}>
        <Content
          name={route.name}
          index={route.index}
          toRoute={goForward}
          toBack={goBackwards}
        />
      </View>
    )
    
  },

  render: function() {

    StatusBarIOS.setStyle(1);

    return (
      <Navigator
        initialRoute={this.props.firstRoute}
        navigationBar={
          <NavBarContainer
            navigator={navigator} 
            toRoute={this.onForward}
            toBack={this.onBack}
            currentRoute={this.state.route}
            style={this.props.headerStyle}
            backButtonComponent={this.props.backButtonComponent}
            rightCorner={this.props.rightCorner}
          />
        }
        renderScene={this.renderScene}
        onWillFocus={this.onWillFocus}
      />
    )
  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 64
  },
});


module.exports = Router;