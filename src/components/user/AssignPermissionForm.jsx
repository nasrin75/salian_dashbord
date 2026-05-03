import React, { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, Typography, Box, Divider, Grid } from '@mui/material';
import { getPermissions } from '../../api/PermissionApi';

// Helper function to flatten the permission tree (if needed for simpler column distribution)
const flattenPermissions = (permissions, parentId = null) => {
  let flatList = [];
  for (const perm of permissions) {
    flatList.push({ ...perm, parentId: parentId }); // Ensure parentId is correctly set for children
    if (perm.children && perm.children.length > 0) {
      flatList = flatList.concat(flattenPermissions(perm.children, perm.id));
    }
  }
  return flatList;
};
const PermissionNode = ({ permission, selectedPermissions, handlePermissionSelection }) => {
  return (
    <Box key={permission.id} sx={{ paddingLeft: '30px', mb: 1 }}> 
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedPermissions.includes(permission.id)}
            onChange={(e) => handlePermissionSelection(permission.id, e.target.checked)}
          />
        }
        label={
          <Typography
            sx={{
              fontWeight: permission.parentId == null ? 'bold' : '',
            }}
          >
            {permission.title}
          </Typography>
        }
      />

      {permission.children && permission.children.length > 0 && (
         <Grid size={{ xs: 12, sm: 12 }} sx={{ display: 'flex' }}>
          {permission.children.map((child) => (
            <PermissionNode
              key={child.id}
              permission={child}
              selectedPermissions={selectedPermissions}
              handlePermissionSelection={handlePermissionSelection}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};

const processApiData = (apiData) => {
  const groupedByCategory = {};

  apiData.forEach(permission => {
    const category = permission.category || "بدون دسته بندی"; 
    if (!groupedByCategory[category]) {
      groupedByCategory[category] = [];
    }

    groupedByCategory[category].push({
      ...permission,
      id: permission.id, 
      children: [], 
      parentId: null
    });
  });
  return groupedByCategory;
};
const AssignPermissionForm = ({ formState, onFieldChange, onSubmit }) => {
  // Initialize with an empty object because the data is now grouped by category
  const [permissionsByCategory, setPermissionsByCategory] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    getPermissions()
      .then(response => {
        setPermissionsByCategory(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
      });
  }, []);

  const handlePermissionSelection = (id, checked) => {
    setSelectedPermissions((prevSelected) => {
      let newPermissions;
      if (checked) {
        // Add permission ID if not already present
        newPermissions = [...prevSelected, id];
      } else {
        // Remove permission ID
        newPermissions = prevSelected.filter(x => x !== id);
      }
      // Update the form state
      onFieldChange("permissionIds", newPermissions);
      return newPermissions;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // The selectedPermissions state already holds the flat list of IDs.
    onSubmit({ permissionIds: selectedPermissions });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      {Object.keys(permissionsByCategory).map((categoryName) => (
        <Box key={categoryName} sx={{ mb: 3 }}> 
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>{categoryName}</Typography>
          {/* Render the root permissions for this category */}
          {permissionsByCategory[categoryName].map((permission) => (
            <PermissionNode
              key={permission.id}
              permission={permission}
              selectedPermissions={selectedPermissions}
              handlePermissionSelection={handlePermissionSelection}
            />
          ))}
          <Divider sx={{ mt: 2 }} /> 
        </Box>
      ))}

      <Box sx={{ mt: 3, textAlign: 'right' }}> 
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>ذخیره</button>
      </Box>
    </Box>
  );
};
export default AssignPermissionForm;