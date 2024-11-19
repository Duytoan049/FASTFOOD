<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProductList from '@/components/ProductList.vue';
import productsService from '@/services/product.services';

const router = useRouter();
const route = useRoute();

const totalPages = ref(1);
const currentPage = computed(() => {
    const page = Number(route.query?.page);
    if (Number.isNaN(page) || page < 1) return 1;
    return page;
});

const products = ref([]);

// Fetch products for the given page
async function retrieveProducts(page) {
    try {
        const response = await productsService.fetchProducts(page, 6, true);
        totalPages.value = response.metadata.lastPage ?? 1;
        products.value = response.products;
    } catch (error) {
        console.error(error);
    }
}

// Fetch products when current page changes
watch(currentPage, () => retrieveProducts(currentPage.value), { immediate: true });
</script>

<template>

    <body>
        <section class="home" id="home">
            <div class="home_container">
                <div class="home_text">
                    <h1>TwoT <br> <span>Fast Food</span></h1>
                    <p>Chúng tôi cam kết mang đến những hương vị tốt nhất cho khách hàng của mình.</p>

                    <div class="order_btn_now">
                        <router-link :to="{ name: 'menu' }" class="nav_link">
                            <button>Order now <i class="fa-solid fa-arrow-right"></i></button>
                        </router-link>
                    </div>
                </div>
                <div class="home_img">
                    <img src="/images/home/home.png" alt="Ly coffee">
                </div>
            </div>
        </section>

        <section class="menu" id="menu">
            <div class="heading">
                <div class="heading_content">
                    <h2>SẢN PHẨM NỔI BẬT</h2>
                </div>
            </div>

            <div class="product_list_container">
                <div class="product_list">
                    <ProductList :products :hotproducts="true" />


                </div>
            </div>

            <div class="btn_showmore">
                <router-link :to="{ name: 'menu' }" class="nav_link"><button>Xem tất cả</button></router-link>
            </div>
        </section>


        <!--  About -->
        <section class="about" id="about">
            <div class="heading">
                <div class="heading_content">
                    <h2>Hãy chọn chúng tôi</h2>
                    <p>We don’t just provide your meals, we make your day!</p>
                </div>
            </div>

            <div class="tieu_chi">
                <div class="box_tieuchi box1">
                    <div class="tieuchi_img">
                        <img src="/images/tieuchi/tieuchi2.png" alt="">
                    </div>
                    <div class="tieuchi_ten">
                        <h2>Chất lượng cao</h2>
                    </div>
                    <div class="tieuchi_mota">
                        <p>Chúng tôi mang đến cho bạn những món ăn với chất lượng cao nhất</p>
                    </div>
                </div>

                <div class="box_tieuchi">
                    <div class="tieuchi_img">
                        <img src="/images/tieuchi/tieuchi1.png" alt="">
                    </div>
                    <div class="tieuchi_ten">
                        <h2>Đặc biệt</h2>
                    </div>
                    <div class="tieuchi_mota">
                        <p>Hương vị mà bạn không thể nào quên</p>
                    </div>
                </div>

                <div class="box_tieuchi">
                    <div class="tieuchi_img">
                        <img src="/images/tieuchi/tieuchi3.png" alt="">
                    </div>
                    <div class="tieuchi_ten">
                        <h2>Giao hàng nhanh</h2>
                    </div>
                    <div class="tieuchi_mota">
                        <p>Dịch vụ giao hàng nhanh chóng</p>
                    </div>
                </div>

                <div class="box_tieuchi">
                    <div class="tieuchi_img">
                        <img src="/images/tieuchi/tieuchi4.png" alt="">
                    </div>
                    <div class="tieuchi_ten">
                        <h2>Giá cả phải chăng</h2>
                    </div>
                    <div class="tieuchi_mota">
                        <p>Giá cả phù hợp với túi tiền của bạn</p>
                    </div>
                </div>
            </div>

            <div class="tieuchi_footer">
                <div class="footer_content">
                    <h2>Get started today.</h2>
                </div>
            </div>

            <div class="btn_joinmember">
                <router-link :to="{ name: 'signup' }"><button>Trở thành thành viên</button></router-link>
            </div>
        </section>


        <section class="footer" id="footer">
            <div class="contact_txt">
                <h2>2T Fast Food</h2>
            </div>

            <div class="footer_container">
                <div class="footer_box">
                    <h3>Kết nối với chúng tôi:</h3>
                    <div class="social">
                        <a href="#" id=""><i class="fa-brands fa-facebook"></i></a>
                        <a href="#" id=""><i class="fa-brands fa-instagram"></i></a>
                        <a href="#" id=""><i class="fa-brands fa-tiktok"></i></a>
                    </div>
                </div>

                <div class="footer_box">
                    <h3>Mở cửa:</h3>
                    <li>Thứ 2 - Thứ 6: 8h30-22:00</li>
                    <li>Thứ 7 - Chủ nhật: 7h30-23:00</li>
                    <li>Giao hàng từ 9h00-21h30 các ngày làm việc trong tuần</li>


                </div>

                <div class="footer_box">
                    <h3>Liên hệ:</h3>
                    <div class="contact">
                        <li><i class="fa-solid fa-location-dot"></i><a href="">1A, Phường B, Quận Ninh Kiều, Thành phố
                                Cần Thơ</a></li>
                        <li><i class="fa-solid fa-phone"></i><a href="tel:+84123456789">+84123456789</a> </li>
                        <li><i class="fa-solid fa-envelope"></i><a href="">2tfastfood@gmail.com</a></li>
                    </div>
                </div>
            </div>

            <div class="design_by">
                <h3>Design by Lê Huy Toàn - Võ Duy Toàn</h3>
            </div>
        </section>
    </body>
