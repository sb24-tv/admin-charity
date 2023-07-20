import { useEffect, useState } from "react";
import APIService from "../../service/APIService.ts";
import { FaRegPenToSquare, FaKey } from "react-icons/fa6";
import ChangePassword from "./ChangePassword.tsx";
import CreateUser from "./CreateUser.tsx";
import EditUser from "./EditUser.tsx";
import { StatusCodes } from "../../enum";
import Loader from "../../common/Loader/index.tsx";

const User = () => {
    const [users, setUser] = useState<any>([]);
    let [isOpenCreateUser, setIsOpenCreateUser] = useState<boolean>(false);
    let [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
    let [isOpenChangePassword, setIsOpenChangePassword] = useState<boolean>(false);

    const [userEdit, setUserEdit] = useState<any>([]);
    const [dataForEdit, setDataForEdit] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const fetchData = () => {
        APIService.get('users').then((response: any) => {
            if (response.status === StatusCodes.OK) {
                setUser(response.data);
                setLoading(false);
            }
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditUser = (user: any) => {
        setDataForEdit(user);
    }
    const onCloseEditUser = () => {
        setIsOpenEdit(false)
    }
    const handleChangePassword = (user: any) => {
        setUserEdit(user);
    }
    const userLogin = JSON.parse(localStorage.getItem("user") || "{}");
    const idUserLogin = userLogin?.id;
    return (
        loading ?
        (
            <Loader />
        )
        :
        
        <>
            <CreateUser show={isOpenCreateUser} onCloseCreateUser={() => setIsOpenCreateUser(false)} createdUser={() => { fetchData(); }} />
            <EditUser show={isOpenEdit} onCloseEditUser={onCloseEditUser} dataForEditUser={dataForEdit} updatedUser={() => { fetchData(); }} />
            <ChangePassword show={isOpenChangePassword} onCloseChangePass={() => setIsOpenChangePassword(false)} dataForPassword={userEdit} />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Users
                </h2>
            </div>
            <div
                className="rounded-xl bg-white px-5 pt-6 pb-2.5 box-shadow-custom-2 dark:border-strokedark dark:bg-black-custom sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <div className="flex justify-end mb-3">
                        <div className="inline-flex items-center justify-center rounded-full bg-primary py-2.5 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-6 cursor-pointer"
                            onClick={() => setIsOpenCreateUser(true)}
                        >
                            Create New
                        </div>
                    </div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-black-2 rounded-t-xl">
                                <th className="min-w-[20px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 rounded-tl-lg rounded-bl-lg">
                                    No
                                </th>
                                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Name
                                </th>
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Username
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
                                users && users.length > 0 ?
                                    users.map((user: any, index: number) => (
                                        <tr key={index} className="border-b border-[#eee] dark:border-graydark last:border-b-0">
                                            <td className="py-4 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                {
                                                    users.length > 0
                                                    &&
                                                    <p className="text-sm text-black dark:text-white">
                                                        {index + 1}
                                                    </p>
                                                }
                                            </td>
                                            <td className="py-4 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <p className="text-base text-black dark:text-white font-medium">
                                                    {user.name ? user.name : "---"}
                                                    {
                                                        idUserLogin === user.id && (
                                                            <span className="text-xs text-orange-dark ml-2">
                                                               (You)
                                                            </span>
                                                        )
                                                    }
                                                </p>
                                            </td>
                                            <td className="py-4 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <p className="text-base font-medium text-black dark:text-white">
                                                    {user.username}
                                                </p>
                                            </td>
                                            <td className="py-4 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white text-base">
                                                    {
                                                        new Date(user.createAt).toLocaleDateString("en-US", {
                                                            weekday: "short",
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })
                                                    }
                                                </p>
                                            </td>
                                            <td className="py-4 px-4 dark:border-strokedark">
                                                {
                                                    user.status === true ? (
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
                                            <td className="py-4 px-4 dark:border-strokedark">
                                                <div className="flex items-center space-x-3.5">
                                                    <div className="flex items-center space-x-3.5">
                                                        <button className="hover:text-primary" onClick={() => {
                                                            handleChangePassword(user);
                                                            setIsOpenChangePassword(true);
                                                        }} >
                                                            <FaKey />
                                                        </button>
                                                        <button className="hover:text-primary" onClick={() => {
                                                            handleEditUser(user);
                                                            setIsOpenEdit(true);
                                                        }
                                                        }>
                                                            <FaRegPenToSquare />
                                                        </button>
                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td colSpan={6} className="py-4 px-4 dark:border-strokedark">
                                            <p className="text-sm text-black dark:text-white text-center">
                                                No data found
                                            </p>
                                        </td>
                                    </tr>

                            }
                        </tbody>
                    </table>
                </div>
            </div >

        </>
    );
};

export default User;
