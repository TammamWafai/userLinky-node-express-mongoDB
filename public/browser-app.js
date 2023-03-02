document.addEventListener("DOMContentLoaded", () => {
  const registerFormDOM = document.querySelector('.registerForm')
  const loginFormDOM = document.querySelector('.loginForm')
  const emailInputDOM = document.querySelector('.email-input')
  const passwordInputDOM = document.querySelector('.password-input')

  const registerNameInputDOM = document.querySelector('.register-name-input')
  const registerEmailInputDOM = document.querySelector('.register-email-input')
  const registerPasswordInputDOM = document.querySelector('.register-password-input')

  const formAlertDOM = document.querySelector('.form-alert')
  const resultDOM = document.querySelector('.result')
  // const btnDOM = document.querySelector('#data')
  const tokenDOM = document.querySelector('.token')
  const btnRegister = document.querySelector('.registerBtn')
  const btnLogin = document.querySelector('.loginBtn')

  const submitRegisterBtn = document.querySelector('.submitRegister')
  const submitLoginBtn = document.querySelector('.submitLogin')


  document.addEventListener("click", async (e) => {
    if (e.target === submitRegisterBtn) {
      console.log(registerNameInputDOM.value, registerEmailInputDOM.value, registerPasswordInputDOM.value);
      try {
        alert('Try Submit reg')
        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerNameInputDOM.value,
            email: registerEmailInputDOM.value,
            password: registerPasswordInputDOM.value,
          }),
        })
        alert("Done POST")
        const data = await response.json()
        alert("after data await")
        if (response.status === 201) {
          alert('status code =201')
          // message.textContent = `Registration successful.  Welcome ${data.user.name}`;
          token = data.token;
          localStorage.setItem("token", token);
          // showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
          registerNameInputDOM.value = "";
          registerEmailInputDOM.value = "";
          registerPasswordInputDOM.value = "";
        } else {
          alert(data.msg);
        }
      } catch (err) {
        alert("A communications error occurred.")
      }
    }

    else if (e.target === submitLoginBtn) {
      alert('Login submit clicked')
    }
  })
  // // let showForm = ''

  // document.onload = codeAddress();
  // function codeAddress() {

  //   // if (showForm === 'login') {
  //   //   console.log('LOGIN')
  //   //   registerFormDOM.style.display = 'none'
  //   //   loginFormDOM.style.display = 'block'
  //   // } else if (showForm === 'register') {

  //   //   console.log('REGISTER')
  //   //   registerFormDOM.style.display = 'block'
  //   //   loginFormDOM.style.display = 'none'
  //   // }

  // }

  loginFormDOM.addEventListener('submit', async (e) => {
    cosole.log("REACT ", email, password)
    const { username } = await axios.get(`/username`, { email, password })
      .then(response => {
        console.log(response)
      })
    alert(username)

    formAlertDOM.classList.remove('text-success')
    tokenDOM.classList.remove('text-success')

    e.preventDefault()
    const email = emailInputDOM.value
    const password = passwordInputDOM.value

    try {

      const { data } = await axios.post(`/${email}/dashboard`, { email, password })

      formAlertDOM.style.display = 'block'
      formAlertDOM.textContent = data.msg

      formAlertDOM.classList.add('text-success')
      emailInputDOM.value = ''
      passwordInputDOM.value = ''

      localStorage.setItem('token', data.token)
      resultDOM.innerHTML = ''
      tokenDOM.textContent = 'token present'
      tokenDOM.classList.add('text-success')
    } catch (error) {
      formAlertDOM.style.display = 'block'
      formAlertDOM.textContent = error.response.data.msg
      localStorage.removeItem('token')
      resultDOM.innerHTML = ''
      tokenDOM.textContent = 'no token present'
      tokenDOM.classList.remove('text-success')
    }
    setTimeout(() => {
      formAlertDOM.style.display = 'none'
    }, 2000)
  })

  btnRegister.addEventListener('click', async (e) => {
    loginFormDOM.style.display = 'none'
    registerFormDOM.style.display = 'block'
  })

  btnLogin.addEventListener('click', async (e) => {
    loginFormDOM.style.display = 'block'
    registerFormDOM.style.display = 'none'
  })

  // btnDOM.addEventListener('click', async () => {
  //   const token = localStorage.getItem('token')
  //   try {
  //     const { data } = await axios.get('/api/v1/dashboard', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     resultDOM.innerHTML = `<h5>${data.msg}</h5><p>${data.secret}</p>`

  //     data.secret
  //   } catch (error) {
  //     localStorage.removeItem('token')
  //     resultDOM.innerHTML = `<p>${error.response.data.msg}</p>`
  //   }
  // })

  // const checkToken = () => {
  //   tokenDOM.classList.remove('text-success')

  //   const token = localStorage.getItem('token')
  //   if (token) {
  //     tokenDOM.textContent = 'token present'
  //     tokenDOM.classList.add('text-success')
  //   }
  // }

  // checkToken()

})