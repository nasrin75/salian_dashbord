import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { getPermissionByCategory } from '../../api/PermissionApi';
import PermissionNode from '../common/PermissionNode';

const AssignPermissionForm = ({ formState, onFieldChange, onSubmit }) => {
  const [permissionsByCategory, setPermissionsByCategory] = useState({});
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    getPermissionByCategory()
      .then((res) => setPermissionsByCategory(res.data.data))
      .catch(() => {});

    setSelected(formState.values || []);
  }, []);

  const togglePermission = (permission, checked) => {
    setSelected((prev) => {
      let newList = new Set(prev);

      const toggleRecursively = (perm, check) => {
        if (check) newList.add(perm.id);
        else newList.delete(perm.id);

        if (perm.children)
          perm.children.forEach((c) => toggleRecursively(c, check));
      };

      // Parent → children
      toggleRecursively(permission, checked);

      // Child → parent refresh
      if (!checked && permission.parentId) {
        const findParent = (categoryData) => {
          for (let root of categoryData)
            if (root.id === permission.parentId) return root;
          return null;
        };

        const category = Object.keys(permissionsByCategory).find(cat =>
          permissionsByCategory[cat].some(x => x.id === permission.parentId)
        );

        const parent = category ? findParent(permissionsByCategory[category]) : null;

        if (parent) {
          const allChildSelected = parent.children.every(ch => newList.has(ch.id));
          if (allChildSelected) newList.add(parent.id);
          else newList.delete(parent.id);
        }
      }

      const updated = Array.from(newList);
      onFieldChange("permissionIds", updated);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ permissionIds: selected });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      {Object.keys(permissionsByCategory).map((cat) => (
        <Box key={cat} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            {cat}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {permissionsByCategory[cat].map((root) => (
              <Box
                key={root.id}
                sx={{
                  width: { xs: '100%', sm: '47%', md: '31%', lg: '23%' },
                  p: 2,
                }}
              >
                <PermissionNode
                  permission={root}
                  selected={selected}
                  onToggle={togglePermission}
                />
              </Box>
            ))}
          </Box>

          <Divider sx={{ mt: 3 }} />
        </Box>
      ))}

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          ذخیره
        </button>
      </Box>
    </Box>
  );
};

export default AssignPermissionForm;
