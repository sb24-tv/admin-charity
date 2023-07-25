import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
interface PaginationProps {
    pagination: (current: number) => void;
    pages: {
        total: number;
        limit: number;
        current_page: number;
    };
    searchKey: any;
    categoryId: any;
}

function Pagination({ pagination, pages, searchKey, categoryId }: PaginationProps) {
    const handlePagination = (current: any) => {
        pagination(current);
    };
    const totalPage = Math.ceil(pages.total / pages.limit);
    const currentPage = pages.current_page;
    const filterKey = searchKey ? `?search=${searchKey}&` : categoryId ? `?categoryId=${categoryId}&` : '';
    // noinspection JSVoidFunctionReturnValueUsed
    return (
        totalPage >= 2 &&
        <ul className="flex items-center justify-start h-full gap-x-4 mt-6 flex-wrap">
            {
                currentPage > 1 &&
                <li>
                    <Link
                        className="p-3 rounded-[50%] hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2"
                        onClick={() => handlePagination(currentPage - 1)}
                        to={filterKey ? `${filterKey}page=${currentPage - 1}` : `?page=${currentPage - 1}`}>
                        <FiChevronLeft className="h-6 w-5 font-bold" />
                    </Link>
                </li>
            }
            {
                totalPage < 7
                    ?
                    <>
                        {Array.apply(0, Array(totalPage)).map((arr: unknown, i) => (
                            <React.Fragment key={i}>
                                <li key={i}>
                                    <Link
                                        className={`${currentPage === i + 1 ? "p-3 hover:bg-meta-2 bg-meta-2 dark:bg-gray-box-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2  font-medium" : "p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"}`}
                                        onClick={() => handlePagination(i + 1)}
                                        to={filterKey ? `${filterKey}page=${i + 1}` : `?page=${i + 1}`}>
                                        {i + 1}
                                    </Link>
                                </li>
                            </React.Fragment>
                        ))}
                    </>
                    :
                    currentPage % 5 >= 0 &&
                        currentPage > 4 &&
                        currentPage + 2 < totalPage
                        ?
                        <>
                            <li>
                                <Link
                                    className="p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"
                                    onClick={() => handlePagination(1)}
                                    to={filterKey ? `${filterKey}page=1` : `?page=1`}>
                                    1
                                </Link>
                            </li>
                            <li>
                                <span className="p-3 rounded-md dark:text-white2 font-medium">...</span>
                            </li>
                            <li>
                                <Link
                                    className="p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"
                                    onClick={() => handlePagination(currentPage - 1)}
                                    to={filterKey ? `${filterKey}page=${currentPage - 1}` : `?page=${currentPage - 1}`}>
                                    {currentPage - 1}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="p-3 hover:bg-meta-2 bg-meta-2 dark:bg-gray-box-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2  font-medium"
                                    onClick={() => handlePagination(currentPage)}
                                    to={filterKey ? `${filterKey}page=${currentPage}` : `?page=${currentPage}`}>
                                    {currentPage}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"
                                    onClick={() => handlePagination(currentPage + 1)}
                                    to={filterKey ? `${filterKey}page=${currentPage + 1}` : `?page=${currentPage + 1}`}>
                                    {currentPage + 1}
                                </Link>
                            </li>
                            <li>
                                <span className="pp-3 rounded-md dark:text-white2 font-medium">...</span>
                            </li>
                            <li>
                                <Link
                                    className="p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"
                                    onClick={() => handlePagination(totalPage)}
                                    to={filterKey ? `${filterKey}page=${totalPage}` : `?page=${totalPage}`}>
                                    {totalPage}
                                </Link>
                            </li>
                        </>
                        :
                        currentPage % 5 >= 0 &&
                            currentPage > 4 &&
                            currentPage + 2 >= totalPage
                            ?
                            <>
                                <li>
                                    <Link
                                        className="p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"
                                        onClick={() => handlePagination(1)}
                                        to={filterKey ? `${filterKey}page=1` : `?page=1`}>
                                        1
                                    </Link>
                                </li>
                                <li>
                                    <span className="p-3 rounded-md dark:text-white2 font-medium">...</span>
                                </li>
                                <li>
                                    <Link
                                        className={`${currentPage === totalPage - 3 ? "p-3 hover:bg-meta-2 bg-meta-2 dark:bg-gray-box-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2  font-medium" : "p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"}`}
                                        onClick={() => handlePagination(totalPage - 3)}
                                        to={filterKey ? `${filterKey}page=${totalPage - 3}` : `?page=${totalPage - 3}`}>
                                        {totalPage - 3}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`${currentPage === totalPage - 2 ? "p-3 hover:bg-meta-2 bg-meta-2 dark:bg-gray-box-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2  font-medium" : "p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"}`}
                                        onClick={() => handlePagination(totalPage - 2)}
                                        to={filterKey ? `${filterKey}page=${totalPage - 2}` : `?page=${totalPage - 2}`}>
                                        {totalPage - 2}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`${currentPage === totalPage - 1 ? "p-3 hover:bg-meta-2 bg-meta-2 dark:bg-gray-box-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2  font-medium" : "p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"}`}
                                        onClick={() => handlePagination(totalPage - 1)}
                                        to={filterKey ? `${filterKey}page=${totalPage - 1}` : `?page=${totalPage - 1}`}>
                                        {totalPage - 1}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`${currentPage === totalPage ? "p-3 hover:bg-meta-2 bg-meta-2 dark:bg-gray-box-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2  font-medium" : "p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"}`}
                                        onClick={() => handlePagination(totalPage)}
                                        to={filterKey ? `${filterKey}page=${totalPage}` : `?page=${totalPage}`}>
                                        {totalPage}
                                    </Link>
                                </li>
                            </>
                            :
                            <>
                                {Array.apply(0, Array(5)).map((arr, i) => (
                                    <React.Fragment key={i}>
                                        <li key={i.toString()}>
                                            <Link
                                                className={`${currentPage === i + 1 ? "p-3 hover:bg-meta-2 bg-meta-2 dark:bg-gray-box-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2  font-medium" : "p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"}`}
                                                onClick={() => handlePagination(i + 1)}
                                                to={filterKey ? `${filterKey}page=${i + 1}` : `?page=${i + 1}`}>
                                                {i + 1}
                                            </Link>
                                        </li>
                                    </React.Fragment>
                                ))}
                                <li>
                                    <span className="p-3 rounded-md dark:text-white2 font-medium">...</span>
                                </li>
                                <li>
                                    <Link
                                        className="p-3 hover:bg-meta-2 rounded-md dark:hover:bg-gray-box hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2 font-medium"
                                        onClick={() => handlePagination(totalPage)}
                                        to={filterKey ? `${filterKey}page=${totalPage}` : `?page=${totalPage}`}>
                                        {totalPage ? totalPage : 99}
                                    </Link>
                                </li>
                            </>
            }
            {
                currentPage < totalPage &&
                <li>
                    <Link
                        className="p-3 rounded-[50%] hover:text-orange-dark dark:hover:text-orange-dark dark:text-white2"
                        onClick={() => handlePagination(currentPage + 1)}
                        to={filterKey ? `${filterKey}page=${currentPage + 1}` : `?page=${currentPage + 1}`}>
                        <FiChevronRight className="h-6 w-5 font-bold" />
                    </Link>
                </li>
            }

        </ul>
    )
}

export default Pagination