import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import Logo from '../../images/logo/charity.png';
import { useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import { LocalStorageKey, StatusCodes } from "../../enum";

const SignIn = () => {
    const usernameRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [requiredUserName, setRequiredUsername] = useState<boolean>(false);
    const [requiredPassword, setRequiredPassword] = useState<boolean>(false);
    const [userDeactivateMessage, setUserDeactivateMessage] = useState<string>('');

    const handleLogin = async () => {
        setMessage('');
        setUserDeactivateMessage('');
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if (!username || !password) {
            if (!username) setRequiredUsername(true);
            if (!password) setRequiredPassword(true);
            return;
        }
        APIService.post('users/login', { username, password }).then((res: any) => {
            if (res.status === StatusCodes.OK) {
                localStorage.setItem(LocalStorageKey.USER, JSON.stringify(res.data.user));
                window.location.href = '/';
            } else if (res.status === StatusCodes.NOT_FOUND) {
                setRequiredUsername(false);
                setRequiredPassword(false);
                setMessage(res.data.message);
            } else if (res.status === StatusCodes.UNAUTHORIZED) {
                setUserDeactivateMessage(res.data.message);
            }
        })
    };
    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            handleLogin().then();
        }
    }

    const onClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <>
            <div className="flex flex-wrap items-center justify-center h-screen">
                <div
                    className="border-stroke dark:border-strokedark min-xl:w-1/2 max-sm:w-2/3 max-md:w-[400px] max-lg:w-[450px] max-2xl:w-[480px] w-[500px] bg-white dark:bg-boxdark rounded-xl box-shadow-custom-2">
                    <div className="w-full p-10 flex items-center flex-col justify-center">
                        <img src={Logo} alt="logo" className="w-20" />
                        <span
                            className="my-5 block font-normal  text-base max-md:text-sm justify-center text-center leading-6 text-gray-4">Welcome to Admin Charity</span>
                        <div className="w-full">
                            <div className="mb-6 relative">
                                <label className="mb-2.5 block font-medium text-gray-5 text-base dark:text-white">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Enter usrename"
                                        name="username"
                                        ref={usernameRef}
                                        onKeyPress={handleKeyPress}
                                        onChange={() => setRequiredUsername(false)}
                                        className={`w-full rounded-lg bg-input py-3 pl-4.5 border pr-10 outline-none focus-visible:shadow-none ${requiredUserName ? 'border-meta-1 focus:border-meta-1' : 'border-input'}`}
                                    />
                                </div>
                                {
                                    requiredUserName && <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">Username is required</span>
                                }
                            </div>
                            <div className="mb-8 relative">
                                <label className="mb-2.5 block font-medium text-gray-5 text-base dark:text-white">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter Password"
                                        name="password"
                                        ref={passwordRef}
                                        onKeyPress={handleKeyPress}
                                        onChange={() => setRequiredPassword(false)}
                                        className={`w-full rounded-lg bg-input py-3 border pl-4 pr-10 outline-none focus-visible:shadow-none ${requiredPassword ? 'border-meta-1 focus:border-meta-1' : 'border-input'}`}
                                    />
                                    <span className="absolute right-2 top-4 cursor-pointer"
                                        onClick={onClickShowPassword}>
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
                                    requiredPassword && <span className="text-meta-1 left-0 absolute bottom-[-22px] text-sm">Password is required</span>
                                }
                            </div>

                            <div className="mb-5 flex">
                                <button
                                    onClick={handleLogin}
                                    className="w-full cursor-pointer rounded-lg border-transparent focus:border-transparent bg-orange-dark p-3 text-white transition hover:bg-opacity-90"
                                >
                                    Login
                                </button>

                            </div>
                            <div className="mb-4 relative">
                                {
                                    message && <span className="text-meta-1 absolute">  {message}  </span>
                                }
                                {
                                    userDeactivateMessage && <span className="text-meta-1 absolute">{userDeactivateMessage}</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;
