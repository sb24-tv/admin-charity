import { useEffect, useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import Pagination from "../../components/Pagination.tsx";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FiSearch, FiX, FiFilter, FiTrash2 } from "react-icons/fi";
import { StatusCodes } from '../../enum';
import NoArticle from "../../images/logo/article.png"
import Filter from "../../images/logo/filter.png"
import NoResult from "../../images/logo/no-results.png"
import Loader from "../../common/Loader/index.tsx";
import FilterCategory from "./FilterCategory.tsx";
const Content = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [content, setContent] = useState<any>([]);
    const [searchResult, setSearchResult] = useState<any>([]);
    const [filterCategoryResult, setFilterCategoryResult] = useState<any>([]);

    const [pages, setPage] = useState<any>([]);
    const [pagesSearch, setPageSearch] = useState<any>([]);
    const [pagesCategory, setPageCategory] = useState<any>([]);

    const page = searchParams.get('page');
    const searchKey = searchParams.get('search');
    const [loading, setLoading] = useState<boolean>(true);
    const [show, setIsOpen] = useState<boolean>(false);
    const [getCategoryId] = useSearchParams();
    const categoryIdParam = getCategoryId.get("categoryId");

    const searchRef = useRef<any>("");

    useEffect(() => {
        APIService.get(`content?page=${page}`).then((response: any) => {
            if (response.status === StatusCodes.OK) {
                setContent(response.data.data);
                setPage(response.data.pagination);
                setLoading(false);
            }
        });
        if (searchKey) {
            APIService.get(`contents?search=${searchKey}${page ? `&page=${page}` : ''}`)
                .then((response: any) => {
                    if (response.status === StatusCodes.OK) {
                        setSearchResult(response.data.data);
                        setPageSearch(response.data.pagination);
                    }
                }
                )
        }
        if (categoryIdParam) {
            APIService.get(`content?categoryId=${categoryIdParam}${page ? `&page=${page}` : ''}`)
                .then((response: any) => {
                    if (response.status === StatusCodes.OK) {
                        setFilterCategoryResult(response.data.data);
                        setPageCategory(response.data.pagination);
                    }
                }
                )
        }
    }, [page, searchKey, categoryIdParam]);
    // @ts-ignore
    const handlePagination = (currents: any) => {
        setPage({ ...pages, current_page: currents });
        if (searchKey) {
            setPageSearch({ ...pagesSearch, current_page: currents });
        }
        if (categoryIdParam) {
            setPageCategory({ ...pagesCategory, current_page: currents });
        }
    };
    const handleSearch = () => {
        const searchValue = searchRef.current?.value;
        if (searchValue) {
            const searchKey = encodeURIComponent(searchValue);
            const searchURL = `/content?search=${searchKey}`;
            navigate(searchURL);
            APIService.get(`contents?search=${searchKey}${page ? `&page=${page}` : ''}`)
                .then((response: any) => {
                    // Handle the response data
                    if (response.status === StatusCodes.OK) {
                        setSearchResult(response.data.data);
                        setPageSearch(response.data.pagination);
                    }
                })
        }
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };
    useEffect(() => {
        const handleKeyPress = (event: any) => {
            if (event.key === '/') {
                event.preventDefault();
                searchRef.current.focus();
            }
        };

        if (!searchKey && searchRef.current) {
            searchRef.current.value = '';
        }

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [searchKey]);
    
    // noinspection XmlDeprecatedElement,JSDeprecatedSymbols
    return (

        loading ?
            (
                <Loader />
            )
            :

            <>
                <FilterCategory show={show} onCloseFilterCategory={() => setIsOpen(false)} />
                <div className="mb-6 flex flex-col gap-3 sm:flex-row items-center">
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                        Content
                    </h2>
                </div>
                <div className="flex flex-col gap-10">
                    <div
                        className="rounded-xl bg-white px-5 pt-6 pb-2.5 box-shadow-custom-2 dark:border-strokedark dark:bg-black-custom sm:px-7.5 xl:pb-1 ">
                        <div className="max-w-full overflow-x-auto">
                            <div className="flex justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            ref={searchRef}
                                            defaultValue={searchKey ? searchKey : ''}
                                            onKeyPress={handleKeyPress}
                                            className="w-90 rounded-full border border-[#e9e9ec]  bg-[#f5f8fa] py-2.5 pl-11 pr-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                                        />
                                        <span className="absolute left-4 top-3 cursor-pointer" onClick={handleSearch}>
                                            <FiSearch className="w-5 h-5" />
                                        </span>
                                        {
                                            searchKey &&
                                            <span className="absolute right-3 bg-[#CBCBCB] dark:bg-[#2F3D47] text-gray-2 top-3 p-1 rounded-full cursor-pointer" onClick={() => { navigate('/content'); }
                                            }>
                                                <FiX className="w-3.5 h-3.5" />
                                            </span>
                                        }
                                    </div>

                                    <button
                                        className="ml-2 border border-meta-9 dark:border-[#2F3D47]  dark:text-white inline-flex items-center justify-center rounded-full bg-transparent py-2.5 px-4 text-center font-medium text-[#0d0c22] hover:bg-[#f3f3f4] dark:hover:bg-gray-box-2 lg:px-5 xl:px-6 outline-none focus:outline-none"
                                        onClick={() => setIsOpen(true)}
                                    >
                                        <FiFilter className="mr-2" /> <span>Filter</span>
                                    </button>
                                    {
                                        categoryIdParam &&
                                        <button
                                            className="ml-2 border border-meta-1  inline-flex items-center justify-center rounded-full bg-meta-1 py-2.5 px-4 text-center font-medium text-white hover:bg-opacity-90
                                        lg:px-4.5 xl:px-5"
                                            onClick={() => { navigate('/content'); }}
                                        >
                                            <FiTrash2 className="mr-2" /> <span>Clear</span>
                                        </button>
                                    }
                                </div>
                                <Link
                                    to="create"
                                    className="inline-flex items-center justify-center rounded-full bg-primary py-2.5 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-6"
                                >
                                    Create New
                                </Link>
                            </div>
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-black-2 rounded-t-xl">
                                        <th className="py-4 font-medium text-black dark:text-white xl:pl-11 rounded-tl-lg rounded-bl-lg">
                                            No
                                        </th>
                                        <th className="min-w-[300px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                            Title
                                        </th>
                                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                            Category
                                        </th>
                                        <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                            User
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                            Created
                                        </th>
                                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                            Status
                                        </th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white rounded-tr-lg rounded-br-lg">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !searchKey && !categoryIdParam && content &&
                                        (
                                            content.length > 0 ?
                                                content.map((item: any, index: number) => (
                                                    <tr key={index} className="border-b border-[#eee] dark:border-graydark last:border-b-0">
                                                        <td className="py-5 pl-9 dark:border-strokedark xl:pl-11">
                                                            {
                                                                pages.current_page === 1 ? (
                                                                    <p className="text-sm text-black dark:text-white">
                                                                        {index + 1}
                                                                    </p>
                                                                ) : (
                                                                    <p className="text-sm text-black dark:text-white">
                                                                        {(pages.current_page - 1) * pages.limit + index + 1}
                                                                    </p>
                                                                )
                                                            }
                                                        </td>
                                                        <td className="py-5 px-4 pl-9 max-w-[300px] dark:border-strokedark xl:pl-11">
                                                            <h5 className="font-medium text-black dark:text-white">
                                                                {item.name}
                                                            </h5>
                                                        </td>
                                                        <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                            <span className="font-medium dark:text-white text-orange-dark ">
                                                                {item.category.name}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                            <span className="font-semibold dark:text-white capitalize">
                                                                {item.user ? item.user.name : "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                            <p className="text-black dark:text-white">
                                                                {new Date(item.createAt).toLocaleDateString("en-US", {
                                                                    weekday: "short",
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })
                                                                }
                                                            </p>
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                            {
                                                                item.status === true ? (
                                                                    <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                                                                        Active
                                                                    </p>
                                                                ) : (
                                                                    <p className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                                                                        Disable
                                                                    </p>
                                                                )
                                                            }
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                            <div className="flex items-center space-x-3.5">
                                                                <Link to={`edit/${item.id}`}
                                                                    className="hover:text-primary">
                                                                    <FaRegPenToSquare />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                                :
                                                <tr>
                                                    <td colSpan={6} className="py-4 px-4 dark:border-strokedark">
                                                        <div className="w-full flex flex-col items-center justify-center">
                                                            <img src={NoArticle} alt="No Category" className="w-25 my-4 text-center" />
                                                            <p className="text-sm text-black dark:text-white text-center">
                                                                Empty content
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>

                                        )
                                    }
                                    {
                                        searchKey && !categoryIdParam &&
                                        (
                                            searchResult.length > 0 ?
                                                searchResult.map((item: any, index: number) => (
                                                    <tr key={index} className="border-b border-[#eee] dark:border-graydark last:border-b-0">
                                                        <td className="py-5 pl-9 dark:border-strokedark xl:pl-11">
                                                            {
                                                                pages.current_page === 1 ? (
                                                                    <p className="text-sm text-black dark:text-white">
                                                                        {index + 1}
                                                                    </p>
                                                                ) : (
                                                                    <p className="text-sm text-black dark:text-white">
                                                                        {(pages.current_page - 1) * pages.limit + index + 1}
                                                                    </p>
                                                                )
                                                            }
                                                        </td>
                                                        <td className="py-5 px-4 pl-9 max-w-[300px] dark:border-strokedark xl:pl-11">
                                                            <h5 className="font-medium text-black dark:text-white">
                                                                {item.name}
                                                            </h5>
                                                        </td>
                                                        <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                            <span className="font-medium dark:text-white text-orange-dark ">
                                                                {item.category.name}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                            <span className="font-semibold dark:text-white capitalize">
                                                                {item.user ? item.user.name : "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                            <p className="text-black dark:text-white">
                                                                {new Date(item.createAt).toLocaleDateString("en-US", {
                                                                    weekday: "short",
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })
                                                                }
                                                            </p>
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                            {
                                                                item.status === true ? (
                                                                    <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                                                                        Active
                                                                    </p>
                                                                ) : (
                                                                    <p className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                                                                        Disable
                                                                    </p>
                                                                )
                                                            }
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                            <div className="flex items-center space-x-3.5">
                                                                <Link to={`edit/${item.id}`}
                                                                    className="hover:text-primary">
                                                                    <FaRegPenToSquare />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                                :
                                                <tr>
                                                    <td colSpan={6} className="py-4 px-4 dark:border-strokedark">
                                                        <div className="w-full flex flex-col items-center justify-center">
                                                            <img src={NoResult} alt="No Category" className="w-25 my-4 text-center" />
                                                            <p className="text-sm text-black dark:text-white text-center">
                                                                Search no results
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                        )
                                    }
                                    {
                                        categoryIdParam &&
                                        (
                                            filterCategoryResult.length > 0 ?
                                                filterCategoryResult.map((item: any, index: number) => (
                                                    <tr key={index} className="border-b border-[#eee] dark:border-graydark last:border-b-0">
                                                        <td className="py-5 pl-9 dark:border-strokedark xl:pl-11">
                                                            {
                                                                pages.current_page === 1 ? (
                                                                    <p className="text-sm text-black dark:text-white">
                                                                        {index + 1}
                                                                    </p>
                                                                ) : (
                                                                    <p className="text-sm text-black dark:text-white">
                                                                        {(pages.current_page - 1) * pages.limit + index + 1}
                                                                    </p>
                                                                )
                                                            }
                                                        </td>
                                                        <td className="py-5 px-4 pl-9 max-w-[300px] dark:border-strokedark xl:pl-11">
                                                            <h5 className="font-medium text-black dark:text-white">
                                                                {item.name}
                                                            </h5>
                                                        </td>
                                                        <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                            <span className="font-medium dark:text-white text-orange-dark ">
                                                                {item.category.name}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                            <span className="font-semibold dark:text-white capitalize">
                                                                {item.user ? item.user.name : "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                            <p className="text-black dark:text-white">
                                                                {new Date(item.createAt).toLocaleDateString("en-US", {
                                                                    weekday: "short",
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })
                                                                }
                                                            </p>
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                            {
                                                                item.status === true ? (
                                                                    <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                                                                        Active
                                                                    </p>
                                                                ) : (
                                                                    <p className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                                                                        Disable
                                                                    </p>
                                                                )
                                                            }
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                            <div className="flex items-center space-x-3.5">
                                                                <Link to={`edit/${item.id}`}
                                                                    className="hover:text-primary">
                                                                    <FaRegPenToSquare />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                                :
                                                <tr>
                                                    <td colSpan={6} className="py-4 px-4 dark:border-strokedark">
                                                        <div className="w-full flex flex-col items-center justify-center">
                                                            <img src={Filter} alt="No Category" className="w-25 my-4 text-center" />
                                                            <p className="text-sm text-black dark:text-white text-center">
                                                                Filter no results
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span>
                                {
                                    !searchKey && !categoryIdParam && content &&
                                    (
                                        content.length === 0 && pages.total === 0 ?
                                            null
                                            :
                                            pages.total < pages.limit
                                                ?
                                                <>
                                                    Showing all
                                                    {
                                                        pages ? ' ' + pages.total + ' ' : 0
                                                    }
                                                    results
                                                </>
                                                :
                                                <>
                                                    Showing
                                                    {
                                                        pages.total === 0
                                                            ?
                                                            ` 0 - 0 `
                                                            :
                                                            ` ${(pages.current_page - 1) * pages.limit + 1} - ${(pages.current_page - 1) * pages.limit + content.length} `

                                                    }
                                                    of
                                                    {
                                                        pages ? ' ' + pages.total + ' ' : 0
                                                    }
                                                    results
                                                </>
                                    )
                                }
                                {
                                    searchKey && !categoryIdParam &&
                                    (
                                        searchResult.length === 0 && pagesSearch.total === 0 ?
                                            null
                                            :
                                            pagesSearch.total < pagesSearch.limit
                                                ?
                                                <>
                                                    Showing all
                                                    {
                                                        pagesSearch ? ' ' + pagesSearch.total + ' ' : 0
                                                    }
                                                    results
                                                </>
                                                :
                                                <>
                                                    Showing
                                                    {
                                                        pagesSearch.total === 0
                                                            ?
                                                            ` 0 - 0 `
                                                            :
                                                            ` ${(pagesSearch.current_page - 1) * pagesSearch.limit + 1} - ${(pagesSearch.current_page - 1) * pagesSearch.limit + searchResult.length} `

                                                    }
                                                    of
                                                    {
                                                        pagesSearch ? ' ' + pagesSearch.total + ' ' : 0
                                                    }
                                                    results
                                                </>
                                    )
                                }
                                {
                                    categoryIdParam &&
                                    (
                                        filterCategoryResult.length === 0 && pagesCategory.total === 0 ?
                                            null
                                            :
                                            pagesCategory.total < pagesCategory.limit
                                                ?
                                                <>
                                                    Showing all
                                                    {
                                                        pagesCategory ? ' ' + pagesCategory.total + ' ' : 0
                                                    }
                                                    results
                                                </>
                                                :
                                                <>
                                                    Showing
                                                    {
                                                        pagesCategory.total === 0
                                                            ?
                                                            ` 0 - 0 `
                                                            :
                                                            ` ${(pagesCategory.current_page - 1) * pagesCategory.limit + 1} - ${(pagesCategory.current_page - 1) * pagesCategory.limit + filterCategoryResult.length} `

                                                    }
                                                    of
                                                    {
                                                        pagesCategory ? ' ' + pagesCategory.total + ' ' : 0
                                                    }
                                                    results
                                                </>
                                    )
                                }
                            </span>
                            {/* @ts-ignore */}
                            <Pagination
                                pages={searchKey ? pagesSearch : categoryIdParam ? pagesCategory : pages}
                                pagination={handlePagination}
                                searchKey={searchKey}
                                categoryId={categoryIdParam}
                            />
                        </div>
                    </div>
                </div>
            </>

    );
};

export default Content;
