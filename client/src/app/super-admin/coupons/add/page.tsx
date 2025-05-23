"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import useCouponStore from "../../../../../store/useCouponStore";
import { useRouter } from "next/navigation";
import { protectCoupontFormAction } from "@/actions/coupon";

function SuperAdminManageCouponPage() {
    const [formData, setFormData] = useState({
        code: "",
        discountPercent: 0,
        startDate: "",
        endDate: "",
        usageLimit: 0,
    });

    const { isLoading, createCoupon } = useCouponStore();
    const { toast } = useToast();
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreateUniqueCoupon = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }

        setFormData((prev) => ({
            ...prev,
            code: result,
        }));
    };

    const handleCouponSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            toast({
                title: "End date must be after start date",
                variant: "destructive",
            });
            return;
        }

        const checkCouponFormValidation = await protectCoupontFormAction();
        if (!checkCouponFormValidation.success) {
            toast({
                title: checkCouponFormValidation.error,
                variant: "destructive",
            });
            return;
        }

        const couponData = {
            ...formData,
            discountPercent: parseFloat(formData.discountPercent.toString()),
            usageLimit: parseInt(formData.usageLimit.toString()),
        };
        const result = await createCoupon(couponData);
        if (result) {
            toast({
                title: "Coupon added successfully",
            });
            router.push("/super-admin/coupons/list");
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col gap-6">
                <header className="flex items-center justify-between">
                    <h1>Add Coupon</h1>
                </header>
                <form className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                    <div className="space-y-4">
                        <div>
                            <Label>Coupon Code</Label>
                            <div className="flex justify-between gap-2 items-center">
                                <Input
                                    name="code"
                                    type="text"
                                    placeholder="Enter coupon code"
                                    className="mt-1.5"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Button
                                    type="button"
                                    className=" w-[250px] mt-1.5"
                                    onClick={handleCreateUniqueCoupon}
                                >
                                    Create Unique Code
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Label>Start Date</Label>
                            <Input
                                name="startDate"
                                type="date"
                                className="mt-1.5"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>End Date</Label>
                            <Input
                                name="endDate"
                                type="date"
                                className="mt-1.5"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>Disscount Percentage</Label>
                            <Input
                                name="discountPercent"
                                type="number"
                                min={0}
                                placeholder="Enter Disscount Percentage"
                                className="mt-1.5"
                                required
                                value={formData.discountPercent}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <Label>Usage Limit</Label>
                            <Input
                                name="usageLimit"
                                type="number"
                                min={0}
                                placeholder="Enter Usage Limit"
                                className="mt-1.5"
                                required
                                value={formData.usageLimit}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="mt-1.5 mx-auto w-[250px]"
                        onClick={handleCouponSubmit}
                    >
                        {!isLoading ? "Create" : "Creating..."}
                    </Button>
                </form>
            </div>
        </div>
    );
}
export default SuperAdminManageCouponPage;
