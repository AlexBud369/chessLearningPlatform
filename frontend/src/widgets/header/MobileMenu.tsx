import React from 'react';
import { Drawer, Box, List, ListItemButton, ListItemText, ListItemIcon, Divider, Select, MenuItem } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  onClose,
  menuItems,
  language,
  onLanguageChange,
  themeMode,
  onToggleTheme,
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

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {menuItems.map((item, index) => (
            <ListItemButton key={index} onClick={() => handleItemClick(item)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
          <ListItemButton onClick={() => { onToggleTheme(); onClose(); }}>
            <ListItemIcon>
              {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </ListItemIcon>
            <ListItemText primary={t('theme.switch')} />
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton>
            <Select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="ru">{t('language.ru')}</MenuItem>
              <MenuItem value="en">{t('language.en')}</MenuItem>
            </Select>
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};