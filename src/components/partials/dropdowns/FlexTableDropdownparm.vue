<script setup lang="ts">

const emits = defineEmits<{
 
  (e: 'received'): void
  (e: 'remove'): void
 
}>()
</script>

<template>
  <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
    <template #content="{ close }">
      <hr class="dropdown-divider" />
      <a
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
          <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
        </div>
        <div class="meta">
          <span>Remove</span>
          <span>Remove from list</span>
        </div>
      </a>
      <a
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
          <i aria-hidden="true" class="lnil lnil-trash-can-alt" />
        </div>
        <div class="meta">
          <span>Drugs Received</span>
          <span>Patient Recieved Drugs</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>
