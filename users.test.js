const { expect } = require("chai"); // Ini mengimpor library assertion Chai

describe("Reqres API Automation Tests", () => { // Ini adalah blok utama untuk mengelompokkan semua test Anda

    let createdUserId; // Variabel ini akan kita gunakan untuk menyimpan ID pengguna yang baru dibuat

    // --- TEST GET: Dapatkan daftar pengguna dari halaman 2 ---
    it("should get a list of users successfully", async () => {
        // Mengirim GET request ke API
        const response = await fetch("https://reqres.in/api/users?page=2");
        // Mengubah respons menjadi format JSON
        const data = await response.json();

        // Assertion: Memverifikasi status code 200 OK
        expect(response.status).to.equal(200);
        // Assertion: Memverifikasi bahwa properti 'data' adalah sebuah array
        expect(data.data).to.be.an('array');
        // Assertion: Memverifikasi bahwa array 'data' tidak kosong
        expect(data.data.length).to.be.above(0);
        // Assertion: Memverifikasi bahwa nomor halaman yang dikembalikan adalah 2
        expect(data.page).to.equal(2);
    });

    // --- TEST POST: Membuat pengguna baru ---
    it("should create a new user successfully", async () => {
        const newUser = {
            name: "Putri Nurani",
            job: "QA Engineer"
        };

        // Mengirim POST request ke API
        const response = await fetch("https://reqres.in/api/users", {
            method: "POST", // Metode HTTP POST
            headers: {
                "Content-Type": "application/json", // Memberitahu server bahwa kita mengirim JSON
                "x-api-key": "reqres-free-v1" // <--- API Key ditambahkan di sini
            },
            body: JSON.stringify(newUser) // Mengubah objek newUser menjadi string JSON
        });

        const data = await response.json();

        // Assertion: Memverifikasi status code 201 Created (karena API Key sudah ada)
        expect(response.status).to.equal(201);
        // Assertion: Memverifikasi nama dan pekerjaan yang dikirimkan sesuai
        expect(data.name).to.equal(newUser.name);
        expect(data.job).to.equal(newUser.job);
        // Assertion: Memverifikasi bahwa respons memiliki properti 'id' (yang menandakan pengguna berhasil dibuat)
        expect(data).to.have.property('id');

        createdUserId = data.id; // Simpan ID pengguna yang baru dibuat untuk test selanjutnya (PATCH/DELETE)
        console.log(`Created User ID: ${createdUserId}`); // Tampilkan ID di konsol
    });

    // --- TEST PATCH: Memperbarui sebagian data pengguna ---
    it("should update a user successfully", async () => {
        // Asumsi createdUserId sudah ada karena test POST berhasil
        const updatedUserData = {
            job: "Senior QA Engineer"
        };

        // Mengirim PATCH request ke API menggunakan ID pengguna yang sudah dibuat
        const response = await fetch(`https://reqres.in/api/users/${createdUserId}`, {
            method: "PATCH", // Metode HTTP PATCH
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "reqres-free-v1" // <--- API Key ditambahkan di sini
            },
            body: JSON.stringify(updatedUserData)
        });

        const data = await response.json();

        // Assertion: Memverifikasi status code 200 OK
        expect(response.status).to.equal(200);
        // Assertion: Memverifikasi bahwa pekerjaan (job) sudah diperbarui
        expect(data.job).to.equal(updatedUserData.job);
        // Penting: reqres.in tidak mengembalikan seluruh data untuk PATCH, hanya yang di-update.
        // Jadi, kita tidak bisa meng-assert data.name di sini.
    });

    // --- TEST DELETE: Menghapus pengguna ---
    it("should delete a user successfully", async () => {
        // Asumsi createdUserId sudah ada karena test POST berhasil

        // Mengirim DELETE request ke API menggunakan ID pengguna yang sudah dibuat
        const response = await fetch(`https://reqres.in/api/users/${createdUserId}`, {
            method: "DELETE", // Metode HTTP DELETE
            headers: { // <--- Tambahkan blok headers ini
                "x-api-key": "reqres-free-v1" // <--- API Key ditambahkan di sini
            }
        });

        // Assertion: Memverifikasi status code 204 No Content (biasanya untuk DELETE sukses)
        expect(response.status).to.equal(204);
        // Untuk DELETE, body respons biasanya kosong, jadi tidak perlu assert data
    });

});