/**
 * 1:1 same data as in test database copied here for convenience
 */
module.exports = {
  user: {
    admin: {
      id: "2",
      email: "1@test.test",
      passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
      firstname: "1",
      lastname: "Admin",
      role: "admin",
      isActive: true,
      isRetired: false,
      createdAt: "2016-11-02 15:13:17.034 +00:00",
      updatedAt: "2016-11-02 15:18:59.847 +00:00",
      StudyFieldId: null,
    },
    professor: {
      id: 3,
      email: "2@test.test",
      passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
      firstName: "2",
      lastname: "Professor",
      role: "professor",
      isActive: true,
      isRetired: false,
      createdAt: "2016-11-02 15:13:17.035 +00:00",
      updatedAt: "2016-11-02 15:18:16.050 +00:00",
      StudyFieldId: null,
    },
    instructor: {
      id: 5,
      email: "4@test.test",
      passwordHash: "$2a$10$HG9eWsyyqecDc/SiHWD8j.a7EK2d4phxxN.4aa1SKhBzS1s9Wmqd6",
      firstname: "4",
      lastname: "Instructor",
      role: "instructor",
      isActive: true,
      isRetired: false,
      createdAt: "2016-11-02 15:16:19.846 +00:00",
      updatedAt: "2016-11-02 15:17:35.024 +00:00",
      StudyFieldId: null,
    }
  }
}
