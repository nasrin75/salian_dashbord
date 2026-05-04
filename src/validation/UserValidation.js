
export function userValidate(user) {
  let issues = [];

  if (!user) {
    return { issues: [{ message: 'اطلاعات کاربر ارسال نشده است.', path: ['UserCreateDto'] }] };
  }

  const addIssue = (message, path) => {
    issues = [...issues, { message, path }];
  };


  const isValidIpAddress = (ip) => {
    if (!ip) return false;
    const regex =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    return regex.test(String(ip).trim());
  };

  const toIpParts = (ip) => ip.split('.').map(Number);

  const areInSameSubnet24 = (singleIp, rangeIp) => {
    if (!isValidIpAddress(singleIp) || !isValidIpAddress(rangeIp)) return false;
    const a = toIpParts(singleIp);
    const b = toIpParts(rangeIp);
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; // /24
  };

  const ipToNumber = (ip) => {
    const p = toIpParts(ip);
    return (
      p[0] * 256 ** 3 +
      p[1] * 256 ** 2 +
      p[2] * 256 +
      p[3]
    );
  };

  const isEndIpGreaterOrEqual = (singleIp, rangeIp) => {
    if (!isValidIpAddress(singleIp) || !isValidIpAddress(rangeIp)) return false;
    return ipToNumber(rangeIp) >= ipToNumber(singleIp);
  };


  if (!user.Username || String(user.Username).trim() === '') {
    addIssue('نام کاربری الزامی است.', ['Username']);
  } else {
    const username = String(user.Username);

    if (username.length < 3 || username.length > 50) {
      addIssue('نام کاربری باید شامل حداقل 3 و حداکثر 50 کاراکتر باشد', ['Username']);
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      addIssue('نام کاربری باید حداقل شامل یک حروف بزرگ و عدد باشد', ['Username']);
    }
  }

  if (!user.Password || String(user.Password).trim() === '') {
    addIssue('رمز عبور الزامی است.', ['Password']);
  } else {
    const password = String(user.Password);

    if (password.length < 8) {
      addIssue('رمز عبور باید حداقل ۸ کاراکتر باشد.', ['Password']);
    }
    if (!/[A-Z]+/.test(password)) {
      addIssue('رمز عبور باید حداقل یک حرف بزرگ داشته باشد.', ['Password']);
    }
    if (!/[a-z]+/.test(password)) {
      addIssue('رمز عبور باید حداقل یک حرف کوچک داشته باشد.', ['Password']);
    }
    if (!/[0-9]+/.test(password)) {
      addIssue('رمز عبور باید حداقل یک عدد داشته باشد.', ['Password']);
    }
  }


  if (!user.Email || String(user.Email).trim() === '') {
    addIssue('ایمیل الزامی است.', ['Email']);
  } else {
    const email = String(user.Email);
    // یک regex عمومی برای ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addIssue('فرمت ایمیل نامعتبر است.', ['Email']);
    }
  }

  if (user.Mobile && String(user.Mobile).trim() !== '') {
    const mobile = String(user.Mobile);
    if (!/^09\d{9}$/.test(mobile)) {
      addIssue('فرمت شماره موبایل نامعتبر است (مثال: 09123456789).', ['Mobile']);
    }
  }


  if (!user.RoleId || Number(user.RoleId) <= 0) {
    addIssue('انتخاب نقش الزامی است', ['RoleId']);
  }

  if (!user.LoginTypes || !Array.isArray(user.LoginTypes) || user.LoginTypes.length === 0) {
    addIssue('انتخاب نوع ورود الزامی است', ['LoginTypes']);
  } else {
    const allowed = new Set(['password', 'otp', 'push', 'email']);
    const allValid = user.LoginTypes.every((t) => allowed.has(t));
    if (!allValid) {
      addIssue("انواع ورود نامعتبر هستند. فقط 'Password' و 'OTP' مجاز است.", ['LoginTypes']);
    }
  }

  if (user.Status == null) {
    addIssue('انتخاب وضعیت الزامی است', ['Status']);
  }
  else if (user.Status !== null && user.Status !== undefined) {
    const statusNumber = Number(user.Status);
    if (!Number.isFinite(statusNumber)) {
      addIssue('انتخاب وضعیت الزامی است', ['Status']);
    }
  }

  // if (user.IsCheckIp !== true) {
  //   addIssue('IsCheckIp must be true.', ['IsCheckIp']);
  // }


  if (user.IsCheckIp === true) {
    // Scope
    if (user.Scope === null || user.Scope === undefined || String(user.Scope).trim() === '') {
      addIssue('انتخاب نوع IP الزامی است', ['Scope']);
    } else {
      // SingleIp
      console.log("user.RangeIp", user.RangeIp, 'scope:', user.Scope)
      if (Number(user.Scope) === 0) {
        if (!user.SingleIp || String(user.SingleIp).trim() === '') {
          addIssue('IP را وارد کنید', ['SingleIp']);
        } else if (!isValidIpAddress(user.SingleIp)) {
          addIssue('فرمت IP نامعتبر است', ['SingleIp']);
        }
      }

      else if (Number(user.Scope) === 1) {
        if (!user.RangeIp || String(user.RangeIp).trim() === '') {
          addIssue('انتخاب محدوده الزامی است', ['RangeIp']);
        } else {
          const rangeParts = String(user.RangeIp).split(',').map(ip => ip.trim());

          if (rangeParts.length !== 2) {
            addIssue('فرمت محدوده IP نامعتبر است. لطفاً دو آی‌پی را با کاما جدا کنید (مثال: 192.168.10.5,192.168.10.9)', ['RangeIp']);
          } else {
            const [startIp, endIp] = rangeParts;

            const validStart = isValidIpAddress(startIp);
            const validEnd = isValidIpAddress(endIp);

            if (!validStart || !validEnd) {
              addIssue('فرمت IP نامعتبر است', ['RangeIp']);
            } else {
              if (!areInSameSubnet24(startIp, endIp)) {
                addIssue('هر دو IP باید در یک subnet باشند (/24)', ['RangeIp']);
              }

              if (!isEndIpGreaterOrEqual(startIp, endIp)) {
                addIssue('IP انتهایی باید بزرگ‌تر یا مساوی IP ابتدایی باشد.', ['RangeIp']);
              }
            }
          }
        }
      }

    }
  }

  return { issues };
}

