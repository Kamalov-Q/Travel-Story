import axiosInstance from "./axiosInstance";

export const uploadImage = async (imageUrl: File | null) => {
  try {
    const formData = new FormData();

    //Append the image file to the form data
    if (imageUrl) {
      formData.append("image", imageUrl);
    }

    const response = await axiosInstance.post("/image-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the header for file upload
      },
    });

    console.log(response.data, "response from image upload");
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
