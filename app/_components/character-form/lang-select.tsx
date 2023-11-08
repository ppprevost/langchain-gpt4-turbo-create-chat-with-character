import { useFormContext } from 'react-hook-form';
import { Select } from 'react-daisyui';
import FormWrapper from './wrapper';

const SelectLang = () => {
  const methods = useFormContext();

  return (
    <FormWrapper
      error={methods.formState.errors.lang?.message as string}
      name="language"
    >
      <Select
        color={methods.formState.errors.lang ? 'error' : 'neutral'}
        {...methods.register('lang')}
        defaultValue={methods.getValues('lang') ?? 'en'}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="pt">Portuguese</option>
        <option value="cn">Chinese</option>
        <option value="jp">Japanese</option>
        <option value="ru">Russian</option>
      </Select>
    </FormWrapper>
  );
};

export default SelectLang;
