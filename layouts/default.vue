<template>
  <AppLoader>
    <div class="min-h-screen flex flex-col">
      <MainHeader />
      <slot />
      <MainFooter />
    </div>
  </AppLoader>
</template>
