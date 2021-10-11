import logo from './logo.jpg';
import './App.css';
import { TouchableOpacity, Text } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IconButton from '@mui/material/IconButton';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import profileSettings from './components/profileSettings';
import { Linking } from 'react-native';

function HomeScreen( {navigation} ) {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} alt="logo" width="100%" />
        <button onClick={() => Linking.openURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley")} className="Profile-Button"><PersonOutlineIcon className="Profile-Icon"></PersonOutlineIcon></button>
      </div>
      <div className="screenDisplay">

      </div>
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