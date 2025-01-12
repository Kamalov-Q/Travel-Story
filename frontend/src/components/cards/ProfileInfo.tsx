import { getInitials } from "../../utils/helper";

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
    onLogOut: () => void;
}
const ProfileInfo = ({ userInfo, onLogOut }: UserInfoProps) => {
    return (
        userInfo && <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-950 rounded-full">
                {getInitials(userInfo?.fullName || "User")}
            </div>

            <div className="">
                <p className="text-sm font-medium">{userInfo?.fullName || "User"}</p>
                <button className="text-sm text-slate-700 underline" onClick={onLogOut}>
                    Log Out
                </button>
            </div>

        </div>
    )
}

export default ProfileInfo
