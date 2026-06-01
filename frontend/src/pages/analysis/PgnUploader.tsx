import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { useTranslation } from 'react-i18next';

interface PgnUploaderProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (pgn: string) => void;
}

export const PgnUploader = ({ open, onClose, onSubmit }: PgnUploaderProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pgn') && !file.name.endsWith('.txt')) {
      setError(t('analysis.upload.invalidFormat'));
      return;
    }

    if (file.size > 1024 * 1024) {
      setError(t('analysis.upload.tooLarge'));
      return;
    }

    setError('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setFileContent(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    const pgn = tab === 0 ? text.trim() : fileContent.trim();

    if (!pgn) {
      setError(t('analysis.upload.empty'));
      return;
    }

    setError('');
    onSubmit(pgn);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setText('');
    setFileName('');
    setFileContent('');
    setError('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('analysis.upload.title')}</DialogTitle>

      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab
            icon={<ContentPasteIcon />}
            iconPosition="start"
            label={t('analysis.upload.pasteTab')}
          />
          <Tab
            icon={<UploadFileIcon />}
            iconPosition="start"
            label={t('analysis.upload.fileTab')}
          />
        </Tabs>

        {tab === 0 && (
          <TextField
            multiline
            rows={10}
            fullWidth
            placeholder={t('analysis.upload.pastePlaceholder')}
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ fontFamily: 'monospace' }}
          />
        )}

        {tab === 1 && (
          <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
            <input
              ref={inputRef}
              type="file"
              accept=".pgn,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => inputRef.current?.click()}
            >
              {t('analysis.upload.chooseFile')}
            </Button>
            {fileName && (
              <Typography variant="body2" color="text.secondary">
                {fileName}
              </Typography>
            )}
            {fileContent && (
              <Box
                sx={{
                  width: '100%',
                  maxHeight: 200,
                  overflow: 'auto',
                  bgcolor: 'action.hover',
                  p: 1.5,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: 13,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {fileContent}
              </Box>
            )}
          </Stack>
        )}

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>{t('common.cancel')}</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={tab === 0 ? !text.trim() : !fileContent.trim()}
        >
          {t('analysis.upload.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};