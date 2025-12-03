import { createBrowserRouter } from 'react-router-dom';

import { Layout, AuthRoute } from '@components';

import {
  Explore,
  Timeline,
  Proposal,
  Profile,
  CreateProposal,
  ErrorElement,
  NotFound404,
} from '@pages';
import paths from '@constants/paths';

export const router = createBrowserRouter([
  {
    path: paths.HOME,
    Component: Layout,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Explore />,
      },
      {
        path: paths.EXPLORE,
        element: <Explore />,
      },
      {
        path: `${paths.PROFILE}/:projectId`,
        element: <AuthRoute />,
        errorElement: <ErrorElement />,
        children: [
          { index: true, element: <Profile /> },
          {
            path: 'voting',
            element: <Profile />,
          },
          {
            path: 'proposal',
            element: <Profile />,
          },
          {
            path: 'members',
            element: <Profile />,
          },
          {
            path: 'assets',
            element: <Profile />,
          },
        ],
      },
      {
        path: `${paths.PROPOSAL}/:proposalId`,
        element: <Proposal />,
        errorElement: <ErrorElement />,
        children: [{ index: true, element: <Proposal /> }],
      },
      {
        path: paths.TIMELINE,
        errorElement: <ErrorElement />,
        children: [
          {
            index: true,
            element: <Timeline />,
          },
          {
            path: ':projectId',
            element: <Timeline />,
          },
          {
            path: ':projectId/about',
            element: <Timeline />,
          },
          {
            path: ':projectId/assets',
            element: <Timeline />,
          },
          {
            path: ':projectId/create-proposal',
            element: <CreateProposal />,
          },
          {
            path: ':projectId/edit-proposal/:proposalId',
            element: <CreateProposal />,
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound404 /> },
]);
