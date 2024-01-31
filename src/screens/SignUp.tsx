import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";
import { useForm, Controller } from 'react-hook-form';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  confirm_password: yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), null], 'A confirmação da senha não confere')
});

export const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { singIn } = useAuth();
  const toast = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const handleGoBack = () => {
    navigation.goBack();
  }

  const handleSignUp = async ({ name, email, password, confirm_password }: FormDataProps) => {
    try {
      setIsLoading(true);
      await api.post('/v1/authenticate/register', { name, email, password, confirm_password });
      await singIn(email, password)
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro no servidor';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10}>
        <Image 
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo.
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller 
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input 
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller 
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input 
                placeholder="E-mail" 
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller 
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input 
                placeholder="Senha" 
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller 
            control={control}
            name="confirm_password"
            render={({ field: { onChange, value } }) => (
              <Input 
                placeholder="Confirmar a Senha" 
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button 
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button 
          mt={24} 
          title="Voltar para o login" 
          variant="outline" 
          onPress={handleGoBack}
        />

      </VStack>
    </ScrollView>
  )
}

// [X]: backup antes do refactore de validação 

// import { useNavigation } from "@react-navigation/native";
// import { VStack, Image, Text, Center, Heading, ScrollView } from "native-base";
// import { useForm, Controller } from 'react-hook-form';
// import LogoSvg from '@assets/logo.svg';
// import BackgroundImg from '@assets/background.png';
// import { Input } from "@components/Input";
// import { Button } from "@components/Button";
// import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

// type FormDataProps = {
//   name: string;
//   email: string;
//   password: string;
//   confirm_password: string;
// }

// export const SignUp = () => {

//   const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>();
//   const navigation = useNavigation<AuthNavigatorRoutesProps>();

//   const handleGoBack = () => {
//     navigation.goBack();
//   }

//   const handleSignUp = ({ name, email, password, confirm_password }: FormDataProps) => {
//     console.log({ name, email, password, confirm_password })
//   }

//   return (
//     <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
//       <VStack flex={1} px={10}>
//         <Image 
//           source={BackgroundImg}
//           defaultSource={BackgroundImg}
//           alt="Pessoas treinando"
//           resizeMode="contain"
//           position="absolute"
//         />

//         <Center my={24}>
//           <LogoSvg />

//           <Text color="gray.100" fontSize="sm">
//             Treine sua mente e o seu corpo.
//           </Text>
//         </Center>

//         <Center>
//           <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
//             Crie sua conta
//           </Heading>

//           <Controller 
//             control={control}
//             name="name"
//             rules={{
//               required: 'Informe o nome.'
//             }}
//             render={({ field: { onChange, value } }) => (
//               <Input 
//                 placeholder="Nome"
//                 onChangeText={onChange}
//                 value={value}
//                 errorMessage={errors.name?.message}
//               />
//             )}
//           />

//           <Controller 
//             control={control}
//             name="email"
//             rules={{
//               required: 'Informe o email.',
//               pattern: {
//                 value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                 message: 'E-mail inválido'
//               }
//             }}
//             render={({ field: { onChange, value } }) => (
//               <Input 
//                 placeholder="E-mail" 
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 onChangeText={onChange}
//                 value={value}
//                 errorMessage={errors.email?.message}
//               />
//             )}
//           />

//           <Controller 
//             control={control}
//             name="password"
//             render={({ field: { onChange, value } }) => (
//               <Input 
//                 placeholder="Senha" 
//                 secureTextEntry
//                 onChangeText={onChange}
//                 value={value}
//               />
//             )}
//           />

//           <Controller 
//             control={control}
//             name="confirm_password"
//             render={({ field: { onChange, value } }) => (
//               <Input 
//                 placeholder="Confirmar a Senha" 
//                 secureTextEntry
//                 onChangeText={onChange}
//                 value={value}
//                 onSubmitEditing={handleSubmit(handleSignUp)}
//                 returnKeyType="send"
//               />
//             )}
//           />

//           <Button 
//             title="Criar e acessar"
//             onPress={handleSubmit(handleSignUp)}
//           />
//         </Center>

//         <Button 
//           mt={24} 
//           title="Voltar para o login" 
//           variant="outline" 
//           onPress={handleGoBack}
//         />

//       </VStack>
//     </ScrollView>
//   )
// }