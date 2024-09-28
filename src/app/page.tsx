"use client";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { use, useEffect } from "react";
import { DataTable } from "./data-table";
import { Items, columns } from "./columns"

export default function Home() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [data, setData] = React.useState<Items[]>([]);
  const [poNumber, setPoNumber] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if(files.length < 1) {
      setData([]);
    }
  }, [files]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("data_file", files[0]);
      const response = await fetch("/api/extract-data", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setData(data?.message?.items);
      setPoNumber(data?.message?.po_number);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen p-5">
      <h1 className="text-2xl font-bold py-2">Extract Data from Purchase Order</h1>
      <div className="flex flex-col gap-4">

      <FileUploader files={files} setFiles={setFiles} />
      <Button onClick={handleSubmit} disabled={loading || files.length<1} className="max-w-fit">
        <div className="flex items-center justify-center">
          {loading && <ReloadIcon className="w-3 h-3 mr-2 animate-spin" />}
          <p>Extract Data</p>
        </div>
      </Button>
      </div>
      <div className="mt-5">
        <h2 className="text-xl font-bold">{`PO Number: ${
          poNumber ? poNumber : "-"
        }`}</h2>
      <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
