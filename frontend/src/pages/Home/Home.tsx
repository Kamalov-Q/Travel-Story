import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AxiosError } from "axios";
import TravelStoryCard from "../../components/cards/TravelStoryCard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAdd } from "react-icons/md";

interface UserInfo {
    email: string;
    fullName: string;
    _id: string;
    password: string;
    createdAt?: string;
    updatedAt?: string;
}

interface AllStories {
    _id: string;
    title: string;
    story: string;
    visitedLocation: string[];
    isFavourites: boolean;
    imageUrl: string;
    visitedDate: Date;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface AddEditModalProps {
    isShown: boolean;
    type: "add" | "edit";
    data: AllStories | null;
}

const Home = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [allStories, setAllStories] = useState<AllStories[] | []>([]);

    const [openAddEditModal, setOpenAddEditModal] = useState<AddEditModalProps>({
        isShown: false,
        type: "add",
        data: null
    });

    //GET User Info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            setUserInfo(response.data?.user);
            console.log(response.data?.user, "response");
        }
        catch (err) {
            console.error(err);
            if (err instanceof AxiosError) {
                if (err?.response?.status === 401 || err?.response?.status === 403) {
                    localStorage.clear();
                    navigate("/login");
                }
            }
            else {
                console.error("Unexpected error happened");
            }
        }
    }

    //GET All Stories
    const getAllStories = async () => {
        try {
            const response = await axiosInstance.get("/get-all-stories");
            if (response?.data && response?.data?.stories) {
                setAllStories(response.data?.stories);
            }
        }
        catch (err) {
            console.error(err);
            if (err instanceof AxiosError) {
                if (err?.response?.status === 401 || err?.response?.status === 403) {
                    localStorage.clear();
                    navigate("/login");
                }
            }
            else {
                console.error("Unexpected error happened");
            }
        }
    }


    //Handle Edit Story Click
    const handleEdit = (story: AllStories) => { }

    //Handle Travel Story Click
    const handleViewStory = (story: AllStories) => { }


    //Handle Favourite Click
    const updateIsFavourites = async (story: AllStories) => {

        const storyId = story?._id;
        // Toggle the value of isFavourites
        const isFavourites = !(story?.isFavourites);
        console.log(isFavourites, "isFavourites");
        try {
            console.log("Updating story ID:", storyId, "with isFavourites:", isFavourites);
            const response = await axiosInstance.put(`/update-is-favourite/${storyId}`, {
                isFavourites,
            });
            if (response?.data) {
                toast.success("Story updated successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                console.log(response.data, "response");
                getAllStories();
            }
        }
        catch (err) {
            console.error(err);
            if (err instanceof AxiosError) {
                if (err?.response?.status === 401 || err?.response?.status === 403) {
                    localStorage.clear();
                    navigate("/login");
                }
            }
            else {
                console.error("Unexpected error happened");
            }
        }

    }


    useEffect(() => {
        getUserInfo();
        getAllStories();
    }, [])


    return (
        <>
            <Navbar userInfo={userInfo} />
            <div className="container mx-auto w-full py-10">
                <div className="flex gap-7">
                    <div className="flex-1 gap-5">
                        {allStories?.length > 0 ? allStories?.map((item) => {
                            return (
                                <TravelStoryCard
                                    key={item?._id}
                                    _id={item?._id}
                                    title={item?.title}
                                    story={item?.story}
                                    visitedLocation={item?.visitedLocation}
                                    isFavourites={item?.isFavourites}
                                    imageUrl={item?.imageUrl}
                                    date={item?.visitedDate}
                                    onEdit={() => handleEdit(item)}
                                    onClick={() => handleViewStory(item)}
                                    onFavouriteClick={() => updateIsFavourites(item)}
                                />
                            )
                        }) : (
                            <div>
                                <h1 className="text-2xl font-semibold">No Stories Found</h1>
                            </div>
                        )}
                    </div>
                    <div className="w-[320px]">

                    </div>
                </div>
            </div>
            <button
                className="w-16 h-16 flex items-center justify-center rounded-full bg-primary fixed right-10 bottom-10 hover:bg-cyan-400"
                onClick={() => {
                    setOpenAddEditModal({
                        isShown: true,
                        type: "add",
                        data: null
                    })
                }}
            >
                <MdAdd className="text-[32px] text-white" />
            </button>
            <ToastContainer aria-label={"Toast Notification"} />
        </>
    )
}

export default Home
