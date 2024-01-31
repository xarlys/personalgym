import { useContext } from "react";
import { useAuth } from '@hooks/useAuth';

import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { Loading } from "@components/Loading";

export const Routes = () => {

  const { colors } = useTheme();
  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  const { user, isLoadingUserStorageData } = useAuth();

  console.log("USUÁRIO LOGADO =>", user.email);

  if(isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {user.email ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}