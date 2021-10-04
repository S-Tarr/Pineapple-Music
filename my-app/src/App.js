import logo from './logo.jpg';
import './App.css';
import { TouchableOpacity, Image } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import doorIcon from './images/icon-door.png' ;

function HomeScreen( {navigation} ) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <TouchableOpacity onPress={() => navigation.navigate("example")}>
          <Image src={doorIcon}></Image>
        </TouchableOpacity>
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
