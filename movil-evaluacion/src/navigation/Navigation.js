import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Users from '../screens/Users';
import Login from '../screens/Login.js';
import Home from '../screens/Home.js'
import Add from '../screens/AddUser.js'

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="User" component={Users} options={{title:'User'}} />
                <Stack.Screen name="Add" component={Add} 
                options={{presentation:'modal', title:'Nuevo Usuario'}}/>
                <Stack.Screen name="Login" component={Login} options={{title:'Login'}} />
                <Stack.Screen name="Home" component={Home} 
                options={{presentation:'modal', title:'Home'}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;