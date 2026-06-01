import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface MenuItemType {
  text: string;
  path?: string;
  action?: () => void;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  menuItems: MenuItemType[];
  language: string;
  onLanguageChange: (lang: string) => void;
  themeMode: 'light' | 'dark';
  onToggleTheme: () => void;
  onResetSettings: () => void;
  isAuthenticated: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  onClose,
  menuItems,
  language,
  onLanguageChange,
  themeMode,
  onToggleTheme,
  onResetSettings,
  isAuthenticated,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleItemClick = (item: MenuItemType) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    onClose();
  };

  const navItems = menuItems.filter((item) => !item.action || item.path);
  const actionItems = menuItems.filter((item) => item.action && !item.path);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: 'min(100vw - 48px, 300px)', sm: 300 } } }}>
      <Box role="presentation" sx={{ py: 1 }}>
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          {t('header.menu')}
        </Typography>

        <List dense>
          {navItems.map((item, index) => (
            <ListItemButton key={`${item.text}-${index}`} onClick={() => handleItemClick(item)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        {actionItems.length > 0 && (
          <>
            <Divider />
            <List dense>
              {actionItems.map((item, index) => (
                <ListItemButton key={`action-${index}`} onClick={() => handleItemClick(item)}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </>
        )}

        <Divider sx={{ my: 1 }} />

        <List dense>
          <ListItemButton
            onClick={() => {
              onToggleTheme();
              onClose();
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </ListItemIcon>
            <ListItemText primary={t('theme.switch')} />
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              onResetSettings();
              onClose();
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SettingsBackupRestoreIcon />
            </ListItemIcon>
            <ListItemText primary={t('header.resetSettings')} />
          </ListItemButton>
        </List>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            {t('language.ru')}/{t('language.en')}
          </Typography>
          <Select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="ru">{t('language.ru')}</MenuItem>
            <MenuItem value="en">{t('language.en')}</MenuItem>
          </Select>
        </Box>

        {isAuthenticated && (
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, display: 'block' }}>
            {t('header.profile')}
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};
