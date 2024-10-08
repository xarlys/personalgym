import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Image, Text, VStack, Icon } from 'native-base';

import { Entypo } from '@expo/vector-icons';
import { IExerciseDTO } from '@dtos/IExerciseDTO';
import { api } from '@services/api';

type Props = TouchableOpacityProps & {
 data: IExerciseDTO
};

export const ExerciseCard = ({ data, ...rest }: Props) => {

  return (
    <TouchableOpacity {...rest}>
      <HStack bg="gray.500" alignItems="center" p={2} pr={4} rounded="md" mb={3}>
        <Image 
          source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumbnail}` }}
          alt="Imagem do exercício"
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="lg" color="white" fontFamily="heading">
            { data.name }
          </Heading>

          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            { data.series } séries x { data.repetitions } repetições
          </Text>
        </VStack>

        <Icon 
          as={Entypo}
          name="chevron-thin-right"
          color="gray.300"
        />
      </HStack>
    </TouchableOpacity>
  );
}
// source={{ uri: 'http://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg' }}