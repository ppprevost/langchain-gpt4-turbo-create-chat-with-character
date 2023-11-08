import { useFormContext } from 'react-hook-form';
import FormWrapper from './wrapper';
import { Textarea } from 'react-daisyui';

const Description = () => {
  const methods = useFormContext();

  return (
    <FormWrapper
      error={methods.formState.errors.description?.message as string}
      name="presentation_character"
    >
      <Textarea
        color={methods.formState.errors.description ? 'error' : 'neutral'}
        {...methods.register('description')}
      />
    </FormWrapper>
  );
};

export default Description;
