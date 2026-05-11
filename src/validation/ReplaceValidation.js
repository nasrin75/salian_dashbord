export function CreateValidation(user) {
  let issues = [];

  if (!user.Title) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['Title'] }];
  }
  if (!user.Abbreviation) {
    issues = [...issues, { message: 'مخفف بخش الزامی است.', path: ['Abbreviation'] }];
  }

  return { issues };
}

export function EditValidation(user){
    let issues = [];

  if (!user.title) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['title'] }];
  }
  if (!user.abbreviation) {
    issues = [...issues, { message: 'مخفف بخش الزامی است.', path: ['abbreviation'] }];
  }

  return { issues };
}