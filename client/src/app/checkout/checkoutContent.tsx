"use client";

import { Card } from "@/components/ui/card";
import { useAddressStore } from "../../../store/useAddressStore";
import { use, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Input } from "@/components/ui/input";
import { CartItem, useCartStore } from "../../../store/useCartStore";
import { useProductStore } from "../../../store/useProductStore";
import { Separator } from "@/components/ui/separator";
import useCouponStore, { Coupon } from "../../../store/useCouponStore";
import { paymentAction } from "@/actions/payment";
import { useToast } from "@/hooks/use-toast";
import { useOrderStore } from "../../../store/useOrderStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";

function CheckoutContentPage() {
    const router = useRouter();
    const { toast } = useToast();

    const { addresses, fetchAddress } = useAddressStore();
    const { items, fetchCart, clearCart } = useCartStore();
    const {
        capturePayPalOrder,
        createPayPalOrder,
        createFinalOrder,
        isPaymentProcessing,
    } = useOrderStore();
    const { user } = useAuthStore();
    const { getProductById } = useProductStore();
    const { fetchAllCoupon, couponList } = useCouponStore();

    const [selectedAddress, setSelectedAddress] = useState("");
    const [showPaymentSlow, setShowPaymentSlow] = useState<boolean>(false);
    const [applyCouponError, setApplyCouponError] = useState("");
    const [checkoutEmail, setCheckoutEmail] = useState("");
    const [applyCoupon, setAppylyCoupon] = useState<Coupon | null>(null);
    const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
        (CartItem & { product: any })[]
    >([]);
    const [couponCode, setCouponCode] = useState("");

    useEffect(() => {
        fetchCart();
        fetchAddress();
        fetchAllCoupon();
    }, [fetchAddress, fetchCart, fetchAllCoupon]);

    useEffect(() => {
        const findAddressDefault = addresses.find(
            (address) => address.isDefault === true
        );

        if (findAddressDefault) {
            setSelectedAddress(findAddressDefault.id);
        }
    }, [addresses]);

    useEffect(() => {
        const fetchIndividualProductDetails = async () => {
            const itemsWithDetails = await Promise.all(
                items.map(async (item) => {
                    const product = await getProductById(item.productId);
                    return { ...item, product };
                })
            );
            setCartItemsWithDetails(itemsWithDetails);
        };
        fetchIndividualProductDetails();
    }, [items, getProductById]);

    const subTotal = cartItemsWithDetails.reduce(
        (acc, item) => acc + (item?.price || 0) * item?.quantity,
        0
    );

    const disCountAmount = applyCoupon
        ? (subTotal * applyCoupon.discountPercent) / 100
        : 0;

    const total = subTotal - disCountAmount;

    const handlePrePaymentFlow = async () => {
        const result = await paymentAction(checkoutEmail);
        if (!result.success) {
            toast({
                title: result.error,
                variant: "destructive",
            });
            return;
        }

        setShowPaymentSlow(true);
    };
    function handleApplyCoupon() {
        const getCurrentCoupon = couponList.find(
            (coupon) => coupon.code === couponCode
        );

        if (!getCurrentCoupon) {
            setApplyCouponError("Invalied Coupon code");
            setAppylyCoupon(null);
            return;
        }

        const now = new Date();

        if (
            now < new Date(getCurrentCoupon.startDate) ||
            now > new Date(getCurrentCoupon.endDate)
        ) {
            setApplyCouponError(
                "Coupon is not valid in this time or expired coupon"
            );
            setAppylyCoupon(null);
            return;
        }

        if (getCurrentCoupon.usageCount >= getCurrentCoupon.usageLimit) {
            setApplyCouponError(
                "Coupon has reached its usage limit! Please try a diff coupon"
            );
            setAppylyCoupon(null);
            return;
        }

        setAppylyCoupon(getCurrentCoupon);
        setApplyCouponError("");
    }

    const handleFinalOrderCreation = async (data: any) => {
        if (!user) {
            toast({
                title: "User not authenticated",
            });

            return;
        }
        try {
            const orderData = {
                userId: user?.id,
                addressId: selectedAddress,
                items: cartItemsWithDetails.map((item) => ({
                    productId: item.productId,
                    productName: item.product.name,
                    productCategory: item.product.category,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    price: item.product.price,
                })),
                couponId: applyCoupon?.id,
                total,
                paymentMethod: "CREDIT_CARD" as const,
                paymentStatus: "COMPLETED" as const,
                paymentId: data.id,
            };

            const createFinalOrderResponse = await createFinalOrder(orderData);

            if (createFinalOrderResponse) {
                await clearCart();
                router.push("/account");
            } else {
                toast({
                    title: "There is some error while processing final order",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "There is some error while processing final order",
                variant: "destructive",
            });
        }
    };

    if (isPaymentProcessing) {
        return (
            <Skeleton className="w-full h-[600px] rounded-xl">
                <div className="h-full flex justify-center items-center">
                    <h1 className="text-3xl font-bold">
                        Processing payment...Please wait!
                    </h1>
                </div>
            </Skeleton>
        );
    }
    return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Delivery
                            </h2>
                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className="flex items-center space-x-4"
                                    >
                                        <Checkbox
                                            id={address.id}
                                            checked={
                                                selectedAddress === address.id
                                            }
                                            onCheckedChange={() =>
                                                setSelectedAddress(address.id)
                                            }
                                        />
                                        <Label
                                            htmlFor={address.id}
                                            className="ml-2"
                                        >
                                            <div>
                                                <span className="font-medium">
                                                    {address.name}
                                                </span>
                                                {address.isDefault && (
                                                    <span className="ml-2 text-sm text-green-600">
                                                        (Default)
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                {address.address}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {address.city},{" "}
                                                {address.country},{" "}
                                                {address.postalCode}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {address.phone}
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                                <Button onClick={() => router.push("/account")}>
                                    Add new address
                                </Button>
                            </div>
                        </Card>
                        <Card className="p-6">
                            {showPaymentSlow ? (
                                <div>
                                    <h3 className="text-4xl font-semibold mb-4">
                                        Payment
                                    </h3>
                                    <p>All transactions secure and encrypted</p>
                                    <PayPalButtons
                                        style={{
                                            layout: "vertical",
                                            label: "pay",
                                            shape: "rect",
                                            color: "black",
                                        }}
                                        fundingSource="card"
                                        createOrder={async () => {
                                            const orderId =
                                                await createPayPalOrder(
                                                    cartItemsWithDetails,
                                                    total
                                                );
                                            if (!orderId) {
                                                throw new Error(
                                                    "Fail to create Paypal order"
                                                );
                                            }
                                            return orderId;
                                        }}
                                        onApprove={async (data, actions) => {
                                            const captureData =
                                                await capturePayPalOrder(
                                                    data.orderID
                                                );
                                            if (captureData) {
                                                await handleFinalOrderCreation(
                                                    captureData
                                                );
                                            } else {
                                                alert(
                                                    "Failed to capture paypal order"
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">
                                        Enter email to get started
                                    </h3>
                                    <div className="gap-2 flex items-center">
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full"
                                            value={checkoutEmail}
                                            onChange={(
                                                event: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                                setCheckoutEmail(
                                                    event.target.value
                                                )
                                            }
                                        />
                                        <Button onClick={handlePrePaymentFlow}>
                                            Proceed to pay
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                    {/* order sumary */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-8">
                            <h2>Order sumary</h2>
                            <div className="space-y-6">
                                {cartItemsWithDetails.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="h-20 w-20 rounded-md overflow-hidden">
                                            <img
                                                src={item?.product?.images[0]}
                                                alt={item?.product?.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-medium">
                                                {item?.product?.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {item.color} / {item.size}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-medium">
                                            ${item.price * item.quantity}
                                        </p>
                                    </div>
                                ))}
                                <Separator />
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Enter a Discount code or Gift code"
                                        value={couponCode}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => setCouponCode(e.target.value)}
                                    />
                                    <Button
                                        onClick={handleApplyCoupon}
                                        className="w-full"
                                        variant={"outline"}
                                    >
                                        Apply
                                    </Button>

                                    {applyCouponError && (
                                        <p className="text-sm text-red-600">
                                            {applyCouponError}
                                        </p>
                                    )}
                                    {applyCoupon && (
                                        <p className="text-sm text-green-600">
                                            Coupon Applied Successfully!
                                        </p>
                                    )}
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>SubTotal</span>
                                        <span>${subTotal.toFixed(2)}</span>
                                    </div>
                                    {applyCoupon && (
                                        <div className="flex justify-between text-green-500">
                                            <span>
                                                Discont{" "}
                                                {applyCoupon.discountPercent}(%)
                                            </span>
                                            <span>
                                                ${disCountAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <Separator />
                                <div className="flex text-2xl justify-between font-medium">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutContentPage;
