module.exports = (models) => {
  const {
    User,
    RefreshToken,
    Theme,
    Course,
    Lesson,
    Task,
    CourseTask,
    UserProgress,
    Game,
    AnalysisNode,
    TrainerStudent,
    Favorite,
    UserTaskResult,
    AssignedCourse,           
  } = models;

  User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens', onDelete: 'CASCADE' });
  RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Theme.hasMany(Course, { foreignKey: 'theme_id', as: 'courses' });
  Course.belongsTo(Theme, { foreignKey: 'theme_id', as: 'theme' });

  User.hasMany(Course, { foreignKey: 'author_id', as: 'authoredCourses' });
  Course.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

  Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons', onDelete: 'CASCADE' });
  Lesson.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

  Theme.hasMany(Task, { foreignKey: 'theme_id', as: 'tasks' });
  Task.belongsTo(Theme, { foreignKey: 'theme_id', as: 'theme' });

  User.hasMany(Task, { foreignKey: 'author_id', as: 'authoredTasks' });
  Task.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

  Course.belongsToMany(Task, { through: CourseTask, foreignKey: 'course_id', otherKey: 'task_id', as: 'tasks' });
  Task.belongsToMany(Course, { through: CourseTask, foreignKey: 'task_id', otherKey: 'course_id', as: 'courses' });

  User.hasMany(UserProgress, { foreignKey: 'user_id', as: 'progress' });
  UserProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Course.hasMany(UserProgress, { foreignKey: 'course_id', as: 'progressRecords' });
  UserProgress.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

  Lesson.hasMany(UserProgress, { foreignKey: 'lesson_id', as: 'progressRecords' });
  UserProgress.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

  Task.hasMany(UserProgress, { foreignKey: 'task_id', as: 'progressRecords' });
  UserProgress.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

  User.hasMany(Game, { foreignKey: 'user_id', as: 'games', onDelete: 'CASCADE' });
  Game.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Game.hasMany(AnalysisNode, { foreignKey: 'game_id', as: 'analysisNodes', onDelete: 'CASCADE' });
  AnalysisNode.belongsTo(Game, { foreignKey: 'game_id', as: 'game' });

  User.hasMany(AnalysisNode, { foreignKey: 'user_id', as: 'analysisNodes' });
  AnalysisNode.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  AnalysisNode.hasMany(AnalysisNode, { foreignKey: 'parent_id', as: 'children', onDelete: 'CASCADE' });
  AnalysisNode.belongsTo(AnalysisNode, { foreignKey: 'parent_id', as: 'parent' });

  User.hasMany(TrainerStudent, { foreignKey: 'trainer_id', as: 'studentsRelations' });
  User.hasMany(TrainerStudent, { foreignKey: 'student_id', as: 'trainersRelations' });
  TrainerStudent.belongsTo(User, { foreignKey: 'trainer_id', as: 'trainer' });
  TrainerStudent.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

  User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites', onDelete: 'CASCADE' });
  Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  User.hasMany(UserTaskResult, { foreignKey: 'user_id', as: 'taskResults', onDelete: 'CASCADE' });
  UserTaskResult.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Task.hasMany(UserTaskResult, { foreignKey: 'task_id', as: 'userResults', onDelete: 'CASCADE' });
  UserTaskResult.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

  User.hasMany(AssignedCourse, { foreignKey: 'student_id', as: 'assignedCourses', onDelete: 'CASCADE' });
  User.hasMany(AssignedCourse, { foreignKey: 'assigned_by', as: 'coursesAssignedByMe', onDelete: 'CASCADE' });
  Course.hasMany(AssignedCourse, { foreignKey: 'course_id', as: 'assignments', onDelete: 'CASCADE' });

  AssignedCourse.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
  AssignedCourse.belongsTo(User, { foreignKey: 'assigned_by', as: 'assigner' });
  AssignedCourse.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
};