<script setup lang="ts">

const emits = defineEmits<{
  (e: 'view'): void
  (e: 'projects'): void
  (e: 'schedule'): void
  (e: 'remove'): void
  (e: 'updateAppointmentModalStatus'): void
  (e: 'selectUser'): void
  (e: 'handleunshedule'):void
}>()
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  openAppointmentModal: {
    type: Boolean,
    required: true,
  },
  onAppointment:{
    type:Boolean,
    required: true
  }
})
</script>

<template>
  <VDropdown
    icon="feather:more-vertical"
    class="is-pushed-mobile"
    spaced
    right
  >
    <template #content="{ close }">
      <RouterLink
        role="menuitem"
        :to="'/profile/' + props.id"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('view')
            close()
          }
        "
      >
        <div class="icon">
          <i 
            aria-hidden="true"
            class="lnil lnil-eye"
          />
        </div>
        <div class="meta">
          <span>View</span>
          <span>View details</span>
        </div>
      </RouterLink>
      <a
        v-if="!props.onAppointment"
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('updateAppointmentModalStatus')
            emits('selectUser')
            close()
          }
        "
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-calendar"
          />
        </div>
        <div class="meta">
          <span>Schedule</span>
          <span>Schedule an appointment</span>
        </div>
      </a>
      <a
        v-if="props.onAppointment"
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('handleunshedule')
            // emits('updateAppointmentModalStatus')
            // emits('selectUser')
            close()
          }
        "
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-calendar"
          />
        </div>
        <div class="meta">
          <span>Unschedule</span>
          <span>Remove appointment</span>
        </div>
      </a>

      <hr class="dropdown-divider">

      <a
        v-if="!props.onAppointment"
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('remove')
            close()
          }
        "
      >
        <div class="icon">
          <i
            aria-hidden="true"
            class="lnil lnil-trash-can-alt"
          />
        </div>
        <div class="meta">
          <span>Remove</span>
          <span>Remove from list</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>
