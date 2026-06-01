import type { SelectProps } from '@mui/material/Select';

/** Select inside Dialog: menu renders above overflow clipping, works on 320px */
export const dialogSelectMenuProps: SelectProps['MenuProps'] = {
  disableScrollLock: true,
  PaperProps: {
    sx: {
      maxHeight: 280,
      maxWidth: 'calc(100vw - 16px)',
    },
  },
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  transformOrigin: { vertical: 'top', horizontal: 'left' },
};
