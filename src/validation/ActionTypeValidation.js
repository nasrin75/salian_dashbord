export function CreateValidation(user) {
  let issues = [];

  if (!user.FaName) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['FaName'] }];
  }
  if (!user.EnName) {
    issues = [...issues, { message: 'مخفف بخش الزامی است.', path: ['EnName'] }];
  }

  return { issues };
}

export function EditValidation(user){
    let issues = [];

  if (!user.faName) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['faName'] }];
  }
  if (!user.enName) {
    issues = [...issues, { message: 'مخفف بخش الزامی است.', path: ['enName'] }];
  }

  return { issues };
}