import CssBaseline from '@mui/material/CssBaseline';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import AppTheme from './shared-theme/AppTheme';
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from './theme/customizations';
import Routes from './routes/Routes'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from './config/dateConfig';
import "dayjs/locale/fa"
import AuthProvider from './hooks/useAuth/AuthProvider';
import TranslateProvider from './hooks/useTranslate/TranslateProvider';

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props) {
  return (

    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="fa"
      dateLibInstance={dayjs}
    >
      <AppTheme {...props} themeComponents={themeComponents}>
        <CssBaseline enableColorScheme />

        <DialogsProvider>
          <AuthProvider>
            <TranslateProvider>
              <Routes />
            </TranslateProvider>
          </AuthProvider>
        </DialogsProvider>

      </AppTheme>
    </LocalizationProvider>

  );
}
