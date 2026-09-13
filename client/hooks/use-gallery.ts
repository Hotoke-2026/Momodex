import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGalleryImages, uploadImage } from '../apis/gallery'

export function useGalleryImages() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: getGalleryImages,
  })
}

export function useUploadImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      file,
      userId,
      caption,
    }: {
      file: File
      userId: string
      caption?: string
    }) => uploadImage(file, userId, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
  })
}
