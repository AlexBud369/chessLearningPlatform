const courseService = require('../services/courseService');
const { uploadCourseCover, handleUploadError } = require('../middleware/upload.middleware');

class CourseController {
  async create(req, res, next) {
    try {
      const course = await courseService.createCourse(req.body, req.user);
      res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, theme_id, search, sortBy, sortOrder, status, difficulty } = req.query;
      const filters = { theme_id, search };

      if (difficulty) {
        const parsedDifficulty = parseInt(difficulty, 10);
        if (parsedDifficulty >= 1 && parsedDifficulty <= 5) {
          filters.difficulty = parsedDifficulty;
        }
      }

      if (status && !req.user) {
        return res.status(401).json({ message: 'Authentication required for status filter' });
      }

      if (status && !['completed', 'not_completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status filter value' });
      }

      if (sortBy && !['title', 'created_at', 'difficulty'].includes(sortBy)) {
        return res.status(400).json({ message: 'Invalid sortBy value' });
      }

      const result = await courseService.getAllCourses(
        filters,
        sortBy,
        sortOrder,
        parseInt(page),
        parseInt(limit),
        req.user?.id,
        status
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      res.json(course);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await courseService.updateCourse(req.params.id, req.body, req.user);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id, req.user);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async uploadCover(req, res, next) {
    uploadCourseCover(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      next();
    });
  }

  async handleUploadCover(req, res, next) {
    try {
      const courseId = req.params.id;
      const filePath = req.file.path;
      const updatedCourse = await courseService.uploadCoverImage(courseId, filePath, req.user);
      res.json(updatedCourse);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();