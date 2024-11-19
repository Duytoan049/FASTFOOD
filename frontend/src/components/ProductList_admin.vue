<script setup>

const emit = defineEmits(['select-product']);


defineProps({
    products: { type: Array, default: () => [] },
    selectedIndex: { type: Number, default: -1 },
    hotproducts: { type: Boolean, default: false }
});
</script>


<template>
    <div v-for="(product, index) in products" :class="{ active: index === selectedIndex }" :key="product.product_Id" @click="$emit('select-product', product)">

        <div class="box_sanphamadmin">
            <div class="sanpham_img">
                <p v-if="hotproducts">HOT</p>
                <img :src="product.product_Img" :alt="product.product_Name">
            </div>
            <div class="sanpham_ten">
                <h2>{{ product.product_Name }}</h2>
            </div>
            <div class="btn_order">
                <button>
                    {{ product.product_Price.toLocaleString('vi-VN') }}đ
                </button>
            </div>
        </div>

    </div>

</template>
