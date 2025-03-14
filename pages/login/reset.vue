<template>
  <AuthFormBase
    title="login.reset.title"
    :handle-login="() => {}"
    :hide-o-auth-login="true"
  >
    <label class="input input-bordered flex items-center gap-2">
      <Icon name="mdi:lock" />
      <input
        type="password"
        class="grow"
        :placeholder="$t('login.placeholder.email')"
        required
      >
    </label>
    <button
      class="btn btn-primary flex-1"
      type="submit"
    >
      {{ $t("login.reset.submit") }}
    </button>
  </AuthFormBase>
</template>

<script lang="ts" setup>
</script>

<style></style>
