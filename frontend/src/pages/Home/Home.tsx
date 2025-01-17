import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AxiosError } from "axios";
import TravelStoryCard from "../../components/cards/TravelStoryCard";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAdd } from "react-icons/md";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/cards/EmptyCard";
import Spinner from "../../components/Spinner";
import { DayPicker } from "react-day-picker";
import moment from "moment";

interface UserInfo {
    email: string;
    fullName: string;
    _id: string;
    password: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AllStories {
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

export interface AddEditModalProps {
    isShown: boolean;
    type?: "add" | "edit";
    data: AllStories | null;
    onClose?: () => void;
    getAllStories?: () => void;
}

const Home = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [allStories, setAllStories] = useState<AllStories[] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState<string>("");

    const [openViewModal, setOpenViewModal] = useState<AddEditModalProps>({
        isShown: false,
        data: null
    });

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
        setLoading(true);
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
        finally {
            setLoading(false);
        }
    }
    //Handle Edit Story Click
    const handleEdit = (story: AllStories | null) => {
        setOpenAddEditModal({
            isShown: true,
            type: "edit",
            data: story
        });
    }

    //Handle Travel Story Click
    const handleViewStory = (story: AllStories) => {
        setOpenViewModal({
            isShown: true,
            data: story
        });
    }


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
                    theme: "colored",
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


    //Delete travel story
    const deleteTravelStory = async (data: AllStories | null) => {
        const response = await axiosInstance.delete("/delete-story" + `/${data?._id}`);
        console.log(response, "response from delete story");
        if (!response?.data?.error) {
            toast.success("Story deleted successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            getAllStories();
            setOpenViewModal({ isShown: false, data: null });
        }
    }


    //Search Story
    const onSearchStory = async (query: string) => {
        try {
            const response = await axiosInstance.post(`/search?query=${query}`);
            if (response?.data?.stories) {
                setAllStories(response.data?.stories);
            }
            console.log(response, "response from search");

        }
        catch (err) {
            console.error(err);
        }
    }


    //Clear Search Query
    const handleClearSearch = () => {
        getAllStories();
        setSearchQuery("");
    }

    useEffect(() => {
        getUserInfo();
        getAllStories();
    }, []);
    return (
        <>
            <Navbar userInfo={userInfo} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearchNote={onSearchStory} handleClearSearch={handleClearSearch} />
            <div className="container mx-auto w-full py-10">
                <div className="flex">
                    {
                        !loading ? (
                            <div className="flex flex-wrap ">
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
                                    <EmptyCard imgSrc={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyf3Zx67rAzUbBKipO527eM96OY0ApJZPsRA&s"} message={"Start creating your first travel story! Click the 'Add' button to jot down your thoughts, ideas, and memories. Let's get started!"} />
                                )}
                            </div>
                        ) : (
                            <Spinner />
                        )
                    }
                </div>
            </div>

            {/* Add & Edit Travel Story */}
            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        zIndex: 9999,
                    },
                }}
                appElement={document.getElementById("root") || undefined}
                className="modal-box"
            >
                <AddEditTravelStory
                    isShown={openAddEditModal.isShown}
                    type={openAddEditModal.type}
                    data={openAddEditModal.data}
                    getAllStories={getAllStories}
                    onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                />
            </Modal>


            {/* View Travel Story Modal */}
            <Modal
                isOpen={openViewModal.isShown}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        zIndex: 9999,
                    },
                }}
                appElement={document.getElementById("root") || undefined}
                className="modal-box"
            >
                <ViewTravelStory
                    onClose={() => setOpenViewModal({ isShown: false, data: null })}
                    onDeleteClick={() => {
                        deleteTravelStory(openViewModal.data || null);
                    }
                    }
                    onEditClick={() => {
                        setOpenViewModal({
                            isShown: false,
                            data: null
                        });
                        handleEdit(openViewModal.data || null);
                    }}
                    storyInfo={openViewModal.data || null}
                />
            </Modal>

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
