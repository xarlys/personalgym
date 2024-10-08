import { IHistoryDTO } from '@dtos/IHistoryDTO';
import { Heading, HStack, Text, VStack } from 'native-base';

type HistoryCardProps = {
  data: IHistoryDTO;
}

export const HistoryCard = ({ data }: HistoryCardProps) => {
  
  return (
    <HStack w="full" px={5} py={4} mb={3} bg="gray.600" rounded="md" alignItems="center" justifyContent="space-between">
      <VStack mr={5} flex={1}>
        <Heading color="white" fontSize="md" textTransform="capitalize" fontFamily="heading" numberOfLines={1}>
          { data.exercise.muscle_group?.name }
        </Heading>

        <Text color="gray.100" fontSize="lg" numberOfLines={1}>
          { data.exercise.name }
        </Text>
      </VStack>

      <Text color="gray.300" fontSize="md">
        { data.hour }
      </Text>

    </HStack>
  );
}