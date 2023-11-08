import { useRef } from 'react';
import { Button, Input, Badge } from 'react-daisyui';
import FormWrapper from './wrapper';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Close from '../ui/close';
import { FormValues } from '.';

const Faq = () => {
  const methods = useFormContext<FormValues>();
  const {
    fields: fieldsFaq,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: methods.control,
    name: 'faq',
  });
  const faqRef = useRef<HTMLInputElement>(null);
  methods.watch('faq');
  return (
    <div className="">
      <div className="flex gap-2 mb-2 items-center">
        <FormWrapper
          error={methods.formState.errors.faq?.message as string}
          name="FAQ"
        >
          <Input
            placeholder="the frequently asked question of your character"
            id="faqs"
            color={methods.formState.errors.faq ? 'error' : 'neutral'}
            ref={faqRef}
          />
          <Button
            onClick={e => {
              e.preventDefault();
              const val = faqRef.current?.value;
              if (val) {
                appendFaq({ text: val });
                faqRef.current.value = '';
              }
            }}
          >
            Add Faq
          </Button>
        </FormWrapper>
      </div>

      {fieldsFaq.map((field, i) => (
        <Badge key={i} color={'primary'} className="mx-2">
          <div onClick={() => removeFaq(i)}>
            <Close />
          </div>
          {field.text}
        </Badge>
      ))}
    </div>
  );
};

export default Faq;