</template>

<style>
/* Google fonts */
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Clicker+Script&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

/* @import url('https://fonts.cdnfonts.com/css/advertising-script'); */

@import url('https://fonts.cdnfonts.com/css/superdie');

* {
    margin: 0;
    padding: 0;
    text-decoration: none;
    border: none;
    outline: none;
    box-sizing: border-box;
    font-family: "Chakra Petch", sans-serif;
    max-width: 100vw;
}

.home {
    min-height: 100vh;
    padding: 70px;
}


/* color */
:root {
    --text-color: #fff;
    --main-text-color: black;
    --background-color: #FFFEFC;
    --special-color: #FF7E00;
}

/* _________________________________________Home _________________________________________*/
.home {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    /* background-color: #F4ECE1; */
    background-color: var(--background-color);
}

.home_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

}

.home_text {
    margin-left: 10px;
    flex: 1;
}

.home_text h1 {
    color: var(--text-color);
    font-size: 100px;
    letter-spacing: 5px;
    color: #FF7E00;
    font-family: 'Superdie', sans-serif;
    text-align: left;
    font-weight: 500;

}

.home_text p {
    color: black;
    font-size: 20px;
    text-align: left;
    font-style: italic;
    letter-spacing: 2px;
}

.home_text span {
    color: var(--special-color);
    /* font-family: 'Advertising Script', sans-serif; */
    font-family: 'Superdie', sans-serif;
    font-size: 90px;
    font-style: italic;
    font-weight: 550;
}

.home_img img {
    width: 600px;
    height: 600px;
}

.home_img {
    flex: 0.7;
}


.fa-arrow-right {
    color: var(--text-color);
}

.order_btn_now {
    display: flex;
    justify-content: center;
    margin-top: 25px;
}

.order_btn_now button {
    transition: 0.3s;
    background-color: var(--special-color);
    border-radius: 0.65rem;
    width: 150px;
    height: 40px;
    cursor: pointer;
    color: var(--text-color);
    font-weight: bold;
    text-align: center;
}

.order_btn_now button:hover {
    background-color: var(--special-color);
    scale: 1.1;
}



/* _________________________________________About_________________________________________ */
.about {
    background-color: var(--background-color);
    padding: 50px 120px 60px 120px;
}

.about .heading {
    display: flex;
    justify-content: center;
    align-items: center;
}

.heading_content {
    width: 60%;
}

.about .heading h2 {
    font-family: "Chakra Petch", sans-serif;
    font-size: 40px;
    font-style: normal;
    color: var(--main-text-color);
    text-align: center;
    text-transform: uppercase;
    color: var(--special-color);
}

.about .heading p {
    font-size: 18px;
    margin: 15px;
    text-align: center;
}

.tieu_chi {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
}

.box_tieuchi {
    width: 280px;
    height: 284px;
    background-color: #fff7f1;
    border: 1px solid rgba(249, 151, 106, 0.6);
    color: var(--main-text-color);
    cursor: pointer;
    transition: 0.3s;
}

.box_tieuchi:hover {
    scale: 1.05;
}

.box1 {
    background-color: #f8c8a5;
}


.tieuchi_img {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 36px;
}

.tieuchi_img img {
    width: 88px;
    height: 88px;
}

.tieuchi_ten {
    display: flex;
    justify-content: center;
}

