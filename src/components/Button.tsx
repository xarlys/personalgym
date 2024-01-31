import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
  title: string;
  variante?: 'outline' | 'solid';
}

export const Button = ({ title, variant = 'solid', ...rest }: Props) => {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      bg={variant === 'outline' ? 'transparent' : 'blue.700'}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor="blue.500"
      rounded="sm"
      _pressed={{
        bg: variant === 'outline' ? 'gray.500' : 'blue.500'  
      }}
      {...rest}
    >
      <Text 
        color={variant === 'outline' ? 'blue.500' : 'white'} 
        fontFamily="heading"
        fontSize="md"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}