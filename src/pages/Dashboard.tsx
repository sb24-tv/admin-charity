import {FaBarsStaggered, FaNewspaper, FaUserLarge,FaImage} from "react-icons/fa6";
import {useEffect, useState} from "react";
import APIService from "../service/APIService.ts";
import {Link} from "react-router-dom";
import Loader from "../common/Loader/index.tsx";
import { StatusCodes } from "../enum";

const ECommerce = () => {
    const [countCategory, setCountCategory] = useState(0)
    const [countContent, setCountContent] = useState(0)
    const [countUser, setCountUser] = useState(0)
    const [countSlide, setCountSlide] = useState(0)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        APIService.get(`category`).then((response: any) => {
            if (response.status == StatusCodes.OK) {
                setCountCategory(response.data.length);
                setLoading(false);
            }
        })

        APIService.get(`content`).then((response: any) => {
            if (response.status == StatusCodes.OK) {
                setCountContent(response.data.pagination.total);
                setLoading(false);
            }
        })

        APIService.get(`users`).then((response: any) => {
            if (response.status == StatusCodes.OK) {
                setCountUser(response.data.length);
                setLoading(false);
            }
        })
        APIService.get(`slide`).then((response: any) => {
            if (response.status == StatusCodes.OK) {
                setCountSlide(response.data.length);
                setLoading(false);
            }
        })

    }, []);
    return (
        loading ?
        (
            <Loader />
        )
        :

        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
                <Link to="/category"
                    className="rounded-xl bg-white py-6 px-7.5  box-shadow-custom-2 dark:border-strokedark dark:bg-black-custom">
                    <div
                        className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <FaBarsStaggered className="fill-pink dark:fill-white"/>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-black dark:text-white">
                                {countCategory ? countCategory : 0}
                            </h4>
                            <span className="text-sm font-medium">Total Category</span>
                        </div>
                    </div>
                </Link>
                <Link to="/content"
                    className="rounded-xl bg-white py-6 px-7.5 box-shadow-custom-2 dark:border-strokedark dark:bg-black-custom">
                    <div
                        className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <FaNewspaper className="fill-pink dark:fill-white"/>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-black dark:text-white">
                                {countContent ? countContent : 0}
                            </h4>
                            <span className="text-sm font-medium">Total Content</span>
                        </div>
                    </div>
                </Link>
                <Link to="/slide"
                      className="rounded-xl bg-white py-6 px-7.5 box-shadow-custom-2 dark:border-strokedark dark:bg-black-custom">
                    <div
                        className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <FaImage className="fill-pink dark:fill-white"/>
                    </div>
                    
                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-black dark:text-white">
                                {countSlide ? countSlide : 0}
                            </h4>
                            <span className="text-sm font-medium">Total SlideShow</span>
                        </div>
                    </div>
                </Link>
                <Link to="/user"
                    className="rounded-xl bg-white py-6 px-7.5 box-shadow-custom-2 dark:border-strokedark dark:bg-black-custom">
                    <div
                        className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <FaUserLarge className="fill-pink dark:fill-white"/>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-black dark:text-white">
                                {countUser ? countUser : 0}
                            </h4>
                            <span className="text-sm font-medium">Total User</span>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default ECommerce;
