// Buat Show Password
document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.querySelector("#togglePassword");
  const togglePasswordConfirm = document.querySelector("#togglePasswordConfirm");
  const passwordInput = document.querySelector("#userPassword");
  const passwordConfirm = document.querySelector("#userPasswordConfirm");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.querySelector("i").classList.toggle("bi-eye");
      this.querySelector("i").classList.toggle("bi-eye-slash");
    });
  }

  if (togglePasswordConfirm && passwordConfirm) {
    togglePasswordConfirm.addEventListener("click", () => {
      const type = passwordConfirm.getAttribute("type") === "password" ? "text" : "password";
      passwordConfirm.setAttribute("type", type);
      this.querySelector("i").classList.toggle("bi-eye");
      this.querySelector("i").classList.toggle("bi-eye-slash");
    });
  }
});

// Buat Confirm Password
// document.addEventListener("DOMContentLoaded", function () {
//   const form = document.querySelector("form");
//   const passwordInput = document.querySelector("#userPassword");
//   const passwordConfirm = document.querySelector("userPasswordConfirm");

//   form.addEventListener('submit', function (e))
//   if (passwordInput != passwordConfirm) {
//     var error = document.querySelector("#passwordError");
//     error.set;
//   }
// });
