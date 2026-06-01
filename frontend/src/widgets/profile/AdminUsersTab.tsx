import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { adminApi, AdminUser } from '../../shared/api/adminApi';

export const AdminUsersTab = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers({ page, limit: 10 });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch {
      toast.error(t('profile.admin.loadError'));
    } finally {
      setLoading(false);
    }
  }, [page, t]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleBlock = async (user: AdminUser) => {
    setUpdatingId(user.id);
    try {
      await adminApi.setBlockedStatus(user.id, !user.is_blocked);
      toast.success(
        user.is_blocked ? t('profile.admin.unblocked') : t('profile.admin.blocked')
      );
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('profile.admin.updateError'));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('profile.admin.description')}
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('profile.firstName')}</TableCell>
              <TableCell>{t('profile.email')}</TableCell>
              <TableCell>{t('profile.role')}</TableCell>
              <TableCell>{t('profile.admin.status')}</TableCell>
              <TableCell align="right">{t('profile.admin.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{t(`profile.role_${user.role}`, { defaultValue: user.role })}</TableCell>
                <TableCell>
                  <Chip
                    label={user.is_blocked ? t('profile.admin.blockedStatus') : t('profile.admin.activeStatus')}
                    color={user.is_blocked ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {user.role !== 'admin' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color={user.is_blocked ? 'success' : 'error'}
                      disabled={updatingId === user.id}
                      onClick={() => handleToggleBlock(user)}
                    >
                      {user.is_blocked ? t('profile.admin.unblock') : t('profile.admin.block')}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination page={page} count={totalPages} onChange={(_, v) => setPage(v)} color="primary" />
        </Box>
      )}
    </>
  );
};
