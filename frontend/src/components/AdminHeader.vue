<script>

</script>

<template>
    <div class="sidebar">
        <header>ADMIN</header>
        <ul>
            <li><router-link :to="{ name: 'productadmin' }" class="nav_link">PRODUCT</router-link></li>
            <li><router-link :to="{ name: 'customeradmin' }" class="nav_link">CUSTOMER</router-link></li>
            <li></li>

        </ul>
    </div>
</template>

<style>
.sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    width: 180px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 100;
    color: white;
}

.sidebar header {
    text-align: center;
    line-height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #63e6be;
    font-size: 40px;
    font-weight: 900;
}

.sidebar header a {

    color: white;
    text-align: center;
    line-height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #D04848;
    text-decoration: none
}

.sidebar ul {
    text-decoration: none;
    list-style-type: none;
    padding-left: 0;
}

.sidebar ul a {
    display: block;
    height: 100%;
    width: 100%;
    line-height: 65px;
    font-size: 20px;
    color: white;
    padding-left: 5px;
    box-sizing: border-box;
    border-bottom: 1px solid black;
    border-top: 1px solid rgba(255, 255, 255, .1);
    transition: .4s;
    text-decoration: none;
}

ul li:hover a {
    background-color: #3d9178;
}
</style>