import { TouchableOpacity } from 'react-native';
import { Box, Heading, HStack, Icon, Image, Text, VStack, ScrollView, useToast } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';
import { Button } from '@components/Button';
import { useEffect, useState } from 'react';
import { IExerciseDTO } from '@dtos/IExerciseDTO';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { Loading } from '@components/Loading';

type RouteParamsProps = {
  exerciseId: string;
}

export const Exercise = () => {
  const [sendingRegister, setSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [exercise, setExercise] = useState<IExerciseDTO>({} as IExerciseDTO);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const toast = useToast();

  const { exerciseId } = route.params as RouteParamsProps;

  const handleGoBack = () => {
    navigation.goBack();
  }

  const fetchExerciseDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/v1/exercise/findById/${exerciseId}`);
      // console.log("exercise details", response.data)
      setExercise(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  const handleExerciseHistoryRegister = async () => {
    try {
      setSendingRegister(true);

      const formData = {
        exercise_id: exerciseId,
        series: exercise.series,
        repetitions: exercise.repetitions,
        user_client_id: exercise.user_client_id
      }

      await api.post('/v1/exercise/history', formData);

      toast.show({
        title: 'Parabéns! Exercício registrado no seu histórico.',
        placement: 'top',
        bgColor: 'green.500'
      });

      navigation.navigate('history');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível registrar exercício.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setSendingRegister(false);
    }
  }


  useEffect(() => {
    fetchExerciseDetails();
  },[exerciseId])
  // console.log("data exercise", exercise)
  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon 
            as={Feather}
            name="arrow-left"
            color="green.500"
            size={6}
          />
        </TouchableOpacity>

        <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center">
          <Heading color="gray.100" fontSize="lg" fontFamily="heading" flexShrink={1}>
            { exercise.name }
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="gray.200" ml={1} textTransform="capitalize">
              { exercise.muscle_group?.name }
            </Text>
          </HStack>
        </HStack>
      </VStack>
      
      { isLoading ? <Loading /> :
      <ScrollView>
        <VStack p={8}>
          <Box rounded="lg" mb={3} overflow="hidden">
            <Image
              w="full"
              h={80}
              source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.image}` }}
              alt="Nome do exercício"
              resizeMode="cover"
              rounded="lg"
            />
          </Box>

          <Box bg="gray.600" rounded="md" pb={4} px={4}>
            <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
              <HStack>
                <SeriesSvg />
                <Text color="gray.200" ml="2">
                  { exercise.series } séries
                </Text>
              </HStack>

              <HStack>
                <RepetitionsSvg />
                <Text color="gray.200" ml="2">
                { exercise.repetitions } repetições
                </Text>
              </HStack>
            </HStack>

            <Button 
              title="Marcar como realizado"
              isLoading={sendingRegister}
              onPress={handleExerciseHistoryRegister}
            />
          </Box>
        </VStack>
      </ScrollView>
      }
    </VStack>
  );
}