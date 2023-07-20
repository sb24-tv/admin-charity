import { Fragment, useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import { Dialog, Transition } from '@headlessui/react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { StatusCodes } from "../../enum";
import { toast } from 'react-toastify';

interface MyComponentProps {
    show: boolean;
    onCloseChangePass: any;
    dataForPassword: any;
}
function ChangePassword(props: MyComponentProps) {
    const { show, onCloseChangePass, dataForPassword } = props;
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [requiredPassword, setRequiredPassword] = useState<boolean>(false);
    const [requiredNewPassword, setRequiredNewPassword] = useState<boolean>(false);
    const [requiredConfirmPassword, setRequiredConfirmPassword] = useState<boolean>(false);
    const [matchPassword, setMatchPassword] = useState<boolean>(false);
    const [notMatchPassword, setNotMatchPassword] = useState<boolean>(false);
    const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const passwordRef = useRef<any>(null);
    const newPasswordRef = useRef<any>(null);
    const confirmPasswordRef = useRef<any>(null);

    const onCloseChangePassword = () => {
        onCloseChangePass();
        setRequiredPassword(false);
        setRequiredNewPassword(false);
        setRequiredConfirmPassword(false);
        setMatchPassword(false);
        setNotMatchPassword(false);
        setInvalidPassword(false);
        setMessage("");
    }
    const notify = () => {
        toast.success('Password changed successfully!', {
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
    const handleCheckPasswordMatch = () => {
        const newPassword = newPasswordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (newPassword === '' || confirmPassword === '') {
            setMatchPassword(false);
            setNotMatchPassword(false);
            // setRequiredNewPassword(true);
            setRequiredConfirmPassword(true);
        } else if (newPassword === confirmPassword) {
            setMatchPassword(true);
            setNotMatchPassword(false);
        } else {
            setMatchPassword(false);
            setNotMatchPassword(true);
        }
    };
    let timeout: ReturnType<typeof setTimeout>;
    const handlePasswordChange = () => {
        clearTimeout(timeout);
        timeout = setTimeout(handleCheckPasswordMatch, 1000); // Set a delay of 500ms before checking password match
    };


    const handleSubmitPassword = async () => {
        const password = passwordRef.current?.value;
        const newPassword = newPasswordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;
        // const id = userEdit?.id;
        if (newPassword !== confirmPassword) {
            return;
        }
        if (!password || !newPassword || !confirmPassword) {
            if (!password) setRequiredPassword(true);
            if (!newPassword) setRequiredNewPassword(true);
            if (!confirmPassword) setRequiredConfirmPassword(true);
            return;
        }

        const data = {
            userId: dataForPassword.id as number,
            currentPassword: password as string,
            newPassword: newPassword
        }
        APIService.put('user/update-password', data).then((response: any) => {
            if (response.status === StatusCodes.OK) {
                onCloseChangePassword();
                notify();
            } else if (response.status === StatusCodes.NOT_FOUND) {
                setInvalidPassword(true);
                setMessage(response.data.message);
            }
        }).catch(() => {
            notifyError();
        }
        );
    }

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-999" onClose={onCloseChangePassword}>
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

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-[700px] max-h-[900px] max-xl:w-[600px] max-lg:w-[500px] max-md:w-[400px] transform overflow-hidden rounded-2xl bg-white dark:bg-boxdark p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-[20px] font-medium leading-6 text-black-box text-center dark:text-white2"
                                >
                                    Change Password
                                </Dialog.Title>
                                <div className="rounded-sm dark:border-strokedark dark:bg-boxdark">
                                    <div className="flex flex-col gap-5.5 p-6.5">
                                        <div className="relative">
                                            <label className="font-medium text-black dark:text-white">
                                                Current Password <span className="text-meta-1">*</span>
                                            </label>
                                            <div className="relative w-full">
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter Current Password"
                                                        name="password"
                                                        ref={passwordRef}
                                                        onChange={() => { // noinspection JSRemoveUnnecessaryParentheses
                                                            setRequiredPassword(false)
                                                            setInvalidPassword(false)}}
                                                        className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredPassword || invalidPassword ? 'border-meta-1 border-2 dark:border-meta-1' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
                                                    />
                                                    <span className="absolute right-2 top-7.5 cursor-pointer"
                                                        onClick={() => setShowPassword(!showPassword)} >
                                                        {
                                                            showPassword
                                                                ?
                                                                <FaRegEye className="w-10" />
                                                                :
                                                                <FaRegEyeSlash className="w-10" />
                                                        }
                                                    </span>
                                                </div>
                                                {
                                                    requiredPassword &&
                                                    <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">Password is required</span>
                                                }
                                                {
                                                    invalidPassword &&
                                                    <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">{message}</span>
                                                }
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="font-medium text-black dark:text-white">
                                                New Password <span className="text-meta-1">*</span>
                                            </label>
                                            <div className="relative w-full">
                                                <div className="relative">
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="New Password"
                                                        name="new_password"
                                                        ref={newPasswordRef}
                                                        onChange={() => {
                                                            setRequiredNewPassword(false)
                                                            setNotMatchPassword(false)
                                                            setMatchPassword(false)
                                                            handlePasswordChange()
                                                        }}
                                                        className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredNewPassword ? 'border-meta-1 border-2 dark:border-meta-1' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
                                                    />
                                                    <span className="absolute right-2 top-7.5 cursor-pointer"
                                                        onClick={() => setShowNewPassword(!showNewPassword)} >
                                                        {
                                                            showNewPassword
                                                                ?
                                                                <FaRegEye className="w-10" />
                                                                :
                                                                <FaRegEyeSlash className="w-10" />
                                                        }
                                                    </span>
                                                </div>
                                                {requiredNewPassword &&
                                                    <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">New Password is required</span>}
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="font-medium text-black dark:text-white">
                                                Confirm Password <span className="text-meta-1">*</span>
                                            </label>
                                            <div className="relative w-full">
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirm Password"
                                                        name="confirm_password"
                                                        ref={confirmPasswordRef}
                                                        onChange={() => {
                                                            setRequiredConfirmPassword(false)
                                                            setNotMatchPassword(false)
                                                            setMatchPassword(false)
                                                            handlePasswordChange()
                                                        }
                                                        }
                                                        className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredConfirmPassword ? 'border-meta-1 border-2 dark:border-meta-1' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
                                                    />
                                                    <span className="absolute right-2 top-7.5 cursor-pointer"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} >
                                                        {
                                                            showConfirmPassword
                                                                ?
                                                                <FaRegEye className="w-10" />
                                                                :
                                                                <FaRegEyeSlash className="w-10" />
                                                        }
                                                    </span>
                                                </div>
                                                {
                                                    requiredConfirmPassword &&
                                                    <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">Confirm Password is required</span>
                                                }
                                                {
                                                    notMatchPassword &&
                                                    <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">Your password not match</span>
                                                }
                                                {
                                                    matchPassword &&
                                                    <span className="text-success left-0 absolute bottom-[-22px] text-sm">Your password has matched</span>
                                                }
                                            </div>
                                        </div>

                                        <div className="flex justify-end items-center">
                                            <button className="flex justify-center bg-transparent border border-meta-9 px-8 py-2 rounded-md font-medium text-black dark:text-white mr-3.5" onClick={onCloseChangePassword}>
                                                Cancel
                                            </button>
                                            <button className="flex justify-center bg-primary px-8 py-2 rounded-md font-medium text-gray" onClick={handleSubmitPassword}>
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ChangePassword