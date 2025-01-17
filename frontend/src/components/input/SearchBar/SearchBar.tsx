import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

interface SearchBarProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSearch: () => void;
    onClearSearch: () => void;
}
const SearchBar = ({ value, onChange, handleSearch, onClearSearch }: SearchBarProps) => {
    return (
        <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
            <input type="text" placeholder="Search Notes" className="w-full text-xs bg-transparent py-3 outline-none"
                value={value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event)}
            />

            {value && <MdClose className="text-slate-500 text-xl mr-3 cursor-pointer hover:text-black" onClick={onClearSearch} />}

            <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-black" onClick={handleSearch} />
        </div>
    )
}

export default SearchBar
