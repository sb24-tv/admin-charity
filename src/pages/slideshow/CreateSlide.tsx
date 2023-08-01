import { Fragment, useState, useRef } from "react";
import APIService from "../../service/APIService.ts";
import { FaUpload } from "react-icons/fa6";
import { Dialog, Transition } from '@headlessui/react'
import { StatusCodes } from "../../enum";
import { toast } from 'react-toastify';
interface MyComponentProps {
    show: boolean;
    onCloseCreateSlide: any;
    createSlide: (data : any) => void;
}

export default function CreateSlide(props: MyComponentProps) {
    const {show, onCloseCreateSlide } = props;
    const titleRef = useRef<any>(null);
    const descriptionRef = useRef<any>(null);
    const orderingRef = useRef<any>(null);
    const imageRef = useRef<any>(null);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    
    const notify = () => {
        toast.success('Slide created successfully', {
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
    const notifyErrorImage = () => {
        toast.error('Allowed only png file', {
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
    
    const [selectFile, setSelectedFile] = useState<File | null>(null);
    const [requiredImage, setRequiredImage] = useState<boolean>(false);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [requiredTitle, setRequiredTitle] = useState<boolean>(false);
    const [requiredDescription, setRequiredDescription] = useState<boolean>(false);
    const [enabled, setEnabled] = useState<boolean>(true);
    const onClose = () => {
        onCloseCreateSlide();
        setRequiredTitle(false);
        setEnabled(true);
        setDisableButton(false);
        setRequiredDescription(false);
        setRequiredImage(false);
        setPreviewURL(null)
    }
    const handleSubmit = async () => {
        const imageValue = imageRef.current?.value
        if (!imageValue){
            setRequiredImage(true)
            return
        }
        if (!requiredTitle){
            setRequiredTitle(true)
            return
        }
        if(!requiredDescription){
            setRequiredDescription(true)
            return
        }
            const formData = new FormData();
            const data = {
                title: titleRef.current?.value,
                description: descriptionRef.current?.value,
                ordering: orderingRef.current?.value,
                status: enabled ? 1 : 0,
            }
                formData.append('title', data.title);
                formData.append('description', data.description);
                formData.append('image', selectFile as any);
                formData.append('ordering', data.ordering);
                formData.append('status', data.status as any);
                APIService.insertFormData('slide', formData).then((response: any) => {
                        if (response.status === StatusCodes.CREATED) {
                            notify();
                            onCloseCreateSlide();
                            props.createSlide(response.data);
                            setSelectedFile(null);
                            setPreviewURL(null);
                            setEnabled(true);
                }
            }
            ).catch(() => {
                notifyError();
            });
    }
    
    const handleFileChange = (event: any) => {
        setRequiredImage(false);
        const file = event.target.files[0];
        if (file) {
            const fileName = file.name;
            const lastDot = fileName.lastIndexOf('.');
            const ext = fileName.substring(lastDot + 1);
            if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
                setSelectedFile(file);
                setPreviewURL(URL.createObjectURL(file));
            } else {
                notifyErrorImage();
            }
        }
    };
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
                                    Create Slide
                                </Dialog.Title>
                                <div className="rounded-sm dark:border-strokedark dark:bg-boxdark">
                                    <div className="flex flex-col gap-5.5 p-6.5">
                                        <div className="relative">
                                            <label className="font-medium text-black dark:text-white">
                                                Title <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                ref={titleRef}
                                                className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredTitle ? 'border-meta-1 border-2 dark:border-meta-1' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
                                            />
                                            {
                                                requiredTitle && (
                                                    <span className="text-meta-1 text-sm absolute left-0 bottom-[-1.5rem]">
                                                        Title is required
                                                    </span>
                                                )
                                            }
                                        </div>
                                        <div className="relative">
                                            <label className="font-medium text-black dark:text-white">
                                                Description <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                ref={descriptionRef}
                                                className={`mt-3 w-full rounded-lg bg-input py-3 px-5 font-medium outline-none transition ${requiredDescription ? 'border-meta-1 border-2 dark:border-meta-1' : 'border-2 border-input'} dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white`}
                                            />
                                            {
                                                requiredDescription && (
                                                    <span className="text-meta-1 text-sm absolute left-0 bottom-[-1.5rem]">
                                                        Description is required
                                                    </span>
                                                )
                                            }
                                        </div>
                                        <div>
                                            <div className="flex justify-between">
                                                <label className="font-medium text-black dark:text-white">
                                                    Ordering
                                                </label>
                                                <label className="font-medium text-black dark:text-white">
                                                    Status
                                                </label>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <input
                                                    type="number"
                                                    ref={orderingRef}
                                                    defaultValue={1}
                                                    className="mt-3 w-5/6 rounded-lg bg-input py-3 px-5 font-medium outline-none transition border-2 border-input dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-black dark:text-white"
                                                />
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
                                        
                                        {
                                            <div className="relative">
                                                <label className="font-medium text-black dark:text-white">Image slide<span className="text-meta-1">*</span></label>
                                                <div className={`relative mt-3 mb-2 block w-full duration-150 transition-all cursor-pointer appearance-none rounded border-2 border-dashed bg-input py-4 px-4 dark:bg-meta-4 sm:py-7.5 ${requiredImage ? 'border-meta-1' : 'border-bodydark hover:border-primary'} ${previewURL ? 'border-primary' : ''}`} >
                                                    <input
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/jpg"
                                                        ref={imageRef}
                                                        className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                                        onChange={handleFileChange}
                                                    />
                                                    <div className="flex flex-col items-center justify-center space-y-3">
                                                        {
                                                            previewURL ? (
                                                                <img
                                                                    src={previewURL}
                                                                    alt="Uploaded Image Preview"
                                                                    className="h-30 w-30 object-contain rounded-lg"
                                                                />
                                                            ) : (
                                                                <span className="flex h-15 w-15 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                                    <FaUpload />
                                                                </span>
                                                            )
                                                        }
                                                        {
                                                            !previewURL &&
                                                            <p className="py-3">
                                                                <span className="text-primary">Click to upload </span> or drag and drop image *.png or *.jpg here
                                                            </p>
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    requiredImage &&
                                                    <span className="text-meta-1 text-sm absolute">
                                                        Image is required
                                                    </span>
                                                }
                                            </div>
                                        }
                                        
                                        <div className="flex justify-end items-center">
                                            <button className="flex justify-center bg-transparent border border-meta-9 px-8 py-2 rounded-md font-medium text-black dark:text-white mr-3.5" onClick={onClose}>
                                                Cancel
                                            </button>
                                            {
                                                disableButton ?
                                                    <button className="flex justify-center bg-primary/60 px-8 py-2 rounded-md font-medium text-gray" disabled>
                                                        Create
                                                    </button>
                                                    :
                                                    <button className="flex justify-center bg-primary px-8 py-2 rounded-md font-medium text-gray" onClick={handleSubmit}>
                                                        Create
                                                    </button>
                                            }
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


