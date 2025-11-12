import { ReactNode } from 'react';

interface MobileScreenFrameProps {
  children: ReactNode;
  time?: string;
}

export const MobileScreenFrame = ({ children, time = '11:30' }: MobileScreenFrameProps) => {
  return (
    <div className="mobile-frame bg-white w-80 h-[600px] overflow-hidden">
      {/* Status Bar */}
      <div className="status-bar bg-transparent px-4 py-2 flex justify-between items-center">
        <span className="text-xs font-medium text-gray-800">{time}</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-gray-800 rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-800 rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-800 rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-400 rounded-sm"></div>
          </div>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="w-6 h-3 border-2 border-gray-800 rounded-sm relative">
            <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-gray-800 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-24px)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};