<script setup lang="ts">
import { useApiWithAuth } from '/@src/utils/api';
const state = reactive({
  prescriptions: []
})
const getPrescriptions = () => {
  const { get, data } = useApiWithAuth('/pharm/fufilled', false)
  const fetchPrescriptions = () => {
    get().then(() => {
      console.log(JSON.parse(JSON.stringify(data.value)).message)
      state.prescriptions = JSON.parse(JSON.stringify(data.value)).message
    })
    .catch((err) => {
      console.log(err)
    })
  }
  fetchPrescriptions()
}
const sorting = ref(false)
const unfufilledDrugs = (id) => {
  sorting.value = true
  const {get, data} = useApiWithAuth('/pharm/unfufilled/' + id, false)
  const handlePrescriptionsSort = () => {
  sorting.value = false
    get().then(() => {
  sorting.value = false
      console.log(JSON.parse(JSON.stringify(data.value)).message)
      state.prescriptions = JSON.parse(JSON.stringify(data.value)).message
      getPrescriptions()
      showModal.value = false
    })
    .catch((err) => {
  sorting.value = false 
      console.log(err)
    })
  }
  handlePrescriptionsSort()
}

onMounted(() => {
getPrescriptions()
})
const showModal = ref(false)
const selectedId = ref(null)
const handleModal = (id) => {
  showModal.value = !showModal.value
  selectedId.value = id
}
</script>

<template>
  <VModal
    :title="'Are you sure you want to unfufill this prescription'"
    :open="showModal"
    @close="() => showModal=false"
  >
    <template #content>
      <div class="columns multiline">
        <div class="column" />
      </div>
      <VButton
        color="primary"
        class=""
        :loading="sorting"
        @click="() => unfufilledDrugs(selectedId)"
      >
        unfufill
      </VButton>
    </template>
  </VModal>
  <AppLayout>
    <table class="table is-hoverable is-fullwidth">
      <thead>
        <tr> 
          <th scope="col">
            Doctor
          </th>
          <th scope="col">
            Patient
          </th>
          <th
            scope="col"
            class="is-end"
          >
          </th>
        </tr> 
      </thead>
      <tbody>
        <tr v-for="presc in state.prescriptions">
          <td>Dr. {{ presc.appointment.doctor.first_name + " " + presc.appointment.doctor.last_name }}</td>
          <td>{{ presc.appointment.patient.first_name + " " + presc.appointment.patient.last_name }}</td>
          <td>
            <VButton @click="() => handleModal(presc._id)">
                unfufill
            </VButton>
          </td>
        </tr>
      </tbody> 
    </table>
  </AppLayout>
</template>