import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../../components/input/PasswordInput";
import { validateEmail } from "../../../utils/helper";
import axiosInstance from "../../../utils/axiosInstance";
import JSConfetti from "js-confetti";
import { AxiosError } from "axios";

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Please enter a password");
            return;
        }

        setError("");

        //Login API Call
        try {
            const response = await axiosInstance.post("/login", { email, password });
            const { accessToken } = response.data;
            //Handle successful login response
            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);

                // Trigger confetti effect
                const jsConfetti = new JSConfetti();
                await jsConfetti.addConfetti();
                navigate("/");
            }
        }
        catch (err: unknown) {
            if (err instanceof AxiosError) {
                // Axios error with response data
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    // Handle cases where the response is missing or doesn't contain a message
                    setError("An error occurred while processing your request.");
                }
            }
            else {
                // Non-Axios error
                setError("An error occurred while processing your request.");
            }
        }
    }

    return (
        <div className="h-screen bg-cyan-50 overflow-hidden relative">
            <div className="login-ui-box right-10 -top-40" />
            <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />
            <div className="container h-screen flex items-center justify-center px-20 mx-auto">
                <div className="w-2/4 h-[75vh] hidden md:flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50">
                    <div className="">
                        <h4 className="text-5xl text-white font-semibold leading-[58px]">Capture Your <br />Journeys</h4>
                        <p className="text-[15px] text-white leading-6 pr-7 mt-4">Record your travel experiences and memories in your personal travel journey</p>
                    </div>
                </div>

                <div className="w-full md:w-2/4 h-1/2 md:h-[75vh] bg-white rounded-r-lg relative p-5 md:p-16 shadow-lg shadow-cyan-200/20">
                    <form onSubmit={handleLogin}>
                        <h4 className="text-2xl font-semibold mb-2">Login</h4>
                        <input type="text" placeholder="Email" className="input-box"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail(e?.target?.value)
                            }}
                        />

                        <PasswordInput value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        {error && <p className="text-xs text-red-500 pb-1 font-bold">{error}</p>}

                        <button type="submit" className="btn-primary">
                            Login
                        </button>

                        <p className="text-xs text-slate-500 text-center my-4">Or</p>

                        <button type="submit" className="btn-primary btn-light" onClick={() => {
                            navigate("/signUp")
                        }}>Create Account</button>
                    </form>
                </div>

            </div>
        </div >
    )
}

export default Login
