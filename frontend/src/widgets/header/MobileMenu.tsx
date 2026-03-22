import React from 'react';
import { Drawer, Box, List, ListItemButton, ListItemText, Divider, Select, MenuItem } from '@mui/material';
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
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  onClose,
  menuItems,
  language,
  onLanguageChange,
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