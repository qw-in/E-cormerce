"use client";

import { ArrowLeft, Menu, ShoppingBag, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useAuthStore } from "../../../store/useAuthStore";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useEffect, useState } from "react";
import { useCartStore } from "../../../store/useCartStore";

const navItems = [
    { title: "HOME", to: "/home" },
    { title: "PRODUCTS", to: "/listing" },
];

function Header() {
    const { logout, user } = useAuthStore();
    const [mobileView, setMobileView] = useState<"menu" | "account">("account");
    const [showSheetDialog, setShowSheetDialog] = useState(false);

    const { fetchCart, items } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const renderMobileMenuitems = () => {
        switch (mobileView) {
            case "account":
                return (
                    <div className="space-y-4 px-2 py-4">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileView("menu")}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </div>
                        <nav className="flex flex-col space-y-2">
                            <p
                                onClick={() => {
                                    router.push("/account");
                                    setShowSheetDialog(false);
                                }}
                                className="block px-4 py-2 rounded-md hover:bg-gray-100 text-sm font-medium transition"
                            >
                                Your Account
                            </p>
                            <Button
                                onClick={() => {
                                    setShowSheetDialog(false);
                                    setMobileView("menu");
                                    handleLogout();
                                }}
                                variant="ghost"
                                className="justify-start px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md"
                            >
                                Logout
                            </Button>
                        </nav>
                    </div>
                );

            default:
                return (
                    <div className="space-y-6 py-6 px-2">
                        <div className="space-y-3">
                            {navItems.map((navItem) => (
                                <p
                                    onClick={() => {
                                        router.push(navItem.to);
                                        setShowSheetDialog(false);
                                    }}
                                    key={navItem.title}
                                    className="block font-bold p-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    {navItem.title}
                                </p>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <Button
                                className="w-full justify-start text-sm font-medium hover:bg-slate-950 rounded-md"
                                onClick={() => setMobileView("account")}
                            >
                                <User className="w-4 h-4 mr-2" /> Account
                            </Button>
                            <Button
                                className="w-full justify-start text-sm font-medium hover:bg-slate-950 rounded-md"
                                onClick={() => router.push("/cart")}
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" /> Cart (
                                {items?.length})
                            </Button>
                        </div>
                    </div>
                );
        }
    };
    const router = useRouter();
    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };
    return (
        <header className="sticky top-0 z-50 shadow-sm bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <Link href="/home" className="text-2xl font-bold">
                        ECOMMERCE
                    </Link>
                    <div className="hidden lg:flex justify-center items-center space-x-8 flex-1">
                        <nav className="flex space-x-8 items-center">
                            {navItems.map((navItem, index) => (
                                <Link
                                    href={navItem.to}
                                    key={index}
                                    className="text-sm font-semibold hover:text-gray-700"
                                >
                                    {navItem.title}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="hidden lg:flex items-center space-x-4">
                        <div
                            className="relative cursor-pointer"
                            onClick={() => router.push("/cart")}
                        >
                            <ShoppingCart />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-black text-white text-xs rounded-full flex items-center justify-center ">
                                {items?.length}
                            </span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <User className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => router.push("/account")}
                                >
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="lg:hidden">
                        <Sheet
                            open={showSheetDialog}
                            onOpenChange={() => {
                                setShowSheetDialog(false);
                                setMobileView("menu");
                            }}
                        >
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                    setShowSheetDialog(!showSheetDialog)
                                }
                            >
                                <Menu className="h-6 w-6" />
                            </Button>

                            <SheetContent side="left">
                                <SheetTitle>ECOMMERCE</SheetTitle>
                                {renderMobileMenuitems()}
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
