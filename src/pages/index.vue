<script setup lang="ts">
import { useDarkmode } from '/@src/stores/darkmode'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import { useApi } from '../utils/api'
// import { error } from 'node:console'
import { useRouter } from 'vue-router'
const isLoading = ref(false)
const darkmode = useDarkmode()
const router = useRouter()
const route = useRoute()
const notyf = useNotyf()
const userSession = useUserSession()
const redirect = route.query.redirect as string
const payload = reactive({
  email: '',
  password: '',
})

// onMounted(() => {
//   if(localStorage.gettItem('token')){
//     if(localStorage.getItem('user_type') == 'doctor'){
//       router.push('/doctors/appointments')
//     }
//     else
//     if(localStorage.getItem('user_type') == 'pharm'){
//       router.push('/pharm')
//     }
//   }
// })
const handleLogin = async () => {
  isLoading.value = true
  const { post, data, error } = useApi('/auth/login', false)
  const Login = () => { 
    post(payload)  
      .then((res) => {
        isLoading.value = false
        userSession.setToken(JSON.parse(JSON.stringify(data.value)).result.token)
        userSession.setUser(JSON.parse(JSON.stringify(data.value)).result)
        if (redirect) {
          router.push(redirect) 
        } else { 
          if (JSON.parse(JSON.stringify(data.value)).result.user_type == 'admin') {
            router.push('/admin/dashboard')
          } else if ( 
            JSON.parse(JSON.stringify(data.value)).result.user_type == 'doctor'
          ) {
            router.push('/doctors/appointments')
          }
          else if ( 
            JSON.parse(JSON.stringify(data.value)).result.user_type == 'pharm'
          ) {
            router.push('/pharm')
          }
          else if( JSON.parse(JSON.stringify(data.value)).result.user_type == 'pharm'){
            router.push('/doctors/pharm')
          }
        }
      })
      .catch(() => {
        isLoading.value = false
        notyf.error(error.value)
      })
  }
  Login()
}
watch(() => payload.email, (newValue) => {
  console.log('Email:', newValue);
});

watch(() => payload.password, (newValue) => {
  console.log('Password:', newValue);
});

useHead({
  title: 'Auth Login - Vuero',
})
</script>

<template>
  <div class="auth-wrapper-inner columns is-gapless image-bg-ero">
    <!-- Image section (hidden on mobile) -->
    <div class="column  image-bg login-column is-8 h-hidden-mobile h-hidden-tablet-p hero-banner">
      <div class="hero login-hero is-fullheight is-app-grey">
        <div
          class="hero-body"
          style="width: 100%; height: 100%;"
        >
          <div
            class="
          columns"
            style="width: 100%; height: 100%;"
          >
            <div
              class="column image-bg is-10 is-offset-1"
              style=" width: 100%;"
            >
              <!-- <img
                class="light-image  has-light-shadow has-light-border"
                src="/@src/assets/illustrations/university.jpeg"
                alt=""
              > -->
              <!-- <img
                class="dark-image has-light-shadow"
                src="/@src/assets/illustrations/apps//@src/assets/illustrations/university.jpeg"
                alt=""
              > -->
            </div>
          </div>
        </div>
        <div class="hero-footer">
          <p class="has-text-centered" />
        </div>
      </div>
    </div>

    <!-- Form section -->
    <div class="column is-4">
      <div class="hero is-fullheight is-white">
        <div class="hero-heading">
          <label
            class="dark-mode ml-auto"
            tabindex="0"
            role="button"
            @keydown.space.prevent="(e) => (e.target as HTMLLabelElement).click()"
          >
            <input
              type="checkbox"
              :checked="!darkmode.isDark"
              @change="darkmode.onChange"
            >
            <span />
          </label>
          <div class="auth-logo">
            <RouterLink to="/">
              <!-- <AnimatedLogo
                width="36px"
                height="36px"
              /> -->
              <img
                src="/src/assets/illustrations/futalogo.png"
                width="150"
                height="150"
                alt=""
              >
            </RouterLink>
          </div>
        </div>
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-12">
                <div class="auth-content">
                  <h2>Welcome Back.</h2>
                  <p>Please sign in to your account</p>
                  <RouterLink to="/auth/signup-2">
                    I do not have an account yet
                  </RouterLink>
                </div>
                <div class="auth-form-wrapper">
                  <!-- Login Form -->
                  <form
                    method="post"
                    novalidate
                    @submit.prevent="handleLogin"
                  >
                    <div class="login-form">
                      <!-- Username -->
                      <VField>
                        <VControl icon="feather:user">
                          <VInput
                            v-model="payload.email"
                            type="email"
                            placeholder="email"
                            autocomplete="email"
                          />
                        </VControl>
                      </VField>

                      <!-- Password -->
                      <VField>
                        <VControl icon="feather:lock">
                          <VInput
                            v-model="payload.password"
                            type="password"
                            placeholder="Password"
                            autocomplete="current-password"
                          />
                        </VControl>
                      </VField>

                      <!-- Switch -->
                      <VField>
                        <VControl class="setting-item">
                          <VCheckbox
                            label="Remember me"
                            paddingless
                          />
                        </VControl>
                      </VField>

                      <!-- Submit -->
                      <div class="login">
                        <VButton
                          :loading="isLoading"
                          color="primary"
                          type="submit"
                          bold
                          fullwidth
                          raised
                        >
                          Sign In
                        </VButton>
                      </div>

                      <div class="forgot-link has-text-centered">
                        <a>Forgot Password?</a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.image-bg-ero{
  background-image: url("/@src/assets/illustrations/university.jpeg")
}
.image-bg{
  width: 100%;
  height: 100%;
  object-fit: center;
  background-position: center;
  // background-color: red;
  img{

    width: 100%;
    height: 100%;
  }
}
.auth-wrapper-inner {
  overflow: hidden !important;
  height: 100%;
  padding: 0;
  margin: 0;

  &.is-gapless:not(:last-child) {
    margin-bottom: 0 !important;
  }

  &.is-single {
    background: var(--widget-grey);
    min-height: 100vh;
  }

  .hero-banner {
    background: var(--widget-grey);
  }

  .hero-heading {
    position: relative;
    max-width: 360px;
    width: 100%;
    margin: 0 auto;
    padding: 20px 0 0;

    .dark-mode {
      position: absolute;
      top: 24px;
      inset-inline-end: 24px;
      transform: scale(0.6);
      z-index: 2;
    }

    .auth-logo {
      display: flex;
      justify-content: center;

      svg {
        height: 42px;
        width: 42px;
      }

      .top-logo {
        height: 42px;
      }
    }
  }

  .hero {
    &.is-white {
      background: var(--white);
    }

    .hero-body {
      .login {
        padding: 10px 0;
      }

      .auth-content {
        max-width: 320px;
        width: 100%;
        margin: 0 auto;
        margin-top: -40px;
        margin-bottom: 40px;

        h2 {
          font-size: 2rem;
          font-family: var(--font);
          line-height: 1;
        }

        p {
          font-size: 1rem;
          margin-bottom: 8px;
          color: var(--muted-grey);
        }

        a {
          font-size: 0.9rem;
          font-family: var(--font-alt);
          font-weight: 500;
          color: var(--primary);
        }
      }

      .auth-form-wrapper {
        max-width: 320px;
        width: 100%;
        margin: 0 auto;
      }
    }
  }

  .forgot-link {
    margin-top: 10px;

    a {
      font-family: var(--font-alt);
      font-size: 0.9rem;
      color: var(--light-text);
      transition: color 0.3s;

      &:hover,
      &:focus {
        color: var(--primary);
      }
    }
  }

  .setting-item {
    display: flex;
    align-items: center;
    padding: 10px 0;

    .setting-meta {
      font-family: var(--font);
      color: var(--light-text);
      margin-inline-start: 8px;
    }
  }

  .v-button {
    min-height: 44px;
  }
}

