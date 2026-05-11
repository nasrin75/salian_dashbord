export function CreateValidation(item) {
  let issues = [];

  console.log('CreateValidation',item)
  if (String(item.ActionType).trim() === 'SendToCharge') {
    if (!item.InLocal) {
      issues = [...issues, { message: 'انتخاب نوع خدمت الزامی است', path: ['InLocal'] }];
    }
  } else if (String(item.ActionType).trim() === 'BackFromCharge') {
    if (!item.Problem) {
      issues = [...issues, { message: 'انتخاب نوع مشکل الزامی است', path: ['Problem'] }];
    }
  }



  return { issues };
}

export function EditValidation(user) {
  let issues = [];

  if (!user.title) {
    issues = [...issues, { message: 'عنوان الزامی است.', path: ['title'] }];
  }
  if (!user.abbreviation) {
    issues = [...issues, { message: 'مخفف بخش الزامی است.', path: ['abbreviation'] }];
  }

  return { issues };
}