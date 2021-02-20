exports.up = function (knex) {
  return knex.schema
    .createTable('Products', (table) => {
      table.increments('productID').primary();
      table.string('productName').notNullable();
      table.integer('cost').notNullable();
      table.integer('discount');
    })
    .createTable('Images', (table) => {
      table.increments('imageID').primary();
      table.string('fileDirectory').notNullable();
      table.boolean('isPrimaryMiniView').notNullable();
      table.boolean('isPrimaryDetailView').notNullable();
      table.integer('productID').unsigned().references('Products.productID');
    })
    .createTable('Colors', (table) => {
      table.increments('colorID').primary();
      table.string('fileDirectory').notNullable();
      table.integer('productID').unsigned().references('Products.productID');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('Colors')
    .dropTable('Images')
    .dropTable('Products');
};
