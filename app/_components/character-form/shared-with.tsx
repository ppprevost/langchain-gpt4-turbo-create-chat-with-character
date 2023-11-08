import { useRef } from 'react';
import { Button, Input, Badge } from 'react-daisyui';
import FormWrapper from './wrapper';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { getUserByEmail } from '@/app/_actions/_users';
import Close from '../ui/close';
import { FormValues } from '.';
import { z } from 'zod';

const SharedWith = () => {
  const sharedRef = useRef<HTMLInputElement>(null);
  const methods = useFormContext<FormValues>();

  const { mutate: getTheUser } = useMutation(['getUser'], getUserByEmail);

  const {
    fields: fieldsShared,
    append: appendShared,
    remove: removeShared,
  } = useFieldArray({
    control: methods.control,
    name: 'sharedWith',
  });

  return (
    <div>
      <div className="flex items-end gap-2 mb-2">
        <FormWrapper
          error={methods.formState.errors.sharedWith?.message}
          name="shared with"
        >
          <Input placeholder='fanchat email user that you want to share your character with' ref={sharedRef} />
          <Button
            onClick={async e => {
              e.preventDefault();
              if (sharedRef.current) {
                const val = sharedRef?.current?.value;

                if (val) {
                  try {
                    z.string().email().parse(val);
                  } catch (err) {
                    console.log(err);

                    return alert('invalid email');
                  }
                  await getTheUser(val, {
                    onSuccess: data => {
                      if (
                        sharedRef.current &&
                        data &&
                        !fieldsShared
                          .map(field => field.email)
                          .includes(data.email)
                      ) {
                        sharedRef.current.value = '';
                        appendShared({
                          id: data._id,
                          email: data.email,
                        });
                      }
                    },
                    onError: err => {
                      if (err) {
                        alert('cannot find your friend');
                      }
                    },
                  });
                }
              }
            }}
          >
            Send Invitations
          </Button>
        </FormWrapper>
      </div>
      {fieldsShared.map((field, i) => (
        <Badge key={field.id} className="mx-2">
          <div onClick={() => removeShared(i)}>
            <Close />
          </div>

          {field.email}
        </Badge>
      ))}
    </div>
  );
};

export default SharedWith;
