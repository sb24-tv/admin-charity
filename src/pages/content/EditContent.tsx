import React, { useEffect, useRef, useState } from "react";
import APIService from "../../service/APIService.ts";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StatusCodes, searchDataById } from '../../enum';
import { toast } from 'react-toastify';
import { FaCaretDown, FaCheck } from "react-icons/fa6";
import 'react-quill/dist/quill.snow.css';
import MyEditor from "./MyEditor"
import Loader from "../../common/Loader/index.tsx";

const EditContent = () => {
	const titleRef = useRef<any>(null);
	const [requiredTitle, setRequiredTitle] = useState<boolean>(false);
	const [requiredCategory, setRequiredCategory] = useState<boolean>(false);
	const [requiredBody, setRequiredBody] = useState<boolean>(false);
	const [openId, setOpenId] = useState<number>(0);
	const [contentById, setContentById] = useState<any>([]);
	const [contentSelected, setContentSelected] = useState<any>([]);
	const [categorySelected, setCategorySelected] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);
	
	const navigate = useNavigate();
	let { id } = useParams();
	
	const [category, setCategory] = useState<any>([]);
	const [editorHtml, setEditorHtml] = useState<string>("");
	
	const quillRef = useRef<any>(null);
	
	const handleChange = (value: string) => {
		if (id) {
			setRequiredBody(false);
			setEditorHtml(value);
		}
	};
	
	const notify = () => {
		toast.success('Content updated successfully', {
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
		APIService.get(`subcat`).then((response: any) => {
			if (response.status === StatusCodes.OK) {
				setCategory(response.data.data);
			}
		});
		
		APIService.get(`content/${id}`).then((response: any) => {
			if (response.status === StatusCodes.OK) {
				setContentById(response.data);
				setLoading(false);
			}
		});
	}, []);
	
	const getParentId = contentById.category ? searchDataById(contentById?.category?.id, category) : null;
	const categoryId = getParentId ? category[getParentId.position[0]].id : null;
	
	const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
	
	const handleSubmit = async () => {
		const title = titleRef.current?.value;
		const body = editorHtml || contentById?.body;
		const allowPublic = contentSelected?.allowPublic;
		if (!title ||  categorySelected === 0) {
			if (!title) setRequiredTitle(true);
			if (categorySelected === 0) setRequiredCategory(true);
			// if (!body) setRequiredBody(true);
			return;
		}
		const data = {
			title: titleRef.current?.value,
			categoryId: categorySelected as number,
			body: body,
			allowPublic: allowPublic,
			userId: userId as number,
		};
		APIService.put(`content/${id}`, data).then((response: any) => {
				if (response.status === StatusCodes.OK) {
					notify();
					navigate('/content');
					setRequiredTitle(false);
					setRequiredCategory(false);
					setOpenId(0);
				}
			}
		).catch(() => {
				notifyError();
			}
		);
	}
	
	const handleCategory = (id: number) => {
		setOpenId(() => id === openId ? 0 : id);
		// setCategorySelected(0);
	}
	
	const onClickSelectCategory = (id: number) => {
		setRequiredCategory(false);
		setCategorySelected(id);
	}
	
	// -------------------------
	useEffect(() => {
		setContentSelected(contentById);
		setOpenId(categoryId)
		setCategorySelected(contentById?.category?.id);
	}, [contentById]);

	
	
	return (
		loading ?
		(
			<Loader />
		)
		:

		<>
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-title-md2 font-semibold text-black dark:text-white">
					Edit Content
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
										ref={titleRef}
										defaultValue={contentById?.title}
										onChange={() => setRequiredTitle(false)}
										className={`w-full rounded-md border bg-input py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input ${requiredTitle ? 'border-meta-1 focus:border-meta-1' : 'border-input'}`}
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
											ref={quillRef}
											theme="snow"
											onChange={handleChange}
											value={editorHtml || contentById?.body}
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
										className={`w-full flex flex-col border rounded mb-2 p-1.5 ${requiredCategory ? 'border-meta-1' : 'border-input dark:border-meta-4'}`}
									>
										{
											category.map((item: any, index: number) => {
												return item.status === true && (
													<React.Fragment key={index}>
														<div
															className={`relative pl-4 py-2 p-1 my-0.5 rounded-md bg-[#f4f5f6] dark:bg-gray-box ${item.subcategories.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
															onClick={() => {
																handleCategory(item.id);
															}}
														>
                                                            <span className="text-orange-dark font-semibold">
                                                                {item.name}
                                                            </span>
															{
																item.subcategories.length > 0 &&
                                                                <span
                                                                    className={`absolute top-1/2 right-4 z-30 -translate-y-1/2 ${openId === item.id ? 'transform rotate-180 transition duration-500' : 'transform rotate-0 transition duration-500'}`}
                                                                >
                                                                    <FaCaretDown className="fill-body" />
                                                                </span>
															}
														</div>
														{
															openId === item.id && item.subcategories.length > 0 &&
                                                            <div className="flex flex-col gap-1.5 pl-4">
																{
																	item.subcategories.map((sub: any, index: number) => {
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
																					sub.subcategories.map((sub2: any, index: number) => {
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
																										sub2.subcategories.map((sub3: any, index: number) => {
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
                                                                                                                                <FaCheck className="fill-primary" />
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
													setContentSelected({
														...contentSelected,
														allowPublic: contentSelected?.allowPublic === true ? false : true
													})
												}}
											/>
											<div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
											<div
												className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${contentSelected.allowPublic === false ? '' : '!right-1 !translate-x-full !bg-primary dark:!bg-white'
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
									Update
								</button>
							
							</div>
						</div>
					</div>
				
				</div>
			</div >
		</>
	);
}


export default EditContent;
