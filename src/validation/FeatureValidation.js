export function CreateValidation(user) {
  let issues = [];

  if (!user.Name) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['Name'] }];
  }
  if (!user.EquipmentIds) {
    issues = [...issues, { message:'انتخاب حداقل یک قطعه الزامی است', path: ['EquipmentIds'] }];
  }

  return { issues };
}

export function EditValidation(user){
    let issues = [];

  if (!user.name) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['name'] }];
  }
  if (!user.equipmentIds) {
    issues = [...issues, { message:' انتخاب حداقل یک قطعه الزامی است', path: ['equipmentIds'] }];
  }

  return { issues };
}