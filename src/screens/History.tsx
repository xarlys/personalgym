import { useCallback, useState } from 'react';
import { HistoryCard } from '@components/HistoryCard'
import { Heading, VStack, SectionList, Text, useToast } from 'native-base';
import { ScreenHeader } from '@components/ScreenHeader';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/useAuth';
import { IHistoryByDayDTO } from '@dtos/IHistoryByDayDTO';
import { Loading } from '@components/Loading';

export const History = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<IHistoryByDayDTO[]>([]);

  // const [exercises, setExercises] = useState([
  //   {
  //     title: '26.08.22',
  //     data: ["Puxada frontal", "Remada unilateral"]
  //   },
  //   {
  //     title: '27.08.22',
  //     data: ["Puxada frontal"]
  //   }
  // ]);

  const { user } = useAuth();
  const toast = useToast();

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await api.get(`/v1/exercise/history/${user.id}`);
      // console.log("response data history", response.data);
      setExercises(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    },[])
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title='Histórico' />
      {
        isLoading ? <Loading /> :
        <SectionList 
          sections={exercises}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoryCard data={item} />
          )}
          renderSectionHeader={({ section }) => (
            <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
              {section.title}
            </Heading>
          )}
          px={8}
          contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      }
    </VStack>
  )
}
