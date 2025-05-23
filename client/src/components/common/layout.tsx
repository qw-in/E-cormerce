"use client";

import React from "react";
import Header from "../user/header";
import { usePathname } from "next/navigation";

const pathNotToShowHeaders = ["/auth", "/super-admin"];

function CommonLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const showHeader = !pathNotToShowHeaders.some((currentpath) =>
        pathname.startsWith(currentpath)
    );
    return (
        <div className="min-h-screen bg-white">
            {showHeader && <Header />}
            <main>{children}</main>
        </div>
    );
}

export default CommonLayout;
