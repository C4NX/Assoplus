<template>
  <div
    class="h-screen flex items-center justify-center bg-cover bg-center bg-[url('pexels-juan-pablo-guardia-137931772-18504011.jpg')]">
    <div class="w-full h-full flex flex-col justify-center items-center backdrop-blur-lg">
      <form class="card bg-base-100 shadow-xl p-8 w-96 flex gap-2 flex-col" @submit.prevent="handleLogin">
        <h1 class="text-2xl font-bold mb-4 text-center">{{ $t('login.title') }}</h1>
        <label class="input input-bordered flex items-center gap-2">
          <Icon name="mdi:email" />
          <input type="email" class="grow" placeholder="Email" required v-model="loginForm.email" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <Icon name="mdi:lock" />
          <input type="password" class="grow" placeholder="Password" required v-model="loginForm.password" />
        </label>
        <div class="flex">
          <button class="btn btn-primary flex-1">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from 'vue3-toastify';

const authStore = useAuthStore();
const { t } = useI18n();
const router = useRouter();

const loginForm = reactive({
  email: '',
  password: '',
});

const handleLogin = async () => {
  if (await authStore.login(loginForm.email, loginForm.password)) {
    toast.success(t('login.success'));
    router.push('/');
  } else {
    toast.error(t('login.error'));
  }
};

</script>

<style></style>