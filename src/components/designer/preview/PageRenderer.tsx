
import React from 'react';
import { BookCoverPage } from './pages/BookCoverPage';
import { BookTitlePage } from './pages/BookTitlePage';
import { BookDayPage } from './pages/BookDayPage';
import { BookAIIllustrationPage } from './pages/BookAIIllustrationPage';
import { BookPrefacePage } from './pages/BookPrefacePage';
import type { BookDesign } from '@/types/book';
import type { ProcessedMessage } from '@/utils/fileProcessing';

interface PageRendererProps {
  currentPage: number;
  design: BookDesign;
  messageGroups: { [key: string]: ProcessedMessage[] };
  messageGroupsKeys: string[];
  isPremiumUser?: boolean;
  accessiblePages?: number;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ 
  currentPage, 
  design, 
  messageGroups,
  messageGroupsKeys,
  isPremiumUser = false,
  accessiblePages = 0
}) => {
  if (currentPage === 0) return <BookCoverPage design={design} />;
  if (currentPage === 1) return <BookTitlePage design={design} />;
  if (currentPage === 2) return <BookPrefacePage design={design} />;
  
  const contentPageIndex = currentPage - 3;
  const totalContentPages = messageGroupsKeys.length + 
    (design.useAIImages ? Math.ceil(messageGroupsKeys.length / 2) : 0);
  
  if (contentPageIndex < messageGroupsKeys.length) {
    return <BookDayPage 
      dateIndex={currentPage}
      date={messageGroupsKeys[contentPageIndex]}
      messages={messageGroups[messageGroupsKeys[contentPageIndex]] || []}
      design={design}
    />;
  }
  
  if (design.useAIImages && contentPageIndex >= messageGroupsKeys.length) {
    return <BookAIIllustrationPage 
      design={design}
      index={contentPageIndex - messageGroupsKeys.length}
      messageGroupsKeys={messageGroupsKeys}
    />;
  }
  
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-500 italic">Page {currentPage + 1}</p>
    </div>
  );
};
