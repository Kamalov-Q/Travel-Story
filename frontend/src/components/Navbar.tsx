import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/logo.webp';
import ProfileInfo from './cards/ProfileInfo';
import SearchBar from './input/SearchBar/SearchBar';

interface UserInfo {
    email: string;
    fullName: string;
    _id: string;
    password: string;
    createdAt?: string;
    updatedAt?: string;
}

interface UserInfoProps {
    userInfo: UserInfo | null;
    searchQuery: string;
    setSearchQuery: (searchQuery: string) => void;
    onSearchNote: (searchQuery: string) => void;
    handleClearSearch: () => void
}


const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }: UserInfoProps) => {
    const isToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const onLogOut = () => {
        localStorage.clear();
        navigate("/login");
    }

    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery);
        }
    };

    const onClearSearch = () => {
        handleClearSearch();
        setSearchQuery("");
    }

    return (
        <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
            <img src={LOGO} className='w-[100px]' alt="Navbar Logo" />

            {isToken &&
                <>
                    <SearchBar value={searchQuery} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event?.target.value)} handleSearch={handleSearch} onClearSearch={onClearSearch} />
                    <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />
                </>
            }

        </div>
    )
}

export default Navbar
