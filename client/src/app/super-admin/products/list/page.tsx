"use client";

import { useEffect, useRef } from "react";
import { useProductStore } from "../../../../../store/useProductStore";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

function SuperAdminListingProductPage() {
    const { products, isLoading, deleteProduct, fetchAllProductForAdmin } =
        useProductStore();

    const { toast } = useToast();

    const router = useRouter();

    const handeleDeleteProduct = async (getId: string) => {
        window.confirm("Are you sure to delete this product?");
        const result = await deleteProduct(getId);
        if (result) {
            toast({ title: "Product deleted success fully" });
            fetchAllProductForAdmin();
        }
    };

    const productFetchRef = useRef(false);

    useEffect(() => {
        if (!productFetchRef.current) {
            fetchAllProductForAdmin();
            productFetchRef.current = true;
        }
    }, [fetchAllProductForAdmin]);

    if (isLoading) return null;

    return (
        <div className="p-6">
            <div className="flex flex-col gap-6">
                <header className="flex items-center justify-between">
                    <h1>All Products</h1>
                    <Button
                        onClick={() => router.push("/super-admin/products/add")}
                    >
                        Add New Product
                    </Button>
                </header>
                <div className="rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-bold">
                                        Product Name
                                    </TableHead>
                                    <TableHead className="font-bold">
                                        Price
                                    </TableHead>
                                    <TableHead className="font-bold">
                                        Stock
                                    </TableHead>
                                    <TableHead className="font-bold">
                                        Category
                                    </TableHead>
                                    <TableHead className="font-bold text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((prodcut) => (
                                    <TableRow key={prodcut.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-sm bg-gray-100 overflow-hidden">
                                                    {prodcut.images[0] && (
                                                        <Image
                                                            src={
                                                                prodcut
                                                                    .images[0]
                                                            }
                                                            alt="Product image"
                                                            width={60}
                                                            height={60}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {prodcut.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Size:{" "}
                                                        {prodcut.sizes.join(
                                                            ","
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            ${prodcut.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <p>{prodcut.stock} Item left</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">
                                                {prodcut.category.toLocaleUpperCase()}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() =>
                                                        handeleDeleteProduct(
                                                            prodcut.id
                                                        )
                                                    }
                                                    variant="ghost"
                                                    size="icon"
                                                    className="bg-red-500 hover:bg-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 text-slate-200" />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        router.push(
                                                            `/super-admin/products/add?id=${prodcut.id}`
                                                        )
                                                    }
                                                    variant="ghost"
                                                    size="icon"
                                                    className="bg-blue-500 hover:bg-blue-600"
                                                >
                                                    <Pencil className="h-4 w-4  text-slate-200 " />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuperAdminListingProductPage;
