<script setup lang="ts">
import { useApi, useApiWithAuth } from '/@src/utils/api'
import { useNotyf } from '/@src/composable/useNotyf'
import { useRoute } from 'vue-router'

const notyf = useNotyf()

const modalStatus = ref(false)
const route = useRoute()

const isLoading = ref(false)
const formData = reactive({
  email: null,
  first_name: null,
  last_name: null,
  matric_number: null,
})

interface userType {
  first_name: string
  last_name: string
  email: string
  _id: string
}
interface appointmentType {
  patient: String
  temperature: String
  systolic: String
  diastolic_pressure: String
  systolic_pressure: String
  matric_number: string
}
interface docType {
  user: userType
  // matric_number: string
}
const state = reactive({
  appointment: [] as appointmentType[],
})

const getAappointments = async () => {
  const { get, data } = useApiWithAuth('/appointments/completed', false)
  const fetchStudents = () => {
    get().then(() => {
      state.appointment = JSON.parse(JSON.stringify(data.value)).result
    })
  }
  fetchStudents()
}
const currentPage = computed(() => {
  try {
    return Number.parseInt(route.query.page as string) || 1
  } catch {
    // do nothing
  }
  return 1
})
const getAllAvailableDoctors = async () => {
  const { get, data } = useApi('/doctors', false)
  const fetchDoctors = () => {
    get()
      .then((res) => {
        // state.doctors = JSON.parse(JSON.stringify(data.value)).result
      })
      .catch((err) => {
        console.log(err)
      })
  }
  fetchDoctors()
}
const selectedUserfirst_name = ref(null)
const selectedUserlast_name = ref(null)
const selectedUserId = ref(null)
const SelectedDoctorFirstName = ref(null)
const SelectedDoctorLastName = ref(null)
const SelectedDoctorId = ref(null)

const openAppointmentCompletedModal = ref(false)
const openPrescriptionModal = ref(false)
const user_id = localStorage.getItem('user_id')

const CompletedAppointment = (id) => {
  const { post } = useApi('/appointments/completed', false)
  const bookAppointment = () => {
    console.log(user_id)
    post({ doctor: user_id, patient: selectedUserId.value })
      .then(() => {
        openAppointmentCompletedModal.value = false
      })
      .catch(() => {})
  }
  bookAppointment()
}

onMounted(async () => {
  await getAappointments()
  await getAllAvailableDoctors()
})
const total_number_of_drugs = reactive([
  {
    drug: '',
  },
])
const next = () => {
  total_number_of_drugs.push({ drug: '' })
}
const prev = () => {
  // total_number_of_drugs.
}

const handleSelect = (e) => {}
</script>

<template>
  <VModal
    :open="openAppointmentCompletedModal"
    @close="() => (openAppointmentCompletedModal = false)"
    :title="'Completion'"
  >
    <template #content>
      <div class="columns">
        <div class="column">
          Are You sure you have completed this appointment your appointment with
          {{ selectedUserfirst_name }}
          {{ selectedUserlast_name }}
        </div>
        <div class="column is-2">
          <VButton color="success" @click="CompletedAppointment"> Yes </VButton>
        </div>
      </div>
    </template>
  </VModal>
  <VModal
    title="Prescription"
    :open="openPrescriptionModal"
    @close="openPrescriptionModal = false"
  >
    <template #content>
      <div class="columns is-multiline">
        <VField class="mb-5 column is-12" v-for="i in total_number_of_drugs.length">
          <VControl icon="">
            <input class="input" placeholder="Prescriptions" />
          </VControl>
        </VField>
        <div
          style="color: red; font-size: 30px; cursor: pointer"
          @click="next"
          class="column"
        >
          <VIcon icon="lucide:plus-circle" />
        </div>
      </div>
    </template>
  </VModal>
  <AppLayout>
    <div>
      <div>
        <div class="columns mt-4">
          <div class="column has-text-dark title">Appointment Management</div>
          <!-- <div color="primary" @click="() => (modalStatus = true)">Appointment</div> -->
        </div>
        <VField class="mb-5">
          <VControl icon="feather:search">
            <input
              v-model="filters"
              class="input custom-text-filter"
              placeholder="Search by name, category or price..."
            />
          </VControl>
        </VField>
      </div>
      <table class="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th scope="col" class="is-media" />
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Temperature</th>
            <th scope="col">Systolic Pressure</th>
            <th scope="col">Diastolic Pressure</th>
            <!-- <th scope="col">Completed</th> -->
            <th scope="col" class="is-end">
              <!-- <div class="is-flex is-justify-content-flex-end">Prescription</div> -->
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- <tr>
            <td class="is-media">
              <VAvatar picture="https://media.cssninja.io/content/avatars/8.gif" />
            </td>
            <td>Olabode</td>
            <td>Ezekiel</td>
            <td>35%C</td>
            <td>200</td> 
            <td>159</td>
            <td>
              <VButton color="danger" @click="openAppointmentCompletedModal = true"
                >Completed</VButton
              >
            </td>
            <td>
              <VButton color="info" @click="openPrescriptionModal = true"
                >Add Drugs</VButton
              >
            </td>
          </tr> -->
          <tr v-for="appoint in state.appointment">
            <td class="is-media">
              <VAvatar picture="https://media.cssninja.io/content/avatars/8.gif" />
            </td>
            <td>{{ appoint.patient.first_name }}</td>
            <td>{{ appoint.patient.last_name }}</td>
            <td>{{ appoint.temperature }}</td>
            <td>{{ appoint.systolic_pressure }}</td>
            <td>{{ appoint.diastolic_pressure }}</td>

            <!-- <VField class="is-flex">
              <VControl raw subcontrol>
                <VCheckbox v-model="option1" label="Option 1" />
              </VControl>
            </VField> -->
          </tr>
        </tbody>
      </table>
      <VFlexPagination
        :item-per-page="8"
        :total-items="state.appointment.length"
        :current-page="currentPage"
        :max-links-displayed="5"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss"></style>
