import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { assignedCoursesApi, type AssignedCourse } from '../../../shared/api/assignedCoursesApi';

interface Student {
  id: number;
  username: string;
  email: string;
}

export const useAssignCourse = () => {
  const { t } = useTranslation();

  const [assigning, setAssigning] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [myCourses, setMyCourses] = useState<AssignedCourse[]>([]);
  const [myCoursesTotalPages, setMyCoursesTotalPages] = useState(1);
  const [loadingMyCourses, setLoadingMyCourses] = useState(false);

  const assignCourse = useCallback(
    async (studentId: number, courseId: number) => {
      setAssigning(true);

      try {
        const checkResponse = await assignedCoursesApi.checkAssigned(studentId, courseId);

        if (checkResponse.data.assigned) {
          toast.warn(t('assign.alreadyAssigned'));
          return false;
        }

        await assignedCoursesApi.assignCourse(studentId, courseId);
        toast.success(t('assign.success'));
        return true;
      } catch {
        toast.error(t('assign.error'));
        return false;
      } finally {
        setAssigning(false);
      }
    },
    [t]
  );

  const removeAssignment = useCallback(
    async (studentId: number, courseId: number) => {
      try {
        await assignedCoursesApi.removeAssignment(studentId, courseId);
        toast.success(t('assign.removed'));
        return true;
      } catch {
        toast.error(t('assign.removeError'));
        return false;
      }
    },
    [t]
  );

  const loadCourseStudents = useCallback(
    async (courseId: number) => {
      setLoadingStudents(true);

      try {
        const response = await assignedCoursesApi.getCourseStudents(courseId);
        setStudents(response.data);
      } catch {
        toast.error(t('assign.loadStudentsError'));
      } finally {
        setLoadingStudents(false);
      }
    },
    [t]
  );

  const loadMyCourses = useCallback(
    async (page = 1, limit = 12) => {
      setLoadingMyCourses(true);

      try {
        const response = await assignedCoursesApi.getMyCourses({ page, limit });
        setMyCourses(response.data.assignments);
        setMyCoursesTotalPages(response.data.totalPages || 1);
      } catch {
        toast.error(t('assign.loadMyCoursesError'));
      } finally {
        setLoadingMyCourses(false);
      }
    },
    [t]
  );

  return {
    assigning,
    assignCourse,
    removeAssignment,
    students,
    loadingStudents,
    loadCourseStudents,
    myCourses,
    myCoursesTotalPages,
    loadingMyCourses,
    loadMyCourses,
  };
};