'use client';
import { useLongPress, LongPressEventType } from 'use-long-press';
import { Microphone } from '@phosphor-icons/react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useQuery } from '@tanstack/react-query';
import { Character } from '@/types';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { getCharacterById } from '@/app/_actions/characters';
import { languageOptions } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';

const MicrophoneComponent = () => {
  const { id } = useParams();
  const { data: character } = useQuery<Character>(['actualCharacter', id], () =>
    getCharacterById(id as string)
  );

  const { setValue } = useFormContext();

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue('message', transcript);

    return () => {
      // SpeechRecognition.stopListening();
    };
  }, [setValue, transcript]);

  useEffect(() => {
    setReady(true);
  }, []);

  const language = useMemo(
    () =>
      languageOptions.find(options =>
        options.value.toLowerCase().includes(character?.lang ?? 'en')
      ),
    [character?.lang]
  );

  const [size, setSize] = useState(24);

  const bind = useLongPress(
    () => {
      navigator.vibrate(100);
      // setIsRecording(true);
    },
    {
      onStart: () => {
        setSize(32);

        SpeechRecognition.startListening({
          continuous: true,
          language: language?.value,
        });
        resetTranscript();
      },
      onFinish: () => {
        console.log('Press stop');
        setTimeout(() => {
          setSize(24);
          SpeechRecognition.stopListening();
        }, 500);
      },
      onCancel: () => {
        setTimeout(() => {
          setSize(24);
          SpeechRecognition.stopListening();
        }, 500);
        console.log('Press cancelled');
      },
      filterEvents: () => true, // All events can potentially trigger long press (same as 'undefined')
      threshold: 200, // In milliseconds
      captureEvent: true, // Event won't get cleared after React finish processing it
      cancelOnMovement: false, // Square side size (in pixels) inside which movement won't cancel long press
      cancelOutsideElement: false, // Cancel long press when moved mouse / pointer outside element while pressing
      detect: LongPressEventType.Pointer,
    }
  ); //
  return ready ? (
    <div>
      {language &&
        browserSupportsSpeechRecognition &&
        isMicrophoneAvailable && (
          <button
            {...bind()}
            className={`border-2 transition-all w-${size} h-${size} cursor-pointer rounded-full ${
              listening ? 'border-red-600' : ''
            }`}
          >
            <Microphone
              className="m-auto"
              weight={listening ? 'fill' : 'regular'}
              color={listening ? 'red' : 'white'}
              size={30}
            />
          </button>
        )}
      {!browserSupportsSpeechRecognition && (
        <div>
          <p>
            Oh no, it looks like your browser doesn&#39;t support Speech
            Recognition.
          </p>
        </div>
      )}
      {!isMicrophoneAvailable && (
        <div>
          <p>
            You need to give the permission for the microphone to be used before
            transcription can begin.
          </p>
        </div>
      )}
    </div>
  ) : null;
};

export default MicrophoneComponent;
