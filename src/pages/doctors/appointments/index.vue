<script setup lang="ts">
import { useApi, useApiWithAuth } from '/@src/utils/api'
import { useNotyf } from '/@src/composable/useNotyf'
import { useRoute } from 'vue-router'
// import { update } from 'cypress/types/lodash';

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

const filter = ref('')
const allAppointments = ref([]);

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
  profile: {

  }
})
const CreateStudent = async () => {
  // isLoading.value = true
  const { post } = useApi('/admin/createStudent', false)
  post(formData)
    .then((res) => {
      notyf.success('created Successfully')
      formData.email = ''
      formData.first_name = ''
      formData.last_name = ''
      formData.matric_number = ''

      modalStatus.value = false
    })
    .catch((err) => {
      console.log(err)
    })
}

const getAappointments = async () => {
  const { get, data } = useApiWithAuth('/appointments/pending', false)
  const fetchappointment = () => {
    get().then(() => {
      allAppointments.value = JSON.parse(JSON.stringify(data.value)).result
      filterAppointments()
      console.log(JSON.parse(JSON.stringify(data.value)).result)
    })
  }
  fetchappointment()
}
const filterAppointments = () => {
  const terms = filter.value.trim().toLowerCase().split(' '); // Convert to lowercase and split
  const [firstNameTerm, lastNameTerm] = terms;
  state.appointment = allAppointments.value.filter(appointment => {
    const patient = appointment.patient;
    console.log(appointment)
    const firstNameMatches = patient.first_name.toLowerCase().includes(firstNameTerm || '');
    const lastNameMatches = lastNameTerm ? patient.last_name.toLowerCase().includes(lastNameTerm) : true;
    return firstNameMatches && lastNameMatches;
  });
};
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
const selectedUserType = ref(null)
const selectedappointment = ref(null)
const SelectedDoctorFirstName = ref(null)
const SelectedDoctorLastName = ref(null)
const SelectedDoctorId = ref(null)
const observation = ref(null)
const openAppointmentCompletedModal = ref(false)
const openPrescriptionModal = ref(false)
const user_id = localStorage.getItem('user_id')
const prescriptionpayload = ref('')
const prescribing  = ref(false)
const prescribe = () => {
  prescribing.value = true
  const {post} = useApiWithAuth('/appointments/prescribe', false)
  const prescribeDrug = () => {
    post({appointment: selectedappointment.value, drugs: prescriptionpayload.value})
    prescribing.value = false
    openPrescriptionModal.value = false
  }
  prescribeDrug()
}
const CompletedAppointment = () => {
  const { post, data } = useApiWithAuth('/appointments/completed', false)
  const bookAppointment = () => { 
    post({ doctor: user_id, patient: selectedUserId.value, patient_type:selectedUserType.value, observation: observation.value }) 
      .then(() => {
        openAppointmentCompletedModal.value = false
        getAappointments()
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
const SinglePrescription = ref(null)
const getPrescription = (id) => {
  const { get, data } = useApiWithAuth('/pharm/' + id, false)
  const fetchPrescription = () => {
    get().then(() => {
      SinglePrescription.value = JSON.parse(JSON.stringify(data.value.message))
      console.log(JSON.stringify(data.value.message))
    })
  }
  fetchPrescription()
}
const getting_profile = ref(false)
const updating_profile = ref(false)
const getProfileDetail = (id) => {
  getting_profile.value = true
  const { get, data } = useApiWithAuth('/profile/' + id, false)
  const fetchProfileDetail = () => {
    get().then(async() => {
      state.profile = JSON.parse(JSON.stringify(data.value)).result
      getting_profile.value = false
    })
  }
  fetchProfileDetail()
}

const updateProfileDetail = (id) => {
  updating_profile.value = true
  const { put, data } = useApiWithAuth('/profile/' + id, false)
  const fetchProfileDetail = () => {
    put({profile:state.profile}).then(async() => {
      state.profile = JSON.parse(JSON.stringify(data.value)).result
      getting_profile.value = false
      updating_profile.value = false
      notyf.success('Successfull')
      show_update_modal.value = false
    })
  }
  fetchProfileDetail()
}
const deleteAppointment = (id) => {
  const { del, data } = useApiWithAuth('/appointments/' + id, false)
  const fetchDeletePrescription = () => {
    del().then(async() => {
      // SinglePrescription.value = JSON.parse(JSON.stringify(data.value.message))
      await getAappointments()
    })
  }
  fetchDeletePrescription()
}
const show_update_modal = ref(false)
</script>

<template>
  <VModal :title="'Update Patient health Details'" :open="show_update_modal" @close="() => show_update_modal = !show_update_modal">
    <template #content>
      <VLoader :active="getting_profile">
        <VField class="is-flex">
      <VControl raw subcontrol>
      <VCheckbox v-model="state.profile.diabetic" label="diabletic" />
    </VControl>
      <VControl raw subcontrol>
      <VCheckbox v-model="state.profile.hypertensive" label="hypertensive" />
    </VControl>
      <VControl raw subcontrol>
      <VCheckbox v-model="state.profile.ulcer" label="ulcer" />
    </VControl>
  </VField>
    </VLoader>
    </template>
    <template #action>
      <VButton :loading="updating_profile" @click="() => updateProfileDetail(selectedUserId)">
        Update Details
      </VButton>
      </template>
    </VModal>
  <VModal
    :open="openAppointmentCompletedModal"
    @close="() => (openAppointmentCompletedModal = false)"
    :title="'Completion'"
  >
    <template #content>
      <div class="">
        <div class="" >
          Any Obeservation with   {{ selectedUserfirst_name }}
          {{ selectedUserlast_name }}
          <div>
            <VControl>
              <VField>
                <VInput type="text" v-model="observation" placeholder="Observation with patient"/>
              </VField>
            </VControl>
          </div>
        </div>
        <div class="column">
          <VButton color="success" @click="CompletedAppointment"> Complete Appointment </VButton>
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
      <div class="columns is-multiline" >
        <i class="column" color="primary" style="color: green; font-weight: 600;">
          {{SinglePrescription !== null ? SinglePrescription.drugs:"No prescription is attached to this appointment yet"}}
        </i>
        <VControl  class="column is-full">
        <VField>
        <VInput type="text" placeholder="Enter Drugs Prescription in text" v-model="prescriptionpayload" />
    </VField>
      </VControl>
      </div>
    </template>
    <template #action>
      <VButton @click="prescribe">
        Prescribe
      </VButton>
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
             @input="filterAppointments"
              v-model="filter"
              class="input custom-text-filter"
              placeholder="Search by first name and last name"
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
            <!-- getProfileDetail -->
            <td class="is-end">
              <div class="is-flex is-justify-content-flex-end">
                <FlexTableDropdownAppoint
                  :id="appoint._id"
                  :studentId="appoint.patient._id"
                  @viewAppointmentCompletedModal="
                    () => {
                      selectedUserfirst_name = appoint.patient.first_name
                      selectedUserlast_name = appoint.patient.last_name
                      selectedUserId = appoint.patient._id
                      selectedUserType = appoint.patient.user_type
                      openAppointmentCompletedModal = true
                    }
                  "
                  @prescribe="() => {
                    getPrescription(appoint._id)
                    selectedappointment = appoint._id
                    openPrescriptionModal=!openPrescriptionModal
                  }"
                  @delete="() => {
                    deleteAppointment(appoint._id)
                  }"
                  @update="() => {
                    show_update_modal = !show_update_modal
                    getProfileDetail(appoint.patient._id)
                    selectedUserId = appoint.patient._id
                  }"
                />
              </div>
            </td>
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