.tieuchi_ten h2 {
    font-family: "Playfair Display";
    font-size: 22px;
    margin: 15px 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-align: center;

}

.tieuchi_mota {
    display: flex;
    justify-content: center;
    text-decoration: none;
}

.tieuchi_mota p {
    font-size: 17px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    padding: 0 10px;
    margin-top: 5px;
}

.about .tieuchi_footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 25px;
}

.footer_content {
    width: 60%;
}

.about .tieuchi_footer h2 {
    font-family: "Playfair Display";
    font-size: 30px;
    font-style: normal;
    color: var(--main-text-color);
    text-align: center;

}

.about .tieuchi_footer p {
    font-size: 18px;
    margin: 15px;
    text-align: center;
}

.btn_joinmember {
    display: flex;
    justify-content: center;
}

.btn_joinmember button {
    margin: 0;
    width: 250px;
    height: 48px;
    border-radius: 24px;
    background: #B43F3F;
    box-shadow: 0px 6px 12px 0px rgba(62, 121, 6, 0.4);
    transition: 0.3s;
    margin-top: 50px;
    font-size: 15px;
    color: #fff;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
}

.btn_joinmember button:hover {
    background: #B43F3F;
    scale: 1.1;
}


.box_sanpham {
    width: 280px;
    height: 368px;
    background-color: #fff7f1;
    border: 1px solid rgba(249, 173, 106, 0.6);
    color: var(--main-text-color);
    cursor: pointer;
    transition: 0.3s;
}

.sanpham_img {
    overflow: hidden;
    position: relative;
    width: 279px;
    height: 222px;
    border-bottom: 1px solid rgba(249, 173, 106, 0.6);
}

.sanpham_img p {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #ff5e00;
    padding: 5px;
    color: #fff;
    width: 60px;
    text-align: center;
    font-weight: bold;
}

.sanpham_img img {
    width: 280px;
    height: 280px;
    transition: 0.3s;
}

.box_sanpham:hover img {
    scale: 1.12;
}

.box_sanpham:hover {
    scale: 1.05;
}

.sanpham_ten {
    display: flex;
    justify-content: center;
    text-align: center;
}

.sanpham_ten h2 {
    font-family: "Playfair Display";
    font-size: 22px;
    margin: 7px 0;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.sanpham_thanhphan {
    display: flex;
    justify-content: center;
}

.sanpham_thanhphan h1 {
    font-family: "Playfair Display";
    font-size: 22px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    margin-top: 5px;
}

.sanpham_gia {
    display: flex;
    justify-content: center;
    margin: 5px 0;
    text-decoration: none;
}

.sanpham_gia h1 {
    font-family: "Playfair Display";
    font-size: 22px;
    font-style: normal;
    font-weight: 900;
    margin-bottom: 7px;
}

.btn_order {
    display: flex;
    justify-content: center;

}

.btn_order button {
    margin: 0;
    width: 134px;
    height: 48px;
    border-radius: 24px;
    background-color: #fff7f1;
    border: 1px solid var(--special-color);
    box-shadow: 0px 6px 12px 0px rgba(62, 121, 6, 0.4);
    cursor: pointer;
    color: var(--special-color);
    font-size: 20px;
    font-weight: bold;
}

.btn_order button:hover {
    background: var(--special-color);
    color: var(--text-color);
}

.btn_showmore {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}

.btn_showmore button {
    margin: 0;
    width: 200px;
    height: 48px;
    border-radius: 24px;
    background: var(--special-color);
    box-shadow: 0px 6px 12px 0px rgba(62, 121, 6, 0.4);
    transition: 0.3s;
    margin-top: 10px;
    font-size: 15px;
    cursor: pointer;
    color: #fff;
    font-size: 17px;
    font-weight: bold;
}

.btn_showmore button:hover {
    scale: 1.1;
}

/* _________________________________________Menu_________________________________________ */

.menu {
    /* background-color: var(--background-color); */
    background-color: #557C56;
    padding: 70px 0px 50px 0px;
}

.menu .heading {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
}

.heading_content {
    width: 60%;
}

.menu .heading h2 {
    font-family: "Chakra Petch", sans-serif;
    font-size: 40px;
    font-style: normal;
    color: var(--text-color);
    text-align: center;
    text-transform: uppercase;

}

.menu .heading p {
    font-size: 18px;
    margin: 15px;
    text-align: center;
}

.product_list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    row-gap: 80px;
    justify-items: center;
}

