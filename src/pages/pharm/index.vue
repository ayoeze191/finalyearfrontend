<script setup lang="ts">
import { useApiWithAuth } from '/@src/utils/api';
import { useViewWrapper } from '/@src/stores/viewWrapper'

const state = reactive({
  prescriptions: []
})
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Pharmacy')
const getPrescriptions = () => {
  const { get, data } = useApiWithAuth('/pharm', false)
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
const unavailable_medications = ref(null)
const sorting = ref(false)
const SortDrugs = (id) => {
  sorting.value = true
  const {post, data} = useApiWithAuth('/pharm/sort', false)
  const handlePrescriptionsSort = () => {
  sorting.value = false
    post({id, unavailable_medications: unavailable_medications.value}).then(() => {
  sorting.value = false
      console.log(JSON.parse(JSON.stringify(data.value)).message)
      state.prescriptions = JSON.parse(JSON.stringify(data.value)).message
      showModal.value = false
      getPrescriptions()

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
    :title="'Are You Sure The Patient has been sorted'"
    :open="showModal"
    @close="() => showModal=false"
  >
    <template #content>
      <div class="columns is-multiline">
      <VControl class="column is-full">
        Prescribed drugs not available 
        <VField>
          <VInput
            v-model="unavailable_medications"
            type="text"
            placeholder="Prescribed Drugs that are not available"
          />
        </VField>
      </VControl>
      <VButton
        color="primary"
        class="column"
        :loading="sorting"
        @click="() => SortDrugs(selectedId)"
      >
        Yes
      </VButton>
    </div>
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
          <th>
            Drugs
          </th>
          <th
            scope="col"
            class="is-end"
          >
            Fufilled
          </th>
        </tr> 
      </thead>
      <tbody>
        <tr v-for="presc in state.prescriptions">
          <td>Dr. {{ presc.appointment.doctor.first_name + " " + presc.appointment.doctor.last_name }}</td>
          <td>{{ presc.appointment.patient.first_name + " " + presc.appointment.patient.last_name }}</td>
          <td>{{ presc.drugs }}</td>

          <td>
            <VButton @click="() => handleModal(presc._id)">
              Sorted
            </VButton>
          </td>
        </tr>
      </tbody> 
    </table>
  </AppLayout>
</template>