<script setup lang="ts">
import { useApi, useApiWithAuth } from '/@src/utils/api'
import { useNotyf } from '/@src/composable/useNotyf'
import { useRoute } from 'vue-router'

const notyf = useNotyf()

const modalStatus = ref(false)
const route = useRoute()
const filter = ref("")
const isLoading = ref(false)
const formData = reactive({
  email: null,
  first_name: null,
  last_name: null,
  matric_number: null,
  faculty: null,
  department: null,
  next_of_kin: null,
  phone_number: null,
})
const selected_user_type = ref(null)
interface AppointmentType{
  systolic_pressure: String | null,
  diastolic_pressure: String | null,
  patient: String | null,
  temperature: String | null,
  doctor: String | null,
  weight: String| null
}
const appointmentFormData = reactive<AppointmentType>({
  systolic_pressure: null,
  diastolic_pressure: null,
  patient: null,
  temperature: null,
  doctor: null,
  weight: null
})


interface userType {
  first_name: string
  last_name: string
  email: string
  user_type: string
  _id: string
}
interface studentType {
  user: userType
  matric_number: string
}
interface docType {
  user: userType
  // matric_number: string
}
const state = reactive({
  students: [] as studentType[],
  doctors: [] as docType[],
})
const creating = ref(false)
const CreateStudent = async () => {
  creating.value = true
  // isLoading.value = true
  const { post, error } = useApiWithAuth('/admin/createStudent', false)
  post(formData)
    .then(async (res) => {
      creating.value = false
      notyf.success('created Successfully')
      formData.email = ''
      formData.first_name = ''
      formData.last_name = ''
      formData.matric_number = ''
      formData.department = ''
      formData.faculty = ''
      formData.next_of_kin = ''
      formData.phone_number = ''

      modalStatus.value = false
      await getStudents()
    })
    .catch((err) => {
      notyf.error(error.value)
    creating.value = false

      // console.log(err)
    })
}