.product_list .box_sanpham:nth-child(4),
.product_list .box_sanpham:nth-child(5) {
    grid-column: span 1;
    /* Đảm bảo mỗi sản phẩm chiếm 1 cột */
    justify-self: center;
    /* Căn giữa các sản phẩm */
}

.product_list_container {
    display: flex;
    justify-content: center;
}

.box_sanpham {
    width: 280px;
    height: 368px;
    background-color: #fff7f1;
    border: 1px solid rgba(249, 173, 106, 0.6);
    color: var(--main-text-color);
    cursor: pointer;
    transition: 0.3s;
}

.sanpham_img {
    overflow: hidden;
    position: relative;
    width: 279px;
    height: 222px;
    border-bottom: 1px solid rgba(249, 173, 106, 0.6);
}

.sanpham_img p {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #ff5e00;
    padding: 5px;
    color: #fff;
    width: 60px;
    text-align: center;
    font-weight: bold;
}

.sanpham_img img {
    width: 280px;
    height: 280px;
    transition: 0.3s;
}

.box_sanpham:hover img {
    scale: 1.12;
}

.box_sanpham:hover {
    scale: 1.05;
}

.sanpham_ten {
    display: flex;
    justify-content: center;
    text-align: center;
}

.sanpham_ten h2 {
    font-family: "Playfair Display";
    font-size: 22px;
    margin: 7px 0;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.sanpham_thanhphan {
    display: flex;
    justify-content: center;
}

.sanpham_thanhphan h1 {
    font-family: "Playfair Display";
    font-size: 22px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    margin-top: 5px;
}

.sanpham_gia {
    display: flex;
    justify-content: center;
    margin: 5px 0;
    text-decoration: none;
}

.sanpham_gia h1 {
    font-family: "Playfair Display";
    font-size: 22px;
    font-style: normal;
    font-weight: 900;
    margin-bottom: 7px;
}

.btn_order {
    display: flex;
    justify-content: center;

}

.btn_order button {
    margin: 0;
    width: 134px;
    height: 48px;
    border-radius: 24px;
    background-color: #fff7f1;
    border: 1px solid var(--special-color);
    box-shadow: 0px 6px 12px 0px rgba(62, 121, 6, 0.4);
    cursor: pointer;
    color: var(--special-color);
    font-size: 20px;
    font-weight: bold;
}

.btn_order button:hover {
    background: var(--special-color);
    color: var(--text-color);
}

.btn_showmore {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}

.btn_showmore button {
    margin: 0;
    width: 200px;
    height: 48px;
    border-radius: 24px;
    background: #B43F3F;
    box-shadow: 0px 6px 12px 0px rgba(62, 121, 6, 0.4);
    transition: 0.3s;
    margin-top: 10px;
    font-size: 15px;
    cursor: pointer;
    color: #fff;
    font-size: 17px;
    font-weight: bold;
}

.btn_showmore button:hover {
    scale: 1.1;
}

/* _________________________________________Footer_________________________________________ */
.footer {
    background-image: url(/images/banner/hero-bg.jpg);
    color: var(--text-color);
    min-height: 430px;
    position: relative;
}

.footer_container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 20px 30px;
}

.contact_txt {
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    height: 100px;
}

.contact_txt h2 {
    font-size: 60px;
    font-family: 'Superdie', sans-serif;
    color: var(--text-color);
    letter-spacing: 10px;
    text-transform: uppercase;

}

.footer_box h3 {
    font-size: 30px;
    margin-bottom: 10px;
    color: rgb(255, 157, 46);
    ;
    font-weight: bold;

}

.footer_box a,
.footer_box li {
    font-size: 17px;
    margin-top: 15px;
    color: var(--text-color);
}

.footer_box li {
    list-style: none;
    cursor: pointer;
}

.footer_box li:hover {
    text-decoration: underline;
}

.social {
    display: flex;
    align-items: center;
    column-gap: 2rem;
}

.social .fa-brands {
    font-size: 35px;
    padding: 15px;
    border-radius: 0.5rem;
    transition: 0.3s;
}

.social .fa-brands:hover {
    background-color: #ad230b;

}

.contact a {
    margin-left: 16px;
    text-decoration: none;
}

.contact span:hover,
.contact a:hover {
    text-decoration: underline;
}

.source {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 2px solid #603809;
    margin-top: 20px;
    padding: 5px;
}

.design_by {
    background-color: black;
    height: 45px;
    width: 80%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 20px 20px 0 0;
}


.design_by h3 {
    color: var(--text-color);
    font-size: 20px;
    text-align: center;
    padding: 9px;

}

</style>