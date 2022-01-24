import { useState, useCallback, useEffect, useMemo } from "react";

const LIMIT = 20;

const usePagination = (max?: number) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(LIMIT);
  const [offset, setOffset] = useState(0);

  const hasMore = useMemo(() => {
    return max ? offset + limit < max : true;
  }, [max, offset, limit]);

  useEffect(() => {
    setOffset(page * limit);
  }, [page]);

  const handleLoadMore = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  return {
    page,
    limit,
    offset,
    hasMore,
    setPage,
    setLimit,
    setOffset,
    handleLoadMore,
  };
};

export default usePagination;
