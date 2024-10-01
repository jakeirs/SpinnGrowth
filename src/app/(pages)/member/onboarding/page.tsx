"use client";

import { FormEvent, useRef, useState } from "react";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function OnboardingPage() {
  const generateUploadUrl = useMutation(api.fromImages.generateUploadUrl);
  const sendImage = useMutation(api.fromImages.sendImage);
  const getImageURL = useQuery(api.fromImages.getPhoto, {
    title: "Title-6941",
  });

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [name] = useState(() => "Title-" + Math.floor(Math.random() * 10000));
  async function handleSendImage(event: FormEvent) {
    event.preventDefault();

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    await sendImage({ storageId, title: name });

    setSelectedImage(null);
    imageInput.current!.value = "";
  }

  const getPhoto = async () => {};

  return (
    <div>
      <Image src={getImageURL!} width="200" height="200" alt="AEL" />
      <form onSubmit={handleSendImage}>
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          onChange={(event) => setSelectedImage(event.target.files![0])}
          disabled={selectedImage !== null}
        />
        <input
          type="submit"
          value="Send Image"
          disabled={selectedImage === null}
        />
      </form>
    </div>
  );
}
