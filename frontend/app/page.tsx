
"use client";

import { useState } from "react";

const API = "http://localhost:4000";

interface Book {
  id: number;
  judul: string;
  penulis: string;
  stok: number;
}

interface Member {
  id: number;
  nama: string;
  username: string;
  kelas: string | null;
  role: string;
}

interface Transaction {
  id: number;
  nama: string;
  judul: string;
  tanggal_pinjam: string;
  tanggal_kembali: string | null;
  status: string;
}

export default function Home() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [menu, setMenu] = useState("books");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [bookId, setBookId] = useState<number | null>(null);
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [stok, setStok] = useState("0");

  const [memberId, setMemberId] = useState<number | null>(null);
  const [nama, setNama] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [kelas, setKelas] = useState("");

  async function request(path: string, method = "GET", body?: object) {
    const response = await fetch(`${API}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Permintaan gagal");
    }

    return result;
  }

  async function loadBooks() {
    const result = await request("/books");
    setBooks(result.data || []);
  }

  async function loadMembers() {
    const result = await request("/users");
    setMembers(result.data || []);
  }

  async function loadTransactions() {
    const result = await request("/transactions");
    setTransactions(result.data || []);
  }

  async function loadAll() {
    try {
      await loadBooks();

      if (role === "admin") {
        await Promise.all([loadMembers(), loadTransactions()]);
      } else {
        await loadTransactions();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat data");
    }
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login gagal");
      }

      const user = result.data;

      setToken(user.token);
      setRole(user.role);
      setMenu("books");
      setMessage(`Selamat datang, ${user.nama}`);

      const authToken = user.token;

      const bookResponse = await fetch(`${API}/books`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const bookResult = await bookResponse.json();

      if (!bookResponse.ok) {
        throw new Error(bookResult.message || "Gagal mengambil buku");
      }

      setBooks(bookResult.data || []);

      const transactionResponse = await fetch(`${API}/transactions`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const transactionResult = await transactionResponse.json();

      if (!transactionResponse.ok) {
        throw new Error(transactionResult.message || "Gagal mengambil transaksi");
      }

      setTransactions(transactionResult.data || []);

      if (user.role === "admin") {
        const memberResponse = await fetch(`${API}/users`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const memberResult = await memberResponse.json();

        if (!memberResponse.ok) {
          throw new Error(memberResult.message || "Gagal mengambil anggota");
        }

        setMembers(memberResult.data || []);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login gagal");
      setToken("");
      setRole("");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setRole("");
    setUsername("");
    setPassword("");
    setBooks([]);
    setMembers([]);
    setTransactions([]);
    setMessage("");
  }

  function resetBookForm() {
    setBookId(null);
    setJudul("");
    setPenulis("");
    setStok("0");
  }

  async function saveBook(e: React.FormEvent) {
    e.preventDefault();

    try {
      const body = {
        judul,
        penulis,
        stok: Number(stok),
      };

      if (bookId) {
        await request(`/books/${bookId}`, "PATCH", body);
        setMessage("Buku berhasil diperbarui");
      } else {
        await request("/books", "POST", body);
        setMessage("Buku berhasil ditambahkan");
      }

      resetBookForm();
      await loadBooks();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan buku");
    }
  }

  async function deleteBook(id: number) {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;

    try {
      await request(`/books/${id}`, "DELETE");
      setMessage("Buku berhasil dihapus");
      await loadBooks();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menghapus buku");
    }
  }

  function editBook(book: Book) {
    setBookId(book.id);
    setJudul(book.judul);
    setPenulis(book.penulis);
    setStok(String(book.stok));
    setMenu("books");
  }

  function resetMemberForm() {
    setMemberId(null);
    setNama("");
    setNewUsername("");
    setNewPassword("");
    setKelas("");
  }

  async function saveMember(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (!memberId && !newPassword) {
        setMessage("Password wajib diisi");
        return;
      }

      const body: Record<string, unknown> = {
        nama,
        username: newUsername,
        kelas,
        role: "siswa",
      };

      if (newPassword) body.password = newPassword;

      if (memberId) {
        await request(`/users/${memberId}`, "PATCH", body);
        setMessage("Anggota berhasil diperbarui");
      } else {
        await request("/users", "POST", body);
        setMessage("Anggota berhasil ditambahkan");
      }

      resetMemberForm();
      await loadMembers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan anggota");
    }
  }

  async function deleteMember(id: number) {
    if (!confirm("Yakin ingin menghapus anggota ini?")) return;

    try {
      await request(`/users/${id}`, "DELETE");
      setMessage("Anggota berhasil dihapus");
      await loadMembers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menghapus anggota");
    }
  }

  function editMember(member: Member) {
    setMemberId(member.id);
    setNama(member.nama);
    setNewUsername(member.username);
    setKelas(member.kelas || "");
    setNewPassword("");
    setMenu("members");
  }

  async function borrowBook(id: number) {
    if (!confirm("Pinjam buku ini?")) return;

    try {
      await request("/transactions", "POST", { id_books: id });
      setMessage("Buku berhasil dipinjam");
      await Promise.all([loadBooks(), loadTransactions()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Peminjaman gagal");
    }
  }

  async function returnBook(id: number) {
    if (!confirm("Kembalikan buku ini?")) return;

    try {
      await request(`/transactions/${id}/return`, "PATCH");
      setMessage("Buku berhasil dikembalikan");
      await Promise.all([loadBooks(), loadTransactions()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pengembalian gagal");
    }
  }

  async function deleteTransaction(id: number) {
    if (!confirm("Hapus transaksi ini?")) return;

    try {
      await request(`/transactions/${id}`, "DELETE");
      setMessage("Transaksi berhasil dihapus");
      await loadTransactions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menghapus transaksi");
    }
  }

  const filteredBooks = books.filter((book) =>
    `${book.judul} ${book.penulis}`.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) {
    return (
      <main className="login-page">
        <form className="login-box" onSubmit={login}>
          <h2>Perpustakaan</h2>
          <p>Silakan login untuk melanjutkan.</p>

          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <h2>Perpustakaan</h2>
          <p>{role === "admin" ? "Administrator" : "Siswa"}</p>
        </div>
        <button className="secondary" onClick={logout}>Logout</button>
      </header>

      {message && <div className="message">{message}</div>}

      <nav className="navigation">
        <button onClick={() => setMenu("books")}>Daftar Buku</button>
        <button onClick={() => setMenu("transactions")}>Transaksi</button>

        {role === "admin" && (
          <>
            <button onClick={() => setMenu("members")}>Kelola Anggota</button>
          </>
        )}

        <button className="secondary" onClick={loadAll}>Refresh</button>
      </nav>

      {menu === "books" && (
        <section>
          <h3>{role === "admin" ? "Kelola Data Buku" : "Katalog Buku"}</h3>

          <input
            className="search"
            placeholder="Cari judul atau penulis buku..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {role === "admin" && (
            <form className="form" onSubmit={saveBook}>
              <h4>{bookId ? "Edit Buku" : "Tambah Buku"}</h4>

              <input
                placeholder="Judul buku"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
              />

              <input
                placeholder="Nama penulis"
                value={penulis}
                onChange={(e) => setPenulis(e.target.value)}
                required
              />

              <input
                type="number"
                min="0"
                placeholder="Stok"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                required
              />

              <button type="submit">{bookId ? "Simpan Perubahan" : "Tambah Buku"}</button>

              {bookId && (
                <button type="button" className="secondary" onClick={resetBookForm}>
                  Batal
                </button>
              )}
            </form>
          )}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Judul</th>
                  <th>Penulis</th>
                  <th>Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.judul}</td>
                    <td>{book.penulis}</td>
                    <td>{book.stok}</td>
                    <td>
                      {role === "admin" ? (
                        <>
                          <button onClick={() => editBook(book)}>Edit</button>
                          <button className="danger" onClick={() => deleteBook(book.id)}>
                            Hapus
                          </button>
                        </>
                      ) : (
                        <button
                          disabled={book.stok <= 0}
                          onClick={() => borrowBook(book.id)}
                        >
                          {book.stok > 0 ? "Pinjam" : "Stok Habis"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredBooks.length === 0 && (
                  <tr><td colSpan={5}>Buku tidak ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {menu === "transactions" && (
        <section>
          <h3>{role === "admin" ? "Semua Transaksi" : "Riwayat Peminjaman Saya"}</h3>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {role === "admin" && <th>Nama Siswa</th>}
                  <th>Judul Buku</th>
                  <th>Tanggal Pinjam</th>
                  <th>Tanggal Kembali</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    {role === "admin" && <td>{transaction.nama}</td>}
                    <td>{transaction.judul}</td>
                    <td>{transaction.tanggal_pinjam}</td>
                    <td>{transaction.tanggal_kembali || "-"}</td>
                    <td>{transaction.status}</td>
                    <td>
                      {transaction.status === "dipinjam" && (
                        <button onClick={() => returnBook(transaction.id)}>
                          Kembalikan
                        </button>
                      )}

                      {role === "admin" && transaction.status === "dikembalikan" && (
                        <button
                          className="danger"
                          onClick={() => deleteTransaction(transaction.id)}
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={role === "admin" ? 6 : 5}>
                      Belum ada transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {menu === "members" && role === "admin" && (
        <section>
          <h3>Kelola Anggota</h3>

          <form className="form" onSubmit={saveMember}>
            <h4>{memberId ? "Edit Anggota" : "Tambah Anggota"}</h4>

            <input
              placeholder="Nama lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />

            <input
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder={memberId ? "Password baru (kosongkan jika tidak diubah)" : "Password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required={!memberId}
            />

            <input
              placeholder="Kelas"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              required
            />

            <button type="submit">{memberId ? "Simpan Perubahan" : "Tambah Anggota"}</button>

            {memberId && (
              <button type="button" className="secondary" onClick={resetMemberForm}>
                Batal
              </button>
            )}
          </form>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>Kelas</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {members.filter((member) => member.role === "siswa").map((member) => (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{member.nama}</td>
                    <td>{member.username}</td>
                    <td>{member.kelas || "-"}</td>
                    <td>
                      <button onClick={() => editMember(member)}>Edit</button>
                      <button className="danger" onClick={() => deleteMember(member.id)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}

                {members.filter((member) => member.role === "siswa").length === 0 && (
                  <tr><td colSpan={5}>Belum ada anggota.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
