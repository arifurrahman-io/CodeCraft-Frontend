import api, { getAssetUrl, normalizeData, request } from "@/services/api";

const getUploadedUrl = (payload) => {
  const data = normalizeData(payload) || payload || {};
  return (
    data.url ||
    data.secureUrl ||
    data.secure_url ||
    data.path ||
    data.filePath ||
    data.image ||
    data.filename
  );
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  // Backend expects "image" field from multer upload.single("image")
  formData.append("image", file);

  const response = await request(
    api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );

  const responseData =
    response.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
      ? response.data
      : {};
  const url = getAssetUrl(getUploadedUrl(response.data));

  return {
    ...response,
    data: {
      ...responseData,
      url,
    },
  };
};

export const deleteUploadedFile = (payload) =>
  request(api.delete("/upload", { data: payload }));

export default {
  uploadFile,
  deleteUploadedFile,
};
