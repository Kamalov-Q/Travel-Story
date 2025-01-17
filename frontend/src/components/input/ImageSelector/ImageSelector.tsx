import React, { useEffect, useRef, useState } from "react"
import { FaRegFileImage } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";

interface ImageSelectorProps {
    image: File | null,
    setImage: (image: File | null) => void,
    handleDeleteImg: () => void
}
const ImageSelector = ({ image, setImage, handleDeleteImg }: ImageSelectorProps) => {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0] || null;
        if (file) {
            setImage(file);
        }
    };

    const onChooseFile = () => {
        inputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setImage(null);
        handleDeleteImg();
    }

    useEffect(() => {
        //If the image prop is a string (URL), set it as the provide URL
        if (typeof image === "string") {
            setPreviewUrl(image);
        }
        else if (image) {
            //If the image props is a File object, create a preview URL
            const objectUrl = URL.createObjectURL(image);
            setPreviewUrl(objectUrl);
        }
        else {
            //If the image prop is null, clear the preview URL
            setPreviewUrl(null);
        }

        return () => {
            if (previewUrl && typeof previewUrl === "string" && !image) {
                URL.revokeObjectURL(previewUrl);
            }
        }
    }, [image]);

    console.log(previewUrl, "previewUrl");


    return (
        <div>
            <input type="file" accept="image/*" id="image-upload" className="hidden" ref={inputRef}
                onChange={handleImageUpload}
            />

            {
                !image ? (
                    <button className="w-full h-[220px] flex flex-col items-center justify-center gap-4
                bg-slate-50 rounded border border-slate-200/50" onClick={onChooseFile}>
                        <div className="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-full border border-cyan-100">
                            <FaRegFileImage className="text-xl text-cyan-500" />
                        </div>

                        <p className="text-sm text-slate-500">Browse Image files to upload</p>

                    </button>
                ) : (
                    <div className="w-full relative">
                        <img src={previewUrl || undefined} alt="Image Upload for Travel Story" className="w-full h-[300px] object-cover rounded-lg" />

                        <button className="btn-small btn-delete absolute top-2 right-2" onClick={handleRemoveImage}>
                            <MdDeleteOutline className="text-lg" />
                        </button>
                    </div>
                )
            }
        </div>
    )
}

export default ImageSelector
