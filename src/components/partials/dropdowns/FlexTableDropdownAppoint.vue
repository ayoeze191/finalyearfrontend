<script setup lang="ts">
import { emit } from 'node:process';
import { boolean } from 'zod'

const emits = defineEmits<{
  (e: 'view'): void
  (e: 'update'): void
  (e: 'projects'): void
  (e: 'schedule'): void
  (e: 'remove'): void
  (e: 'viewAppointmentCompletedModal'): void
  (e: 'prescribe'): void
  (e: 'delete'): void
  //   (e: 'updateAppointmentModalStatus'): void
  //   (e: 'selectUser'): void
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
  studentId: {
    type: String,
    required: true
  }
  
})
</script>

<template>
  <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
    <template #content="{ close }">
      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('viewAppointmentCompletedModal')
            close()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-briefcase" />
        </div>
        <div class="meta">
          <span>Completed</span>
          <span>Complete appointment</span>
        </div>
      </a>
      <RouterLink
        role="menuitem"
        :to="'/profile/' + props.studentId"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('view')
            close()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-eye" />
        </div>
        <div class="meta">
          <span>View</span>
          <span>View Patient health details</span>
        </div>
      </RouterLink>

      <a
        href="#"
        role="menuitem"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('update')
            close()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-eye" />
        </div>
        <div class="meta">
          <span>Update</span>
          <span>Update Patient health details</span>
        </div>
      </a>

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('prescribe')
            // emits('updateAppointmentModalStatus')
            // emits('selectUser')
            close()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-calendar" />
        </div>
        <div class="meta">
          <span>Prescribe </span>
          <span>Prescribe drug for this patient</span>
        </div>
      </a>

      <hr class="dropdown-divider" />

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('delete')
            close()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
        </div>
        <div class="meta">
          <span>Remove</span>
          <span>Remove from list</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>
