const { faker } = require('@faker-js/faker');

function createCustomer() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    phone: faker.string.numeric('09########'),
    gender: faker.number.int({ 
      min: 0, //Female
      max: 1  //Male
    }),
    avatar: '/public/images/blank-profile-picture.png',
  };
}

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.seed = async function (knex) {
  await knex('customers').del();
  await knex('customers').insert(Array(25).fill().map(createCustomer));
};
