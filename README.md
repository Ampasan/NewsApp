# News App

## Informasi Mahasiswa

- Nama : Naufal Rakan Ramadhan
- NIM : 2410501042

## Deskripsi Aplikasi

Aplikasi ini adalah aplikasi berita berbasis React Native (Expo) yang menampilkan daftar berita terbaru dari berbagai kategori. Pengguna dapat mencari berita, menyaring hasil berdasarkan sumber dan rentang waktu, membuka artikel asli melalui tautan, menyimpan artikel favorit ke bookmark, serta membagikan artikel ke aplikasi lain. Aplikasi juga mendukung tema terang/gelap untuk kenyamanan penggunaan.

## Fitur yang Diimplementasikan

- Menampilkan berita terbaru per kategori (Umum, Teknologi, Olahraga, Bisnis, Kesehatan).
- Pencarian berita dengan debounce (aktif saat input minimal 3 karakter).
- Filter berita berdasarkan sumber (source) dan rentang waktu publikasi (24 jam, 7 hari, 30 hari).
- Menyimpan dan menghapus artikel dari bookmark (disimpan lokal dengan AsyncStorage).
- Halaman khusus Bookmark untuk melihat artikel yang telah disimpan.
- Membagikan artikel ke aplikasi lain menggunakan fitur share.
- Tema light/dark.

## Screenshot

### Home Screen
<p align="center">
  <img src="https://res.cloudinary.com/drrmbeiyk/image/upload/v1775832466/home_dbaqfw.webp" alt="home" width="250" />
</p>

### Search News
<p align="center">
  <img src="https://res.cloudinary.com/drrmbeiyk/image/upload/v1775832466/search_ntkldq.webp" alt="search" width="250" />
</p>

### Bookmark
<p align="center">
  <img src="https://res.cloudinary.com/drrmbeiyk/image/upload/v1775832466/bookmark_byrif7.webp" alt="book" width="250" />
</p>

## Cara Menjalankan

```bash
npm install && npx expo start
```
