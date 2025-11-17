# SIMS PPOB API

Aplikasi backend untuk SIMS PPOB API yang dibuat menggunakan NodeJS, ExpressJS, dan MySQL

## Fitur Utama

-   Autentikasi JWT (login, register)
-   Upload file menggunakan Multer
-   Validasi input menggunakan Joi
-   Logging menggunakan Winston
-   Password hasing menggunakan bcrypt
-   Konfigurasi environment menggunakan dotenv
-   Modular folder structure (controller, route, middleware, utils)

## **Clone repository**

```bash
git clone https://github.com/mfauzi-dev/sims-ppob-api
```

## **Setup Project Baru**

1. **Rename folder sesuai project baru**

    ```bash
    mv sims-ppob-api my-new-project
    cd my-new-project
    ```

2. **Hapus riwayat Git lama**

    ```bash
    rm -rf .git
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

4. **Buat folder uploads untuk menyimpan file yang di-upload**

    ```bash
    mkdir uploads
    ```

5. **Buat file .env berdasarkan .env.example**

    ```bash
    cp .env.example .env
    ```

6. **Jalankan project**

    ```bash
    npm run dev
    ```

7. **Jalankan seeder banner**

    ```bash
    node src/seeders/bannerSeeder.js
    ```

8. **Jalankan seeder service**
    ```bash
    node src/seeders/serviceSeeder.js
    ```

## Teknologi

-   Express.js

-   MySQL

-   JWT

-   bcrypt

## Lisensi

Proyek ini menggunakan lisensi MIT.  
Lihat file [LICENSE](LICENSE) untuk detailnya.
