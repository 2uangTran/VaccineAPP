import {createContext, useContext, useMemo, useReducer} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

const MyContext = createContext();

MyContext.displayName = 'MyContextContext';

function reducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN': {
      return {...state, userLogin: action.value};
    }
    case 'SET_USER_ROLE': {
      return {...state, userRole: action.value};
    }
    case 'ADD_TO_CART': {
      const updatedCartItems = [...(state.cartItems || []), action.item];
      return {...state, cartItems: updatedCartItems};
    }
    case 'REMOVE_FROM_CART': {
      const updatedCartItems = state.cartItems.filter(
        item => item.id !== action.id,
      );
      return {...state, cartItems: updatedCartItems};
    }
    case 'SET_CART_COUNT': {
      return {...state, cartCount: action.value};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}


function MyContextControllerProvider({children}) {
  const initialState = {
    userLogin: null,
    userRole: null,
    cartItems: [], // Thêm trạng thái giỏ hàng
  };
  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

function useMyContextController() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error(
      'useMyContextController should be used inside the MyContextControllerProvider.',
    );
  }
  return context;
}

const USERS = firestore().collection('USERS');
const vaccines = firestore().collection('vaccines');
const Cart = firestore().collection('Cart');

const login = (dispatch, email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() =>
      USERS.doc(email).onSnapshot(u => {
        const value = u.data();
        console.log('Dang nhap thanh cong voi user : ', value);
        dispatch({type: 'USER_LOGIN', value});
      }),
    )
    .catch(e => Alert.alert('Error', 'Invalid email or password'));
};

const logout = (dispatch, navigation) => {
  dispatch({type: 'USER_LOGIN', value: null});
  navigation.navigate('Login');
};

const register = async (
  fullName,
  email,
  password,
  gender,
) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const userData = {
      email: userCredential.user.email,
      fullName: fullName,
      gender: gender,
    };
    await USERS.doc(email).set(userData);

    console.log('Registration successful with user:', userData);
    return userData;
  } catch (error) {
    console.error('Error registering:', error.message);
    throw error;
  }
};
const deleteVaccines = async id => {
  try {
    await Cart.doc(id).delete();
    console.log('Vaccine deleted successfully');
    Alert.alert('Success', 'Vaccine deleted successfully!');
  } catch (error) {
    console.error('Error deleting vaccine:', error);
    Alert.alert('Error', error.message);
  }
};


const getCartCount = async (dispatch) => {
  try {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const cartSnapshot = await Cart.where('userId', '==', currentUser.uid).get();
      let cartCount = 0;
      cartSnapshot.forEach(doc => {
        const productData = doc.data();
        if (productData.userId === currentUser.uid) {
          cartCount++;
        }
      });
      dispatch({type: 'SET_CART_COUNT', value: cartCount});
    }
  } catch (error) {
    console.error('Error getting cart count:', error);
  }
};


const listenToCartCount = (dispatch) => {
  return Cart.onSnapshot(snapshot => {
    let cartCount = 0;
    const currentUser = auth().currentUser;
    if (currentUser) {
      snapshot.forEach(doc => {
        const productData = doc.data();
        if (productData.userId === currentUser.uid) {
          cartCount++;
        }
      });
    }
    dispatch({type: 'SET_CART_COUNT', value: cartCount});
  }, error => {
    console.error('Error listening to cart count:', error);
  });
};



export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  logout,
  register,
  deleteVaccines,
  getCartCount,
  listenToCartCount,
};