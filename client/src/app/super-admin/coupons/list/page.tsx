"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import useCouponStore from "../../../../../store/useCouponStore";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SuperAdminListingCouponPage() {
    const { isLoading, fetchAllCoupon, deteleCoupon, couponList } =
        useCouponStore();
    const router = useRouter();
    const { toast } = useToast();
    const fetchCouponRef = useRef(false);
    const handleDeleteCoupon = async (couponId: string) => {
        window.confirm("Are you sure to delete this product?");
        const result = await deteleCoupon(couponId);
        if (result) {
            toast({ title: "Coupon deleted success fully" });
            fetchAllCoupon();
        }
    };

    useEffect(() => {
        if (!fetchCouponRef.current) {
            fetchCouponRef.current = true;
            fetchAllCoupon();
        }
    }, [fetchAllCoupon]);

    console.log("All couponlist", couponList);

    return (
        <div className="p-6">
            <div className="flex flex-col gap-6">
                <header className="flex items-center justify-between">
                    <h1>All Coupons</h1>
                    <Button
                        onClick={() => router.push("/super-admin/coupons/add")}
                    >
                        Add New Coupon
                    </Button>
                </header>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">Code</TableHead>
                            <TableHead className="font-bold">
                                Discount
                            </TableHead>
                            <TableHead className="font-bold">Usage</TableHead>
                            <TableHead className="font-bold">
                                Start Date
                            </TableHead>
                            <TableHead className="font-bold">
                                End Date
                            </TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {couponList.map((coupon) => (
                            <TableRow key={coupon.id}>
                                <TableCell className="font-semibold">
                                    <p>{coupon.code}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{coupon.discountPercent}%</p>
                                </TableCell>
                                <TableCell>
                                    <p>
                                        {coupon.usageCount}/{coupon.usageLimit}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(coupon.startDate),
                                        "dd MMM yyyy"
                                    )}
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(coupon.endDate),
                                        "dd MMM yyyy"
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            new Date(coupon.startDate) >
                                            new Date()
                                                ? "bg-yellow-500 text-white"
                                                : new Date(coupon.endDate) <
                                                  new Date()
                                                ? "bg-gray-500 text-white"
                                                : "bg-green-500 text-white"
                                        }
                                    >
                                        {new Date(coupon.startDate) > new Date()
                                            ? "Not Ready"
                                            : new Date(coupon.endDate) <
                                              new Date()
                                            ? "Expired"
                                            : "Active"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() =>
                                            handleDeleteCoupon(coupon.id)
                                        }
                                        variant="ghost"
                                        size="icon"
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        <Trash2 className="h-4 w-4 text-slate-200" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default SuperAdminListingCouponPage;
