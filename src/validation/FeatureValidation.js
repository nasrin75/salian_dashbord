export function CreateValidation(user) {
  let issues = [];

  if (!user.Name) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['Name'] }];
  } else if (user.Name.length < 3) {
    issues = [...issues, { message: 'عنوان باید حداقل ۳ کاراکتر باشد.', path: ['Name'] }];
  } else if (user.Name.length > 100) {
    issues = [...issues, { message: 'عنوان باید حداکثر ۱۰۰ کاراکتر باشد.', path: ['Name'] }];
  }

  if (!Array.isArray(user.EquipmentIds) || user.EquipmentIds.length === 0) {
   issues = [...issues, { message: 'انتخاب حداقل یک قطعه الزامی است', path: ['EquipmentIds'] }];
  } else if (user.EquipmentIds.length < 1) {
    issues.push({
      message: 'تعداد قطعات باید حداقل ۱ باشد',
      path: ['EquipmentIds'],
    });
    issues = [...issues, { message: 'تعداد قطعات باید حداقل ۱ باشد', path: ['EquipmentIds'] }];
  }


  return { issues };
}

export function EditValidation(user) {
  let issues = [];
if (!user.name) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['name'] }];
  } else if (user.name.length < 3) {
    issues = [...issues, { message: 'عنوان باید حداقل ۳ کاراکتر باشد.', path: ['name'] }];
  } else if (user.name.length > 100) {
    issues = [...issues, { message: 'عنوان باید حداکثر ۱۰۰ کاراکتر باشد.', path: ['name'] }];
  }

  if (!Array.isArray(user.equipmentIds) || user.equipmentIds.length === 0) {
   issues = [...issues, { message: 'انتخاب حداقل یک قطعه الزامی است', path: ['equipmentIds'] }];
  } else if (user.equipmentIds.length < 1) {
    issues.push({
      message: 'تعداد قطعات باید حداقل ۱ باشد',
      path: ['equipmentIds'],
    });
    issues = [...issues, { message: 'تعداد قطعات باید حداقل ۱ باشد', path: ['equipmentIds'] }];
  }


  return { issues };
}