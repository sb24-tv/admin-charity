import React, { useEffect, useState } from "react";
import APIService from "../../service/APIService.ts";
import { Link, useSearchParams } from "react-router-dom";
import { FaRegPenToSquare } from "react-icons/fa6";
import CreateCategory from "./CreateCategory.tsx";
import EditCategory from "./EditCategory.tsx";
import NoFile from "../../images/logo/no-task.png";
import Loader from "../../common/Loader/index.tsx";
const Category = () => {
    const [searchParams] = useSearchParams();
    const getFirstCategory = searchParams.get('c1');
    const [category, setCategory] = useState([]);
    // This for create category
    let [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const fetchData = () => {
        APIService.get('category/front/sub').then((response: any) => {
            setCategory(response.data.data);
            setLoading(false);
        });
    }
    useEffect(() => {
        fetchData();
    }, [getFirstCategory]);

    const onCloseCreateCategory = () => {
        setOpen(false);
    }

    // This for edit category
    const [dataForEdit, setDataForEdit] = useState<any>(null);
    const [openEdit, setOpenEdit] = useState<boolean>(false);

    const onCloseEditCategory = () => {
        setOpenEdit(false);
    }
    return (
        loading ?
        (
            <Loader />
        )
        :

        <>
            <CreateCategory show={open} onCloseCreateCategory={onCloseCreateCategory} createCategory={() => fetchData()} />
            <EditCategory show={openEdit} onCloseEditCategory={onCloseEditCategory} dataForEditCategory={dataForEdit} updateCategory={() => fetchData()} />
            <div className="mb-6 flex flex-col gap-3 sm:flex-row items-center">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Category
                </h2>
            </div>
            <div
                className="rounded-xl bg-white px-5 pt-6 pb-2.5 box-shadow-custom-2 dark:border-strokedark dark:bg-black-custom sm:px-7.5 xl:pb-1 ">
                <div className="max-w-full overflow-x-auto">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            {
                                getFirstCategory &&
                                <>
                                    <Link to="/category">
                                        <span className="text-orange-dark font-medium hover:text-primary duration-100">Main</span>
                                    </Link>
                                    <span className="mx-2">/</span>
                                    <span className="text-gray-4 font-medium">First Category</span>
                                </>
                            }
                            
                        </div>
                        <div className="inline-flex items-center justify-center rounded-full bg-primary py-2.5 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-6 cursor-pointer"
                            onClick={() => setOpen(true)}
                        >
                            Create New
                        </div>
                    </div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-black-2 rounded-t-xl">
                                <th className="py-4 px-4 min-w-[10px] font-medium text-black dark:text-white xl:pl-11 rounded-tl-lg rounded-bl-lg">
                                    No
                                </th>
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Name
                                </th>
                                {
                                    !getFirstCategory &&
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                        Slug
                                    </th>
                                }
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Order
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
                                getFirstCategory &&
                                category.filter((item: any) => item.id == parseInt(getFirstCategory)).map((item: any, key: number) => (
                                    <React.Fragment key={key}>
                                        {
                                            item.subCategories.length > 0 ?
                                                item.subCategories.map((subcategory: any, index: number) => (
                                                    <tr className="border-b border-[#eee] dark:border-graydark last:border-b-0" key={index}>
                                                        <td className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                                            {
                                                                <p className="text-sm text-black dark:text-white">
                                                                    {index + 1}
                                                                </p>
                                                            }
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark xl:pl-11">
                                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                                    <p className="text-base text-black dark:text-white">
                                                                        {subcategory.name}
                                                                    </p>
                                                                </div>
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                                <p className="text-base text-black dark:text-white">
                                                                    {subcategory.ordering}
                                                                </p>
                                                        </td>
                                                        <td className="py-5 px-4 dark:border-strokedark">
                                                            <p className="text-black dark:text-white">
                                                                {new Date(subcategory.createAt).toLocaleDateString("en-US", {
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
                                                                subcategory.status === true ? (
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
                                                                <button className="hover:text-primary"
                                                                    onClick={
                                                                        () => {
                                                                            setOpenEdit(true);
                                                                            setDataForEdit(subcategory);
                                                                        }
                                                                    }
                                                                >
                                                                    <FaRegPenToSquare />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                ))
                                                :
                                                <tr>
                                                    <td colSpan={6} className="py-4 px-4 dark:border-strokedark">
                                                        <div className="w-full flex flex-col items-center justify-center">
                                                            <img src={NoFile} alt="No Category" className="w-25 my-4 text-center" />
                                                            <p className="text-sm text-black dark:text-white text-center">
                                                                No Category Found
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                        }
                                    </React.Fragment>
                                ))
                            }
                            {
                                category.length > 0 ?
                                    !getFirstCategory &&
                                    category.map((item: any, index: number) => (
                                        <tr className="border-b border-[#eee] dark:border-graydark last:border-b-0" key={index}>
                                            <td className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                                {
                                                    <p className="text-sm text-black dark:text-white">
                                                        {index + 1}
                                                    </p>
                                                }
                                            </td>
                                            <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <Link to={`?c1=${item.id}`}>
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                        <p className="text-base text-black dark:text-white">
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="py-5 px-4 dark:border-strokedark">
                                                <Link to={`?c1=${item.id}`}>
                                                    <p className="text-base text-black dark:text-white">
                                                        {item.slug}
                                                    </p>
                                                </Link>
                                            </td>
                                            <td className="py-5 px-4 dark:border-strokedark">
                                                <Link to={`?c1=${item.id}`}>
                                                    <p className="text-base text-black dark:text-white">
                                                        {item.ordering}
                                                    </p>
                                                </Link>
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
                                                    <button className="hover:text-primary"
                                                        onClick={
                                                            () => {
                                                                setOpenEdit(true);
                                                                setDataForEdit(item);
                                                            }
                                                        }
                                                    >
                                                        <FaRegPenToSquare />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td colSpan={7} className="py-4 px-4 dark:border-strokedark">
                                            <div className="w-full flex flex-col items-center justify-center">
                                                <img src={NoFile} alt="No Category" className="w-25 my-4 text-center" />
                                                <p className="text-sm text-black dark:text-white text-center">
                                                    No Category Found
                                                </p>
                                            </div>
                                        </td>
                                    </tr>

                            }

                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
};

export default Category;
