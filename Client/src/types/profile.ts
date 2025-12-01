export type ProfileImage = {
  id: string
  label?: string
  url: string
}

export type ProfileConfig = {
  images: ProfileImage[]
  selectedId?: string
}
