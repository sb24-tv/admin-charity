import React, { Fragment, useState, useEffect } from "react";
import APIService from "../../service/APIService.ts";
import { Dialog, Transition } from '@headlessui/react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusCodes, searchDataById } from "../../enum";
import { FiChevronDown, FiCheck } from "react-icons/fi";

interface PropsCategory {
    show: boolean;
    onCloseFilterCategory: any;
}

export default function FilterCategory({ show, onCloseFilterCategory }: PropsCategory) {
    const [category, setCategory] = useState<any>([]);
    const [openId, setOpenId] = useState<number>(0);
    const [requiredCategory, setRequiredCategory] = useState<boolean>(false);
    const [getCategoryId] = useSearchParams();
    const categoryIdParam = getCategoryId.get("categoryId");
    const [categorySelected, setCategorySelected] = useState<any>([]);

    const navigate = useNavigate();

    useEffect(() => {
        APIService.get(`category/front/sub`).then((response: any) => {
            if (response.status === StatusCodes.OK) {
                setCategory(response.data.data);
            }
        });
    }, []);

    const getParentId: any = categoryIdParam ? searchDataById(categoryIdParam ? Number(categoryIdParam) : 0, category) : null;
    const contentById: any | null = getParentId ? category[getParentId.position[0]].id : null;
    
    const handleCategory = (id: number) => {
        setOpenId(() => id === openId ? 0 : id);
    }
    
    useEffect(() => {
        setCategorySelected(categoryIdParam ? Number(categoryIdParam) : 0);
        setOpenId(contentById);
    }, [categoryIdParam, contentById]);

    const handleApply = async () => {
        const category = categorySelected;
        if (!category) {
            if (!category) setRequiredCategory(true);
            return;
        }
        navigate(`/content?categoryId=${category}`);
        onCloseFilterCategory();

    }
    const onClose = () => {
        onCloseFilterCategory();
        setRequiredCategory(false);
        setOpenId(contentById);
        setCategorySelected(categoryIdParam ? Number(categoryIdParam) : 0);
    }
    const onClickSelectCategory = (id: number) => {
        setRequiredCategory(false);
        setCategorySelected(id);
    }
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-999" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>
                <div className="fixed inset-0 ">
                    <div className="flex right-0 top-0 items-center justify-center text-center">
                        <Transition.Child
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                            className="absolute right-0 top-0 h-full"

                        >
                            <Dialog.Panel className="w-full max-w-[450px] h-[100vh] transform bg-white dark:bg-boxdark py-6 text-left align-middle shadow-xl transition-all">
                                <div className="w-full flex items-center justify-between px-5 pb-5">
                                    <h3 className="text-[18px] font-medium leading-6 tebg-black-box text-center dark:text-white2">
                                        Filter Content
                                    </h3>
                                </div>
                                <div className="sidebar-mobile w-full h-screen overflow-y-auto flex justify-start bg-white dark:bg-boxdark relative">
                                    <div className="flex items-start justify-start h-12 px-5 mt-1">
                                        <div className="max-lg:w-[400px] max-md:w-[350px] max-sm:w-[250px] w-[400px]">
                                            <div className="relative bg-transparent">
                                                <div
                                                    className="w-full flex flex-col h-[75vh] overflow-y-auto rounded mb-2 overflow-hidden"
                                                >
                                                    {
                                                        category.map((item: any, index: number) => {
                                                            return item.status === true && (
                                                                <React.Fragment key={index}>
                                                                    <div
                                                                        className={`relative pl-4 py-2 p-1 my-0.5 rounded-md bg-[#f4f5f6] dark:bg-gray-box ${item.subCategories.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                                                                        onClick={() => {
                                                                            handleCategory(item.id);
                                                                        }}
                                                                    >
                                                                        <span className="text-orange-dark font-semibold">
                                                                            {item.name}
                                                                        </span>
                                                                        {
                                                                            item.subCategories.length > 0 &&
                                                                            <span
                                                                                className={`absolute top-1/2 right-4 z-30 -translate-y-1/2 ${openId === item.id ? 'transform rotate-180 transition duration-500' : 'transform rotate-0 transition duration-500'}`}
                                                                            >
                                                                                <FiChevronDown className="text-body" />
                                                                            </span>
                                                                        }
                                                                    </div>
                                                                    {
                                                                        openId === item.id && item.subCategories.length > 0 &&
                                                                        <div className="flex flex-col gap-1.5 pl-4">
                                                                            {
                                                                                item.subCategories.map((sub: any, index: number) => {
                                                                                    return sub.status === true && (
                                                                                        <React.Fragment key={index}>
                                                                                            <div className="relative pl-6 p-0.5 my-0.5 rounded-md">
                                                                                                <label
                                                                                                    htmlFor={`checkbox-${sub.id}`}
                                                                                                    className="flex cursor-pointer select-none items-center"
                                                                                                >
                                                                                                    <div className="relative">
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            id={`checkbox-${sub.id}`}
                                                                                                            className="sr-only"
                                                                                                            onChange={() => {
                                                                                                                onClickSelectCategory(sub.id);
                                                                                                            }}
                                                                                                        />
                                                                                                        <div
                                                                                                            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${categorySelected === sub.id && 'border-primary bg-gray dark:bg-transparent'
                                                                                                                }`}
                                                                                                        >
                                                                                                            <span
                                                                                                                className={`h-2.5 w-2.5 rounded-sm ${categorySelected === sub.id && 'bg-primary'}`}
                                                                                                            ></span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <span className="text-success font-medium">
                                                                                                        {sub.name}
                                                                                                    </span>
                                                                                                </label>
                                                                                            </div>
                                                                                            {
                                                                                                sub.subCategories.map((sub2: any, index: number) => {
                                                                                                    return sub2.status === true && (
                                                                                                        <React.Fragment key={index}>
                                                                                                            <div className="relative pl-8 p-0.5 my-0.5 rounded-md">
                                                                                                                <label
                                                                                                                    htmlFor={`checkbox-${sub2.id}`}
                                                                                                                    className="flex cursor-pointer select-none items-center"
                                                                                                                >
                                                                                                                    <div className="relative">
                                                                                                                        <input
                                                                                                                            type="checkbox"
                                                                                                                            id={`checkbox-${sub2.id}`}
                                                                                                                            className="sr-only"
                                                                                                                            onChange={() => {
                                                                                                                                onClickSelectCategory(sub2.id)
                                                                                                                            }}
                                                                                                                        />
                                                                                                                        <div className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${categorySelected === sub2.id && 'border-primary'
                                                                                                                            }`}
                                                                                                                        >
                                                                                                                            <span className={`h-2.5 w-2.5 rounded-full bg-transparent ${categorySelected === sub2.id && '!bg-primary'
                                                                                                                                }`}
                                                                                                                            >
                                                                                                                                {' '}
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <span className="text-warning font-medium">
                                                                                                                        {sub2.name}
                                                                                                                    </span>
                                                                                                                </label>
                                                                                                            </div>
                                                                                                            {
                                                                                                                sub2.subCategories.map((sub3: any, index: number) => {
                                                                                                                    return sub3.status === true && (
                                                                                                                        <div className="relative pl-10 p-0.5 my-0.5 rounded-md" key={index}>
                                                                                                                            <label
                                                                                                                                htmlFor={`checkbox-${sub3.id}`}
                                                                                                                                className="flex cursor-pointer select-none items-center"
                                                                                                                            >
                                                                                                                                <div className="relative">
                                                                                                                                    <input
                                                                                                                                        type="checkbox"
                                                                                                                                        id={`checkbox-${sub3.id}`}
                                                                                                                                        className="sr-only"
                                                                                                                                        onChange={() => {
                                                                                                                                            onClickSelectCategory(sub3.id);
                                                                                                                                        }}
                                                                                                                                    />
                                                                                                                                    <div className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${categorySelected === sub3.id && 'border-primary bg-gray dark:bg-transparent'
                                                                                                                                        }`} >
                                                                                                                                        <span className={`opacity-0 ${categorySelected === sub3.id && '!opacity-100'}`}>
                                                                                                                                            <FiCheck className="text-primary" />
                                                                                                                                        </span>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                <span className="font-medium text-gray-box-2 dark:text-white">
                                                                                                                                    {sub3.name}
                                                                                                                                </span>
                                                                                                                            </label>
                                                                                                                        </div>
                                                                                                                    )
                                                                                                                }
                                                                                                                )
                                                                                                            }
                                                                                                        </React.Fragment>
                                                                                                    )
                                                                                                }
                                                                                                )
                                                                                            }
                                                                                        </React.Fragment>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    }
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        requiredCategory && <span className="text-meta-1 text-sm absolute left-0 -bottom-7">Category is required</span>
                                                    }
                                                    <div
                                                        className="absolute -bottom-20 inset-x-0 flex items-center justify-center px-5 mt-1"
                                                    >
                                                        <div className="flex justify-end items-center">
                                                            <button className="flex justify-center bg-transparent border border-meta-9 px-8 py-2 rounded-md font-medium text-black dark:text-white mr-3.5" onClick={onClose}>
                                                                Close
                                                            </button>
                                                            <button className="flex justify-center bg-primary px-8 py-2 rounded-md font-medium text-gray" onClick={handleApply}>
                                                                Apply
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};


