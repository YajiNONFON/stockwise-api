import cloudinary from "./cloudinary";

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "limit" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        },
      )
      .end(buffer);
  });
}

/*
 * FLOW OVERVIEW — upload.service.ts
 *
 * Uploads an image buffer to Cloudinary and returns the public URL.
 *
 * Uses upload_stream (not the file-based upload) because we're working
 * with a Buffer directly — no temp file written to disk.
 *
 * Two transformations are applied automatically on upload:
 * - Resize to max 400×400 (crop: "limit" means it won't upscale smaller images)
 * - Quality set to "auto" so Cloudinary picks the best compression level
 *
 * The folder and publicId params let the caller control where the file lands
 * in Cloudinary (e.g. folder: "logos", publicId: userId).
 * Returns the secure HTTPS URL once the upload is confirmed.
 */
