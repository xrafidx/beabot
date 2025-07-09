import * as authServices from "../services/auth.services.js";

export async function login(req, res, next) {
  const email = req.body.email;
  const plainPassword = req.body.password;
  try {
    const userData = await authServices.verifyUser(email, plainPassword);
    const accessToken = authServices.craftToken(userData); // Lebih baik pakai nama 'accessToken' atau 'token'
    res.cookie("accessToken", accessToken, {
      // <-- Perbaikan di sini, gunakan 'accessToken'
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Hanya secure di production
      sameSite: "Lax",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 hariSSSSS
    });

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      // Opsi: Kirim data user yang relevan (tanpa password)
      user: {
        id: userData.id, // Asumsikan userData memiliki id
        email: userData.email,
        name: userData.name, // Asumsikan userData memiliki name
      },
    });
    // res.redirect('/dashboard');

  } catch (error) {
    if(error.message === 'Email atau password salah'){
      return res.status(401).json({
        success: false,
        message: "Email atau password yang Anda masukkan salah."
      });
    }
    else{
      next(error); // Untuk error yang tidak ditangani secara spesifik, kirim ke error handling middleware
    }
  }
}

export async function register(req, res, next) {
  const { name, email, password: plainPassword } = req.body;
  try {
    let newUser = await authServices.newUser(name, email, plainPassword);
    const accessToken = authServices.craftToken(newUser); // Menggunakan accessToken untuk konsistensi

    res.cookie("accessToken", accessToken, {
      // <-- Perbaikan di sini, gunakan 'accessToken'
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Hanya secure di production
      sameSite: "Lax",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 hari
    });

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      // Opsi: Kirim data user yang baru terdaftar
      user: {
        id: newUser.id, // Asumsikan newUser memiliki id
        email: newUser.email,
        name: newUser.name,
      },
    });
    // res.redirect('/dashboard');
  } catch (error) {
    // Penting: Tangani error spesifik di sini
    // Contoh: if (error.message === 'Email already exists') res.status(409).json({ message: 'Email sudah terdaftar' });
    // else next(error);
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const token = req.cookies.accessToken;
    const result = authServices.blacklistToken(token); // Pastikan ini menghapus cookie juga
    // Menghapus cookie di sisi client
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    res.status(200).json({
      success: true,
      message: "Logout berhasil.",
    });
    // res.redirect('/login');
  } catch (error) {
    next(error);
  }
}


