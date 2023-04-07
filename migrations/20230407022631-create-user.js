'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nik: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      tgl_lahir: {
        type: Sequelize.DATE
      },
      nama: {
        type: Sequelize.STRING
      },
      dep: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Departemens'
          },
          key: 'id',
        },
      },
      wa: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};