import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Button, Select, MenuItem, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../shared/lib/hooks';
import { logout } from '../../entities/user/model/store';
import { authApi } from '../../shared/api/authApi';
import { tokenStorage } from '../../shared/lib/tokenStorage';
import { ROUTES } from '../../shared/constants/routes';
import { MobileMenu } from './MobileMenu';

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t, i18n } = useTranslation();
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await authApi.logout();
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

  const menuItems = user
    ? [
        { text: t('header.profile'), path: ROUTES.PROFILE },
        { text: t('header.logout'), action: handleLogout },
      ]
    : [
        { text: t('header.login'), path: ROUTES.LOGIN },
        { text: t('header.register'), path: ROUTES.REGISTER },
      ];

  return (
    <AppBar position="static">
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to={ROUTES.HOME} style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="Logo" height="40" style={{ marginRight: '8px' }} />
            </Link>
          </Box>

          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Select
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                }}
                size="small"
              >
                <MenuItem value="ru">{t('language.ru')}</MenuItem>
                <MenuItem value="en">{t('language.en')}</MenuItem>
              </Select>

              {user ? (
                <>
                  <Button color="inherit" component={Link} to={ROUTES.PROFILE}>
                    {t('header.profile')}
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    {t('header.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to={ROUTES.LOGIN}>
                    {t('header.login')}
                  </Button>
                  <Button color="inherit" component={Link} to={ROUTES.REGISTER}>
                    {t('header.register')}
                  </Button>
                </>
              )}
            </Box>
          ) : (
            <>
              <IconButton color="inherit" onClick={toggleDrawer(true)} edge="end">
                <MenuIcon />
              </IconButton>
              <MobileMenu
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                menuItems={menuItems}
                language={i18n.language}
                onLanguageChange={handleLanguageChange}
              />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};