"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useAddressStore, Address } from "../../../store/useAddressStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useOrderStore } from "../../../store/useOrderStore";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const initialAddress = {
    name: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
    isDefault: false,
};

function UserAccountPage() {
    const { toast } = useToast();

    const [showAddresses, setShowAddresses] = useState(false);
    const [editingAddresses, setEditingAddresses] = useState<string | null>(
        null
    );
    const [formData, setFormData] = useState(initialAddress);
    const {
        isLoading: isAddressLoading,
        error: isAddressError,
        addresses,
        createAddress,
        deleteAddress,
        fetchAddress,
        updateAddress,
    } = useAddressStore();
    const { userOrders, getOrdersByUserId, isLoading } = useOrderStore();

    const handleDeleteAddress = async (id: string) => {
        const confirm = window.confirm("Are you sure to delete this address");
        if (confirm) {
            try {
                const success = await deleteAddress(id);
                if (success) {
                    fetchAddress();
                    toast({
                        title: "Address deleted sccuessfully",
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleEditAddress = (address: Address) => {
        setFormData({
            name: address.name,
            address: address.address,
            city: address.city,
            country: address.country,
            phone: address.phone,
            postalCode: address.postalCode,
            isDefault: address.isDefault,
        });
        setEditingAddresses(address.id), setShowAddresses(true);
    };

    const handleAddressSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (editingAddresses) {
                const result = await updateAddress(editingAddresses, formData);
                if (result) {
                    fetchAddress();
                    setEditingAddresses(null);
                }
            } else {
                const result = await createAddress(formData);
                if (result) {
                    fetchAddress();
                    toast({
                        title: "address created success fully",
                    });
                }
            }

            setShowAddresses(false);
            setFormData(initialAddress);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAddress();
        getOrdersByUserId();
    }, [fetchAddress, getOrdersByUserId]);

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
    if (isLoading) return null;
    return (
        <div className="min-h-screen bg-white py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">MY ACCOUNT</h1>
                </div>
                <Tabs defaultValue="orders" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="orders">Order History</TabsTrigger>
                        <TabsTrigger value="addresses">Adresses</TabsTrigger>
                    </TabsList>
                    <TabsContent value="orders">
                        <Card>
                            <CardContent>
                                <h1 className="text-xl font-semibold">
                                    Orders History
                                </h1>
                                {userOrders.length === 0 && (
                                    <h1 className="text-2xl font-bold">
                                        You have not placed an Order yet
                                    </h1>
                                )}
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Order #</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Items</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {userOrders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell>
                                                        {order.id}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.items.length}{" "}
                                                        {order.items.length > 1
                                                            ? "Items"
                                                            : "Item"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={`${getStatusColor(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {order.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                order.status.slice(
                                                                    1
                                                                )}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.total.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="addresses">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">
                                        Addresses
                                    </h2>
                                    <Button
                                        onClick={() => {
                                            setEditingAddresses(null);
                                            setFormData(initialAddress);
                                            setShowAddresses(true);
                                        }}
                                    >
                                        Add new address
                                    </Button>
                                </div>
                                {isAddressLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin h-10 w`10 rounded-full border-b-2 border-gray-900"></div>
                                    </div>
                                ) : showAddresses ? (
                                    <form
                                        onSubmit={handleAddressSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label>Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                required
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Address</Label>
                                            <Input
                                                id="name"
                                                value={formData.address}
                                                required
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter your address"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>City</Label>
                                            <Input
                                                id="name"
                                                value={formData.city}
                                                required
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        city: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter your city"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Country</Label>
                                            <Input
                                                id="name"
                                                value={formData.country}
                                                required
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        country: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter your country"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Postal Code</Label>
                                            <Input
                                                id="name"
                                                value={formData.postalCode}
                                                required
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        postalCode:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter your postal code"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input
                                                id="name"
                                                value={formData.phone}
                                                required
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter your phone"
                                            />
                                            <div>
                                                <Checkbox
                                                    id="default"
                                                    checked={formData.isDefault}
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        setFormData({
                                                            ...formData,
                                                            isDefault:
                                                                checked as boolean,
                                                        });
                                                    }}
                                                />
                                                <Label
                                                    className="ml-3"
                                                    htmlFor="default"
                                                >
                                                    Set as defalt address
                                                </Label>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button type="submit">
                                                    {editingAddresses
                                                        ? "Update"
                                                        : "Add"}
                                                    Address
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={"outline"}
                                                    onClick={() => {
                                                        setShowAddresses(false);
                                                        setEditingAddresses(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        {addresses.map((address) => (
                                            <Card
                                                key={address.id}
                                                className="shadow-md rounded-xl"
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        {/* Thông tin địa chỉ */}
                                                        <div className="space-y-1">
                                                            <p className="text-lg font-semibold">
                                                                {address.name}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    address.address
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {address.city},
                                                                {
                                                                    address.country
                                                                }
                                                                ,
                                                                {
                                                                    address.postalCode
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                📞
                                                                {address.phone}
                                                            </p>

                                                            {address.isDefault && (
                                                                <Badge
                                                                    className="mt-2"
                                                                    variant="secondary"
                                                                >
                                                                    Default
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {/* Nút hành động */}
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleEditAddress(
                                                                        address
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDeleteAddress(
                                                                        address.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default UserAccountPage;
