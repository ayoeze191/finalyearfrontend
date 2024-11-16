<script setup lang="ts">
const openSubsidebarLinks = ref('')
const emit = defineEmits(['close'])
const user_type = localStorage.getItem('user_type')
console.log(user_type)
</script>

<template>
  <div class="sidebar-panel is-generic">
    <div class="subpanel-header">
      <h3 class="no-mb">
        Dashboards
      </h3>
      <div
        class="panel-close"
        tabindex="0"
        role="button"
        @keydown.space.prevent="emit('close')"
        @click="emit('close')"
      >
        <i
          aria-hidden="true"
          class="iconify"
          data-icon="feather:x"
        />
      </div>
    </div>
    <div
      class="inner"
      data-simplebar
    >
      <VCollapseLinks
        v-if="user_type == 'admin'"
        v-model:open="openSubsidebarLinks"
        collapse-id="personal"
      >
        <template #header>
          Dashboard
          <i
            aria-hidden="true"
            class="iconify rtl-hidden"
            data-icon="feather:chevron-right"
          />
          <i
            aria-hidden="true"
            class="iconify ltr-hidden"
            data-icon="feather:chevron-left"
          />
        </template>
        <RouterLink
          :to="'/admin/dashboard/'"
          class="is-submenu"
        >
          <i
            aria-hidden="true"
            class="lnir lnir-user"
          />
          <span>Students</span>
        </RouterLink>
        <RouterLink
          to="/admin/dashboard/staffs/"
          class="is-submenu"
        >
          <i
            aria-hidden="true"
            class="lnir lnir-users"
          />
          <span>Staffs</span>
        </RouterLink>
      </VCollapseLinks>

      <VCollapseLinks
        v-if="user_type == 'pharm'"
        v-model:open="openSubsidebarLinks"
        collapse-id="personal"
      >
        <template #header>
          Dashboard
          <i
            aria-hidden="true"
            class="iconify rtl-hidden"
            data-icon="feather:chevron-right"
          />
          <i
            aria-hidden="true"
            class="iconify ltr-hidden"
            data-icon="feather:chevron-left"
          />
        </template>
        <RouterLink
          :to="'/pharm/'"
          class="is-submenu"
        >
          <i
            aria-hidden="true"
            class="lnir lnir-user"
          />
          <span>Prescriptions</span>
        </RouterLink>
        <RouterLink
          to="/pharm/fufilled"
          class="is-submenu"
        >
          <i
            aria-hidden="true"
            class="lnir lnir-users"
          />
          <span>Fufilled Prescriptions</span>
        </RouterLink>
      </VCollapseLinks>

      <VCollapseLinks
      v-if="user_type == 'doctor'"

        v-model:open="openSubsidebarLinks"
        collapse-id="personal"
      >
        <!--  -->
        <template #header>
          Appointments
          <i
            aria-hidden="true"
            class="iconify rtl-hidden"
            data-icon="feather:chevron-right"
          />
          <i
            aria-hidden="true"
            class="iconify ltr-hidden"
            data-icon="feather:chevron-left"
          />
        </template>
        <RouterLink
        
          :to="'/doctors/appointments'"
          class="is-submenu"
        >
          <i
            aria-hidden="true"
            class="lnir lnir-user"
          />
          <span>Pending Appointments</span>
        </RouterLink>
        <RouterLink
          to="/doctors/appointments/completed"
          class="is-submenu"
        >
          <i
            aria-hidden="true"
            class="lnir lnir-users"
          />
          <span>Completed Appointments</span>
        </RouterLink>
      </VCollapseLinks>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
</style>
