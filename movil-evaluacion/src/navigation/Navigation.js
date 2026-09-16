import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Login from '../screens/Login.js';
import Home from '../screens/Home.js'

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={{title:'Login'}} />
                <Stack.Screen name="Home" component={Home} 
                options={{presentation:'modal', title:'Home'}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;