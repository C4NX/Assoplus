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
        {{ isModalEdit ? $t('association.donations.edit') : $t('association.donations.create') }}
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
                {{ $t('association.donations.amount') }}
              </span>
              <span class="label-text-alt text-error">
                *
              </span>
            </label>
            <input
              type="number"
              id="amount"
              placeholder="0.00"
              step="0.01"
              min="0"
              class="input input-bordered input-sm w-full"
              v-model="modalDonation.amount"
            />
            </div>

          <!-- Currency -->
          <div class="form-control">
            <label
              for="currency"
              class="label"
            >
              <span class="label-text">
                {{ $t('association.donations.currency') }}
              </span>
              <span class="label-text-alt text-error">
                *
              </span>
            </label>
            <select
              id="currency"
              class="select select-bordered select-sm w-full"
              v-model="modalDonation.currency"
            >
              <option :value="currency" v-for="currency of Intl.supportedValuesOf('currency')">{{ currency }}</option>
            </select>
          </div>

          <!-- Donor Name -->
          <div class="form-control">
            <label
              for="donorName"
              class="label"
            >
              <span class="label-text">
                {{ $t('association.donations.donor_name') }}
              </span>
              <span class="label-text-alt text-error">
                *
              </span>
            </label>
            <input
              type="text"
              id="donorName"
              v-model="modalDonation.donorName"
              placeholder="John Doe"
              class="input input-bordered input-sm w-full"
            />
          </div>

          <!-- Donor Email -->
          <div class="form-control">
            <label
              for="donorEmail"
              class="label"
            >
              <span class="label-text">
                {{ $t('association.donations.donor_email') }}
              </span>
            </label>
            <input
              type="email"
              id="donorEmail"
              v-model="modalDonation.donorEmail"
              placeholder="exemple@exemple.com"
              class="input input-bordered input-sm w-full"
            />
          </div>

          <!-- Payment Method -->
          <div class="form-control">
            <label
              for="paymentMethod"
              class="label"
            >
              <span class="label-text">
                {{ $t('association.donations.payment_method') }}
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
              <option :value="option.value" v-for="option of PaymentMethodOptions">{{ option.label }}</option>
            </select>
          </div>

          <!-- Type -->
          <div class="form-control">
            <label
              for="type"
              class="label"
            >
              <span class="label-text">
                {{ $t('association.donations.type') }}
              </span>
              <span class="label-text-alt text-error">
                *
              </span>
            </label>
            <select
              id="type"
              class="select select-bordered select-sm w-full"
              v-model="modalDonation.type"
            >
              <option :value="option.value" v-for="option of DonationTypeOptions">{{ option.label }}</option>
            </select>
          </div>

          <!-- Campaign -->
          <div class="form-control">
            <label
              for="campaign"
              class="label"
            >
              <span class="label-text">
                {{ $t('association.donations.campaign') }}
              </span>
            </label>
            <input
              type="text"
              id="campaign"
              placeholder="Campaign Name"
              class="input input-bordered input-sm w-full"
              v-model="modalDonation.campaign"
            />
          </div>
           
          <!-- Receipt Number -->
          <div class="form-control">
            <label
              for="receiptNumber"
              class="label"
            >
              <span class="label-text">
                {{ $t('association.donations.receipt_number') }}
              </span>
            </label>
            <input
              type="text"
              id="receiptNumber"
              placeholder="123456789"
              class="input input-bordered input-sm w-full"
              v-model="modalDonation.receiptNumber"
            />
            </div>
        </div>
      </div>

      <div class="modal-action">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Sauvegarder
        </button>
        <button
          type="button"
          class="btn"
          @click="dashboardDonationsStore.closeModal()"
        >
          Close
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
  (e: 'onSave'): void
}>()

const handleSubmit = async () => {
  const currentDonation = modalDonation.value

  if(!currentDonation) {
    return
  }

  if(isModalEdit.value) {
    await dashboardDonationsStore.updateDonation(currentDonation)
  } else {
    await dashboardDonationsStore.createDonation({
      ...currentDonation,
      associationId: props.associationId,
    })  
  }

  emit('onSave')
  dashboardDonationsStore.closeModal()
}

</script>
