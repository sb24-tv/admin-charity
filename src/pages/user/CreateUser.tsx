import { Fragment, useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import { Dialog, Transition } from '@headlessui/react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { StatusCodes } from "../../enum";
import { toast } from 'react-toastify';

interface MyComponentProps {
    show: boolean;
    onCloseCreateUser: any;
    createdUser: () => void;
}

function CreateUser(props: MyComponentProps) {
    const { show, onCloseCreateUser } = props;
    const [requiredName, setRequiredName] = useState<boolean>(false);
    const [requiredUsername, setRequiredUsername] = useState<boolean>(false);
    const [requiredPassword, setRequiredPassword] = useState<boolean>(false);
    const [enabled, setEnabled] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [usernameExist, setUsernameExist] = useState<boolean>(false);
    const [usernameExistMessage, setUsernameExistMessage] = useState<string>('');
    const nameRef = useRef<any>(null);
    const usernameRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);

    const notify = () => {
        toast.success('User created successfully', {
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
    const handleSubmit = async () => {
        const name = nameRef.current?.value;
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if (!name || !username || !password) {
            if (!name) setRequiredName(true);
            if (!username) setRequiredUsername(true);
            if (!password) setRequiredPassword(true);
            return;
        }

        const data = {
            name: nameRef?.current.value,
            username: usernameRef?.current.value,
            password: passwordRef?.current.value,
            status: enabled
        }
        APIService.post('users/signup', data).then((response: any) => {
            if (response.status === StatusCodes.CREATED) {
                notify();
                onCloseCreateUser();
                props.createdUser();
            } else if (response.status === StatusCodes.CONFLICT) {
                setUsernameExist(true);
                setUsernameExistMessage(response.data.message);
            }
        }).catch(() => {
            notifyError();
        }
        );
    }
    const handleClose = () => {
        onCloseCreateUser();
        setRequiredName(false);
        setRequiredUsername(false);
        setRequiredPassword(false);
        setEnabled(true);
        setShowPassword(false);
        setUsernameExist(false);
        setUsernameExistMessage('');
    }
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-999" onClose={handleClose}>
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
                                    Create User
                                </Dialog.Title>
                                <div className="rounded-sm dark:border-strokedark dark:bg-boxdark">
                                    <div className="flex flex-col gap-5.5 p-6.5">
                                        <div className="relative">
                                            <label className="font-medium text-black dark:text-white">
                                                Name <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                ref={nameRef}
                                                onChange={() => setRequiredName(false)}
                                                className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredName ? 'border-meta-1 border-2 dark:border-meta-1' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
                                            />
                                            {
                                                requiredName && (
                                                    <span className="text-meta-1 text-sm absolute left-0 bottom-[-1.5rem]">
                                                        Name is required
                                                    </span>
                                                )
                                            }
                                        </div>
                                        <div className="relative">
                                            <label className="font-medium text-black dark:text-white">
                                                Username <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Username"
                                                ref={usernameRef}
                                                onChange={() => { // noinspection CommaExpressionJS
                                                    setRequiredUsername(false), setUsernameExist(false) }}
                                                className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredUsername || usernameExist ? 'border-meta-1 border-2 dark:border-meta-1' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
                                            />
                                            {
                                                requiredUsername && (
                                                    <span className="text-meta-1 text-sm absolute left-0 bottom-[-1.5rem]">
                                                        Username is required
                                                    </span>
                                                )
                                            }
                                            {
                                                usernameExist && (
                                                    <span className="text-meta-1 text-sm absolute left-0 bottom-[-1.5rem]">
                                                        {usernameExistMessage}
                                                    </span>
                                                )
                                            }
                                        </div>

                                        <div>
                                            <div className="flex justify-between">
                                                <label className="font-medium text-black dark:text-white">
                                                    Password <span className="text-meta-1">*</span>
                                                </label>
                                                <label className="font-medium text-black dark:text-white">
                                                    Status
                                                </label>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="relative w-5/6 ">
                                                    <div className="relative">
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Enter Password"
                                                            name="password"
                                                            ref={passwordRef}
                                                            onChange={() => setRequiredPassword(false)}
                                                            className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredPassword ? 'border-meta-1 border-2 dark:border-meta-1' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
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
                                                    {requiredPassword &&
                                                        <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">Password is required</span>}
                                                </div>
                                                <div className="mt-3">
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
                                        </div>
                                        <div className="flex justify-end items-center">
                                            <button className="flex justify-center bg-transparent border border-meta-9 px-8 py-2 rounded-md font-medium text-black dark:text-white mr-3.5" onClick={handleClose}>
                                                Cancel
                                            </button>
                                            <button className="flex justify-center bg-primary px-8 py-2 rounded-md font-medium text-gray" onClick={handleSubmit}>
                                                Create
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

export default CreateUser