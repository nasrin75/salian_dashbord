import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Typography, Box, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PermissionNode = ({ permission, selected, onToggle }) => {
  const [open, setOpen] = useState(true);

  const hasChildren = permission.children && permission.children.length > 0;

  const handleSelfToggle = (checked) => {
    onToggle(permission, checked);
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {hasChildren && (
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ mr: 1 }}
          >
            {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={selected.includes(permission.id)}
              onChange={(e) => handleSelfToggle(e.target.checked)}
            />
          }
          label={
            <Typography sx={{ fontWeight: permission.parentId ? 400 : 600 }}>
              {permission.title}
            </Typography>
          }
        />
      </Box>

      {hasChildren && open && (
        <Box sx={{ ml: 4 }}>
          {permission.children.map((child) => (
            <PermissionNode
              key={child.id}
              permission={child}
              selected={selected}
              onToggle={onToggle}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PermissionNode;
