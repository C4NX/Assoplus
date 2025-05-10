<template>
  <input
    v-model="isModalOpen"
    type="checkbox"
    class="modal-toggle"
  >
  <form
    class="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    @submit.prevent="handleSubmit"
  >
    <div class="modal-box w-11/12 max-w-5xl">
      <h3
        id="modal-title"
        class="font-bold text-lg"
      >
        {{ isModalEdit ? $t('dashboard.donations.edit') : $t('dashboard.donations.create') }}
      </h3>

      <div class="py-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <!-- Amount -->
          <div class="form-control">
            <label
              for="amount"
              class="label"
            >
              <span class="label-text">
                {{ $t('dashboard.donations.amount') }}
              </span>
              <span class="label-text-alt text-error">
                *
              </span>
            </label>
            <input
              id="amount"
              v-model="modalDonation.amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              class="input input-bordered input-sm w-full"
            >
          </div>

          <!-- Currency -->
          <div class="form-control">
            <label
              for="currency"
              class="label"
            >
              <span class="label-text">
                {{ $t('dashboard.donations.currency') }}
              </span>
              <span class="label-text-alt text-error">
                *
              </span>
            </label>
            <select
              id="currency"
              v-model="modalDonation.currency"
              class="select select-bordered select-sm w-full"
            >
              <option
                v-for="currency of Intl.supportedValuesOf('currency')"
                :key="currency"
                :value="currency"
              >
                {{ currency }}
              </option>
            </select>
          </div>

          <!-- Donor Name -->
          <div class="form-control">
            <label
              for="donorName"
              class="label"
            >
              <span class="label-text">
                {{ $t('dashboard.donations.donor_name') }}
              </span>
              <span class="label-text-alt text-error">
                *
              </span>
            </label>
            <input
              id="donorName"
              v-model="modalDonation.donorName"
              type="text"
              placeholder="John Doe"
              class="input input-bordered input-sm w-full"
            >
          </div>

          <!-- Donor Email -->
          <div class="form-control">
            <label
              for="donorEmail"
              class="label"
            >
              <span class="label-text">
                {{ $t('dashboard.donations.donor_email') }}
              </span>
            </label>
            <input
              id="donorEmail"
              v-model="modalDonation.donorEmail"
              type="email"
              placeholder="exemple@exemple.com"
              class="input input-bordered input-sm w-full"
            >
          </div>

          <!-- Payment Method -->
          <div class="form-control">
            <label
              for="paymentMethod"
              class="label"
            >
              <span class="label-text">
                {{ $t('dashboard.donations.payment_method') }}
              </span>
              <span class="label-text-alt text-error">
                *
              </span>
            </label>
            <select
              id="paymentMethod"
              v-model="modalDonation.paymentMethod"
              class="select select-bordered select-sm w-full"
            >
              <option
                v-for="option of PaymentMethodOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Type -->
          <div class="form-control">
            <label
              for="type"
              class="label"
            >
              <span class="label-text">
                {{ $t('dashboard.donations.type') }}
              </span>
              <span class="label-text-alt text-error">
                *
              </span>
            </label>
            <select
              id="type"
              v-model="modalDonation.type"
              class="select select-bordered select-sm w-full"
            >
              <option
                v-for="option of DonationTypeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Campaign -->
          <div class="form-control">
            <label
              for="campaign"
              class="label"
            >
              <span class="label-text">
                {{ $t('dashboard.donations.campaign') }}
              </span>
            </label>
            <input
              id="campaign"
              v-model="modalDonation.campaign"
              type="text"
              placeholder="Campaign Name"
              class="input input-bordered input-sm w-full"
            >
          </div>

          <!-- Receipt Number -->
          <div class="form-control">
            <label
              for="receiptNumber"
              class="label"
            >
              <span class="label-text">
                {{ $t('dashboard.donations.receipt_number') }}
              </span>
            </label>
            <input
              id="receiptNumber"
              v-model="modalDonation.receiptNumber"
              type="text"
              placeholder="123456789"
              class="input input-bordered input-sm w-full"
            >
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button
          type="submit"
          class="btn btn-primary"
        >
          {{ $t('common.save') }}
        </button>
        <button
          type="button"
          class="btn"
          @click="dashboardDonationsStore.closeModal()"
        >
          {{ $t('common.cancel') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
const dashboardDonationsStore = useDashboardDonationsStore()
const { isModalOpen, modalDonation, isModalEdit } = storeToRefs(dashboardDonationsStore)

const props = defineProps({
  associationId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  (e: "onSave"): void
}>()

const handleSubmit = async () => {
  const currentDonation = modalDonation.value

  if (!currentDonation) {
    return
  }

  if (isModalEdit.value) {
    await dashboardDonationsStore.updateDonation(currentDonation)
  }
  else {
    await dashboardDonationsStore.createDonation({
      ...currentDonation,
      associationId: props.associationId,
    })
  }

  emit("onSave")
  dashboardDonationsStore.closeModal()
}
</script>
