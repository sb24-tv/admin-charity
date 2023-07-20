import React, { useEffect, useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import { Link, useNavigate } from "react-router-dom";
import { StatusCodes } from '../../enum';
import { toast } from 'react-toastify';
import { FaCaretDown } from "react-icons/fa6";
import 'react-quill/dist/quill.snow.css';
import MyEditor from "./MyEditor.tsx";
import Loader from "../../common/Loader/index.tsx";

const CreateContent = () => {
    const nameRef = useRef<any>(null);
    const [requiredTitle, setRequiredTitle] = useState<boolean>(false);
    const [requiredCategory, setRequiredCategory] = useState<boolean>(false);
    const [requiredBody, setRequiredBody] = useState<boolean>(false);
    const [enabled, setEnabled] = useState<boolean>(true);
    const [showSubCategory, setSubCategory] = useState<boolean>(false);
    const [openId, setOpenId] = useState<number>(0);
    const [getId, setGetId] = useState<number>(0);
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editorHtml, setEditorHtml] = useState<string>("");
    const handleChange = (html: string) => {
        setRequiredBody(false);
        setEditorHtml(html);
    };

    const notify = () => {
        toast.success('Content created successfully', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };
    const notifyError = () => {
        toast.error('Something went wrong', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };


    useEffect(() => {
        APIService.get(`category/front/sub`).then((response: any) => {
            if (response.status === StatusCodes.OK) {
                setCategory(response.data.data);
                setLoading(false);
            }
        });
    }, []);

    const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

    const handleSubmit = async () => {
        const name = nameRef.current?.value;
        const category = getId !== 0 && getId;
        const description = editorHtml;
        if (!name || !category) {
            if (!name) setRequiredTitle(true);
            if (!category) setRequiredCategory(true);
            return;
        }
        const data = {
            name: nameRef.current?.value,
            categoryId: getId as number,
            description: description,
            status: enabled,
            userId: userId

        };
        APIService.post(`content`, data).then((response: any) => {
            if (response.status === StatusCodes.CREATED) {
                notify();
                navigate('/content');
                setRequiredTitle(false);
                setRequiredCategory(false);
                setEnabled(true);
                setOpenId(0);
                setGetId(0);
            }
        }
        ).catch(() => {
            notifyError();
        }
        );
    }
    const handleCategory = (id: number) => {
        if (openId === id) {
            setSubCategory(!showSubCategory);
            setOpenId(id);
            setGetId(0);
        }
        if (openId !== id) {
            setSubCategory(true);
            setOpenId(id);
            setGetId(0);
        }
    }
    return (
        loading ?
            (
                <Loader />
            )
            :

            <>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                        Create Content
                    </h2>
                </div>
                <div className="flex justify-between gap-5">
                    <div className="flex flex-col w-full">
                        <div
                            className="rounded-xl bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div>
                                <div className="p-6.5">
                                    <div className="mb-7 relative">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Title <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            name="title"
                                            ref={nameRef}
                                            onChange={() => setRequiredTitle(false)}
                                            className={`w-full rounded-md border bg-input py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input ${requiredTitle ? 'border-meta-1 focus:border-meta-1 dark:border-meta-1' : 'border-input'}`}
                                        />
                                        {
                                            requiredTitle && <span className="text-meta-1 text-sm absolute left-0 -bottom-7">Title is required</span>
                                        }
                                    </div>

                                    <div className="mb-6 relative">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Content Detail
                                        </label>
                                        <MyEditor
                                            theme="snow"
                                            onChange={handleChange}
                                            value={editorHtml}
                                            className="bg-input dark:bg-form-input custom-quill min-h-[40vh]"
                                            placeholder={"Write something awesome..."}
                                        />
                                        {
                                            requiredBody && <span className="text-meta-1 text-sm absolute left-0 -bottom-8">Content is required</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-6/12">
                        <div
                            className="rounded-xl bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                            <div className="p-6.5">

                                <div className="mb-7 relative">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Choose Category <span className="text-meta-1">*</span>
                                    </label>
                                    <div className="relative z-20 bg-transparent">
                                        <div
                                            className={`w-full flex flex-col border rounded mb-2 p-1.5 ${requiredCategory ? 'border-meta-1 dark:border-meta-1' : 'border-input dark:border-meta-4'}`}
                                        >
                                            {
                                                category.map((item: any, index: number) => {
                                                    return item.status === true && (
                                                        <React.Fragment key={index}>
                                                            <div
                                                                className={`relative pl-4 py-2 p-1 my-0.5 rounded-md bg-[#f4f5f6] dark:bg-gray-box ${item.subCategories.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                                                                onClick={() => handleCategory(item.id)}>
                                                                <span className="text-orange-dark font-semibold">
                                                                    {item.name}
                                                                </span>
                                                                {
                                                                    item.subCategories.length > 0 &&
                                                                    <span
                                                                        className={`absolute top-1/2 right-4 z-30 -translate-y-1/2 ${openId === item.id && showSubCategory ? 'transform rotate-180 transition duration-500' : 'transform rotate-0 transition duration-500'}`}
                                                                    >
                                                                        <FaCaretDown className="fill-body" />
                                                                    </span>
                                                                }
                                                            </div>
                                                            {
                                                                openId === item.id && showSubCategory && item.subCategories.length > 0 &&
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
                                                                                                        setGetId(sub.id)
                                                                                                        setRequiredCategory(false)
                                                                                                    }}
                                                                                                />
                                                                                                <div
                                                                                                    className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${getId === sub.id && 'border-primary bg-gray dark:bg-transparent'
                                                                                                        }`}
                                                                                                >
                                                                                                    <span
                                                                                                        className={`h-2.5 w-2.5 rounded-sm ${getId === sub.id && 'bg-primary'}`}
                                                                                                    ></span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <span className="text-success font-medium">
                                                                                                {sub.name}
                                                                                            </span>
                                                                                        </label>
                                                                                    </div>
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
                                        </div>
                                    </div>
                                    {
                                        requiredCategory && <span className="text-meta-1 text-sm absolute left-0 -bottom-7">Category is required</span>
                                    }
                                </div>
                                <div className="my-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Status
                                    </label>
                                    <div className="mt-3 w-14">
                                        <label htmlFor="toggle1"
                                            className="flex cursor-pointer select-none items-center"
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    id="toggle1"
                                                    className="sr-only"
                                                    onChange={() => {
                                                        setEnabled(!enabled);
                                                    }}
                                                />
                                                <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                                                <div
                                                    className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${enabled && '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                                                        }`}
                                                ></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className="text-right flex justify-end items-end">
                                    <Link to="/content"
                                        className="flex justify-center bg-transparent border border-meta-9 px-8 py-2 rounded-md font-medium text-black dark:text-white mr-3.5"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        className="flex justify-center bg-primary px-8 py-2 rounded-md font-medium text-gray"
                                        onClick={handleSubmit}
                                    >
                                        Create
                                    </button>

                                </div>
                            </div>
                        </div>

                    </div>
                </div >
            </>
    );
};

export default CreateContent;
