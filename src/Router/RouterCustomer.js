import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MyContextControllerProvider} from '../context';
import Login from '../LoginRegister/Login';
import Register from '../LoginRegister/Register';
import Main from '../customer/Main';
import Personal from '../customer/Personal';
import Schedule from '../customer/Schedule';
import VaccinationRecord from '../customer/VaccinationRecord';
import Vaccine from '../customer/Vaccine';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ListVaccin from '../customer/menumain/ListVaccin';
import COLORS from '../theme/constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import UpdateInfo from '../customer/menuperson/UpdateInfo';
import {IconButton} from 'react-native-paper';
import AddNewVaccine from '../customer/menumain/AddNewVaccine';
import {useNavigation} from '@react-navigation/native';
import CustomHeaderRight from './CustomHeaderRight';
import InfoVictim from '../customer/vaccinform/InfoVictim';
import Cart from '../customer/Cart/Cart';
import DetailVaccines from '../customer/menumain/Vaccines/DetailVaccines';
import CustomHeaderRightUpdate from './CustomHeaderRightUpdate';
import UpdateVaccines from '../customer/menumain/Vaccines/UpdateVaccines';
import Info from '../customer/vaccinform/Info';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        tabBarStyle: {
          display: 'flex',
          height: 80,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 15,
        },
        tabBarIconStyle: {
          marginBottom: 5,
        },
      }}>
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          tabBarIcon: ({color, size}) => (
            <Feather name="home" color={color} size={34} />
          ),
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="calendar-month-outline"
              color={color}
              size={34}
            />
          ),
          tabBarLabel: 'Lịch hẹn',
        }}
      />

      <Tab.Screen
        name="Vaccine"
        component={Vaccine}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="shield-heart" color={color} size={34} />
          ),
          tabBarLabel: 'Vắc xin',
        }}
      />

      <Tab.Screen
        name="VaccinationRecord"
        component={VaccinationRecord}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="heart-circle-outline" color={color} size={34} />
          ),
          tabBarLabel: 'Hồ sơ tc',
        }}
      />
      <Tab.Screen
        name="Personal"
        component={Personal}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-circle-outline" color={color} size={34} />
          ),
          tabBarLabel: 'Cá nhân',
        }}
      />
    </Tab.Navigator>
  );
};

const RouterCustomer = () => {
  return (
    <MyContextControllerProvider>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: COLORS.blue},
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="Home"
          component={CustomerTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="UpdateInfo"
          component={UpdateInfo}
          options={{
            title: 'Hồ sơ cá nhân',
          }}
        />
        <Stack.Screen
          name="ListVaccin"
          component={ListVaccin}
          options={{
            title: 'Danh mục vắc xin',
            headerRight: () => <CustomHeaderRight />,
          }}
        />
        <Stack.Screen
          name="AddNewVaccine"
          component={AddNewVaccine}
          options={{title: 'Thêm Vaccine'}}
        />
        <Stack.Screen
          name="InfoVictim"
          component={InfoVictim}
          options={{
            title: 'Thông tin người được tiêm',
            headerRight: () => <CustomHeaderRight />,
          }}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{
            title: 'Giỏ hàng',
            headerRight: () => <CustomHeaderRight />,
          }}
        />
        <Stack.Screen
          name="DetailVaccines"
          component={DetailVaccines}
          options={{
            title: 'Chi tiết sản phẩm',
            headerRight: () => <CustomHeaderRightUpdate />,
          }}
        />
        <Stack.Screen
          name="UpdateVaccines"
          component={UpdateVaccines}
          options={{
            title: 'Cập nhật sản phẩm'}}
        />
        <Stack.Screen
          name="Info"
          component={Info}
          options={{
            title: 'Thông tin người tiêm'}}
        />
      </Stack.Navigator>
    </MyContextControllerProvider>
  );
};

export default RouterCustomer;
