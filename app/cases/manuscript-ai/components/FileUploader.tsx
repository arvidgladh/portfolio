"use client";

import React, { useState } from "react";

export default function FileUploader({
  onUpload,
}: {
  onUpload: (file: File) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | null) => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
        dragging ? "bg-neutral-900 border-neutral-500" : "border-neutral-700"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0] ?? null;
        handleFile(file);
      }}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.txt,.doc,.docx";
        input.onchange = () => {
          const file = input.files?.[0] ?? null;
          handleFile(file);
        };
        input.click();
      }}
    >
      <p className="text-lg text-neutral-100 mb-2">
        Dra in ett manus eller klicka för att ladda upp
      </p>
      <p className="text-sm text-neutral-500">
        Stöd för PDF, Word och textfiler i denna MVP.
      </p>
    </div>
  );
}
