"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useOrderStore } from "../../../../store/useOrderStore";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";

function OrdersPage() {
    const { getAllOrders, updateOrderStatus, adminOrders } = useOrderStore();
    const handleSatusUpdate = async (orderId: string, status: OrderStatus) => {
        await updateOrderStatus(orderId, status);
    };
    useEffect(() => {
        getAllOrders();
    }, [getAllOrders]);
    console.log(adminOrders);
    const getStatusColor = (
        status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED"
    ) => {
        switch (status) {
            case "PENDING":
                return "bg-blue-500";
            case "PROCESSING":
                return "bg-yellow-500";
            case "SHIPPED":
                return "bg-purple-500";
            case "DELIVERED":
                return "bg-green-500";

            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">ORDERS LIST</h1>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order Id</TableHead>
                        <TableHead>Create at</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {adminOrders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8}>No Orders Found</TableCell>
                        </TableRow>
                    ) : (
                        adminOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-semibold">
                                    {order.id}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{order.user.name}</TableCell>
                                <TableCell>{order.total.toFixed(2)}</TableCell>
                                <TableCell>{order.paymentStatus}</TableCell>
                                <TableCell>{order.items.length}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={`${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status.charAt(0).toUpperCase() +
                                            order.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={order.status}
                                        onValueChange={(value) =>
                                            handleSatusUpdate(
                                                order.id,
                                                value as OrderStatus
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-[160px]">
                                            <SelectValue placeholder="Update Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="PROCESSING">
                                                Processing
                                            </SelectItem>
                                            <SelectItem value="SHIPPED">
                                                Shipped
                                            </SelectItem>
                                            <SelectItem value="DELIVERED">
                                                Delivered
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default OrdersPage;
