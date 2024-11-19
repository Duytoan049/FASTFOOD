<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CustomerCard from '@/components/CustomerCard.vue';
import InputSearch from '@/components/InputSearch.vue';
import CustomerList from '@/components/CustomerList.vue';
import MainPagination from '@/components/MainPage.vue';
import customersService from '@/services/customer.services';
// The full code will be presented below

const router = useRouter();
const route = useRoute();

const totalPages = ref(1);

const currentPage = computed(() => {
  const page = Number(route.query?.page);
  if (Number.isNaN(page) || page < 1) return 1;
  return page;
});

const customers = ref([]);
const selectedIndex = ref(-1);
const searchText = ref('');

const searchableCustomer = computed(() => {
  return customers.value.filter((customer) => {
    const { name, email, address, phone, gender } = customer;
    return [name, email, address, phone, gender].join(' ').toLowerCase().includes(searchText.value.toLowerCase());
  });
});


const filteredCustomers = computed(() => {
  if (!searchText.value) return customers.value;
  return searchableCustomer.value;
});


const selectedCustomer = computed(() => {
  if (selectedIndex.value < 0) return null;
  return filteredCustomers.value[selectedIndex.value];
});

async function retrieveCustomers(page) {
  try {
    const response = await customersService.fetchCustomers(page);
    totalPages.value = response.metadata.lastPage ?? 1;
    customers.value = response.customers.sort((current, next) =>
      current.name.localeCompare(next.name)
    );
    selectedIndex.value = -1;
  } catch (error) {
    console.error(error);
  }
}
async function goToAddCustomer() {
  await router.push('customer.add');
}
function changeCurrentPage(page) {
  router.push({ name: 'customerbook', query: { page } });
}

// Whenever searchText changes, reset selectedIndex
watch(searchText, () => (selectedIndex.value = -1));
// or watchEffect(() => (selectedIndex.value = -1));
// When currentPage changes, fetch customer for currentPage
watch(currentPage, () => retrieveCustomers(currentPage.value), { immediate: true });
</script>


<template>
  <div class="page row mb-5">
    <div class="mt-3 col-md-6">
      <h4>
        KHÁCH HÀNG
        <i class="fas fa-address-book"></i>
      </h4>
      <div class="my-3">
        <InputSearch v-model="searchText" />
      </div>
      <div v-if="filteredCustomers.length === 0" class="no-products-found">
        <h3 style="padding-top: 20px;">Không tìm thấy sản phẩm</h3>
      </div>
      <CustomerList :customers="filteredCustomers"
        v-model:selected-index="selectedIndex" />

      <div class="mt-3 d-flex flex-wrap justify-content-round align-items-center">
        <MainPagination :total-pages="totalPages" :current-page="currentPage"
          @update:current-page="changeCurrentPage" />
        <div class="w-100"></div>
        <button class="btn btn-sm btn-primary" @click="retrieveCustomers(currentPage)">
          <i class="fas fa-redo"></i> Làm mới
        </button>
        <button class="btn btn-sm btn-success" @click="goToAddCustomer">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
        <!-- <button
          class="btn btn-sm btn-danger"
          @click="onDeleteContacts"
        >
          <i class="fas fa-trash"></i> Xóa tất cả
        </button> -->
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="selectedCustomer">
        <h4>
          CHI TIẾT KHÁCH HÀNG
          <i class="fas fa-address-card"></i>
        </h4>
        <CustomerCard :customer="selectedCustomer" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.page {
  text-align: left;
  padding: 60px 10px 70px 250px;
}
</style>
