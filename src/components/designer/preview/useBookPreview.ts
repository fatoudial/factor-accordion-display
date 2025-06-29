
import { useState, useMemo } from 'react';
import { ProcessedMessage } from '@/components/extractor/types';
import { BookDesign } from '@/types/book';

export const useBookPreview = (
  messages: ProcessedMessage[], 
  design: BookDesign, 
  isPremiumUser: boolean
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBookView, setIsBookView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // S'assurer que messages est toujours un tableau
  const safeMessages = Array.isArray(messages) ? messages : [];

  const processedMessages = useMemo(() => {
    return safeMessages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  }, [safeMessages]);

  const totalPages = Math.ceil(processedMessages.length / 10);
  const accessiblePages = isPremiumUser ? totalPages : Math.min(5, totalPages);

  const messageGroups = useMemo(() => {
    const groups: { [key: string]: ProcessedMessage[] } = {};
    processedMessages.forEach(msg => {
      const date = msg.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  }, [processedMessages]);

  const messageGroupsKeys = Object.keys(messageGroups);

  const nextPage = () => {
    if (currentPage < accessiblePages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const toggleBookView = () => {
    setIsBookView(prev => !prev);
  };

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    processedMessages,
    totalPages,
    bookDesign: design,
    extractedMessages: safeMessages,
    currentPage,
    accessiblePages,
    messageGroups,
    messageGroupsKeys,
    nextPage,
    prevPage,
    isGenerating,
    isBookView,
    isFullscreen,
    toggleFullscreen,
    toggleBookView,
    handleGeneratePreview,
    setCurrentPage,
  };
};
