import React, { useMemo, useState } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  DeleteOutline as DeleteOutlineIcon,
  Edit as EditIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

function formatTimeLabel(value) {
  if (!value) return 'No timestamp';
  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return String(value);
  }
}

function HistoryItem({
  item,
  isActive,
  isRenaming,
  renameValue,
  onSelect,
  onStartRename,
  onRenameValueChange,
  onConfirmRename,
  onCancelRename,
  onDelete,
}) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: isActive ? '#93C5FD' : '#E2E8F0',
        backgroundColor: isActive ? '#EFF6FF' : '#FFFFFF',
        borderRadius: '12px',
        p: 1.5,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {isRenaming ? (
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                value={renameValue}
                onChange={(e) => onRenameValueChange(e.target.value)}
                fullWidth
              />
              <IconButton size="small" onClick={() => onConfirmRename(item)}>
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onCancelRename}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : (
            <Button
              onClick={() => onSelect(item)}
              sx={{
                p: 0,
                justifyContent: 'flex-start',
                textTransform: 'none',
                minWidth: 0,
                maxWidth: '100%',
                color: '#0F172A',
                fontWeight: 600,
                fontFamily: 'Open Sans, sans-serif',
              }}
            >
              <Typography noWrap>{item.leading_title || 'Untitled Chat'}</Typography>
            </Button>
          )}
          <Typography
            sx={{
              fontFamily: 'Open Sans, sans-serif',
              color: '#64748B',
              fontSize: '12px',
              mt: 0.5,
            }}
          >
            {formatTimeLabel(item.last_accessed_time || item.created_at)}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Open Sans, sans-serif',
              color: '#64748B',
              fontSize: '12px',
            }}
          >
            {item.message_count ?? 0} messages
          </Typography>
        </Box>

        {!isRenaming && (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Rename">
              <IconButton size="small" onClick={() => onStartRename(item)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => onDelete(item)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default function ChatHistory({
  histories = [],
  selectedHistoryId = null,
  loading = false,
  onSelect,
  onCreateNew,
  onRename,
  onDelete,
  onClose,
}) {
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const sortedHistories = useMemo(() => {
    const toEpoch = (value) => {
      const epoch = new Date(value || 0).getTime();
      return Number.isNaN(epoch) ? 0 : epoch;
    };
    return [...histories].sort((a, b) => {
      const aTime = toEpoch(a.last_accessed_time || a.created_at);
      const bTime = toEpoch(b.last_accessed_time || b.created_at);
      return bTime - aTime;
    });
  }, [histories]);

  const startRename = (item) => {
    setRenamingId(item.hid);
    setRenameValue(item.leading_title || '');
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  const confirmRename = async (item) => {
    const nextTitle = renameValue.trim();
    if (!nextTitle || !onRename) return;
    await onRename(item, nextTitle);
    cancelRename();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, gap: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <HistoryIcon sx={{ color: '#1D4ED8', fontSize: 20 }} />
          <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontSize: '18px', fontWeight: 600 }}>
            Chat History
          </Typography>
        </Stack>
        {onClose && (
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={onCreateNew}
        sx={{
          alignSelf: 'flex-start',
          borderColor: '#BFDBFE',
          color: '#1D4ED8',
          textTransform: 'none',
          fontFamily: 'Open Sans, sans-serif',
        }}
      >
        New Chat
      </Button>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
            <CircularProgress size={24} />
          </Stack>
        ) : sortedHistories.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', color: '#64748B', fontSize: '14px' }}>
              No saved chats yet.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1}>
            {sortedHistories.map((item) => (
              <HistoryItem
                key={item.hid}
                item={item}
                isActive={selectedHistoryId === item.hid}
                isRenaming={renamingId === item.hid}
                renameValue={renameValue}
                onSelect={onSelect || (() => {})}
                onStartRename={startRename}
                onRenameValueChange={setRenameValue}
                onConfirmRename={confirmRename}
                onCancelRename={cancelRename}
                onDelete={onDelete || (() => {})}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
