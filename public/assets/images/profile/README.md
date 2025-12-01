# Imagens de Perfil (Profile)

Coloque aqui as imagens de perfil/wallpaper da barbearia, exibidas no círculo do topo do site.

- Tamanho recomendado: 800x800px (quadrado) para recorte circular nítido
- Formatos: .jpg, .png, .webp
- Nomes sugeridos (5 imagens iniciais):
  - profile-1.jpg
  - profile-2.jpg
  - profile-3.jpg
  - profile-4.jpg
  - profile-5.jpg

Como o projeto consome:
- As imagens são servidas via `/assets/images/profile/...` (pasta `public`).
- A lista inicial de imagens fica em `Client/src/data/profile.ts`.
- A imagem selecionada é controlada por `Client/src/context/ProfileContext.tsx` e persiste em `localStorage`, preparando terreno para a dashboard/backend futuros.