const getStudents = async () => {
  const { get, data } = useApiWithAuth('/admin/getStudents', false)
  const fetchStudents = () => {
    get().then(() => {
      console.log(JSON.parse(JSON.stringify(data.value)).result)
      state.students = JSON.parse(JSON.stringify(data.value)).result
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
  const { get, data } = useApiWithAuth('/doctors', false)
  const fetchDoctors = () => {
    get()
      .then((res) => {
        state.doctors = JSON.parse(JSON.stringify(data.value)).result
      })
      .catch((err) => {
        console.log(err)
      })
  }
  fetchDoctors()
}
const selectedUserfirst_name = ref(null)
const SelectedUserId = ref(null)
const selectedUserlast_name = ref(null)
const SelectedDoctorFirstName = ref(null)
const SelectedDoctorLastName = ref(null)
const SelectedDoctorId = ref(null)

const openAppointmentModal = ref(false)
const bookingAappointment = ref(false)
const schedulerAppointment = () => {
  bookingAappointment.value = true
  const { post, error, data } = useApiWithAuth('/appointments', false)
  post(appointmentFormData).then(async (res) => {
    appointmentFormData.diastolic_pressure = ''
    appointmentFormData.systolic_pressure = ''
    appointmentFormData.doctor = ''
    appointmentFormData.patient = ''
    appointmentFormData.temperature = ''
    creating.value = false
    notyf.success('created Booked and appointment')
    bookingAappointment.value = false
    openAppointmentModal.value = false
    await getStudents()
  })
  .then((err) => {
    creating.value = false
  })
}
const UnscheduleAppointment = () => {
  bookingAappointment.value = true
  const { post } = useApiWithAuth('/appointments/unschedule', false)
  post({ patient: appointmentFormData.patient, patient_type: selected_user_type.value})
  .then(async(res) => {
    appointmentFormData.doctor = ''
    appointmentFormData.patient = ''
    await getStudents()
    notyf.success('Unbooked Successfull')
  })
  .then((err) => {
    creating.value = false
  })
}
const filteredStudents = computed(() => {
      // Filter students based on first and last names
      return state.students.filter(student => {
        const fullName = `${student.user.first_name} ${student.user.last_name}`.toLowerCase();
        return fullName.includes(filter.value.toLowerCase());
      });
    });
onMounted(async () => {
  await getStudents()
  await getAllAvailableDoctors()
})
</script>

<template>
  <VModal
    :open="openAppointmentModal"
    :title="
      'Schedule an appointment for ' +
        selectedUserfirst_name +
        ' ' +
        selectedUserlast_name
    "
    @close="() => (openAppointmentModal = false)"
  >
    <template #content>
      <div class="mb-5 columns">
        <div class="column">
          <div class="subtitle is-6">
            Doctor
          </div>
        </div>
        <VDropdown
          :title="
            SelectedDoctorId
              ? SelectedDoctorFirstName + ' ' + SelectedDoctorLastName
              : 'Select doctor'
          "
          modern
          class="column is-primary-focus column is-four-fifths"
        >
          <template #content>
            <a
              v-for="doc in state.doctors"
              href="#"
              class="dropdown-item is-primary-focus column is-four-fifths fucku"
              style="width: 100%"
              @click="
                () => {
                  SelectedDoctorFirstName = doc.user.first_name
                  SelectedDoctorLastName = doc.user.last_name
                  SelectedDoctorFirstName = doc.user.first_name
                  appointmentFormData.doctor = doc.user._id
                  SelectedDoctorId = doc.user._id
                }
              "
            >
              {{ doc.user.first_name }} {{ doc.user.last_name }}
            </a>
            <hr class="dropdown-divider">
          </template>
        </VDropdown>
      </div>
      <VField style="margin-right: 1rem">
        <VControl class="columns">
          <div class="column">
            <div class="subtitle is-6">
              Temperature
            </div>
          </div>
          <VInput
            v-model="appointmentFormData.temperature"
            class="is-primary-focus column is-four-fifths"
            type="text"
            placeholder="In °C"
          />
        </VControl>
        <VControl class="columns">
          <div class="column">
            <div class="subtitle is-6">
              Systolic Pressure
            </div>
          </div>
          <VInput
            v-model="appointmentFormData.systolic_pressure"
            class="is-primary-focus column is-four-fifths"
            type="text"
            placeholder="mm Hg"
          />
        </VControl>
        <VControl class="columns">
          <div class="column">
            <div class="subtitle is-6">
              Diastolic Pressure
            </div>
          </div>
          <VInput
            v-model="appointmentFormData.diastolic_pressure"
            class="is-primary-focus column is-four-fifths"
            type="text"
            placeholder="mm Hg"
          />
        </VControl>
        <VControl class="columns">
          <div class="column">
            <div class="subtitle is-6">
              Weight
            </div>
          </div>
          <VInput
            v-model="appointmentFormData.weight"
            class="is-primary-focus column is-four-fifths"
            type="text"
            placeholder="In °C"
          />
        </VControl>
      </VField>
    </template>
    <template #action>
      <VButton
        style="margin-left: auto"
        @click="schedulerAppointment"
      >
        Schedule
      </VButton>
    </template>
  </VModal>
  <VModal
    :open="modalStatus"
    title="Create Student Account"
    @close="() => (modalStatus = false)"
  >
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 20px">
        <VField style="margin-right: 1rem">
          <VControl class="columns">
            <div class="column">
              <div class="subtitle is-6">
                Email
              </div>
            </div>
            <VInput
              v-model="formData.email"
              class="is-primary-focus column is-four-fifths"
              type="text"
              placeholder="Student email"
            />
          </VControl>
        </VField>
        <VField style="margin-right: 1rem; margin-top: 1rem">
          <VControl class="columns">
            <div class="column">
              <div class="subtitle is-6">
                First Name
              </div>
            </div>
            <VInput
              v-model="formData.first_name"
              class="is-primary-focus column is-four-fifths"
              type="text"
              placeholder="Students First Name"
            />
          </VControl>
        </VField>
        <VField style="margin-right: 1rem; margin-top: 1rem">
          <VControl class="columns">
            <div class="column">
              <div class="subtitle is-6">
                Last Name
              </div>
            </div>
            <VInput
              v-model="formData.last_name"
              class="is-primary-focus column is-four-fifths"
              type="text"
              placeholder="Students Last Name"
            />
          </VControl>
        </VField>
        <VField style="margin-right: 1rem; margin-top: 1rem">
          <VControl class="columns">
            <div class="column">
              <div class="subtitle is-6">
                Matric
              </div>
            </div>
            <VInput
              v-model="formData.matric_number"
              class="is-primary-focus column is-four-fifths"
              type="text"
              placeholder="Students Matric Number"
            />
          </VControl>
        </VField>
        <VField style="margin-right: 1rem; margin-top: 1rem">
          <VControl class="columns">
            <div class="column">
              <div class="subtitle is-6">
                Faculty
              </div>
            </div>
            <VInput
              v-model="formData.faculty"
              class="is-primary-focus column is-four-fifths"
              type="text"
              placeholder="Students Faculty"
            />
          </VControl>
        </VField><VField style="margin-right: 1rem; margin-top: 1rem">
          <VControl class="columns">
            <div class="column">
              <div class="subtitle is-6">
                Department
              </div>
            </div>
            <VInput
              v-model="formData.department"
              class="is-primary-focus column is-four-fifths"
              type="text"
              placeholder="Students Department"
            />
          </VControl>
        </VField>
        <VField style="margin-right: 1rem; margin-top: 1rem">
          <VControl class="columns">
            <div class="column">
              <div class="subtitle is-6">
                Next of kin
              </div>
            </div>
            <VInput
              v-model="formData.next_of_kin"
              class="is-primary-focus column is-four-fifths"
              type="text"
              placeholder="Students Next of kin"
            />
          </VControl>
        </VField>
        <!-- <VField style="margin-right: 1rem; margin-top: 1rem">
          <VControl class="columns">
            <div class="column"><div class="subtitle is-6">DOB</div></div>
            <VInput
              class="is-primary-focus column is-four-fifths"
              v-model="formData.matric_number"
              type="text"
              placeholder="Students Date of Birth"
            />
          </VControl>
        </VField> -->
        <VField style="margin-right: 1rem; margin-top: 1rem">
          <VControl class="columns">
            <div class="column">
              <div class="subtitle is-6">
                Phone number
              </div>
            </div>
            <VInput
              v-model="formData.phone_number"
              class="is-primary-focus column is-four-fifths"
              type="text"
              placeholder="Students Phone Number"
            />
          </VControl>
        </VField>
      </div>
    </template>
    <template #action>
      <VButton
        style="margin-left: auto"
        :loading="creating"
        @click="CreateStudent"
      >
        Create Student
      </VButton>
    </template>
  </VModal>

  <AppLayout>
    <div>
      <div>
        <div class="columns mt-4">
          <div class="column has-text-dark title">
            Students Management
          </div>
          <VButton
            color="primary"
            @click="() => (modalStatus = true)"
          >
            Create Students
          </VButton>
        </div>
        <VField class="mb-5">
          <VControl icon="feather:search">
            <input
              v-model="filter"
              class="input custom-text-filter"
              placeholder="Search by name, category or price..."
            >
          </VControl>
        </VField>
      </div>
      <table class="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th
              scope="col"
              class="is-media"
            />
            <th scope="col">
              First Name
            </th>
            <th scope="col">
              Last Name
            </th>
            <th scope="col">
              Matric Number
            </th>
            <th scope="col">
              Email
            </th>
            <th scope="col">
              Has Appointment
            </th>

            <th
              scope="col"
              class="is-end"
            >
              <div class="dark-inverted is-flex is-justify-content-flex-end">
                Actions
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents">
            <td class="is-media">
              <VAvatar picture="https://media.cssninja.io/content/avatars/8.gif" />
            </td>
            <td>{{ student.user.first_name }}</td>
            <td>{{ student.user.last_name }}</td>
            <td>{{ student.matric_number }}</td>
            <td>{{ student.user.email }}</td>
            <td>
              <VButton
                v-if="!student.onAppointment"
                :disabled="true"
                color="primary"
              >
                {{ student.onAppointment }}
              </VButton>
              <VButton
                v-else
                :disabled="true"
                color="danger"
              >
                {{ student.onAppointment }}
              </VButton>
            </td>

            <td class="is-end">
              <div class="is-flex is-justify-content-flex-end">
                <FlexTableDropdown
                  @handleunshedule="() => {
                    console.log('is-flex')
                    appointmentFormData.patient = student.user._id
                    selected_user_type = student.user.user_type
                    UnscheduleAppointment()
                  }"
                  :id="student.user._id" 
                  :on-appointment="student.onAppointment"
                  open-appointment-modal
                  @selectUser="
                    () => {
                      selectedUserfirst_name = student.user.first_name
                      selectedUserlast_name = student.user.last_name
                      SelectedUserId = student.user._id
                      appointmentFormData.patient = student.user._id
                    }
                  "
                  @updateAppointmentModalStatus="() => (openAppointmentModal = true)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <VFlexPagination
        :item-per-page="8"
        :total-items="state.students.length"
        :current-page="currentPage"
        :max-links-displayed="5"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss">
.fucku {
  width: 100% !important;
  // background-color: red !important;
}
</style>
