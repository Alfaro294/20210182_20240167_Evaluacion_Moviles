import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Users from '../screens/Users';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="User" component={Users} options={{title:'User'}} />
                {/*<Stack.Screen name="Add" component={Add} 
                options={{presentation:'modal', title:'Nuevo Usuario'}}/>*/}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;