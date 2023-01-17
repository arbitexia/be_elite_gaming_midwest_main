import { DEFAULT_PAGE_SIZE } from '@/constants';

const getEnhancedPageCursor = (key, cursor) => {
  const defaultPageCursor = {
    page: 0,
    size: 25 //DEFAULT_PAGE_SIZE[key]
  };

  if (cursor) {
    return {
      ...defaultPageCursor,
      ...cursor
    };
  }

  return defaultPageCursor;
};

export default getEnhancedPageCursor;
