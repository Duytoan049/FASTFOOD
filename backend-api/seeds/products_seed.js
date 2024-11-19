const { faker } = require('@faker-js/faker');

function createProduct() {
  return {
    product_Name: faker.commerce.productName(),
    product_Price: faker.number.int({ min: 1000, max: 100000 }), // Giá sản phẩm từ 1.000 đến 100.000
    product_Img: faker.image.url() // Tạo URL hình ảnh giả
  };
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('products').del();
  await knex('products').insert(Array(25).fill().map(createProduct)); // Chèn 25 sản phẩm giả
};
