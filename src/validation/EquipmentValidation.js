export function CreateValidation(user) {
  let issues = [];

  if (!user.Name) {
    issues = [...issues, { message: 'نام قطعه الزامی است.', path: ['Name'] }];
  }
  if (!user.Type) {
    issues = [...issues, { message: 'انتخاب نوع قطعه الزامی است.', path: ['Type'] }];
  }

  return { issues };
}

export function EditValidation(user){
    let issues = [];

  if (!user.name) {
    issues = [...issues, { message: 'نام قطعه الزامی است.', path: ['name'] }];
  }
  if (!user.type) {
    issues = [...issues, { message: 'انتخاب نوع قطعه الزامی است.', path: ['type'] }];
  }

  return { issues };
}