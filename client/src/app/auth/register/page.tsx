"use client";

import Image from "next/image";
import banner from "../../../../public/image/banner2.jpg";
import logo from "../../../../public/image/logo1.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { protectSignupAction } from "@/actions/auth";

import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

function Registerpage() {
    const [formData, setformData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { toast } = useToast();
    const { register, isLoading } = useAuthStore();
    const router = useRouter();

    const handleOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setformData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const checkFirstLevelOfValidation = await protectSignupAction(
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
        const userId = await register(
            formData.name,
            formData.email,
            formData.password
        );
        if (userId) {
            toast({
                title: "Registration successfullty",
            });
            router.push("/auth/login");
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                className="bg-[#ffede1]"
                                value={formData.name}
                                onChange={handleOnchange}
                                required
                            ></Input>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="bg-[#ffede1]"
                                value={formData.email}
                                onChange={handleOnchange}
                                required
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
                                value={formData.password}
                                onChange={handleOnchange}
                                required
                            ></Input>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-black text-white hover:bg-black transition-colors"
                        >
                            {isLoading ? (
                                "Creating account..."
                            ) : (
                                <>
                                    CREATE ACCOUNT{" "}
                                    <ArrowRight className="w-4 h-4 ml-2" />{" "}
                                </>
                            )}
                        </Button>
                        <p className="text-center text-[#3f3d56] text-sm">
                            Alredy have an account{" "}
                            <Link
                                href={"/auth/login"}
                                className="text-[#000] hover:underline font-bold"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Registerpage;
