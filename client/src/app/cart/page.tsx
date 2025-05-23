"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "../../../store/useCartStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "../../../store/useAuthStore";
import { useRouter } from "next/navigation";

function CartPage() {
    const router = useRouter();
    const {
        fetchCart,
        upDateCartItemQuantity,
        removeFromCart,
        items,
        isLoading,
    } = useCartStore();
    const { user } = useAuthStore();
    const [isUpdating, setIsUpDating] = useState(false);

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleDeleteItem = async (id: string) => {
        setIsUpDating(true);
        await removeFromCart(id);
        setIsUpDating(false);
    };

    const handleUpdateQuantity = async (id: string, newQuantity: number) => {
        setIsUpDating(true);
        await upDateCartItemQuantity(id, Math.max(1, newQuantity));
        setIsUpDating(false);
    };

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    if (isLoading || !user) return null;
    return (
        <div className="bg-white min-h-screen py-8">
            <div className="container mx-auto px-5">
                <h1 className="text-3xl font-bold text-center mb-8">
                    YOUR CART
                </h1>
                <div className="w-full overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">PRODUCT</th>
                                <th className="px-4 py-2 text-center">SIZE</th>
                                <th className="px-4 py-2 text-center">COLOR</th>
                                <th className="px-4 py-2 text-center">PRICE</th>
                                <th className="px-4 py-2 text-center">
                                    QUANTITY
                                </th>
                                <th className="px-4 py-2 text-center">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-4 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-20 w-20 object-cover"
                                            />
                                            <span className="font-medium">
                                                {item.name}
                                            </span>
                                        </div>
                                        <Button
                                            disabled={isLoading}
                                            onClick={() =>
                                                handleDeleteItem(item.id)
                                            }
                                            className="text-sm text-white hover:bg-red-400 mt-2 bg-red-500"
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                    <td className="px-4 py-4 text-center text-gray-700">
                                        {item.size}
                                    </td>
                                    <td className="px-4 py-4 text-center text-gray-700">
                                        {item.color}
                                    </td>
                                    <td className="px-4 py-4 text-center text-gray-700">
                                        ${item.price}
                                    </td>
                                    <td className="px-4 py-4 text-center text-gray-700">
                                        <div className="flex justify-center items-center gap-2">
                                            <Button
                                                disabled={isUpdating}
                                                variant={"outline"}
                                                size={"icon"}
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <Input
                                                type="number"
                                                className="w-16 text-center"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleUpdateQuantity(
                                                        item.id,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                            />
                                            <Button
                                                disabled={isUpdating}
                                                variant={"outline"}
                                                size={"icon"}
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center text-gray-700">
                                        ${item.quantity * item.price}
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        Your cart is empty.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-8 flex justify-end">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">TOTAL:</span>
                            <span className="font-bold ml-4">${total}</span>
                        </div>
                        <Button
                            onClick={() => router.push("/checkout")}
                            className="w-full bg-black text-white"
                        >
                            PROCESS TO CHECKOUT
                        </Button>
                        <Button
                            onClick={() => router.push("/listing")}
                            className="w-full mt-2"
                            variant={"outline"}
                        >
                            CONTINUE TO SHOPPING
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
