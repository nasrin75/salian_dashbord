import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Diversity3Outlined from '@mui/icons-material/Diversity3Outlined'
import BuildCircleOutlined from '@mui/icons-material/BuildCircleOutlined'
import PersonIcon from '@mui/icons-material/Person';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { matchPath, useLocation } from 'react-router';
import DashboardSidebarContext from '../../../context/DashboardSidebarContext';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from '../../../constants';
import DashboardSidebarPageItem from '../sidebar/DashboardSidebarPageItem';

import {
  getDrawerSxTransitionMixin,
  getDrawerWidthTransitionMixin,
} from '../../../mixins';

function DashboardSidebar({
  expanded = true,
  setExpanded,
  disableCollapsibleSidebar = false,
  container,
}) {
  const theme = useTheme();

  const { pathname } = useLocation();

  const [expandedItemIds, setExpandedItemIds] = React.useState([]);

  const isOverSmViewport = useMediaQuery(theme.breakpoints.up('sm'));
  const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));

  const [isFullyExpanded, setIsFullyExpanded] = React.useState(expanded);
  const [isFullyCollapsed, setIsFullyCollapsed] = React.useState(!expanded);

  React.useEffect(() => {
    if (expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyExpanded(true);
      }, theme.transitions.duration.enteringScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyExpanded(true);

    return () => { };
  }, [expanded, theme.transitions.duration.enteringScreen]);

  React.useEffect(() => {
    if (!expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyCollapsed(true);
      }, theme.transitions.duration.leavingScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyCollapsed(false);

    return () => { };
  }, [expanded, theme.transitions.duration.leavingScreen]);

  const mini = !disableCollapsibleSidebar && !expanded;

  const handleSetSidebarExpanded = React.useCallback(
    (newExpanded) => () => {
      setExpanded(newExpanded);
    },
    [setExpanded],
  );

  const handlePageItemClick = React.useCallback(
    (itemId, hasNestedNavigation) => {
      if (hasNestedNavigation && !mini) {
        setExpandedItemIds((previousValue) =>
          previousValue.includes(itemId)
            ? previousValue.filter(
              (previousValueItemId) => previousValueItemId !== itemId,
            )
            : [...previousValue, itemId],
        );
      } else if (!isOverSmViewport && !hasNestedNavigation) {
        setExpanded(false);
      }
    },
    [mini, setExpanded, isOverSmViewport],
  );

  const hasDrawerTransitions =
    isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

  const getDrawerContent = React.useCallback(
    (viewport) => (
      <React.Fragment>
        <Toolbar />
        <Box
          component="nav"
          aria-label={`${viewport.charAt(0).toUpperCase()}${viewport.slice(1)}`}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'auto',
            scrollbarGutter: mini ? 'stable' : 'auto',
            overflowX: 'hidden',
            pt: !mini ? 0 : 2,
            ...(hasDrawerTransitions
              ? getDrawerSxTransitionMixin(isFullyExpanded, 'padding')
              : {}),
          }}
        >
          <List
            dense
            sx={{
              padding: mini ? 0 : 0.5,
              mb: 4,
              width: mini ? MINI_DRAWER_WIDTH : 'auto',
            }}
          >
            {/* <DashboardSidebarHeaderItem>کاربران</DashboardSidebarHeaderItem> */}
            <DashboardSidebarPageItem
              id="users"
              title="کاربران"
              icon={<PersonIcon />}
              href="/users"
              selected={!!matchPath('/user/*', pathname) || pathname === '/'}
            />
            <DashboardSidebarPageItem
              id="employees"
              title="پرسنل"
              icon={<Diversity3Outlined />}
              href="/employees"
              selected={!!matchPath('/employee/*', pathname) || pathname === '/'}
            />
               <DashboardSidebarPageItem
              id="equipments"
              title="قطعات"
              icon={<BuildCircleOutlined />}
              href="/equipments"
              selected={!!matchPath('/equipment/*', pathname) || pathname === '/'}
            />
            {/* <DashboardSidebarHeaderItem>Example items</DashboardSidebarHeaderItem> */}
            <DashboardSidebarPageItem
              id="setting"
              title="تنظیمات"
              icon={<SettingsOutlined />}
              href="/reports"
              selected={!!matchPath('/setting', pathname)}
              defaultExpanded={!!matchPath('/setting', pathname)}
              expanded={expandedItemIds.includes('setting')}
              nestedNavigation={
                <List
                  dense
                  sx={{
                    padding: 0,
                    my: 1,
                    pl: mini ? 0 : 1,
                    minWidth: 240,
                  }}
                >
                  <DashboardSidebarPageItem
                    id="locations"
                    title="بخش ها"
                    href="/setting/locations"
                    selected={!!matchPath('/setting/locations', pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="actionTypes"
                    title="نوع عملیات"
                    href="/setting/actionTypes"
                    selected={!!matchPath('/setting/actionTypes', pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="roles"
                    title="نقش ها"
                    href="/setting/roles"
                    selected={!!matchPath('/setting/roles', pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="permissions"
                    title="دسترسی ها"
                    href="/setting/permissions"
                    selected={!!matchPath('/setting/permissions', pathname)}
                  />
                  <DashboardSidebarPageItem
                    id="traffic"
                    title="ویژگی قطعات"
                    href="/setting/traffic"
                    selected={!!matchPath('/settings/traffic', pathname)}
                  />
                </List>
              }
            />
            <DashboardSidebarPageItem
              id="integrations"
              title="Integrations"
              icon={<LayersIcon />}
              href="/integrations"
              selected={!!matchPath('/integrations', pathname)}
            />
          </List>
        </Box>
      </React.Fragment>
    ),
    [mini, hasDrawerTransitions, isFullyExpanded, expandedItemIds, pathname],
  );

  const getDrawerSharedSx = React.useCallback(
    (isTemporary) => {
      const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;

      return {
        displayPrint: 'none',
        width: drawerWidth,
        flexShrink: 0,
        ...getDrawerWidthTransitionMixin(expanded),
        ...(isTemporary ? { position: 'absolute' } : {}),
        [`& .MuiDrawer-paper`]: {
          position: 'absolute',
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundImage: 'none',
          ...getDrawerWidthTransitionMixin(expanded),
        },
      };
    },
    [expanded, mini],
  );

  const sidebarContextValue = React.useMemo(() => {
    return {
      onPageItemClick: handlePageItemClick,
      mini,
      fullyExpanded: isFullyExpanded,
      fullyCollapsed: isFullyCollapsed,
      hasDrawerTransitions,
    };
  }, [
    handlePageItemClick,
    mini,
    isFullyExpanded,
    isFullyCollapsed,
    hasDrawerTransitions,
  ]);

  return (
    <DashboardSidebarContext.Provider value={sidebarContextValue}>
      <Drawer
        container={container}
        variant="temporary"
        open={expanded}
        onClose={handleSetSidebarExpanded(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: {
            xs: 'block',
            sm: disableCollapsibleSidebar ? 'block' : 'none',
            md: 'none',
          },
          ...getDrawerSharedSx(true),
        }}
      >
        {getDrawerContent('phone')}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: 'none',
            sm: disableCollapsibleSidebar ? 'none' : 'block',
            md: 'none',
          },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent('tablet')}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent('desktop')}
      </Drawer>
    </DashboardSidebarContext.Provider>
  );
}

DashboardSidebar.propTypes = {
  container: (props, propName) => {
    if (props[propName] == null) {
      return null;
    }
    if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
      return new Error(`Expected prop '${propName}' to be of type Element`);
    }
    return null;
  },
  disableCollapsibleSidebar: PropTypes.bool,
  expanded: PropTypes.bool,
  setExpanded: PropTypes.func.isRequired,
};

export default DashboardSidebar;
