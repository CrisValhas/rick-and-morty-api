import { useState } from 'react';

const usePagination = (initialPage: number = 1) => {
    const [page, setPage] = useState(initialPage);

    const nextPage = () => setPage((prev) => prev + 1);
    const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    return { page, nextPage, prevPage };
};

export default usePagination;