import { AppRegistry } from 'react-native';
import App from './App';

// Register the React Native root component
AppRegistry.registerComponent('JunglePalsApp', () => App);

// Mount to the DOM root element
AppRegistry.runApplication('JunglePalsApp', {
  rootTag: document.getElementById('root'),
});