export function userEditValidator(user) {
  let issues = [];

  if (!user) {
    return { issues: [{ message: 'اطلاعات کاربر ارسال نشده است.', path: ['UserUpdateDto'] }] };
  }

  const addIssue = (message, path) => {
    issues = [...issues, { message, path }];
  };


  const isValidIpAddress = (ip) => {
    if (!ip) return false;
    const regex =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    return regex.test(String(ip).trim());
  };

  const toIpParts = (ip) => ip.split('.').map(Number);

  const areInSameSubnet24 = (singleIp, rangeIp) => {
    if (!isValidIpAddress(singleIp) || !isValidIpAddress(rangeIp)) return false;
    const a = toIpParts(singleIp);
    const b = toIpParts(rangeIp);
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; // /24
  };

  const ipToNumber = (ip) => {
    const p = toIpParts(ip);
    return (
      p[0] * 256 ** 3 +
      p[1] * 256 ** 2 +
      p[2] * 256 +
      p[3]
    );
  };

  const isEndIpGreaterOrEqual = (singleIp, rangeIp) => {
    if (!isValidIpAddress(singleIp) || !isValidIpAddress(rangeIp)) return false;
    return ipToNumber(rangeIp) >= ipToNumber(singleIp);
  };


  if (!user.username || String(user.username).trim() === '') {
    addIssue('نام کاربری الزامی است.', ['Username']);
  } else {
    const username = String(user.username);

    if (username.length < 3 || username.length > 50) {
      addIssue('نام کاربری باید شامل حداقل 3 و حداکثر 50 کاراکتر باشد', ['username']);
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      addIssue('نام کاربری باید حداقل شامل یک حروف بزرگ و عدد باشد', ['username']);
    }
  }

  if (!user.password || String(user.password).trim() === '') {
    addIssue('رمز عبور الزامی است.', ['password']);
  } else {
    const password = String(user.password);

    if (password.length < 8) {
      addIssue('رمز عبور باید حداقل ۸ کاراکتر باشد.', ['password']);
    }
    if (!/[A-Z]+/.test(password)) {
      addIssue('رمز عبور باید حداقل یک حرف بزرگ داشته باشد.', ['password']);
    }
    if (!/[a-z]+/.test(password)) {
      addIssue('رمز عبور باید حداقل یک حرف کوچک داشته باشد.', ['password']);
    }
    if (!/[0-9]+/.test(password)) {
      addIssue('رمز عبور باید حداقل یک عدد داشته باشد.', ['password']);
    }
  }


  if (!user.email || String(user.email).trim() === '') {
    addIssue('ایمیل الزامی است.', ['email']);
  } else {
    const email = String(user.email);
    // یک regex عمومی برای ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addIssue('فرمت ایمیل نامعتبر است.', ['email']);
    }
  }

  if (user.mobile && String(user.mobile).trim() !== '') {
    const mobile = String(user.mobile);
    if (!/^09\d{9}$/.test(mobile)) {
      addIssue('فرمت شماره موبایل نامعتبر است (مثال: 09123456789).', ['mobile']);
    }
  }


  if (!user.roleId || Number(user.roleId) <= 0) {
    addIssue('انتخاب نقش الزامی است', ['roleId']);
  }

  if (!user.loginTypes || !Array.isArray(user.loginTypes) || user.loginTypes.length === 0) {
    addIssue('انتخاب نوع ورود الزامی است', ['loginTypes']);
  } else {
    const allowed = new Set(['password', 'otp', 'push', 'email']);
    const allValid = user.loginTypes.every((t) => allowed.has(t));
    if (!allValid) {
      addIssue("انواع ورود نامعتبر هستند. فقط 'Password' و 'OTP' مجاز است.", ['loginTypes']);
    }
  }

  if (user.status == null) {
    addIssue('انتخاب وضعیت الزامی است', ['status']);
  }
  else if (user.status !== null && user.status !== undefined) {
    const statusNumber = Number(user.status);
    if (!Number.isFinite(statusNumber)) {
      addIssue('انتخاب وضعیت الزامی است', ['status']);
    }
  }


  if (user.IsCheckIp === true) {
    if (user.scope === null || user.scope === undefined || String(user.scope).trim() === '') {
      addIssue('انتخاب نوع IP الزامی است', ['scope']);
    } else {
      // SingleIp
      if (Number(user.scope) === 0) {
        if (!user.startIp || String(user.startIp).trim() === '') {
          addIssue('IP را وارد کنید', ['startIp']);
        } else if (!isValidIpAddress(user.startIp)) {
          addIssue('فرمت IP نامعتبر است', ['startIp']);
        }
      }

      else if (Number(user.scope) === 1) {
        if (!user.endIp || String(user.endIp).trim() === '') {
          addIssue('انتخاب محدوده الزامی است', ['endIp']);
        } else {
          //const rangeParts = String(user.endIp).split(',').map(ip => ip.trim());

          // if (rangeParts.length !== 2) {
          //   addIssue('فرمت محدوده IP نامعتبر است. لطفاً دو آی‌پی را با کاما جدا کنید (مثال: 192.168.10.5,192.168.10.9)', ['endIp']);
          // } else {
          //   const [startIp, endIp] = rangeParts;

            const validStart = isValidIpAddress(user.startIp);
            const validEnd = isValidIpAddress(user.endIp);

            if (!validStart || !validEnd) {
              addIssue('فرمت IP نامعتبر است', ['endIp']);
            } else {
              if (!areInSameSubnet24(user.startIp, user.endIp)) {
                addIssue('هر دو IP باید در یک subnet باشند (/24)', ['endIp']);
              }

              if (!isEndIpGreaterOrEqual(user.startIp, user.endIp)) {
                addIssue('IP انتهایی باید بزرگ‌تر یا مساوی IP ابتدایی باشد.', ['endIp']);
              }
            }
           
         }
      }

    }
  }

  return { issues };
}