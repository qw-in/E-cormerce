"use client";

import Image from "next/image";
import banner from "../../../../public/image/banner2.jpg";
import logo from "../../../../public/image/logo1.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useRouter } from "next/navigation";
import { protectSigninpAction } from "@/actions/auth";

function Loginpage() {
    const [formData, setformData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const { toast } = useToast();
    const { login, isLoading } = useAuthStore();
    const router = useRouter();

    const handleOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setformData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const checkFirstLevelOfValidation = await protectSigninpAction(
            formData.email
        );
        if (!checkFirstLevelOfValidation.success) {
            console.log(checkFirstLevelOfValidation.error);

            toast({
                title: checkFirstLevelOfValidation.error,
                variant: "destructive",
            });
            return;
        }
        const success = await login(formData.email, formData.password);
        if (success) {
            toast({
                title: "Login successfullty",
            });
            const user = useAuthStore.getState().user;

            if (user?.role === "SUPER_ADMIN") {
                router.push("/super-admin");
            } else {
                router.push("/home");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#fff6f4] flex">
            <div className="hidden lg:block w-1/2 bg-[#ffede1] relative overflow-hidden">
                <Image
                    src={banner}
                    alt="register"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    priority
                />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center ">
                <div className="max-w-md w-full mx-auto">
                    <div className="flex justify-center">
                        <Image src={logo} width={200} height={50} alt="Logo" />
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="bg-[#ffede1]"
                                required
                                value={formData.email}
                                onChange={handleOnchange}
                            ></Input>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="Password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="bg-[#ffede1]"
                                required
                                value={formData.password}
                                onChange={handleOnchange}
                            ></Input>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-black text-white hover:bg-black transition-colors"
                        >
                            Login
                        </Button>
                        <p className="text-center text-[#3f3d56] text-sm">
                            New here{" "}
                            <Link
                                href={"/auth/register"}
                                className="text-[#000] hover:underline font-bold"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Loginpage;
