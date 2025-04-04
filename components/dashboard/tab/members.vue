<template>
  <DashboardTabBase title="Members">
    <div class="overflow-x-auto" v-if="status === 'success'">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <th>Membre</th>
            <th>Rôles</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="member in data?.items" :key="member.id">
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <td>
              <div class="flex items-center gap-3">
                <!-- <div class="avatar">
                  <div class="mask mask-squircle h-12 w-12">
                    <img src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                      alt="Avatar Tailwind CSS Component" />
                  </div>
                </div> -->
                <div>
                  <div class="font-bold">{{ member.firstName }} {{ member.lastName }}</div>
                  <div class="text-sm opacity-50">{{ member.email }}</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-center items-center flex-1" v-else>
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  </DashboardTabBase>
</template>

<script lang="ts" setup>

const { activeAssociationId } = useDashboardStore();

const { data, status } = await useFetch(() => `/api/association/${activeAssociationId}/members`);

</script>

<style>

</style>