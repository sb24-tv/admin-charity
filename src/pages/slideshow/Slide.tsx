import { useEffect, useState } from "react";
import APIService from "../../service/APIService.ts";
import { FaRegPenToSquare } from "react-icons/fa6";
import CreateSlide from "./CreateSlide.tsx";
import EditSlide from "./EditSlide.tsx";
import NoFile from "../../images/logo/no-task.png";
import Loader from "../../common/Loader/index.tsx";
import NoImage from "../../images/logo/black-and-white.png"
import {StatusCodes} from "../../enum";
// import {data} from "autoprefixer";

function getURL() {
    // @ts-ignore
    if (import.meta.env.MODE === "production") {
        // @ts-ignore
        return import.meta.env.VITE_API_PROD
    } else {
        // @ts-ignore
        return import.meta.env.VITE_API_DEV
    }
}

const Slide = () => {
    const [slides, setSlide] = useState<any>([]);
    // This for create category
    let [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const fetchData = () => {
        APIService.get('slide').then((response: any) => {
            // console.log(response.data)
            if (response.status === StatusCodes.OK) {
                setSlide(response.data);
                setLoading(false);
            }
        });
    }
    useEffect(() => {
        fetchData();
    }, []);

    const onCloseCreateSlide = () => {
        setOpen(false);
    }

    // This for edit slide
    const [dataForEdit, setDataForEdit] = useState<any>(null);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const onError = (e: any) => {
        e.target.src = NoImage;
    }

    const onCloseEditSlide = () => {
        setOpenEdit(false);
    }
    return (
        loading ?
        (
            <Loader />
        )
        :
        
        <>
            <CreateSlide
                show={open}
                onCloseCreateSlide={onCloseCreateSlide}
                createSlide={(data) => {
                    setSlide((previous : any) => {
                        const newData = [...previous];
                        newData.unshift(data);
                        return newData;
                    })
                }}
            />
            <EditSlide
                show={openEdit}
                onCloseEditSlide={onCloseEditSlide}
                dataForEditSlide={dataForEdit}
                updatedSlide={() => fetchData()}
            />
            <div className="mb-6 flex flex-col gap-3 sm:flex-row items-center">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Slide
                </h2>
            </div>
            <div
                className="rounded-xl bg-white px-5 pt-6 pb-2.5 box-shadow-custom-2 dark:border-strokedark dark:bg-black-custom sm:px-7.5 xl:pb-1 ">
                <div className="max-w-full overflow-x-auto">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                        
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
                                    Title
                                </th>
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Description
                                </th>
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
                               slides.length ?
                                    slides.map((slide: any, index: number) => (
                                        <tr className="border-b border-[#eee] dark:border-graydark last:border-b-0" key={index}>
                                            <td className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                                {
                                                    <p className="text-sm text-black dark:text-white">
                                                        {index + 1}
                                                    </p>
                                                }
                                            </td>
                                            <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                    <div className="h-12.5 w-15 rounded-md">
                                                        <img
                                                            src={slide.image ? getURL() + '/public/images/' + slide.image : NoImage}
                                                            alt={slide.image} className="w-20" onError={onError}/>
                                                    </div>
                                                    <p className="text-base text-black dark:text-white">
                                                        {slide.title}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                    <p className="text-base text-black dark:text-white">
                                                        {slide.description}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 dark:border-strokedark">
                                                    <p className="text-base text-black dark:text-white">
                                                        {slide.ordering}
                                                    </p>
                                            </td>
                                            <td className="py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {new Date(slide.createAt).toLocaleDateString("en-US", {
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
                                                    slide.status  ? (
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
                                                                setDataForEdit(slide);
                                                                console.log(dataForEdit)
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
                                                    No Slide Found
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

export default Slide;
