<script setup lang="ts">
import { useApi, useApiWithAuth } from '/@src/utils/api'
import { useNotyf } from '/@src/composable/useNotyf'
import { useRoute } from 'vue-router'

const notyf = useNotyf()
const staffmodalStatus = ref(false)
const staffformData = reactive({
  email: null,
  first_name: null,
  last_name: null,
  employmentId: null,
})
const route = useRoute()

interface userType {
  first_name: string
  last_name: string
  email: string
  _id: string
}
interface staffType {
  user: userType
  employmentId: stringstaffs
}
const currentPage = computed(() => {
  try {
    return Number.parseInt(route.query.page as string) || 1
  } catch {
    // do nothing
  }
  return 1
})
const state = reactive({
  staffs: [] as staffType[],
})
const CreateStaffs = async () => {
  console.log('Creating')
  isLoading.value = true
  const { post } = useApiWithAuth('/admin/createStaff', false)
  post(staffformData)
    .then((res) => {
      notyf.success('created Successfully')
      staffformData.email = ''
      staffformData.first_name = ''
      staffformData.last_name = ''
      staffformData.employmentId = ''
      // isLoading.value = true
      staffmodalStatus.value = false
    })
    .catch((err) => {
      console.log(err)
    })
}
const getStaffs = async () => {
  const { get, data } = useApiWithAuth('/admin/getStaffs', false)
  const fetchStafs = () => {
    get().then(() => {
      console.log(JSON.parse(JSON.stringify(data.value)).result)
      state.staffs = JSON.parse(JSON.stringify(data.value)).result
    })
  }
  fetchStafs()
}
onMounted(async () => {
  await getStaffs()
})
</script>
<template>
  <VModal
    :open="staffmodalStatus"
    @close="() => (staffmodalStatus = false)"
    title="Create Staff Account"
  >
    <template #content>
      <VField style="margin-right: 1rem">
        <VControl class="columns">
          <div class="column"><div class="subtitle is-6">Email</div></div>
          <VInput
            class="is-primary-focus column is-four-fifths"
            v-model="staffformData.email"
            type="text"
            placeholder="Staffs email"
          />
        </VControl>
      </VField>
      <VField style="margin-right: 1rem; margin-top: 1rem">
        <VControl class="columns">
          <div class="column"><div class="subtitle is-6">First Name</div></div>
          <VInput
            class="is-primary-focus column is-four-fifths"
            v-model="staffformData.first_name"
            type="text"
            placeholder="Staffs First Name"
          />
        </VControl>
      </VField>
      <VField style="margin-right: 1rem">
        <VControl class="columns">
          <div class="column"><div class="subtitle is-6">Last Name</div></div>
          <VInput
            class="is-primary-focus column is-four-fifths"
            v-model="staffformData.last_name"
            type="text"
            placeholder="Staffs Last Name"
          />
        </VControl>
      </VField>
      <VField style="margin-right: 1rem">
        <VControl class="columns">
          <div class="column"><div class="subtitle is-6">Employment Id</div></div>
          <VInput
            class="is-primary-focus column is-four-fifths"
            v-model="staffformData.employmentId"
            type="text"
            placeholder="Staffs Employment Number"
          />
        </VControl>
      </VField>
    </template>
    <template #action>
      <VButton style="margin-left: auto" @click="CreateStaffs"> Create Staff </VButton>
    </template>
  </VModal>
  <AppLayout>
    <div>
      <div class="columns mt-4">
        <div class="column has-text-dark title">Staffs Management</div>
        <VButton color="primary" @click="() => (staffmodalStatus = true)"
          >Create Staffs</VButton
        >
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
          <th scope="col">Employment Id</th>
          <th scope="col">Email</th>

          <th scope="col" class="is-end">
            <div class="dark-inverted is-flex is-justify-content-flex-end">Actions</div>
          </th>
        </tr>
      </thead>
      <tbody v-if="state.staffs.length > 0">
        <tr v-for="student in state.staffs">
          <td class="is-media">
            <VAvatar picture="https://media.cssninja.io/content/avatars/8.gif" />
          </td>
          <td>{{ student.user.first_name }}</td>
          <td>{{ student.user.last_name }}</td>
          <td>{{ student.employmentId }}</td>
          <td>{{ student.user.email }}</td>

          <td class="is-end">
            <div class="is-flex is-justify-content-flex-end">
              <FlexTableDropdown />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <VFlexPagination
      :item-per-page="8"
      :total-items="state.staffs.length"
      :current-page="currentPage"
      :max-links-displayed="5"
    />
  </AppLayout>
</template>
