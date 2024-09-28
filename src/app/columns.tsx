"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Items = {
  name: string
  quantity: number
  price: number
}

export const columns: ColumnDef<Items>[] = [
  {
    accessorKey: "name",
    header: "Item Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
]
