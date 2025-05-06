<template>
  <Teleport to="body">
      <dialog
        class="modal"
        :open="$props.modelValue"
      >
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="$emit('update:modelValue', false)">
              ✕
            </button>
          </form>
          <h3 class="text-lg font-bold">
            <slot name="title">
              {{ $t("common.confirm_title") }}
            </slot>
          </h3>
          <p class="py-4">
            <slot name="description" />
          </p>
          <div class="flex gap-5 justify-end">
            <form method="dialog" v-if="cancelable">
              <button class="btn btn-primary text-neutral-content" @click="$emit('update:modelValue', false); $emit('cancel')">
                <slot name="cancel">
                  {{ $t("common.cancel") }}
                </slot>
              </button>
            </form>
            <button
              :class="{'btn': true, 'btn-primary': !dangerous, 'btn-error text-neutral-content': dangerous }"
              @click="$emit('confirm'); $emit('update:modelValue', false)"
            >
              <slot name="confirm">
                {{ $t("common.confirm") }}
              </slot>
            </button>
          </div>
        </div>
        <form
          method="dialog"
          class="modal-backdrop"
          @click="$emit('update:modelValue', false)"
        >
          <button>close</button>
      </form>
    </dialog>
  </Teleport>
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  cancelable: {
    type: Boolean,
    default: true,
  },
  dangerous: {
    type: Boolean,
    default: false,
  },
});

defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "cancel"): void
  (e: "confirm"): void
}>();
</script>
