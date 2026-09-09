// Accepted file size limit for image files
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
// Accepted file types for image files
export const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg']

export interface FileValidationResult {
  valid: boolean
  errorMessage?: string
}

export function validateImageFile(file: File): FileValidationResult {
  // Check if the file is empty or not provided
  if (!file || file.size === 0) {
    return { valid: false, errorMessage: 'The selected file is empty.' }
  }
  // check if the file type is accepted (PNG or JPG)
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      errorMessage: 'Only PNG or JPG images are supported.',
    }
  }
  // Check if the file size exceeds the maximum limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, errorMessage: 'Image must be 5MB or smaller.' }
  }

  return { valid: true }
}
