/**
 * 1:1 same data as in test database copied here for convenience
 */
module.exports = {
  user: {
    admin: {
      id: 1,
      email: "ohtugrappa@gmail.com",
      firstname: "First",
      lastname: "Admin",
      role: "admin",
      isActive: true,
      isRetired: false,
      StudyFieldId: null,
      passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    },
    professor: {
      id: 2,
      email: "ohtugrappa2@gmail.com",
      firstname: "Second",
      lastname: "Proffa",
      role: "professor",
      isActive: true,
      isRetired: false,
      StudyFieldId: 1,
      passwordHash: "$2a$10$fMNq6gxAyrO7422piQplh.jca1iJaJTEFPWVJ5jsJgBeUrTQOvN9C",
    },
    instructor: {
      id: 4,
      email: "ohtugrappa4@gmail.com",
      firstname: "Fourth",
      lastname: "Instructor",
      role: "instructor",
      isActive: true,
      isRetired: false,
      StudyFieldId: 1,
      passwordHash: "$2a$10$5mOHm69eXRjjmQJf8/qbZeo0OzjSL7SUeXbuup50TfcUp3t/X8KwC",
    }
  }
}