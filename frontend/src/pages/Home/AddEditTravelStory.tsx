import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'
import { AddEditModalProps } from './Home'
import DateSelector from '../../components/input/DateSelector/DateSelector'
import { useState } from 'react'
import ImageSelector from '../../components/input/ImageSelector/ImageSelector'
import TagInput from '../../components/input/TagInput/TagInput'
import axiosInstance from '../../utils/axiosInstance'
import moment from 'moment'
import { toast } from 'react-toastify'
import { uploadImage } from '../../utils/uploadImage'

const AddEditTravelStory = ({ isShown, type, data, onClose, getAllStories }: AddEditModalProps) => {

    const [visitedDate, setVisitedDate] = useState<Date | undefined>(data?.visitedDate || undefined);
    const [title, setTitle] = useState<string>(data?.title || "");
    const [storyImg, setStoryImg] = useState<File | null>(null);
    const [story, setStory] = useState<string>(data?.story || "");
    const [visitedLocation, setVisitedLocation] = useState<string[]>(data?.visitedLocation || []);
    const [error, setError] = useState("");


    // Check if there's an existing image URL
    const existingImageUrl = data?.imageUrl || "";

    //Add New Travel Story
    const addNewTravelStory = async () => {
        try {
            let imageUrl = existingImageUrl;

            //Upload the story image if present
            if (storyImg) {
                const imgUploads = await uploadImage(storyImg);

                //Get image URL
                imageUrl = imgUploads.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
                visitedLocation,
                imageUrl: imageUrl || "",
            });

            if (response.data && !response.data.error) {
                toast.success("Story added successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });

                //Refresh the stories
                getAllStories?.();

                //Close the modal
                onClose?.();
            }

        } catch (error) {
            console.error(error);
        }
    }

    const updateTravelStory = async () => {
        try {
            let imageUrl = existingImageUrl;

            //Upload the story image if present
            if (storyImg) {
                const imgUploads = await uploadImage(storyImg);

                //Get image URL
                imageUrl = imgUploads.imageUrl || "";
            }
            const response = await axiosInstance.put("/edit-story" + `/${data?._id}`, {
                title,
                story,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
                visitedLocation,
                imageUrl: imageUrl || "",
            });

            if (response.data && !response.data.error) {
                toast.success("Story edited successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });

                //Refresh the stories
                getAllStories?.();

                //Close the modal
                onClose?.();
            }

        } catch (error) {
            console.error(error);
        }
    }

    const handleAddOrUpdateClick = () => {
        console.log("Input Data", { title, story, visitedDate, visitedLocation, storyImg });

        if (!title) {
            setError("Please enter a title");
            return;
        }

        if (!story) {
            setError("Please enter a story");
            return;
        }

        if (!visitedDate) {
            setError("Please select a date");
            return;
        }

        setError("");

        if (type === "edit") {
            updateTravelStory();
        }
        else {
            addNewTravelStory();
        }

    }

    //Delete story Image and update the story
    const handleDeleteStoryImg = async () => {

        //Delete the story image
        const deleteImgRes = await axiosInstance.delete("/delete-image", {
            params: {
                imageUrl: data?.imageUrl
            }
        });
        if (deleteImgRes.data && !deleteImgRes.data.error) {
            updateTravelStory(); 
        }

    }

    return (
        <div className='relative'>
            <div className='flex items-center justify-between'>
                <h5 className='text-xl font-medium text-slate-700'>
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>

                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    {type === "add" ? <button className='btn-small' onClick={handleAddOrUpdateClick}>
                        <MdAdd className='text-lg' />Add Story
                    </button> : <>
                        <button className='btn-small' onClick={handleAddOrUpdateClick}>
                            <MdUpdate className='text-lg' />Update Story
                        </button>
                        <button className='btn-small btn-delete' onClick={onClose}>
                            <MdDeleteOutline className='text-lg' />Delete
                        </button>
                    </>}


                    <button className='' onClick={onClose}>
                        <MdClose className='text-xl text-slate-400' />
                    </button>



                </div>

            </div>
            {error && <p className='text-sm text-red-600 pt-2 text-right'>{error}</p>}

            <div>
                <div className='flex-1 flex flex-col gap-2 pt-4'>
                    <label className='input-label'>Title</label>
                    <input type="text" className='text-2xl text-slate-950 outline-none' placeholder='A Day at the Great Wall' value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />

                    <div className='my-3'>
                        <DateSelector date={visitedDate} setDate={setVisitedDate} />
                    </div>

                    <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />

                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor="" className='input-label'>Story</label>
                        <textarea className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded' placeholder='Your Story'
                            rows={10}
                            cols={10}
                            color='red'
                            value={story}
                            onChange={({ target }) => setStory(target.value)}
                        />
                    </div>


                    <div className='pt-3'>
                        <label className='input-label'>Visited Locations</label>
                        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                    </div>

                </div>
            </div>

        </div>
    )
}

export default AddEditTravelStory
