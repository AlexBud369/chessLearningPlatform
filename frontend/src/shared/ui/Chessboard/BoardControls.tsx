import { Button, Stack } from '@mui/material';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useTranslation } from 'react-i18next';

interface BoardControlsProps {
  onFlipBoard: () => void;
  onSwitchTurn?: () => void;
  showSwitchTurn?: boolean;
}

export const BoardControls = ({ onFlipBoard, onSwitchTurn, showSwitchTurn = true }: BoardControlsProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
      <Button size="small" variant="outlined" startIcon={<FlipCameraAndroidIcon />} onClick={onFlipBoard}>
        {t('boardControls.flipBoard')}
      </Button>
      {showSwitchTurn && onSwitchTurn && (
        <Button size="small" variant="outlined" startIcon={<SwapHorizIcon />} onClick={onSwitchTurn}>
          {t('boardControls.switchTurn')}
        </Button>
      )}
    </Stack>
  );
};
