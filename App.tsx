import { StatusBar, View } from 'react-native';
import { NativeBaseProvider, combineContextAndProps } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { THEME } from './src/theme';
import { Loading } from '@components/Loading';
import { Routes } from '@routes/index';
import { AuthContextProvider } from '@contexts/AuthContext';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
       <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}

// refatorado o contexto para dentro do provider combineContextAndProps
// backup do contexto anterior
{/* <AuthContext.Provider value={{
    user: {
      id: '1',
      name: 'Rodrigo Gonçalves',
      email: 'rodrigo@email.com',
      avatar: 'rodrigo.png'
    },
    infoToken: {
      user_who_created_id: "1",
      token: "1",
      expires_in_token: "7",
      expires_in_refresh_token: "7",
    }
  }}>
  {fontsLoaded ? <Routes /> : <Loading />}
</AuthContext.Provider> */}
