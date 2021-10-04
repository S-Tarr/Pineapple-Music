import logo from './logo.jpg';
import './App.css';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import doorIcon from './images/icon-door.png' ;
import { Linking } from 'react-native';

function HomeScreen( {navigation} ) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => Linking.openURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley")} className="Logout-Button"><img src={doorIcon} className="Logout-Icon" /></button>
      </header>
    </div>
  )
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
