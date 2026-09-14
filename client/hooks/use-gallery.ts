import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { getGalleryImages, uploadImage } from '../apis/gallery'

export function useGalleryImages() {
  const { getAccessTokenSilently } = useAuth0()

  return useQuery({
    queryKey: ['gallery'],
    queryFn: () => getGalleryImages(getAccessTokenSilently),
  })
}

export function useUploadImage() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: ({
      file,
      userId,
      caption,
    }: {
      file: File
      userId: string
      caption?: string
    }) => uploadImage(file, userId, getAccessTokenSilently, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
  })
}