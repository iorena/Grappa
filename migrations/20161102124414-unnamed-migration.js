'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn("EmailStatuses", "ThesisId", {
      type: Sequelize.INTEGER,
    })

    queryInterface.addColumn("CouncilMeeting", "studentDeadline", {
      type: Sequelize.DATE,
      validate: {
        isDate: true,
        notEmpty: true,
      },
    })
    queryInterface.addColumn("CouncilMeeting", "instructorDeadline", {
      type: Sequelize.DATE,
      validate: {
        isDate: true,
        notEmpty: true,
      },
    })
    queryInterface.removeColumn('CouncilMeetings', 'deadline')
    queryInterface.removeColumn('Theses', 'ethesis')

  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
