import { useCallback, useEffect, useState } from 'react';
import { FlatList, Heading, HStack, Text, useToast, VStack } from 'native-base';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { ExerciseCard } from '@components/ExerciseCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { IMuscleGroupDTO } from '@dtos/IMuscleGroupDTO';
import { IExerciseDTO } from '@dtos/IExerciseDTO';
import { Loading } from '@components/Loading';

export const Home = () => {
  const [groups, setGroups] = useState<IMuscleGroupDTO[]>([]);
  const [exercises, setExercises] = useState<IExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState('costas')

  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const handleOpenExerciseDetails = (exerciseId: string) => {
    navigation.navigate('exercise', { exerciseId });
  }

  const fetchGroups = async () => {
    try {

      const { data } = await api.get('/v1/muscle-group/list');
      setGroups(data);
      setGroupSelected(data[0].id);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const fecthExercisesByGroup = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/v1/exercise/findByGroupId/${groupSelected}`);
      setExercises(data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  },[])

  useFocusEffect(
    useCallback(() => {
      fecthExercisesByGroup()
    },[groupSelected])
  )

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList 
        data={groups}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Group 
            name={item.name}
            isActive={groupSelected === item.id}
            onPress={() => setGroupSelected(item.id)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{
          px: 8,
        }}
        my={10}
        maxH={10}
        minH={10}
      />
      {
        isLoading ? <Loading /> : 
        <VStack px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>
            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList 
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExerciseCard 
                onPress={() => handleOpenExerciseDetails(item.id)} 
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20
            }}
          />

        </VStack>
      }
    </VStack>
  )
}

{/* 
<HStack>
  <Group name="costa" />
  <Group name="ombro" />
</HStack> 
*/}
