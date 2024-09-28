"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "./ui/card";
import { CrossCircledIcon, UploadIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

interface FileUploaderProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

function FileUploader({ files = [], setFiles }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prevFiles: any) => [
        ...(prevFiles || []),
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [setFiles]
  );

  const removeFile = (file: File) => {
    setFiles((prevFiles) => (prevFiles || []).filter((f) => f !== file));
  };

  const {
    acceptedFiles,
    fileRejections,
    isDragActive,
    getRootProps,
    getInputProps,
  } = useDropzone({
    maxFiles: 2,
    onDrop,
    accept: {
      "image/*": [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
        ".svg",
      ],
    },
  });

  const acceptedFileItems = files.map((file: any) => (
    <li
      key={file.path}
      className="flex flex-row justify-center items-center gap-5"
    >
      <img src={file.preview} className="h-20 w-20" />
      {file.path} - {file.size} bytes
      <Button variant="ghost" size="icon" onClick={() => removeFile(file)}>
        <CrossCircledIcon className="h-5 w-5 cursor-pointer text-red-500" />
      </Button>
    </li>
  ));

  const fileRejectionItems = fileRejections.map(
    ({ file, errors }: { file: any; errors: any }) => {
      return (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map((e: any) => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
      );
    }
  );

  return (
    <Card className="container p-3 w-56 max-w-full min-w-fit">
      {files.length < 1 ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-primary"
          }`}
        >
          <input {...getInputProps()} />
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag 'n' drop some files here, or click to select files
          </p>
        </div>
      ) : (
        <aside>
          <ul>{acceptedFileItems}</ul>
        </aside>
      )}
    </Card>
  );
}

export default FileUploader;
