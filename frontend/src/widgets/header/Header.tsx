import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Select,
  MenuItem,
  IconButton,
  Menu,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../shared/lib/hooks';
import { logout } from '../../entities/user/model/store';
import { toggleTheme } from '../../entities/theme/model/store';
import { authApi } from '../../shared/api/authApi';
import { tokenStorage } from '../../shared/lib/tokenStorage';
import { resetAppSettings } from '../../shared/lib/resetAppSettings';
import { ROUTES } from '../../shared/constants/routes';
import { LOGO_SRC } from '../../shared/constants/assets';
import { getPublicNavItems } from '../../shared/constants/navigation';
import { MobileMenu } from './MobileMenu';
import { ConfirmDialog } from '../../shared/ui/ConfirmDialog/ConfirmDialog';

export const Header = () => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { t, i18n } = useTranslation();
  const user = useAppSelector((state) => state.user.user);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const navItems = getPublicNavItems(user);

  const handleLogoutRequest = () => {
    setUserMenuAnchor(null);
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    try {
      await authApi.logout();
    } catch {
      // proceed with local logout even if API fails
    }
    tokenStorage.remove();
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleResetSettings = () => {
    resetAppSettings(dispatch);
    toast.success(t('settings.resetSuccess'));
    window.location.reload();
  };

  const mobileMenuItems = [
    ...navItems.map((item) => ({
      text: t(item.labelKey),
      path: item.path,
    })),
    ...(user
      ? [
          { text: t('header.profile'), path: ROUTES.PROFILE },
          { text: t('header.logout'), action: handleLogoutRequest },
        ]
      : []),
  ];

  return (
    <AppBar position="static" sx={{ flexShrink: 0 }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 1440,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <Link
              to={ROUTES.HOME}
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 8 }}
            >
              <Box
                component="img"
                src={LOGO_SRC}
                alt={t('header.title')}
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.endsWith('logo.jpg')) {
                    img.src = '/images/background/logo.jpg';
                  }
                }}
                sx={{
                  height: { xs: 36, sm: 44 },
                  width: 'auto',
                  maxWidth: { xs: 120, sm: 160 },
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Link>
          </Box>

          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {navItems.map((item) => (
                <Button key={item.key} color="inherit" component={Link} to={item.path} size="small">
                  {t(item.labelKey)}
                </Button>
              ))}

              <Select
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                sx={{
                  color: 'white',
                  ml: 0.5,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                }}
                size="small"
              >
                <MenuItem value="ru">{t('language.ru')}</MenuItem>
                <MenuItem value="en">{t('language.en')}</MenuItem>
              </Select>

              <IconButton onClick={handleToggleTheme} color="inherit" size="small" aria-label={t('theme.switch')}>
                {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>

              <IconButton
                onClick={handleResetSettings}
                color="inherit"
                size="small"
                aria-label={t('header.resetSettings')}
              >
                <SettingsBackupRestoreIcon />
              </IconButton>

              {user && (
                <>
                  <IconButton
                    color="inherit"
                    onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                    aria-label={t('header.profile')}
                    size="small"
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={() => setUserMenuAnchor(null)}
                  >
                    <MenuItem
                      component={Link}
                      to={ROUTES.PROFILE}
                      onClick={() => setUserMenuAnchor(null)}
                    >
                      {t('header.profile')}
                    </MenuItem>
                    <MenuItem onClick={handleLogoutRequest}>{t('header.logout')}</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          ) : (
            <>
              <IconButton color="inherit" onClick={toggleDrawer(true)} edge="end" aria-label={t('header.menu')}>
                <MenuIcon />
              </IconButton>
              <MobileMenu
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                menuItems={mobileMenuItems}
                language={i18n.language}
                onLanguageChange={handleLanguageChange}
                themeMode={themeMode}
                onToggleTheme={handleToggleTheme}
                onResetSettings={handleResetSettings}
                isAuthenticated={Boolean(user)}
              />
            </>
          )}
        </Box>
      </Toolbar>
      <ConfirmDialog
        open={logoutDialogOpen}
        title={t('header.logoutConfirmTitle')}
        message={t('header.logoutConfirmMessage')}
        confirmLabel={t('header.logoutConfirmYes')}
        cancelLabel={t('header.logoutConfirmNo')}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutDialogOpen(false)}
        confirmColor="error"
      />
    </AppBar>
  );
};
