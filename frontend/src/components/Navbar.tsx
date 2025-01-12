import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/logo.webp';
import ProfileInfo from './cards/ProfileInfo';

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
}


const Navbar = ({ userInfo }: UserInfoProps) => {
    const isToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const onLogOut = () => {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
            <img src={LOGO} className='w-[100px]' alt="Navbar Logo" />

            {isToken && <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />}

        </div>
    )
}

export default Navbar