.is-dark {
  .auth-wrapper-inner {
    .hero-banner {
      background: var(--dark-sidebar-light-4);
    }

    .hero {
      &.is-white {
        background: var(--dark-sidebar-dark-4);
      }

      .hero-body {
        .auth-content {
          h2 {
            color: var(--dark-dark-text);
          }

          a {
            color: var(--primary);
          }
        }
      }
    }

    .forgot-link {
      a:hover {
        color: var(--primary);
      }
    }
  }
}

.auth-nav {
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .left,
  .right {
    display: flex;
    align-items: center;
    width: 20%;
  }

  .right {
    justify-content: flex-end;

    .dark-mode {
      transform: scale(0.7);
    }
  }

  .center {
    flex-grow: 2;

    a {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        display: block;
        width: 100%;
        max-width: 50px;
      }
    }
  }
}

.auth-wrapper-inner {
  .single-form-wrap {
    min-height: 690px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    .inner-wrap {
      width: 100%;
      max-width: 400px;
      margin: 40px auto 0;

      .auth-head {
        max-width: 320px;
        width: 100%;
        margin: 0 auto;
        margin-bottom: 20px;
        text-align: center;

        h2 {
          font-size: 2rem;
          font-family: var(--font);
          line-height: 1;
        }

        p {
          font-size: 1rem;
          margin-bottom: 8px;
          color: var(--muted-grey);
        }

        a {
          font-size: 0.9rem;
          font-family: var(--font-alt);
          font-weight: 500;
          color: var(--primary);
        }
      }

      .form-card {
        background: var(--white);
        border: 1px solid var(--fade-grey-dark-3);
        border-radius: 10px;
        padding: 50px;
        margin-bottom: 16px;

        .v-button {
          margin-top: 10px;
        }
      }
    }
  }
}

.is-dark {
  .auth-wrapper-inner {
    &.is-single {
      background: var(--dark-sidebar-light-4);

      .single-form-wrap {
        .inner-wrap {
          .auth-head {
            h2 {
              color: var(--dark-dark-text);
            }

            a {
              color: var(--primary);
            }
          }

          .form-card {
            background: var(--dark-sidebar-dark-4);
            border-color: var(--dark-sidebar-light-1);
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .avatar-carousel {
    &.resized-mobile {
      max-width: 300px;
    }

    .slick-custom {
      display: none !important;
    }

    .image-wrapper img {
      height: auto;
    }
  }

  .auth-wrapper-inner {
    .hero {
      .hero-body {
        .auth-content {
          text-align: center !important;
        }
      }
    }

    .single-form-wrap {
      .inner-wrap {
        .form-card {
          padding: 40px;
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .modern-login {
    .top-logo {
      svg {
        height: 60px;
        width: 60px;
      }
    }

    .dark-mode {
      top: -58px;
      inset-inline-end: 30%;
    }

    .columns {
      display: flex;
      height: 100vh;
    }
  }

  .auth-wrapper-inner {
    .hero {
      .hero-body {
        .auth-content {
          text-align: center !important;
        }
      }
    }
  }

  .signup-columns {
    max-width: 460px;
    margin: 0 auto;
  }
}
</style>
