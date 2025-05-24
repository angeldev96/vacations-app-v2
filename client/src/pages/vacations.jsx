import { Helmet } from 'react-helmet-async';

import { EmployeeView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function Vacations() {
  return (
    <>
      <Helmet>
        <title> Gestion Vacaciones </title>
      </Helmet>

      <EmployeeView />
    </>
  );
}
