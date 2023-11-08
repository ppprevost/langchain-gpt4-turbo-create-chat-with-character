import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export const Message = ({
  isError,
  children,
}: {
  isError: boolean;
  children: ReactNode;
}) => {
  return (
    <div
      className={`flex-1 ${
        isError ? 'text-red-500' : 'text-gray-400'
      } text-lg max-w-full overflow-x-scroll`}
    >
      {children}
    </div>
  );
};

type ChatStripeI = {
  isAi: boolean;
  children: ReactNode;
};

function ChatStripe({ isAi = false, children }: ChatStripeI) {
  return (
    <div className={cn('w-full p-3', isAi ? 'bg-[#40414F]' : 'bg-inherit')}>
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-2">
        {children}
      </div>
    </div>
  );
}

export default ChatStripe;
