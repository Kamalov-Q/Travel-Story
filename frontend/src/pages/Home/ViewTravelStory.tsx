import { MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import { AllStories } from "./Home"
import moment from "moment";
import { GrMapLocation } from "react-icons/gr";

interface ViewTravelStoryProps {
    storyInfo: AllStories | null;
    onClose: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void
}
const ViewTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }: ViewTravelStoryProps) => {
    return (
        <div className='relative'>
            <div className='flex items-center justify-end'>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    <button className='btn-small' onClick={onEditClick}>
                        <MdUpdate className='text-lg' />Update Story
                    </button>
                    <button className='btn-small btn-delete' onClick={onDeleteClick}>
                        <MdDeleteOutline className='text-lg' />Delete
                    </button>

                    <button className='' onClick={onClose}>
                        <MdClose className='text-xl text-slate-400' />
                    </button>



                </div>

            </div>

            <div className="">
                <div className="flex-1 flex flex-col gap-2 py-4">
                    <h1 className="text-2xl text-slate-950">
                        {storyInfo && storyInfo?.title}
                    </h1>

                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">
                            {storyInfo && storyInfo?.visitedDate && moment(storyInfo?.visitedDate).format("Do MMM YYYY")}
                        </span>

                        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
                            <GrMapLocation className="text-sm" />
                            {storyInfo && storyInfo?.visitedLocation?.map((location, index) => (
                                storyInfo.visitedLocation.length - 1 === index ? <span key={index}>{location}</span> : <span key={index}>{location},</span>
                            ))}
                        </div>

                    </div>

                </div>
                <img src={storyInfo && storyInfo?.imageUrl || undefined} className="w-full h-[300px] object-cover rounded-lg" alt="Travel Story Viewed Image" />

                <div className="mt-4">
                    <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">{storyInfo && storyInfo?.story}</p>
                </div>

            </div>
        </div>
    )
}

export default ViewTravelStory
