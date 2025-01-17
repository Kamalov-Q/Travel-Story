import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
import moment from "moment";


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

interface TravelStoryCardProps {
    _id: string;
    title: string;
    story: string;
    visitedLocation: string[];
    isFavourites: boolean;
    imageUrl: string;
    date: Date;
    onEdit: (story: AllStories) => void;
    onClick: () => void;
    onFavouriteClick: (story: AllStories) => void;
}


const TravelStoryCard = ({ title, imageUrl, _id, isFavourites, story, date, visitedLocation, onEdit, onClick, onFavouriteClick }: TravelStoryCardProps) => {
    return (
        <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg cursor-pointer hover:shadow-slate-200 transition-all ease-in-out relative w-auto md:w-[400px] h-auto m-5" onClick={onClick}>
            <img src={imageUrl} alt="Travel Story Card" className="w-full h-56 object-fill rounded-lg"
            />

            <button className="w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4"
                onClick={() => onFavouriteClick({ _id, title, story, visitedLocation, isFavourites, imageUrl, visitedDate: date })}
            >
                <FaHeart size={20} className={`icon-btn ${isFavourites ? "text-red-500" : "text-white"}`} />
            </button>

            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <h6 className="text-sm font-medium">{title}</h6>
                        <span className="text-xs text-slate-500">
                            {date ? moment(date).format("Do MMM YYYY") : "N/A"}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 mt-2">{story?.slice(0, 60)}</p>

                <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
                    <GrMapLocation size={20} className="text-sm" />
                    {visitedLocation?.map((location, index) => (
                        visitedLocation.length - 1 === index ? <span key={index} className="text-xs text-slate-600">{location}</span> : <span className="text-xs text-slate-600" key={index}>{location}, </span>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default TravelStoryCard
