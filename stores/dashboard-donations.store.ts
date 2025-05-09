import { defineStore } from "pinia"

enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH = "CASH",
  CHECK = "CHECK",
}

enum DonationType {
  ONE_TIME = "ONE_TIME",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export const PaymentMethodOptions = [
  { label: "Carte de crédit", value: PaymentMethod.CREDIT_CARD },
  { label: "Virement bancaire", value: PaymentMethod.BANK_TRANSFER },
  { label: "Espèces", value: PaymentMethod.CASH },
  { label: "Chèque", value: PaymentMethod.CHECK },
]

export const DonationTypeOptions = [
  { label: "Unique", value: DonationType.ONE_TIME },
  { label: "Mensuel", value: DonationType.MONTHLY },
  { label: "Annuel", value: DonationType.YEARLY },
]

interface Donation {
  id: number
  amount: number
  currency: string
  donorName: string
  donorEmail?: string
  paymentMethod: PaymentMethod
  type: DonationType
  campaign?: string
  receiptNumber?: string
}

export interface DonationCreate extends Omit<Donation, "id"> {
  associationId: string
}

export interface DonationUpdate extends Partial<Donation> {
  id: number
}

const donationFactory = (): Donation => ({
  id: 0,
  amount: 0,
  currency: "EUR",
  donorName: "",
  donorEmail: undefined,
  paymentMethod: PaymentMethod.CREDIT_CARD,
  type: DonationType.ONE_TIME,
  campaign: undefined,
  receiptNumber: undefined,
})

export const useDashboardDonationsStore = defineStore("dashboard-donation", {
  state: () => ({
    isModalOpen: ref(false),
    isModalEdit: ref(false),
    modalDonation: ref<Donation>(donationFactory()),
  }),
  actions: {
    openCreateModal() {
      this.isModalOpen = true
      this.isModalEdit = false
      this.modalDonation = donationFactory()
    },
    openEditModal(donation: Donation) {
      this.isModalOpen = true
      this.isModalEdit = true
      this.modalDonation = { ...donation }
    },

    closeModal() {
      this.isModalOpen = false
      this.modalDonation = donationFactory()
    },

    async createDonation(donation: DonationCreate) {
      const data = await $fetch(`/api/donations`, {
        method: "POST",
        body: donation,
        onResponse: toastifyResponse,
        headers: {
          "Content-Type": "application/json",
        },
      })

      return data
    },

    async updateDonation(updates: DonationUpdate) {
      const data = await $fetch(`/api/donations/${updates.id}`, {
        method: "PATCH",
        body: updates,
        onResponse: toastifyResponse,
        headers: {
          "Content-Type": "application/json",
        },
      })

      return data
    },

    async deleteDonation(donationId: number) {
      const data = await $fetch(`/api/donations/${donationId}`, {
        method: "DELETE",
        onResponse: toastifyResponse,
        headers: {
          "Content-Type": "application/json",
        },
      })

      return data
    },
  },
})
